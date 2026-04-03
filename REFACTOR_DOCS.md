# Locatalyze v2 – Refactor Documentation
**Architecture, Caching, Fallback Rules, Assumptions & Monetization Guide**

---

## 1. What Changed (Summary)

| Area | Before | After |
|------|--------|-------|
| Execution | Sequential A1→A6→A7→A8→A2→A3→A4→A5 | **Parallel A1+A6+A7+A8** then sequential A2→A3→A4→A5 |
| Estimated runtime | ~160–200 seconds | **~60–80 seconds** (full), ~35–45s (light) |
| Supabase key | Hardcoded in workflow JSON | **n8n Credential Manager** (`Supabase Service Role Key`) |
| Error handling | `neverError: true` everywhere | **Validation nodes** + retry (3x, 5s delay) |
| Payload size | Full JSON passed between agents | **Slim summaries** (5–8 key fields per agent) |
| Models | All gpt-4o | **A1/A3/A6/A7/A8 → gpt-4o-mini**, A4/A5 → gpt-4o |
| Mode | Always runs all 8 agents | **Light** (A1+A2+A3+A5) or **Full** (all 8) |
| webhookBaseUrl | Accepted as-is from request | **Validated against allowlist** |
| AI scope | AI could influence numeric outputs | **AI generates text explanations only** |

---

## 2. Parallelization Architecture

```
Request
  └─▶ Parse & Validate Inputs v2
        ├─▶ Call Agent A1 (Competitor)   ─────────────────────────┐
        ├─▶ IF A6 full? ─▶ Call A6 (Demographics)                 │
        │               └─▶ A6 Stub (light mode)    ─────────────►│
        ├─▶ IF A7 full? ─▶ Call A7 (Benchmark)                    │
        │               └─▶ A7 Stub (light mode)    ─────────────►├─▶ Merge Group 1
        └─▶ IF A8 full? ─▶ Call A8 (Economy)                     │       │
                        └─▶ A8 Stub (light mode)    ─────────────┘       │
                                                                          ▼
                                                           Extract Group 1 Summaries
                                                                          │
                                                           A2 ──▶ A3 ──▶ IF A4 full?
                                                                         ├─▶ A4 (full)
                                                                         └─▶ A4 Stub
                                                                               │
                                                                              A5
                                                                               │
                                                                          Consolidate
                                                                          Normalize
                                                                          Save to Supabase
```

**Why this is faster:** A1, A6, A7, A8 now run simultaneously. On average each takes 15–25 seconds. In parallel, the group completes in ~25 seconds (slowest agent) instead of ~80 seconds (sum of all). This alone saves 50–60 seconds per request.

---

## 3. Mode Selection

Send `"mode": "light"` or `"mode": "full"` in your webhook POST body.

### Light Mode (default for free/trial users)
Runs: **A1, A2, A3, A5**
Skips: A4 (Cost), A6 (Demographics), A7 (Benchmarks), A8 (Economy)

- Cost: ~60% cheaper than full mode
- Speed: ~40–45 seconds
- Output: Competitor map, rent data, market demand, revenue projection
- Missing: ATO benchmarks, ABS demographics, RBA economic context, full cost breakdown

### Full Mode (paid users)
Runs: **All 8 agents**
- Cost: Full LLM + API usage
- Speed: ~65–80 seconds
- Output: Complete 10-dimension analysis with SWOT, projections, benchmarks

### How to implement mode-gating in your frontend
```javascript
const payload = {
  // ... other fields ...
  mode: user.isPro ? 'full' : 'light'
};
```

---

## 4. Caching Layer

### Which agents to cache and why

| Agent | Cache TTL | Reason |
|-------|-----------|--------|
| A6 – Demographics | 30 days | ABS Census data, changes annually |
| A7 – Benchmarks | 14 days | ATO benchmarks updated quarterly |
| A8 – Economy | 7 days | ABS/RBA data released weekly |
| A1 – Competitors | 3 days | Google Maps listings update slowly |
| A2 – Rent | 2 days | Property listings change daily |
| A3 – Market | No cache | Depends on user's business_type + segment |
| A4 – Cost | No cache | Depends on user's specific inputs |
| A5 – Revenue | No cache | Depends on A1–A4 which vary |

### Cache key formula
```javascript
// Generate cache key for each agent
const cacheKey = md5(
  agentId + '|' +
  city.toLowerCase() + '|' +
  area.toLowerCase() + '|' +
  (businessType || '').toLowerCase()
).slice(0, 32);
```

### How to implement in n8n (step-by-step for beginners)

**Step 1:** Before each cacheable agent call (A1, A6, A7, A8), add an HTTP GET node:
```
GET https://YOUR_PROJECT.supabase.co/rest/v1/agent_cache
?cache_key=eq.{cache_key}
&select=cached_data,expires_at
```
Headers: `apikey: YOUR_SERVICE_ROLE_KEY`

**Step 2:** Add an IF node: `expires_at > NOW()`
- TRUE → skip HTTP agent call, use `cached_data`
- FALSE → call agent as normal, then write to cache

**Step 3:** After agent runs (on cache miss), add HTTP POST:
```
POST /rest/v1/agent_cache
Body: { cache_key, agent_id, cached_data, ttl_hours, city, area }
```

**Estimated savings with caching:**
- City like Melbourne/Sydney: same suburb + business type appears dozens of times daily
- A6 cache hit = save ~20s + ~$0.003 in API costs per request
- At 100 requests/day: 30 cache hits → ~$2/day saved just on demographics

---

## 5. Security Implementation

### Supabase Credential Setup (REQUIRED – do this before importing)

1. Go to n8n → Settings → Credentials → New Credential
2. Type: `HTTP Header Auth`
3. Name: `Supabase Service Role Key`
4. Header Name: `apikey`
5. Header Value: Your NEW Supabase service role key
6. Create a second credential with same key but name `Authorization`, value `Bearer YOUR_KEY`

**After creating credentials:**
In the `Save to Supabase` node in the refactored orchestrator:
- Open the node
- Set `Authentication` → `Predefined Credential Type`
- Select your `Supabase Service Role Key` credential
- Replace `REPLACE_WITH_SUPABASE_CREDENTIAL_ID` with the actual credential ID

### webhookBaseUrl Validation
The Parse node now validates incoming `webhookBaseUrl` against:
```javascript
const ALLOWED_HOSTS = ['amanguleria.app.n8n.cloud', 'n8n.cloud'];
```
Add your own n8n instance hostname to this list. Any other URL is rejected and replaced with the default.

### Additional Security Checklist
- [ ] Rotate old Supabase key immediately (if exposed in any git commits or shared files)
- [ ] Enable Supabase Row Level Security (already in schema)
- [ ] Add rate limiting to webhook (n8n Cloud: set execution limit per IP)
- [ ] Validate `user_id` against Supabase `auth.users` before processing
- [ ] Never log full request bodies to n8n execution logs (they contain user PII)

---

## 6. Error Handling & Fallback Rules

### Per-Agent Validation
Each `Validate & Store Ax` node checks:
- Required fields exist (`agent_id` minimum)
- No parse error flag
- Sets `_ax_failed = true` if validation fails

### Fallback Defaults Applied in Consolidation
When an agent fails, the system uses these fallbacks:

| Agent Failed | Fallback Behaviour |
|-------------|-------------------|
| A1 | `competitor_density_score = 50`, `saturation_level = 'Unknown'`, no competitor list |
| A2 | `median_rent = null`, `rent_viability_score = null`, flag `rent_missing` set |
| A3 | `growth_score = 50`, `demand_trend = 'Unknown'` |
| A4 | `setup_cost = null`, cost feasibility score = null |
| A5 | `revenue_range = null`, profitability score = null |
| A6 | Demographics score = null, footfall falls back to A2 POI data only |
| A7 | Benchmark score = null, no ATO comparison |
| A8 | Economic health = null, wage/CPI data = ABS assumptions used |

### Retry Logic
All agent HTTP calls: `retryOnFail: true, maxTries: 3, waitBetweenTries: 5000ms`
Supabase save: `retryOnFail: true, maxTries: 2, waitBetweenTries: 3000ms`

### When to Alert
Add a Supabase insert to `agent_logs` table after consolidation. Trigger an alert (email/Slack) if:
- `overall_score = null` (multiple agents failed)
- `execution_ms > 120000` (workflow took over 2 minutes)
- More than 2 agents failed in one run

---

## 7. AI Layer Restrictions

Every agent's AI system prompt now includes this mandatory restriction:
```
CRITICAL OUTPUT RULES:
1. You are an EXPLANATION engine only. Never invent numbers.
2. All metrics come exclusively from the data provided to you.
3. Your job: turn deterministic data into clear plain-English insights.
4. If data is missing: state "Insufficient data" — do NOT estimate.
5. Never alter numeric metrics in your output.
```

**What AI does:** Interprets data → generates natural language explanation
**What AI does NOT do:** Calculate scores, generate revenue projections, invent competitor names, create financial forecasts

All numeric outputs (scores, rent figures, revenue ranges) come from your processing code nodes, not from the AI.

---

## 8. Payload Size Reduction

### Before (what was passed between agents)
```json
{ "a1_output": { ...full 8KB JSON response with all 28 competitors, full analysis... } }
```

### After (slim summaries)
```json
{
  "a1_summary": {
    "competitor_density_score": 58,
    "saturation_level": "High",
    "total_competitors_found": 28,
    "competitors_within_500m": 11,
    "pricing_bands": { "low": 2, "mid": 8, "high": 1 },
    "opportunity_gaps": ["Specialty coffee", "Late-night", "Allergen-free"],
    "threat_summary": "High density near entry point",
    "_failed": false
  }
}
```

**Reduction:** ~8KB → ~0.4KB per agent summary = **~95% smaller**
**Impact:** Each downstream LLM call costs 60–80% fewer input tokens

---

## 9. Model Cost Comparison

| Agent | Old Model | New Model | Cost per 1M tokens | Saving |
|-------|-----------|-----------|-------------------|--------|
| A1 Competitor | gpt-4o | gpt-4o-mini | $0.15 vs $2.50 | ~94% |
| A3 Market | gpt-4o | gpt-4o-mini | $0.15 vs $2.50 | ~94% |
| A6 Demographics | gpt-4o | gpt-4o-mini | $0.15 vs $2.50 | ~94% |
| A7 Benchmarks | gpt-4o | gpt-4o-mini | $0.15 vs $2.50 | ~94% |
| A8 Economy | gpt-4o | gpt-4o-mini | $0.15 vs $2.50 | ~94% |
| A4 Cost | gpt-4o | gpt-4o (unchanged) | $2.50 | – |
| A5 Revenue | gpt-4o | gpt-4o (unchanged) | $2.50 | – |

**Why A4 and A5 stay on gpt-4o:** These agents produce complex multi-year financial projections and break-even analysis. The accuracy improvement from the larger model justifies the cost. All other agents produce structured explanations where gpt-4o-mini performs equally well.

**Estimated total cost saving per report:** 60–75% reduction in LLM costs

---

## 10. Monetization & Next Steps

### Tier Architecture

**Free / Trial**
- Mode: Light
- Reports per day: 3
- Agents: A1, A2, A3, A5
- No PDF export, no saved history

**Starter (~A$29/month)**
- Mode: Full
- Reports per day: 10
- All 8 agents
- PDF export, 30-day history

**Pro (~A$79/month)**
- Mode: Full + caching for speed
- Unlimited reports
- White-label PDF
- API access for your own integrations
- Priority processing (webhook priority queue)

**Agency (~A$249/month)**
- Bulk processing API
- White-label reports
- Multi-user accounts
- Custom business type training data

### Implementing Free vs Paid in n8n
In your Parse node, after validating the user, add:
```javascript
// Check user tier from Supabase
// GET /rest/v1/user_tiers?user_id=eq.{user_id}
// Then set mode based on tier:
const tier = userRecord.tier || 'free';
const mode = tier === 'free' ? 'light' : 'full';
```

### Revenue Estimates
- 100 free users → 20% convert → 20 paid @ $29 = $580/month
- LLM cost per full report: ~$0.08–0.15
- LLM cost per light report: ~$0.02–0.05
- At 1000 reports/month: LLM cost ~$80–150/month
- Gross margin at 20 paid users: ~73%

### Next Improvements to Build
1. **Webhook endpoint for async processing** — return a job ID immediately, poll for result (removes 2-minute timeout risk)
2. **Cache warming** — pre-populate A6/A7/A8 for top 50 Australian suburbs nightly
3. **Batch API** — process multiple locations in one request (for commercial property search tools)
4. **Feedback loop** — let users rate report accuracy → feed into prompt refinement
5. **Real estate data integration** — direct Domain.com.au or REA Group API instead of SerpAPI scraping

---

## 11. File Inventory

| File | Description |
|------|-------------|
| `refactored-master-orchestrator-v2.json` | Main n8n workflow — import this |
| `refactored-a1-agent.json` | A1 Competitor Intel (model: gpt-4o-mini) |
| `refactored-a2-agent.json` | A2 Rent (no model change, data-only) |
| `refactored-a3-agent.json` | A3 Market Growth (model: gpt-4o-mini) |
| `refactored-a4-agent.json` | A4 Cost Projection (model: gpt-4o, unchanged) |
| `refactored-a5-agent.json` | A5 Revenue & Profitability (model: gpt-4o, unchanged) |
| `refactored-a6-agent.json` | A6 Demographics (model: gpt-4o-mini) |
| `refactored-a7-agent.json` | A7 Benchmarks (model: gpt-4o-mini) |
| `refactored-a8-agent.json` | A8 Economic Context (model: gpt-4o-mini) |
| `supabase-schema-v2.sql` | Run in Supabase SQL Editor — creates all tables |
| `sample-output-light-mode.json` | Example API response for light mode |
| `sample-output-full-mode.json` | Example API response for full mode |
| `REFACTOR_DOCS.md` | This file |

## 12. Import Order

1. Run `supabase-schema-v2.sql` in Supabase SQL Editor
2. Create n8n credentials for Supabase (see Section 5)
3. Import all 8 individual agent workflows (`refactored-ax-agent.json`)
4. Import the master orchestrator (`refactored-master-orchestrator-v2.json`)
5. Update the `REPLACE_WITH_SUPABASE_CREDENTIAL_ID` placeholder in Save to Supabase node
6. Update `webhookBaseUrl` allowlist in Parse node with your n8n instance URL
7. Activate all 9 workflows
8. Test with a POST to `/webhook/locatalyze-master-v2` with `"mode": "light"` first
