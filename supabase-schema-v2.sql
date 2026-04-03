-- ═══════════════════════════════════════════════════════════════════════
-- LOCATALYZE v2 – Supabase Schema
-- Includes: reports (processed), agent_cache (TTL cache), agent_logs (monitoring)
-- ═══════════════════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ───────────────────────────────────────────────────────────────────────
-- 1. REPORTS TABLE (main output – one row per analysis run)
-- ───────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reports (
  -- Identity
  report_id             TEXT PRIMARY KEY,
  submission_id         TEXT UNIQUE,
  user_id               TEXT,
  status                TEXT NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending','processing','complete','failed')),
  mode                  TEXT NOT NULL DEFAULT 'full'
                        CHECK (mode IN ('light','full')),

  -- Timestamps
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at          TIMESTAMPTZ,
  progress_step         TEXT,

  -- Location
  location_name         TEXT,
  address               TEXT,
  business_type         TEXT,
  industry_category     TEXT,
  city                  TEXT,
  area                  TEXT,
  locality              TEXT,
  country               TEXT DEFAULT 'Australia',
  lat                   NUMERIC(10,7),
  lng                   NUMERIC(10,7),

  -- Scores (0–100)
  overall_score         SMALLINT CHECK (overall_score BETWEEN 0 AND 100),
  verdict               TEXT CHECK (verdict IN ('go','caution','no_go')),
  score_competition     SMALLINT,
  score_rent            SMALLINT,
  score_demand          SMALLINT,
  score_cost            SMALLINT,
  score_profitability   SMALLINT,
  score_footfall        SMALLINT,
  score_demographics    SMALLINT,
  score_benchmark       SMALLINT,
  score_economy         SMALLINT,

  -- Financials (key numbers only)
  monthly_rent          NUMERIC(12,2),
  revenue_monthly_base  NUMERIC(12,2),
  revenue_monthly_min   NUMERIC(12,2),
  revenue_monthly_max   NUMERIC(12,2),
  monthly_opex          NUMERIC(12,2),
  net_profit_monthly    NUMERIC(12,2),
  setup_cost_recommended NUMERIC(12,2),
  breakeven_months      SMALLINT,
  breakeven_daily_customers SMALLINT,

  -- Analysis summaries
  competitor_analysis   TEXT,
  rent_analysis         TEXT,
  market_demand         TEXT,
  profitability         TEXT,
  recommendation        TEXT,

  -- Agent status flags (for debugging)
  agent_status          JSONB DEFAULT '{}',   -- { a1: "ok", a2: "failed", ... }
  failed_agents         TEXT[],
  data_flags            TEXT[],

  -- Confidence
  confidence_overall    TEXT CHECK (confidence_overall IN ('high','medium','low')),
  confidence_rent       TEXT,
  confidence_footfall   TEXT,

  -- Full structured outputs (JSONB for querying)
  scores_json           JSONB,
  financials_json       JSONB,
  real_estate_json      JSONB,
  market_json           JSONB,
  demographics_json     JSONB,
  benchmark_json        JSONB,
  economy_json          JSONB,
  competitors_json      JSONB,   -- top 8 competitors array
  properties_json       JSONB,   -- top 3 property listings
  risks_json            JSONB,
  swot_json             JSONB,

  -- Projections
  three_year_projection JSONB,
  sensitivity_analysis  JSONB,

  -- Raw report (full structured output for frontend)
  result_data           JSONB,
  input_data            JSONB,

  -- DEPRECATED: full_report_markdown (use result_data instead)
  -- Keep for backward compatibility only, remove after migration
  full_report_markdown  TEXT,

  -- Execution metadata
  execution_ms          INTEGER,
  request_id            TEXT
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_reports_user_id       ON reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_city_type     ON reports(city, business_type);
CREATE INDEX IF NOT EXISTS idx_reports_created_at    ON reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_verdict       ON reports(verdict);
CREATE INDEX IF NOT EXISTS idx_reports_status        ON reports(status);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_reports_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ───────────────────────────────────────────────────────────────────────
-- 2. AGENT CACHE TABLE (TTL-based, avoids repeated expensive API calls)
-- ───────────────────────────────────────────────────────────────────────
-- Which agents benefit from caching:
--   A6 Demographics  → TTL 30 days (ABS Census data changes slowly)
--   A7 Benchmarks    → TTL 14 days (ATO data updated quarterly)
--   A8 Economy       → TTL 7 days (ABS/RBA data, weekly releases)
--   A1 Competitors   → TTL 3 days (Google Maps changes)
--   A2 Rent          → TTL 2 days (listing prices change frequently)
--   A3, A4, A5       → NO cache (depends on user-specific inputs)

CREATE TABLE IF NOT EXISTS agent_cache (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cache_key    TEXT NOT NULL UNIQUE,   -- MD5(agent_id + city + area + business_type + ...)
  agent_id     TEXT NOT NULL,          -- 'A1', 'A6', etc.
  city         TEXT,
  area         TEXT,
  locality     TEXT,
  business_type TEXT,
  industry_category TEXT,

  -- Cached payload (slim summary – not full agent output)
  cached_data  JSONB NOT NULL,
  data_quality TEXT DEFAULT 'medium',

  -- TTL management
  ttl_hours    INTEGER NOT NULL DEFAULT 168,   -- default 7 days
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at   TIMESTAMPTZ GENERATED ALWAYS AS (created_at + (ttl_hours || ' hours')::INTERVAL) STORED,
  hit_count    INTEGER NOT NULL DEFAULT 0,
  last_hit_at  TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_cache_key         ON agent_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_cache_expires_at  ON agent_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_cache_agent_loc   ON agent_cache(agent_id, city, area);

-- Helper function: check if cache is valid
CREATE OR REPLACE FUNCTION is_cache_valid(p_cache_key TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM agent_cache
    WHERE cache_key = p_cache_key AND expires_at > NOW()
  );
$$ LANGUAGE sql STABLE;

-- Helper function: get cache + increment hit count
CREATE OR REPLACE FUNCTION get_cache(p_cache_key TEXT)
RETURNS JSONB AS $$
DECLARE v_data JSONB;
BEGIN
  UPDATE agent_cache SET hit_count = hit_count + 1, last_hit_at = NOW()
  WHERE cache_key = p_cache_key AND expires_at > NOW()
  RETURNING cached_data INTO v_data;
  RETURN v_data;
END;
$$ LANGUAGE plpgsql;

-- Cleanup expired cache entries (run nightly via Supabase Cron)
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS INTEGER AS $$
DECLARE deleted INTEGER;
BEGIN
  DELETE FROM agent_cache WHERE expires_at < NOW();
  GET DIAGNOSTICS deleted = ROW_COUNT;
  RETURN deleted;
END;
$$ LANGUAGE plpgsql;


-- ───────────────────────────────────────────────────────────────────────
-- 3. AGENT LOGS TABLE (execution monitoring + cost tracking)
-- ───────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS agent_logs (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id    TEXT REFERENCES reports(report_id) ON DELETE CASCADE,
  request_id   TEXT,
  agent_id     TEXT NOT NULL,         -- 'A1'–'A8' or 'ORCHESTRATOR'
  agent_name   TEXT,
  mode         TEXT DEFAULT 'full',

  -- Execution
  started_at   TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  exec_ms      INTEGER,
  status       TEXT DEFAULT 'ok'
               CHECK (status IN ('ok','failed','skipped','cached','retried')),
  retry_count  SMALLINT DEFAULT 0,

  -- Cost tracking
  model_used   TEXT,
  tokens_input  INTEGER,
  tokens_output INTEGER,
  cost_usd      NUMERIC(8,6),         -- estimated cost per call

  -- Error info
  error_message TEXT,
  missing_fields TEXT[],

  -- Cache info
  cache_hit    BOOLEAN DEFAULT FALSE,
  cache_key    TEXT,

  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_logs_report_id  ON agent_logs(report_id);
CREATE INDEX IF NOT EXISTS idx_logs_agent_id   ON agent_logs(agent_id);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON agent_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_status     ON agent_logs(status);


-- ───────────────────────────────────────────────────────────────────────
-- 4. USEFUL VIEWS
-- ───────────────────────────────────────────────────────────────────────

-- Report summary view (for dashboard / API)
CREATE OR REPLACE VIEW report_summaries AS
SELECT
  r.report_id,
  r.user_id,
  r.mode,
  r.status,
  r.verdict,
  r.overall_score,
  r.business_type,
  r.location_name,
  r.city,
  r.area,
  r.monthly_rent,
  r.revenue_monthly_base,
  r.breakeven_months,
  r.confidence_overall,
  r.agent_status,
  r.failed_agents,
  r.execution_ms,
  r.created_at,
  r.completed_at
FROM reports r
ORDER BY r.created_at DESC;


-- Cost tracking by day
CREATE OR REPLACE VIEW daily_agent_costs AS
SELECT
  DATE(created_at)    AS run_date,
  agent_id,
  model_used,
  COUNT(*)            AS calls,
  SUM(tokens_input)   AS total_input_tokens,
  SUM(tokens_output)  AS total_output_tokens,
  SUM(cost_usd)       AS total_cost_usd,
  AVG(exec_ms)        AS avg_exec_ms,
  SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) AS failures,
  SUM(CASE WHEN cache_hit THEN 1 ELSE 0 END)         AS cache_hits
FROM agent_logs
GROUP BY DATE(created_at), agent_id, model_used
ORDER BY run_date DESC, agent_id;


-- Cache efficiency view
CREATE OR REPLACE VIEW cache_stats AS
SELECT
  agent_id,
  COUNT(*)              AS cached_entries,
  SUM(hit_count)        AS total_hits,
  AVG(hit_count)        AS avg_hits_per_entry,
  COUNT(*) FILTER (WHERE expires_at < NOW()) AS expired
FROM agent_cache
GROUP BY agent_id
ORDER BY total_hits DESC;


-- ───────────────────────────────────────────────────────────────────────
-- 5. ROW LEVEL SECURITY (RLS)
-- ───────────────────────────────────────────────────────────────────────
ALTER TABLE reports    ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_logs ENABLE ROW LEVEL SECURITY;

-- Users can only see their own reports
CREATE POLICY "reports_user_isolation"
ON reports FOR ALL
USING (user_id = auth.uid()::TEXT OR auth.role() = 'service_role');

-- Agent logs visible to service role only (internal)
CREATE POLICY "agent_logs_service_only"
ON agent_logs FOR ALL
USING (auth.role() = 'service_role');

-- Cache readable by service role only
ALTER TABLE agent_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cache_service_only"
ON agent_cache FOR ALL
USING (auth.role() = 'service_role');


-- ───────────────────────────────────────────────────────────────────────
-- 6. MIGRATION FROM v1 (run once to restructure existing data)
-- ───────────────────────────────────────────────────────────────────────
-- If you have existing rows in the v1 `reports` table, add missing columns:

-- ALTER TABLE reports ADD COLUMN IF NOT EXISTS mode TEXT DEFAULT 'full';
-- ALTER TABLE reports ADD COLUMN IF NOT EXISTS agent_status JSONB DEFAULT '{}';
-- ALTER TABLE reports ADD COLUMN IF NOT EXISTS failed_agents TEXT[];
-- ALTER TABLE reports ADD COLUMN IF NOT EXISTS data_flags TEXT[];
-- ALTER TABLE reports ADD COLUMN IF NOT EXISTS confidence_overall TEXT;
-- ALTER TABLE reports ADD COLUMN IF NOT EXISTS execution_ms INTEGER;
-- ALTER TABLE reports ADD COLUMN IF NOT EXISTS request_id TEXT;
-- ALTER TABLE reports ADD COLUMN IF NOT EXISTS scores_json JSONB;
-- ALTER TABLE reports ADD COLUMN IF NOT EXISTS financials_json JSONB;
-- UPDATE reports SET mode = 'full' WHERE mode IS NULL;

-- NOTE: After confirming new columns work, you can deprecate full_report_markdown
-- by storing only the first 5000 chars as a preview, and using result_data for full JSON
