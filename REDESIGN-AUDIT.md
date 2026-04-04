# Locatalyze Report Redesign — Full Audit & Strategy

**Author:** Senior Product Engineer / UX Strategist
**Date:** April 2026
**Scope:** Transform the report from "AI-generated output" to premium decision-grade SaaS product

---

## 1. AUDIT: Backend Power vs. UI Surface

### What the backend computes but the UI does NOT show

| Capability | Backend | UI Status | Impact if Surfaced |
|---|---|---|---|
| Revenue uncertainty range ($35k–$55k ±30%) | `C.revenueRange` | **Not shown** — UI shows false-precision "$47,200" | Critical — this is the #1 trust killer |
| Market intelligence (saturation score 0–100, opportunity score, viability score) | `C.marketIntelligence` | **Not shown** | High — these are the most valuable computed scores |
| Top 3 threat competitors (ranked by composite threat score) | `C.marketIntelligence.topThreats[]` | **Not shown** | High — users care about WHO their competition is |
| Market gap detection ("no premium tier in high-saturation area") | `C.marketIntelligence.marketGapNote` | **Not shown** | High — this is actionable, differentiated intelligence |
| Competitor strength breakdown (3 strong, 2 medium, 1 weak) | `C.marketIntelligence.strongCount/moderateCount/weakCount` | **Not shown** | High — "6 competitors" is meaningless without severity |
| Competitor pressure factor (revenue adjusted -20% due to density) | `C.competitorPressure.pressureFactor` | **Not shown** | Medium — explains why revenue was reduced |
| Demand signals score (transit/schools/malls/anchors weighted 0–100) | Live API `demandSignals` | **Not shown** — only raw map data | High — synthesised demand score is more useful |
| Verdict failure modes ("This will fail if rent increases >25%") | `C.verdictFailureModes[]` | **Partially shown** (added recently) | Critical — this is what makes the report worth paying for |
| Verdict conditions ("This works ONLY IF ticket size stays above $18") | `C.verdictConditions[]` | **Partially shown** (added recently) | Critical |
| Section-level confidence with gap explanations | `C.sectionConfidence[section].gaps[]` | **Tiny badge only** — gaps not expanded | High — needs prominent treatment |
| Per-metric provenance (Live Data vs Benchmark per field) | `C.provenance` | **Small badges only** | Medium — should be more prominent on individual metrics |
| Contradiction warnings | `C.contradictions[]` | **Shown when error** | Good — but warning-level should be more visible |
| Scores: saturation (0–100), viability (0–100) | `C.scores.saturation`, `C.scores.viability` | **Not shown** | Medium |
| Competitor data confidence (87% Google, 13% OSM) | `C.competitorPressure.avgConfidence` | **Not shown** | Medium |
| 3-year cumulative projection | `C.projection.year1/2/3` | **Not shown** | Medium |

### Where the UI is misleading or too generic

1. **"$47,200/month" displayed as fact** — the engine knows this is ±30% uncertain but the UI presents a single number. This is the single biggest credibility problem. No serious analyst would present a benchmark estimate as a precise figure.

2. **"6 competitors" with no severity context** — 6 weak competitors is completely different from 6 strong ones. The backend computes `strongCount=3, moderateCount=2, weakCount=1` but the UI just shows "6".

3. **"CAUTION" verdict with no actionable context** — when a hard fail gate fires (e.g. benchmark-only data), the user sees "CAUTION" but doesn't understand what to do differently. The gate explanation was recently added but the conditions/failure modes need more prominence.

4. **Generic copy throughout** — phrases like "benchmark estimate" and "from A5 model" mean nothing to users. The copy needs to be specific: "Estimated from Australian cafe industry averages — verify with local sales data."

5. **Competition tab shows raw cards but no strategic synthesis** — the tab lists competitors but doesn't answer the question users actually have: "Can I win here?"

6. **No suburb context** — the report jumps straight into financials without establishing where this is. What kind of suburb? Who lives there? What do they spend? The A6 demographics data exists but is barely used.

---

## 2. REDESIGNED REPORT STRUCTURE

### New Tab Architecture

| Tab | Purpose | Primary Data Sources |
|---|---|---|
| **Summary** | Hero verdict + 4–6 key insights + conditions | C.verdict, C.verdictReasons, C.verdictConditions, C.verdictFailureModes, C.revenueRange |
| **Key Insights** | 4–6 data-backed actionable insight cards | Synthesised from all C.* fields |
| **Suburb Intel** | NEW — suburb profile, demographics, lifestyle signals | A6, A2 area context, demographics |
| **Competition** | Strength-based breakdown, top threats, gaps | C.marketIntelligence, C.competitors, C.competitorPressure |
| **Financials** | Revenue range, cost breakdown, scenarios, P&L | C.revenueRange, C.costBreakdown, C.scenarios, C.provenance |
| **Risks & Conditions** | Failure modes, contradictions, what-if calculator | C.verdictFailureModes, C.contradictions, C.verdictConditions |
| **Map** | Interactive competition + demand overlay | MapboxMap, nearby-places API |

### Summary Tab (replaces current Overview)

**Hero Section:**
- Verdict badge: GO / PROCEED — VERIFY FIRST / NO (not just CAUTION)
- Revenue range displayed as the hero number: "$35k–$55k/month" not "$47,200"
- Confidence bar with percentage
- Gate explanation when triggered (one sentence, not hidden)
- 3–5 verdict reasons from `C.verdictReasons` (already specific, not generic)

**Key Metrics Row (4 tiles):**
- Revenue range (from `C.revenueRange`)
- Net profit/month
- Break-even daily customers
- Viability score (from `C.scores.viability` — this is the composite "should I open here?" number)

**Conditions & Failure Modes (NEW — most important addition):**
- "This location works IF:" — 3–4 conditions from `C.verdictConditions`
- "This location fails IF:" — 2–3 modes from `C.verdictFailureModes`
- These should be PROMINENT, not buried. They're what differentiate this from a generic report.

**Score Breakdown:**
- Keep the radar + score bars but add the section confidence badge INLINE with each score
- e.g. "Competition: 72/100 (HIGH DATA — 12 competitors verified via Google)"

---

## 3. SUBURB INTELLIGENCE TAB (New Feature)

This is the highest-leverage new feature. Most location analysis tools dump numbers. A suburb intelligence section makes the report feel like it was written by a local market analyst.

### Section A: Suburb Overview Card
- Suburb name + postcode (from input)
- One-paragraph AI-generated summary: "Fitzroy is a dense inner-city suburb known for its cafe culture, high foot traffic, and young professional demographic. The area commands premium rents but supports premium pricing."
- Source: Synthesise from A2 area context + A6 demographics + A3 market data

### Section B: Demographics Grid (4 metric tiles)
- **Median household income**: from A6 `median_household_income` — with color coding (green >$100k, amber $70k–$100k, red <$70k)
- **Population density**: from A6 `population_density` — with context label ("Dense urban", "Suburban", "Regional")
- **Median age**: from A6 `age_distribution` — with relevance note ("Young professionals 25–34 are 38% of residents — strong cafe demographic")
- **Renter vs Owner split**: from A6 if available — renters tend to eat out more

### Section C: Lifestyle & Spending Signals
Cards for each signal with a "what this means" line:
- **Transit access**: from `C.locationSignals.transitSignal` — "Excellent transit access drives walk-in traffic"
- **Nearby anchors**: from `C.locationSignals.nearbyAnchors[]` — "Coles, Woolworths, and Target within 500m generate consistent foot traffic"
- **Foot traffic signal**: from `C.locationSignals.footfallSignal`
- **Road type**: from `C.locationSignals.roadType` — "Main road frontage provides visibility but may lack the intimate feel that cafe customers prefer"

### Section D: Property & Rent Context
- Area median rent: from `C.locationSignals.medianRent`
- Submitted rent vs area median (is the user overpaying?)
- Rent-to-revenue ratio (already exists, move here for context)
- Top 3 property listings from A2 (already exists)

### Section E: "What This Means For Your Business"
AI-generated synthesis block — 3–4 sentences connecting demographics + location signals to the specific business type. NOT generic. Example:
> "Fitzroy's young, high-income demographic (median $112k) and dense foot traffic make it a strong cafe market. However, the 14 existing cafes within 500m mean you'll need a clear differentiator — premium single-origin coffee or a niche food offering. The area supports premium pricing ($6–8 coffees) but won't tolerate a generic offering."

Data sources: business_type + A6 + A3 market data + C.marketIntelligence

---

## 4. INSIGHT LAYER

### Design: Key Insight Cards

Each insight card has:
- **Headline** (bold, specific, 1 line): "12 competitors within 500m — 3 are dominant chains"
- **Implication** (1 sentence): "Premium positioning required to survive; competing on price against F45 and Anytime Fitness is not viable"
- **Data source badge** (small pill): "Google Places + Geoapify"
- **Confidence indicator** (dot): green/amber/red

### Insight Generation Logic (4–6 insights, ordered by severity)

**Insight 1: Competition Landscape**
- From: `C.marketIntelligence.strongCount`, `C.validCompetitorCount`, `C.marketIntelligence.saturationBand`
- Template: "{count} competitors within {radius}m — {strongCount} are strong operators"
- Implication varies by saturation band

**Insight 2: Revenue Reality Check**
- From: `C.revenueRange`, `C.provenance.revenue`
- If benchmark: "Revenue estimated at $35k–$55k/month from industry benchmarks — not validated against local sales data"
- If live: "Revenue projected at $42k–$52k/month from A5 market model (±20% confidence)"

**Insight 3: Rent Pressure**
- From: `fin.rent.toRevenuePercent`, `C.locationSignals.medianRent`
- Template: "Your rent is {pct}% of projected revenue — {assessment}"
- Assessment: ≤12% = "well within safe margins", 12–20% = "manageable but watch closely", >20% = "exceeds safe threshold — negotiate or find cheaper premises"

**Insight 4: Market Opportunity (or Risk)**
- From: `C.marketIntelligence.marketGapNote`, `C.marketIntelligence.opportunityLevel`
- If gap exists: "Market gap detected: {gapNote}"
- If no gap: "No clear market gap — differentiation strategy is critical"

**Insight 5: Demand Signal**
- From: `C.marketSignals.demandTrend`, `C.competitorPressure.adjustedDemandScore`
- Template: "Demand is {trend} in this area — {implication}"

**Insight 6: Data Confidence Warning** (only if low confidence)
- From: `C.dataCompleteness`, `C.modelConfidence`
- Template: "This report is based on {pct}% live data — {specific gaps}"

---

## 5. TRUST & TRANSPARENCY LAYER

### Per-Section Confidence (Not Just Global)

Current state: tiny badge. Required state: **prominent inline indicator**.

For each tab, show at the top:
```
[GREEN DOT] HIGH CONFIDENCE — 87% complete
Revenue: Live market data (A5)  |  Costs: Live A4 model  |  Ticket size: User input
```
or
```
[AMBER DOT] MEDIUM CONFIDENCE — 52% complete
Revenue: Benchmark estimate  |  Missing: local competitor pricing, foot traffic count
```

Data: `C.sectionConfidence[tab]` + `C.provenance`

### Revenue as RANGE (Not Point Estimate)

The hero metric should ALWAYS be a range when `C.revenueRange` exists:

```
Monthly Revenue: $35,000 – $55,000
±30% uncertainty  ·  Source: Benchmark estimate
[why?] → expandable: "Revenue estimated from Australian cafe industry averages.
Uncertainty is ±30% because no live sales data was available for this specific location."
```

### Contradiction Warnings

Current: error-level shown as red banner, warnings barely visible.
Required: ALL contradictions visible, with clear explanation:

```
⚠ DATA CONFLICT: 12 competitors found but saturation labelled "low"
  → Competition score may be understated. Verify by visiting the area.
  Affects: Competition tab, Overall score
```

### Missing Data — Say It Explicitly

When a field is null/missing, NEVER show "--". Instead:
- "Revenue data unavailable — industry benchmark used instead (±40% uncertainty)"
- "Competitor data incomplete — only 2 of 3 API sources returned results"
- "Demographics use state-level averages — suburb-level data was unavailable"

---

## 6. COMPETITION UPGRADE

### Current Problems
- Shows raw competitor count without severity
- No "top threats" ranking
- No strategic synthesis ("can I win here?")
- Opportunity gaps exist in backend but barely surfaced

### Redesigned Competition Section

**Hero Metrics Row (4 tiles):**
- Total competitors: `C.validCompetitorCount`
- Strong operators: `C.marketIntelligence.strongCount` (RED)
- Market saturation: `C.marketIntelligence.saturationBand` (with 0–100 score)
- Opportunity score: `C.marketIntelligence.opportunityScore` (0–100, GREEN)

**Threat Breakdown Visual:**
```
Competitor Strength Distribution
■■■ Strong (3)  ■■ Medium (2)  ■ Weak (1)
[==============================] 100%
```
Data: `C.marketIntelligence.strongCount/moderateCount/weakCount`

**Top 3 Threats:**
Cards ranked by `C.marketIntelligence.topThreats[]`:
- Name, rating, review count, distance
- Threat label (strong/medium/weak) with score
- Market signals (e.g. "franchise_competition", "high_loyalty")

**Market Gap Detection:**
Prominent card when `C.marketIntelligence.marketGapNote` exists:
```
📊 MARKET GAP DETECTED
"No premium-tier operator in a high-saturation market —
premium positioning may be the most viable entry strategy."
```

**Revenue Impact:**
When `C.competitorPressure.revenueAdjusted === true`:
```
Revenue adjusted down by {(1 - pressureFactor) * 100}% due to competitor density.
Without competitors: $55k/mo → With density adjustment: $44k/mo
```

---

## 7. FINANCIALS UPGRADE

### Revenue: Range First, Point Estimate Second

```
MONTHLY REVENUE RANGE
$35,000 — $55,000
Central estimate: $45,000  ·  Uncertainty: ±30%
Source: Benchmark estimate (Australian cafe industry)
[What drives this estimate?]
→ Avg ticket size: $12 (user input) × 125 customers/day × 30 days
→ Adjusted -12% for competitor density (6 competitors within 500m)
```

### Cost Breakdown: With Attribution

Each cost line should show its source:
```
Monthly Operating Costs                     Source
─────────────────────────────────────────────
Rent                 $4,200    User input ✓
Staff (2 FT + 2 PT)  $28,000   A4 model
COGS (35% of revenue) $15,750   Benchmark
Other operating       $3,500    A4 model
─────────────────────────────────────────────
Total               $51,450
```

### Scenarios: With Customer Count

Each scenario should answer: "how many customers do I need?"
```
                    Worst       Base        Best
Revenue           $31,500     $45,000     $58,500
Costs             $51,450     $51,450     $51,450
Profit/Loss      -$19,950    -$6,450     +$7,050
Customers/day       84         125         163
```

### Break-Even: Visual + Conditional

Show the break-even gauge ONLY when data is reliable.
When `C.provenance.revenue.isBenchmark === true`, add:
```
⚠ Break-even estimate is based on benchmark revenue.
Actual break-even may vary significantly based on local demand.
```

---

## 8. MAP INTELLIGENCE

### Competitor Markers — Color by Strength
- Red markers: `strength === 'strong'` (rating 4.5+, 200+ reviews, or chain brand)
- Amber markers: `strength === 'medium'`
- Teal markers: `strength === 'weak'`
- Marker popup shows: name, rating, reviews, distance, strength score, market signals

### Density Heatmap
Already exists. Improvements:
- Toggle between "all competitors" and "strong competitors only"
- Add gradient legend: Low → Medium → High

### Demand Signals Overlay (New)
- Transit stop markers (from Overpass API)
- School markers
- Mall/anchor markers
- Each with distance ring showing walk time

### Map Insight Panel
Currently exists but could be richer:
- "3 strong competitors within 200m — consider a location 400m+ away"
- "Nearest transit stop is 50m — excellent for walk-in traffic"
- "2 anchor tenants (Coles, Woolworths) generate consistent foot traffic"

---

## 9. COPY & TONE FIX

### Words to eliminate

| Remove | Replace with |
|---|---|
| "moderate" | specific number + context: "6 competitors — above the area average of 4" |
| "average" | the actual number: "$78k median income" |
| "growing market" | "demand grew 4.2% CAGR over 5 years" |
| "various factors" | name the factors |
| "economic uncertainty" | delete entirely or cite specific indicator |
| "benchmark estimate" | "estimated from Australian [type] industry data (not local sales)" |
| "from A5 model" | "from market demand analysis" |
| "from A4 agent" | "from financial model" |
| "--" (double dash) | explicit "Data unavailable — [reason]" |

### Tone guidelines

- Write like a commercial real estate analyst, not a chatbot
- Every sentence must contain a specific number, name, or threshold
- Replace "this is good/bad" with "this means [specific consequence]"
- Use conditional language: "viable IF ticket size stays above $15" not "this looks viable"
- Never use exclamation marks
- Never use "exciting", "great opportunity", "promising"

### Example rewrites

**Before:** "The competition level is moderate with several competitors in the area."
**After:** "12 competitors within 500m — 3 are strong operators (F45, Anytime Fitness, Plus Fitness). The remaining 9 are independent studios with ratings below 4.0 and fewer than 50 reviews, suggesting weak customer loyalty."

**Before:** "Revenue is estimated at $47,200/month."
**After:** "Revenue estimated at $35k–$55k/month (±30%). This is a benchmark estimate based on Australian gym industry averages — not validated against local sales data. The central estimate assumes 125 daily customers at $12.50 average ticket."

---

## 10. PRIORITISATION

### Phase 1: Ship This Week (Highest Impact)

1. **Revenue range as primary display** — replace single-number with `C.revenueRange` everywhere. This alone makes the report 10x more credible.

2. **Key Insights section** — 4–6 synthesised insight cards at the top of the report. This is the "worth paying for" moment.

3. **Competition strength breakdown** — show strong/medium/weak counts, surface `topThreats[]` and `marketGapNote`. Currently the most undertapped backend data.

4. **Conditions & failure modes prominence** — move these from "partially shown" to the hero section. These are what differentiate a paid report from a free one.

5. **Copy pass** — eliminate all "--" values, replace all "moderate/average" with specific data, remove all A1/A2/A3/A4/A5 references from user-facing copy.

### Phase 2: Ship Next Week (High Impact)

6. **Suburb Intelligence tab** — demographics + lifestyle + property context. Requires rendering A6 data properly and generating the synthesis paragraph.

7. **Financials confidence integration** — provenance badges on every metric, "what drives this estimate" expandable sections.

8. **Map strength-coded markers** — colour competitors by threat level.

### Phase 3: Following Sprint (Medium Impact)

9. **Demand signals overlay on map** — transit/school/mall markers with walk-time rings.
10. **Scenario calculator improvements** — tie what-if sliders to actual model variables.
11. **PDF export quality** — make the exported PDF match the web quality.

---

## 11. HONEST OPINION

### Biggest weakness right now

**The report presents guesses as facts.** When the engine says "revenue: $47,200" but internally knows the uncertainty is ±40%, showing the precise number destroys trust for anyone who understands the data. A sophisticated user (the kind who would pay for this) will immediately ask "where did $47,200 come from?" and the answer is "we made it up from benchmarks." That's not a product — it's a liability.

The fix is simple: show the range, show the source, show the confidence. The backend already computes all of this. The UI just needs to stop hiding it.

### What would make this product truly worth paying for

Three things, in order:

1. **The verdict conditions and failure modes.** No other tool tells you "this location works ONLY IF your ticket size stays above $15 AND you achieve 130+ customers/day within 3 months." That's specific, actionable, and worth money. It's already computed — it just needs to be prominent.

2. **The market gap detection.** When the engine says "no premium operator in a high-saturation market — premium positioning is the entry strategy," that's the kind of insight a commercial real estate consultant charges $2,000 for. It's computed, it's specific, it's actionable. Surface it.

3. **The suburb intelligence context.** Knowing that "Fitzroy is 38% renters aged 25–34 with $112k median income" frames every other number in the report. Without it, the financials float in a vacuum.

### What would differentiate this from competitors

Most location analysis tools fall into two categories:
- **Generic market reports** (IBISWorld, Statista): broad industry data, no location specificity
- **Real estate platforms** (Realcommercial, CRE): property listings without business viability analysis

Locatalyze's unique position is **location-specific business viability with honest uncertainty.** No one else computes "your revenue at THIS address, adjusted for THIS competition density, with THIS confidence level."

The differentiation is NOT in having more data. It's in having an opinion backed by data — "GO, but only if these 3 conditions hold" — and being honest about what the data doesn't know.

That's what the backend already does. The frontend just needs to show it.
