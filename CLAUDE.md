# Locatalyze – Engineering Context

## Product
Locatalyze is a production-grade SaaS platform that analyses retail/food/service business locations in Australia and produces decision-grade reports. A user enters a business type, address, and monthly rent on the onboarding page, selects coordinates via Mapbox, and the platform runs an 8-agent n8n pipeline (A1–A8) that saves structured JSON to Supabase. The frontend reads that JSON and renders a premium report.

Target quality standard: Stripe / Notion / Airbnb — clarity, no junk data, no "--" values, no AI filler phrases.

---

## Architecture

```
Next.js 14 App Router (Vercel)
  ├── /app/(marketing)          – public landing pages
  ├── /app/(app)/dashboard      – authenticated report viewer
  ├── /app/onboarding           – address + business type form (Mapbox UI)
  ├── /app/api/analyse          – POST → validates → triggers n8n → returns reportId
  └── /app/auth                 – Supabase auth (magic link + password)

n8n (amanguleria.app.n8n.cloud)
  └── Master Orchestrator       – receives webhook, fans out to A1–A8 in parallel/serial
        ├── A1 – Competitor Intelligence (Google Maps + SerpApi)
        ├── A2 – Location & Rent (SerpApi listings, Overpass, Google Maps)
        ├── A3 – Market Demand (SerpApi + AI analysis)
        ├── A4 – Cost Projection (dynamic financial model)
        ├── A5 – Revenue & Scenarios (sensitivity analysis)
        ├── A6 – Demographics (ABS-adjacent data)
        ├── A7 – Benchmarking
        └── A8 – Economic Context

Supabase
  └── reports table: report_id, user_id, status, result_data (JSONB), input_data (JSONB)
```

---

## Critical Data Rules

### NEVER do this
- Show `--`, `null`, or empty strings for financial figures without a fallback message
- Show profit/loss/ROI when revenue is missing
- Show contradictory data: "0 competitors" + "high competition", "low saturation" + "high density"
- Show generic AI phrases: "growing market", "economic uncertainty", "various factors"

### ALWAYS do this
- If revenue is missing → show: "Revenue could not be calculated — average ticket size or demand estimate is missing."
- If any financial output is partial → block the entire financial section and show a structured CTA
- A4 is the source of truth for costs and revenue estimates when A5 returns null/"Insufficient data"
- Validate: `competitors_found > 0` before any "high competition" label

### A4 → A5 Revenue Reconciliation (CRITICAL)
A5 `monthly_revenue` frequently returns null or "Insufficient data". Always fall back to A4:
```js
const monthlyRevenue = parseMoney(a5out.monthly_revenue ?? a5out.projected_monthly_revenue
  ?? a5out.revenue_range?.monthly_base
  ?? a4out.financial_projections?.estimated_monthly_revenue) || null
```

---

## Coordinate Flow (CRITICAL — currently broken, being fixed)

The user selects an address via Mapbox on `/onboarding`. The `coords` state holds `{ lat, lng }`.

**Required data flow:**
1. Onboarding `runAnalysis()` → include `lat` and `lng` in fetch body
2. `/api/analyse` route → parse `address` string into `{ area, city, locality }` + forward `lat`/`lng` to n8n
3. n8n Master Orchestrator `Parse & Validate Inputs v2` → reads `body.lat`, `body.lng`, `body.area`, `body.city`, `body.locality`
4. A2 agent → receives all fields, uses `$json.area` in SerpApi queries (NOT hardcoded suburb names)

**Address parsing logic** (in `/api/analyse`):
```
"421 Brunswick Street, Fitzroy VIC 3065"
→ locality = "421 Brunswick Street"
→ area     = "Fitzroy"
→ state    = "VIC"
→ city     = "Melbourne"  (mapped from state)
→ postcode = "3065"
```

---

## Known A2 Agent Bugs (n8n)

Two SerpApi nodes in the A2 workflow have **hardcoded Fitzroy/Carlton suburb names** that must be replaced with dynamic `$json.area` references:

| Node name | Hardcoded value | Fix |
|-----------|----------------|-----|
| `SerpApi – Adjacent suburbs` | `'Fitzroy Collingwood Carlton Richmond...'` | `$json.area + ' ' + $json.city + ' adjacent suburb retail lease...'` |
| `SerpApi – Category Prices` | `'...Fitzroy OR Collingwood OR Carlton...'` | `'(site:cre.com.au OR site:realcommercial.com.au) ' + $json.area + ' retail lease...'` |

Without this fix, every single report shows rent data for Fitzroy regardless of the user's actual location.

---

## Verdict Engine (MUST IMPLEMENT)

Every report must include a structured verdict:
```
VERDICT: GO / CAUTION / NO
Reasoning (3–5 bullets — specific, not generic)
Conditions: "This location works ONLY IF: [specific thresholds]"
Failure modes: "This will fail if: [specific triggers]"
```

Financial outputs must be completely suppressed (replaced with CTAs) if any of:
- `monthlyRevenue` is null
- `avgTicketSize` is null or 0
- `setupBudget` is null or 0

---

## Financial Model Standards

### Staffing costs
Never use static values. Calculate from business type + size:
- Cafe (2 FT + 2 casual): AUD 25,000–35,000/month
- Restaurant (3–6 staff): AUD 35,000–55,000/month
- Retail (2–3 staff): AUD 15,000–25,000/month

### Revenue formula
`monthly_revenue = customers_per_day × avg_ticket_size × 30`

### Break-even
`break_even_months = setup_cost / monthly_net_profit`
Only show when `monthly_net_profit > 0`.

---

## UI Standards

- Zero `--` values in any rendered field
- Zero contradictions between sections
- No bullet lists in narrative sections — use prose
- Confidence shown as two separate scores: Data Completeness % + Model Confidence label
- Map section is mandatory (Mapbox, shows competitors, 500m radius, transit nodes)
- Tabs: Overview, Competition, Location & Rent, Market, Financials, Map

---

## Git & Deploy

- Remote: GitHub (token stored in original remote URL)
- Hosting: Vercel (auto-deploy on push to main)
- Local repo has a corrupted `.trash` ref — always push via a clean clone at `/tmp/report_deploy`
- Push command pattern:
  ```bash
  cd /tmp/report_deploy
  git config user.email "pg4441@gmail.com"
  git config user.name "prash"
  cp /sessions/blissful-magical-franklin/mnt/locatalyze/<file> <dest>
  git add <file> && git commit -m "..." && git push
  ```

---

## Environment Variables (Vercel + local .env.local)

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
N8N_WEBHOOK_URL            ← must be /webhook/ not /webhook-test/
NEXT_PUBLIC_MAPBOX_TOKEN
UPSTASH_REDIS_REST_URL     (optional, rate limiting)
UPSTASH_REDIS_REST_TOKEN   (optional)
```

---

## Report Sections (current tab structure)

| Tab | Agent sources | Key outputs |
|-----|--------------|-------------|
| Overview | A1–A5 | Verdict, net profit hero, top risks, SWOT, score radar |
| Competition | A1 | Competitor cards (name, rating, strengths/weaknesses), saturation, opportunity gaps |
| Location & Rent | A2 | Median rent, 3 property listings, footfall/transit signals, anchor effects |
| Market | A3 | Demand trend, 5yr forecast, customer segments, seasonal patterns |
| Financials | A4+A5 | Revenue, cost breakdown table, scenarios (worst/base/best), growth levers |
| Map | Mapbox | Interactive map with competitor pins, 500m radius, transit stops |
