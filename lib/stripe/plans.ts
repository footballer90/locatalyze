export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    reportLimit: 1,
    features: ['1 location report', 'Core scoring', 'Break-even analysis'],
  },
  pro: {
    name: 'Pro',
    price: 79,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!,
    reportLimit: Infinity,
    features: [
      'Unlimited reports',
      'Risk simulation',
      'PDF export',
      'Location comparison',
    ],
  },
} as const

export type PlanKey = keyof typeof PLANS

export function canAccessPro(plan: string): boolean {
  return plan === 'pro' || plan === 'team'
}
