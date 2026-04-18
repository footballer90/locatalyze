// lib/break-even-calc.ts
// Pure deterministic logic for the Break-Even Foot Traffic tool.
// No UI dependencies — safe to import in server or client components.

export type BusinessTypeBE = 'cafe' | 'restaurant' | 'retail' | 'gym' | 'salon'
export type StaffSetup    = '1' | '2' | '3plus'
export type RiskLevel     = 'low' | 'medium' | 'high' | 'critical'
export type BufferLevel   = 'high' | 'medium' | 'low' | 'critical'

export interface BreakEvenInput {
  businessType : BusinessTypeBE
  monthlyRent  : number        // AUD
  staffSetup   : StaffSetup
  avgTicket    : number        // AUD per transaction
  cogsPercent  : number        // 0–100
}

export interface BreakEvenResult {
  dailyCustomersNeeded      : number
  weeklyRevenueRequired     : number
  monthlyRevenueRequired    : number
  contributionMarginPerCust : number  // AUD
  riskLevel                 : RiskLevel
  riskLabel                 : string
  riskExplanation           : string
  bufferLevel               : BufferLevel
  bufferNote                : string
  costs: {
    rent    : number
    staff   : number
    overhead: number
    total   : number
  }
  businessLabel          : string
  typicalDailyCustomers  : number
  insight                : string
  ctaNote                : string
}

// ── Option lists ─────────────────────────────────────────────────────────────

export const BUSINESS_OPTIONS_BE: { value: BusinessTypeBE; label: string }[] = [
  { value: 'cafe',       label: 'Café / Coffee Shop'      },
  { value: 'restaurant', label: 'Restaurant / Bistro'     },
  { value: 'retail',     label: 'Retail Shop'             },
  { value: 'gym',        label: 'Gym / Fitness Studio'    },
  { value: 'salon',      label: 'Salon / Beauty'          },
]

export const STAFF_OPTIONS: { value: StaffSetup; label: string }[] = [
  { value: '1',      label: '1 staff (solo or part-time help)' },
  { value: '2',      label: '2 staff'                         },
  { value: '3plus',  label: '3+ staff'                        },
]

export const COGS_OPTIONS: { value: string; label: string }[] = [
  { value: '10', label: '10% — gym, services'         },
  { value: '15', label: '15%'                         },
  { value: '20', label: '20% — salon, studio'         },
  { value: '25', label: '25%'                         },
  { value: '30', label: '30% — café (drinks only)'    },
  { value: '35', label: '35% — café (food + drinks)'  },
  { value: '40', label: '40%'                         },
  { value: '45', label: '45% — typical retail'        },
  { value: '50', label: '50%'                         },
  { value: '55', label: '55%'                         },
  { value: '60', label: '60%+ — high-cost retail'     },
]

// ── Business metadata ─────────────────────────────────────────────────────────

const BIZ: Record<BusinessTypeBE, {
  label                : string
  defaultTicket        : number
  defaultCogs          : number   // %
  overhead             : number   // monthly: utilities + insurance + misc
  staffCost            : Record<StaffSetup, number>
  typicalDailyCustomers: number   // used for buffer comparison
}> = {
  cafe: {
    label: 'Café',
    defaultTicket: 14,
    defaultCogs: 33,
    overhead: 1200,
    staffCost: { '1': 5000, '2': 9500, '3plus': 18000 },
    typicalDailyCustomers: 130,
  },
  restaurant: {
    label: 'Restaurant',
    defaultTicket: 42,
    defaultCogs: 35,
    overhead: 1800,
    staffCost: { '1': 6000, '2': 11000, '3plus': 22000 },
    typicalDailyCustomers: 80,
  },
  retail: {
    label: 'Retail',
    defaultTicket: 65,
    defaultCogs: 48,
    overhead: 900,
    staffCost: { '1': 4000, '2': 8000, '3plus': 14000 },
    typicalDailyCustomers: 55,
  },
  gym: {
    label: 'Gym / Fitness',
    defaultTicket: 15,
    defaultCogs: 12,
    overhead: 2000,
    staffCost: { '1': 4000, '2': 8000, '3plus': 14000 },
    typicalDailyCustomers: 50,
  },
  salon: {
    label: 'Salon',
    defaultTicket: 80,
    defaultCogs: 20,
    overhead: 800,
    staffCost: { '1': 4000, '2': 8000, '3plus': 14000 },
    typicalDailyCustomers: 22,
  },
}

// ── Risk thresholds (customers/day) ──────────────────────────────────────────

const RISK: { max: number; level: RiskLevel; label: string; explanation: string }[] = [
  {
    max: 30,
    level: 'low',
    label: 'Achievable',
    explanation:
      'Under 30 customers/day is realistic for most suburban locations. Even quieter streets can sustain this volume without high-footfall anchors.',
  },
  {
    max: 60,
    level: 'medium',
    label: 'Moderate risk',
    explanation:
      '30–60 customers/day requires decent foot traffic. A suburban strip with good anchors or a busy road can manage this — but verify before signing.',
  },
  {
    max: 100,
    level: 'high',
    label: 'High bar',
    explanation:
      'Over 60/day is above average for most suburban streets. You need a busy strip, a strong destination concept, or a near-CBD location.',
  },
  {
    max: Infinity,
    level: 'critical',
    label: 'Very high risk',
    explanation:
      'Over 100 customers/day is only achievable in high-traffic inner-city locations. Consider cutting rent, reducing staff, or increasing the average ticket.',
  },
]

// ── Core calculation ──────────────────────────────────────────────────────────

export function calculateBreakEven(input: BreakEvenInput): BreakEvenResult {
  const meta     = BIZ[input.businessType]
  const cogsRatio = Math.min(input.cogsPercent, 99) / 100
  const cm        = input.avgTicket * (1 - cogsRatio)   // contribution margin / customer

  const staffCost = meta.staffCost[input.staffSetup]
  const overhead  = meta.overhead
  const totalFixed = input.monthlyRent + staffCost + overhead

  // Break-even customers
  const customersPerMonth   = cm > 0 ? Math.ceil(totalFixed / cm) : 9999
  const dailyCustomersNeeded = Math.ceil(customersPerMonth / 26)  // 26 trading days/month
  const weeklyRevenueRequired = Math.round(dailyCustomersNeeded * input.avgTicket * 6)
  const monthlyRevenueRequired = Math.round(customersPerMonth * input.avgTicket)

  // Risk
  const riskEntry   = RISK.find(r => dailyCustomersNeeded <= r.max)!

  // Buffer — how close is break-even to typical volume for this format?
  const ratio       = dailyCustomersNeeded / meta.typicalDailyCustomers
  let bufferLevel: BufferLevel
  let bufferNote: string
  if (ratio <= 0.5) {
    bufferLevel = 'high'
    bufferNote  = `You break even at only ${Math.round(ratio * 100)}% of a typical ${meta.label}'s daily volume — solid cushion.`
  } else if (ratio <= 0.75) {
    bufferLevel = 'medium'
    bufferNote  = `You need ${Math.round(ratio * 100)}% of a typical ${meta.label}'s daily volume. Manageable if the location performs.`
  } else if (ratio <= 1.0) {
    bufferLevel = 'low'
    bufferNote  = `You need nearly full typical ${meta.label} volume just to break even. Almost no buffer for slow weeks.`
  } else {
    bufferLevel = 'critical'
    bufferNote  = `Requires ${Math.round(ratio * 100)}% of typical ${meta.label} volume — above average even for well-performing locations.`
  }

  const insight =
    `To cover all fixed costs you need ${dailyCustomersNeeded} customers per day ` +
    `each spending $${input.avgTicket}. ` +
    `That's $${weeklyRevenueRequired.toLocaleString()} per week before you make a single dollar of profit.`

  const ctaNote =
    riskLevel === 'low'
      ? 'The maths work — but does your suburb actually see this foot traffic?'
      : riskLevel === 'medium'
      ? 'This is achievable in the right street. Verify actual foot traffic before signing.'
      : `${dailyCustomersNeeded} customers/day is a high bar. Most locations won't hit this without strong anchors or a destination concept.`

  return {
    dailyCustomersNeeded,
    weeklyRevenueRequired,
    monthlyRevenueRequired,
    contributionMarginPerCust: Math.round(cm * 100) / 100,
    riskLevel      : riskEntry.level,
    riskLabel      : riskEntry.label,
    riskExplanation: riskEntry.explanation,
    bufferLevel,
    bufferNote,
    costs: { rent: input.monthlyRent, staff: staffCost, overhead, total: totalFixed },
    businessLabel          : meta.label,
    typicalDailyCustomers  : meta.typicalDailyCustomers,
    insight,
    ctaNote,
  }
}

export function getDefaultTicket(bt: BusinessTypeBE): number {
  return BIZ[bt].defaultTicket
}
export function getDefaultCogs(bt: BusinessTypeBE): number {
  return BIZ[bt].defaultCogs
}
