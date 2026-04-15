/**
 * lib/places/strength-scorer.ts
 *
 * Rates each competitor as strong / medium / weak based on
 * rating, review volume, distance proximity, and brand recognition.
 *
 * Also generates structured "review intelligence" — market insights
 * derived from available data signals WITHOUT requiring the expensive
 * Places Details API (which would add ~$0.017/place/call).
 *
 * Strength score (0–100):
 *   Rating quality    → up to 40 pts   (highest signal)
 *   Review volume     → up to 25 pts   (establishment signal)
 *   Proximity threat  → up to 20 pts   (distance to target)
 *   Brand recognition → up to 10 pts   (chain = established = harder to beat)
 *   Source confidence → up to 5 pts    (Google > OSM)
 *
 * Thresholds:
 *   strong:  score ≥ 60
 *   medium:  score ≥ 30
 *   weak:    score  < 30
 */

// ── Chain brand registry ─────────────────────────────────────────────────────
// Franchise/chain brands that are established competitors regardless of
// their review count (they have national marketing + loyal customer bases).

const CHAIN_BRANDS_AU = new Set([
  // Cafes / Coffee
  'starbucks', 'gloria jeans', 'muffin break', 'hudsons coffee', 'zarraffa',
  'the coffee club', 'mcafe', 'gelatissimo', 'boost juice', 'chatime',
  // Gyms / Fitness
  'anytime fitness', 'snap fitness', 'plus fitness', 'jetts', 'fitness first',
  'goodlife', 'genesis fitness', 'ufc gym', 'f45', 'kx pilates', 'fitstop',
  'orangetheory', 'club lime', 'fernwood', 'bodyfit',
  // Restaurants / Fast food
  "mcdonald's", 'mcdonalds', 'kfc', 'hungry jacks', "domino's", 'dominos',
  'pizza hut', 'subway', 'oporto', 'red rooster', 'guzman y gomez',
  "nando's", 'nandos', 'grill\'d', 'schnitz', 'roll\'d',
  // Salons
  'just cuts', 'toni and guy', 'supercuts',
  // Pharmacies
  'chemist warehouse', 'priceline', 'amcal', 'terry white',
  // Retail
  'kmart', 'target', 'big w', 'h&m', 'zara', 'cotton on', 'uniqlo',
])

function isChainBrand(name: string): boolean {
  const lower = name.toLowerCase()
  return [...CHAIN_BRANDS_AU].some(brand => lower.includes(brand))
}

// ── Strength scoring ─────────────────────────────────────────────────────────

export interface CompetitorStrength {
  strength:      'strong' | 'medium' | 'weak'
  strengthScore: number   // 0–100
  reviewInsight: string   // human-readable market signal
  marketSignals: string[] // structured keywords for market analysis
}

export function scoreCompetitorStrength(competitor: {
  name:        string
  rating:      number    // 0–5 (0 = unknown)
  reviewCount: number    // 0 = unknown
  distance:    number    // metres from target location
  source:      string    // 'google' | 'geoapify' | 'foursquare'
  tier?:       string    // 'budget' | 'mid' | 'premium'
}): CompetitorStrength {
  const { name, rating, reviewCount, distance, source, tier } = competitor

  // ── Rating quality (max 40 pts) ──────────────────────────────────────────
  let ratingPts = 0
  if (rating >= 4.5)      ratingPts = 40
  else if (rating >= 4.2) ratingPts = 32
  else if (rating >= 4.0) ratingPts = 24
  else if (rating >= 3.5) ratingPts = 14
  else if (rating >= 3.0) ratingPts = 6
  else if (rating  > 0)   ratingPts = 2
  // rating=0 (unknown) = 0 pts — don't reward unknown quality

  // ── Review volume (max 25 pts) ───────────────────────────────────────────
  let reviewPts = 0
  if (reviewCount >= 1000)     reviewPts = 25
  else if (reviewCount >= 500) reviewPts = 20
  else if (reviewCount >= 200) reviewPts = 15
  else if (reviewCount >= 100) reviewPts = 10
  else if (reviewCount >= 30)  reviewPts = 5
  else if (reviewCount > 0)    reviewPts = 2

  // ── Proximity threat (max 20 pts) ────────────────────────────────────────
  let distancePts = 0
  if (distance <= 100)       distancePts = 20
  else if (distance <= 250)  distancePts = 16
  else if (distance <= 500)  distancePts = 10
  else if (distance <= 1000) distancePts = 4

  // ── Brand recognition (max 10 pts) ───────────────────────────────────────
  const brandPts = isChainBrand(name) ? 10 : 0

  // ── Source confidence bonus (max 5 pts) ──────────────────────────────────
  const sourcePts = source === 'google' ? 5 : source === 'foursquare' ? 3 : 0

  const strengthScore = Math.min(100, ratingPts + reviewPts + distancePts + brandPts + sourcePts)

  const strength: 'strong' | 'medium' | 'weak' =
    strengthScore >= 60 ? 'strong'
    : strengthScore >= 30 ? 'medium'
    : 'weak'

  // ── Review intelligence (inferred from signals) ───────────────────────────
  const isChain    = brandPts > 0
  const isEstab    = reviewCount >= 100
  const isUnknown  = rating === 0 && reviewCount === 0
  const isNearby   = distance <= 300
  const isPremium  = tier === 'premium'
  const isBudget   = tier === 'budget'

  // Market signals array — consumed by finance engine and review panel
  const marketSignals: string[] = []
  if (strength === 'strong')  marketSignals.push('dominant_operator')
  if (isChain)                marketSignals.push('franchise_competition')
  if (isEstab && !isChain)    marketSignals.push('established_local')
  if (isPremium)              marketSignals.push('premium_segment')
  if (isBudget)               marketSignals.push('price_competition')
  if (reviewCount >= 200 && rating >= 4.2) marketSignals.push('high_loyalty')
  if (rating > 0 && rating < 3.5)         marketSignals.push('weak_incumbent')
  if (isNearby && strength === 'strong')   marketSignals.push('proximity_threat')
  if (isUnknown)              marketSignals.push('unverified_venue')

  // Single human-readable insight for the popup
  let reviewInsight: string
  if (isUnknown) {
    reviewInsight = 'No review data — new or unverified venue'
  } else if (isChain && isEstab) {
    reviewInsight = `${isChain ? 'Franchise operator' : 'Established venue'} · ${reviewCount} reviews`
  } else if (rating >= 4.2 && reviewCount >= 200) {
    reviewInsight = `Well-rated with ${reviewCount} reviews — loyal customer base`
  } else if (rating >= 4.0 && reviewCount < 50) {
    reviewInsight = `New or niche venue — high quality, low awareness`
  } else if (rating < 3.5 && reviewCount >= 100) {
    reviewInsight = `High volume but mixed reviews — quality vulnerability`
  } else if (isPremium) {
    reviewInsight = `Premium positioning — price-insensitive customer segment`
  } else if (isBudget) {
    reviewInsight = `Budget operator — volume-focused, price competition risk`
  } else {
    reviewInsight = rating > 0
      ? `${rating.toFixed(1)} · ${reviewCount > 0 ? reviewCount + ' reviews' : 'review count unknown'}`
      : 'Mid-market competitor — standard local presence'
  }

  return { strength, strengthScore, reviewInsight, marketSignals }
}

// ── Aggregate market intelligence ─────────────────────────────────────────────

export interface MarketIntelligence {
  strongCount:    number
  mediumCount:    number
  weakCount:      number
  dominantBrand:  string | null   // highest-scoring competitor name
  marketInsights: string[]        // 2–3 actionable insights
  opportunityGap: string | null   // specific gap detected
}

export function deriveMarketIntelligence(
  competitors: Array<{
    name:          string
    strength:      'strong' | 'medium' | 'weak'
    strengthScore: number
    marketSignals: string[]
    distance:      number
    tier?:         string
  }>,
  bizType: string,
): MarketIntelligence {
  const strongCount  = competitors.filter(c => c.strength === 'strong').length
  const mediumCount  = competitors.filter(c => c.strength === 'medium').length
  const weakCount    = competitors.filter(c => c.strength === 'weak').length

  const sorted       = [...competitors].sort((a, b) => b.strengthScore - a.strengthScore)
  const dominantBrand = sorted[0]?.name ?? null

  const allSignals   = competitors.flatMap(c => c.marketSignals)
  const has          = (s: string) => allSignals.includes(s)

  const insights: string[] = []

  // Saturation assessment
  if (strongCount >= 3) {
    insights.push(`Market is crowded — ${strongCount} strong operators dominating within radius`)
  } else if (strongCount === 0 && competitors.length > 0) {
    insights.push(`No dominant operator — all competitors are medium or weak threat`)
  } else if (strongCount === 1) {
    insights.push(`One dominant player holds the market — positioning around their weakness is key`)
  }

  // Franchise vs independent
  const franchiseCount = competitors.filter(c => c.marketSignals.includes('franchise_competition')).length
  if (franchiseCount >= 2) {
    insights.push(`${franchiseCount} franchise chains present — differentiate on local authenticity`)
  } else if (franchiseCount === 0 && competitors.length >= 3) {
    insights.push(`Independents only — no franchise competition, standard quality bar applies`)
  }

  // Pricing gap
  const premiumCount = competitors.filter(c => c.tier === 'premium').length
  const budgetCount  = competitors.filter(c => c.tier === 'budget').length
  if (premiumCount === 0 && competitors.length >= 2) {
    insights.push(`No premium operators — opportunity for upscale positioning`)
  } else if (budgetCount === 0 && competitors.length >= 2) {
    insights.push(`No budget operators — market skews premium, price sensitivity unknown`)
  }

  // Weak incumbents (low rating = vulnerable)
  const weakIncumbents = competitors.filter(c => c.marketSignals.includes('weak_incumbent'))
  if (weakIncumbents.length >= 2) {
    insights.push(`${weakIncumbents.length} poorly-rated incumbents — addressable quality gap`)
  }

  // Gap detection
  let opportunityGap: string | null = null
  if (competitors.length === 0) {
    opportunityGap = `No ${bizType} competitors detected within radius — verify on the ground`
  } else if (premiumCount === 0 && strongCount >= 2) {
    opportunityGap = `Market has strong operators but no premium tier — boutique gap exists`
  } else if (strongCount === 0) {
    opportunityGap = `No dominant operator — first-mover advantage available for quality entrant`
  }

  return {
    strongCount,
    mediumCount,
    weakCount,
    dominantBrand,
    marketInsights: insights.slice(0, 3),
    opportunityGap,
  }
}

// ── Demand signal score ───────────────────────────────────────────────────────

export interface DemandSignals {
  score:         number   // 0–100
  label:         'High demand zone' | 'Moderate demand' | 'Low demand zone'
  transitCount:  number
  schoolCount:   number
  mallCount:     number
  anchorCount:   number
  signals:       string[]  // human-readable demand drivers
}

export function computeDemandSignals(landmarks: {
  kind: string
}[], anchors: {
  kind: string
  footTraffic: string
}[]): DemandSignals {
  const transitCount = landmarks.filter(l => l.kind === 'transport').length
  const schoolCount  = landmarks.filter(l => l.kind === 'school').length
  const mallCount    = landmarks.filter(l => l.kind === 'mall').length
  const anchorCount  = anchors.length

  // Weighted demand score
  const score = Math.min(100,
    Math.min(transitCount, 3) * 20 +    // max 60 from 3+ transit nodes
    Math.min(mallCount,    2) * 15 +    // max 30 from 2+ malls
    Math.min(schoolCount,  2) *  8 +    // max 16 from 2+ schools
    Math.min(anchorCount,  4) *  5,     // max 20 from 4+ anchors
  )

  const label: DemandSignals['label'] =
    score >= 55 ? 'High demand zone'
    : score >= 25 ? 'Moderate demand'
    : 'Low demand zone'

  const signals: string[] = []
  if (transitCount >= 2) signals.push(`${transitCount} transit nodes nearby — commuter foot traffic`)
  else if (transitCount === 1) signals.push('1 transit node nearby — moderate commuter access')
  if (mallCount >= 1)     signals.push(`${mallCount} shopping centre${mallCount > 1 ? 's' : ''} — destination retail foot traffic`)
  if (schoolCount >= 1)   signals.push(`${schoolCount} school${schoolCount > 1 ? 's' : ''} nearby — family and afternoon traffic`)
  const supermarkets = anchors.filter(a => a.kind === 'supermarket').length
  if (supermarkets >= 1)  signals.push(`${supermarkets} supermarket anchor${supermarkets > 1 ? 's' : ''} — daily necessity foot traffic`)

  if (signals.length === 0) signals.push('Limited demand signals in immediate area')

  return { score, label, transitCount, schoolCount, mallCount, anchorCount, signals }
}
