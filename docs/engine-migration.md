# Engine Migration Plan: Legacy Manual-Score Pages

> **Goal:** Remove all 67 entries from `.check-scores-ignore` so that `npm run check:scores` passes with zero violations and all pages derive scores from `computeLocationModel()`.

---

## Why This Matters

The scoring engine in `lib/analyse-data/scoring-engine.ts` is the single source of truth.
Legacy pages with hardcoded scores create:
- Silent contradictions (e.g. Casuarina: retail page says 84/GO, engine says 45/RISKY)
- Maintenance risk: updating a factor in the engine has no effect on legacy pages
- Trust erosion if users visit multiple pages for the same city

---

## Page Archetypes (4 patterns)

All 67 legacy files fall into one of these patterns. The refactor recipe is identical within each pattern.

### Archetype A — Foundation data files (2 files)
`lib/analyse-data/cities.ts`, `lib/analyse-data/suburbs.ts`

These define TypeScript interfaces and data used by city hub pages.
- `SuburbRef` has `score: number` and `verdict: Verdict` hardcoded
- `SuburbPageData` has `overallScore: number` and `scores: ScoreBreakdown` hardcoded

**Fix:** Make score fields optional (`score?: number`) and add a `factors?: LocationFactors` field.
City data files can then provide factors and let the hub compute scores at render time.
No page changes required — just type relaxation.

---

### Archetype B — City hub pages (8 files)
Pattern: `/analyse/[city]/page.tsx`

Files: `perth`, `sydney`, `melbourne`, `brisbane`, `newcastle`, `analyse/page.tsx`

These pages have a `BUSINESS_TYPES` array like:
```ts
const BUSINESS_TYPES = [
  { type: 'cafe', score: 82, topSuburb: 'Subiaco', topScore: 89, ... },
  ...
]
```

**Fix:**
1. Create `lib/analyse-data/[city].ts` with suburb seed data
2. Import `getXxxSuburbs()` in the hub page
3. Derive `score` from `suburb.compositeScore` for each business type's topSuburb
4. Remove hardcoded `score` and `topScore` fields

---

### Archetype C — Business-type SEO guide pages (24 files)
Pattern: `/analyse/[city]/[type]/page.tsx`

Files: `sydney/cafe`, `sydney/restaurant`, `sydney/retail`, `perth/cafe`, `perth/restaurant`, `melbourne/cafe`, `melbourne/restaurant`, `brisbane/cafe`, `adelaide/restaurant`, and 15 others.

These pages follow the exact same structure as `darwin/retail` which was already migrated.
They have:
```ts
const SUBURB_SCORES = [
  { suburb: 'Newtown', score: 86, rent: 9500, traffic: 91, income: 88 },
  ...
]
const TOP_SUBURBS = [
  { rank: 1, name: 'Newtown', score: 86, verdict: 'GO' as const, ... },
  ...
]
```

**Fix:** Identical to the darwin/retail migration:
1. Import `getXxxSuburbs()` from the city data layer
2. Helper: `getScore(name) → suburb.cafe | suburb.restaurant | suburb.retail`
3. Replace `SUBURB_SCORES[n].score` with `getScore(name)`
4. Replace `TOP_SUBURBS[n].score` and `.verdict` with engine values
5. Reorder TOP_SUBURBS by engine score (highest first)
6. Update narrative where verdicts flip (GO→CAUTION or vice versa)

---

### Archetype D — Suburb deep-dive pages (33 files)
Pattern: `/analyse/[city]/[suburb]/page.tsx`

Files: `sydney/parramatta`, `sydney/auburn`, `sydney/bankstown`, `sydney/marrickville`, `melbourne/broadmeadows`, `perth/mount-lawley`, `perth/perth-cbd`, and 26 others.

These are individual suburb analysis pages. They have a top-level `overallScore` and a `ScoreBreakdown`:
```ts
const DATA = {
  overallScore: 84,
  scores: { footTraffic: 88, demographics: 85, rentViability: 82, ... },
  verdict: 'GO',
  ...
}
```

**Fix:**
1. Import `getXxxSuburb(slug)` from city data layer
2. Replace `DATA.overallScore` with `suburb.compositeScore`
3. Replace `DATA.verdict` with `suburb.verdict`
4. The `scores` breakdown (footTraffic etc.) maps to engine `locationFactors` — replace or remove

---

## Migration Phases

### Phase 0 — Already done ✅
- Darwin data layer (`lib/analyse-data/darwin.ts`)
- Darwin retail page migrated (`darwin/retail/page.tsx`)
- Gold Coast data layer (`lib/analyse-data/gold-coast.ts`)
- Runtime assertion + CI script + pre-commit hook

---

### Phase 1 — Foundation types (2 files) 🎯 DO FIRST
**Files:** `cities.ts`, `suburbs.ts`
**Risk:** Low — only type changes, no behaviour change
**Effort:** 1–2 hours

Changes:
- `SuburbRef.score` → `score?: number` (optional, computed from engine if present)
- `SuburbRef.verdict` → `verdict?: Verdict` (optional)
- `NearbySuburb.score` → `score?: number`
- `SuburbPageData.overallScore` → `overallScore?: number`
- Add `factors?: LocationFactors` to `SuburbRef` so hub pages can optionally compute

No downstream pages break — all usages already provide values.
Remove from `.check-scores-ignore` after.

---

### Phase 2 — Brisbane (5 files)
**Why first:** Fewest pages, most contained. A good rehearsal before Sydney/Melbourne.
**Files:** `brisbane/page.tsx`, `brisbane/cafe/page.tsx`, `bundaberg/cafe/page.tsx`, `sunshine-coast/cafe/page.tsx`, `sunshine-coast/restaurant/page.tsx`

Steps:
1. Create `lib/analyse-data/brisbane.ts` (Brisbane city suburbs + Bundaberg/Sunshine Coast)
2. Migrate `brisbane/page.tsx` (Archetype B)
3. Migrate `brisbane/cafe/page.tsx` (Archetype C)
4. Migrate QLD regional pages (Archetype C)
5. `npm run check:scores` must pass with these 5 removed from ignore

---

### Phase 3 — Perth (4 files)
**Files:** `perth/page.tsx`, `perth/cafe/page.tsx`, `perth/restaurant/page.tsx`, `perth/mount-lawley/page.tsx`, `perth/perth-cbd/page.tsx`

Note: Perth suburb data already exists in `lib/suburb-data.ts` (from an earlier session) — cross-reference to avoid duplicating seed data.

Steps:
1. Create `lib/analyse-data/perth.ts` (key Perth suburbs — Subiaco, Fremantle, Leederville, etc.)
2. Migrate hub + business-type pages (Archetypes B + C)
3. Migrate `perth/mount-lawley` and `perth/perth-cbd` suburb pages (Archetype D)
4. Remove 5 files from ignore

---

### Phase 4 — Regional cities (12 files)
**Files:** All smaller single-city pages: Adelaide, Melbourne (outer suburbs), Canberra, Gold Coast gym, Newcastle, Wollongong restaurant, Toowoomba, Townsville, Geelong, Hobart, Ballarat, Bendigo, Cairns, Rockhampton, Hervey Bay, Launceston, Ipswich, Mackay

These share a city data layer per city (or share a `regional.ts` if the city only has 1–2 pages).

Strategy:
- For cities with 1 page: inline the seed data directly in the page (no separate data layer file needed)
- For cities with 2+ pages: create `lib/analyse-data/[city].ts`

---

### Phase 5 — Melbourne (9 files)
**Files:** `melbourne/page.tsx`, `melbourne/cafe/page.tsx`, `melbourne/restaurant/page.tsx`, `melbourne/broadmeadows/page.tsx`, `melbourne/cranbourne/page.tsx`, `melbourne/epping/page.tsx`, `melbourne/frankston/page.tsx`, `melbourne/hoppers-crossing/page.tsx`, `melbourne/narre-warren/page.tsx`, `melbourne/pakenham/page.tsx`, `melbourne/sunshine/page.tsx`

Largest single city migration. Melbourne outer suburb pages (Broadmeadows, Cranbourne, etc.) are all Archetype D.

Steps:
1. Create `lib/analyse-data/melbourne.ts` (inner city + outer suburbs)
2. Migrate hub page (Archetype B)
3. Migrate cafe + restaurant pages (Archetype C)
4. Migrate 8 suburb deep-dive pages (Archetype D)

---

### Phase 6 — Sydney (18 files) — do last
**Files:** `sydney/page.tsx`, `sydney/cafe/page.tsx`, `sydney/restaurant/page.tsx`, `sydney/retail/page.tsx`, `sydney/gym/page.tsx`, `sydney/bakery/page.tsx`, `sydney/salon/page.tsx`, and 11 suburb deep-dive pages (Alexandria, Auburn, Bankstown, Blacktown, Burwood, Campbelltown, Fairfield, Granville, Hornsby, Lakemba, Liverpool, Marrickville, Merrylands, Mount Druitt, North Sydney, Parramatta, Penrith, Ryde)

Sydney is the most complex — the most pages, the most narrative content.

Steps:
1. Create `lib/analyse-data/sydney.ts` (all Sydney suburbs in the pages above)
2. Migrate hub page (Archetype B)
3. Migrate 6 business-type guide pages (Archetype C) — scores will change, update narrative
4. Migrate 11 suburb pages (Archetype D) — most are simpler structure
5. Final `npm run check:scores` with Sydney removed from ignore

---

### Phase 7 — Final cleanup
- Remove `lib/analyse-data/cities.ts` and `lib/analyse-data/suburbs.ts` from `.check-scores-ignore`
- Run `npm run check:scores` — expect ZERO violations and ZERO files in ignore
- Confirm all TypeScript types pass: `npx tsc --noEmit`
- Deploy to Vercel: full regression test across 10 cities

---

## Per-Page Refactor Checklist

Run this for every page migration:

- [ ] Identify which archetype the page is (A/B/C/D)
- [ ] Confirm city data layer (`lib/analyse-data/[city].ts`) exists or create it
- [ ] Import `get[City]Suburbs()` or `get[City]Suburb(slug)` at top of page
- [ ] Replace all `SUBURB_SCORES[n].score` with engine value
- [ ] Replace all `TOP_SUBURBS[n].score` and `.verdict` with engine values
- [ ] Sort `TOP_SUBURBS` by engine score (descending) — reorder if needed
- [ ] For any suburb where verdict flips (GO↔CAUTION, CAUTION↔RISKY): update narrative angle to match
- [ ] Remove suburb from `RISK_SUBURBS` if engine now gives CAUTION (don't present as NO)
- [ ] Run `npx tsc --noEmit` — must pass
- [ ] Run `npm run check:scores` — must show reduced violation count
- [ ] Remove page from `.check-scores-ignore`
- [ ] Deploy and verify page renders correctly

---

## Safety Rules (Non-negotiable)

1. **Never change URLs** — routes stay identical, only data changes
2. **Never modify the scoring engine** — `scoring-engine.ts` is frozen during migration
3. **Migrate one city at a time** — never work on Sydney and Melbourne simultaneously
4. **TypeScript must pass before every push** — `npx tsc --noEmit` with zero errors
5. **`check:scores` must pass before removing from ignore** — don't remove pre-emptively
6. **Update narrative when verdict flips** — a page saying "Parramatta is GO" with engine score of 55 (RISKY) is worse than the original manual score

---

## Verdict Change Risk Matrix

When migrating, some suburbs will see verdict changes. This table shows the risk level:

| Change | Risk | Action |
|--------|------|--------|
| GO → GO (score changes slightly) | Low | Just update number |
| GO → CAUTION | Medium | Update narrative to be more qualified |
| GO → RISKY | High | Rewrite narrative angle completely |
| CAUTION → RISKY | Medium | Update risks section |
| CAUTION → GO | Low | Upgrade narrative |
| RISKY → CAUTION | Low | Upgrade narrative |

**Rule:** Never leave a page where the written narrative contradicts the engine verdict.

---

## Validation System

### Per-migration check
```bash
npm run check:scores          # must pass with page removed from ignore
npx tsc --noEmit              # zero TypeScript errors
```

### Final production check (Phase 7)
```bash
npm run check:scores          # expect: 0 violations, 0 legacy files ignored
npx tsc --noEmit              # zero errors
```

Manual spot-checks:
- Visit `/analyse/sydney/cafe` — scores should match `/analyse/sydney` hub
- Visit `/analyse/perth` hub — suburb scores match `/analyse/perth/cafe` guide
- Visit `/analyse/darwin` hub — scores match `/analyse/darwin/retail` (already verified)

---

## Estimated Effort

| Phase | Files | Effort | Risk |
|-------|-------|--------|------|
| Phase 1 (types) | 2 | 1 hr | Low |
| Phase 2 (Brisbane) | 5 | 3 hrs | Low |
| Phase 3 (Perth) | 5 | 3 hrs | Low |
| Phase 4 (Regional cities) | 18 | 8 hrs | Low-Medium |
| Phase 5 (Melbourne) | 11 | 6 hrs | Medium |
| Phase 6 (Sydney) | 19 | 10 hrs | High |
| Phase 7 (Cleanup) | 2 | 1 hr | Low |
| **Total** | **62** | **~32 hrs** | |

> Note: 67 files listed in `.check-scores-ignore` includes the 2 foundation files + 65 page files. 62 page-level changes above. Phases 2–6 require 4–5 new city data layer files to be created first.

---

## Current Status

| City | Data layer | Pages migrated | Ignore entries |
|------|-----------|----------------|----------------|
| Darwin | ✅ darwin.ts | ✅ retail/page | 0 |
| Gold Coast | ✅ gold-coast.ts | 0 (hub uses engine) | 1 (gym) |
| Brisbane | ❌ | 0 | 4 |
| Perth | ❌ | 0 | 5 |
| Sydney | ❌ | 0 | 18 |
| Melbourne | ❌ | 0 | 11 |
| Adelaide | ❌ | 0 | 1 |
| Regional QLD | ❌ | 0 | 9 |
| Wollongong | ❌ | 0 | 1 |
| Newcastle | ❌ | 0 | 2 |
| Foundation | n/a | n/a | 2 |
| **Total** | | | **54** |

*Note: Wollongong and Newcastle hub pages use the engine for the main suburb grid but may have legacy scores in their restaurant/bakery sub-pages.*
