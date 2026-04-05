export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    reportLimit: 1,
    features: ['1 free report', 'Verdict + score', 'Competitor map'],
  },
  single: {
    name: 'Single Report',
    price: 29,
    credits: 1,
    features: [
      'Full financial model',
      'Break-even analysis',
      'SWOT insights',
      'PDF export',
    ],
  },
  pack3: {
    name: '3-Pack',
    price: 69,
    credits: 3,
    features: [
      'Everything in Single Report',
      'Compare locations side-by-side',
      'No expiry',
    ],
  },
  pack10: {
    name: '10-Pack',
    price: 199,
    credits: 10,
    features: [
      'Everything in Single Report',
      'Bulk location research',
      'Priority support',
    ],
  },
  pro: {
    name: 'Pro',
    price: 149,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!,
    reportLimit: Infinity,
    features: [
      'Unlimited reports',
      'PDF export',
      'Location comparison',
      'Priority support',
    ],
  },
  business: {
    name: 'Business',
    price: 199,
    priceId: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID!,
    reportLimit: Infinity,
    features: [
      'Everything in Pro',
      'Team access',
      'Advanced analytics',
    ],
  },
} as const

export type PlanKey = keyof typeof PLANS

export function canAccessPro(plan: string): boolean {
  return plan === 'pro' || plan === 'business' || plan === 'team'
}
