export type DemoScenarioKey = 'go' | 'caution' | 'no'

export interface DemoScenario {
  biz: string
  location: string
  score: number
  monthlyRevenue: string
  monthlyProfit: string
  breakEven: string
  annualRevenue: string
  competitors800m: string
}

export const DEMO_SCENARIOS: Record<DemoScenarioKey, DemoScenario> = {
  go: {
    biz: 'Specialty Coffee Shop',
    location: 'Subiaco, WA',
    score: 82,
    monthlyRevenue: '$78k–$88k',
    monthlyProfit: '$27,200',
    breakEven: '35–50/day',
    annualRevenue: '$936k–$1.06m',
    competitors800m: '4',
  },
  caution: {
    biz: 'Casual Dining Restaurant',
    location: 'Fremantle, WA',
    score: 61,
    monthlyRevenue: '$54k–$74k',
    monthlyProfit: '$9,200',
    breakEven: '50–70/day',
    annualRevenue: '$480k–$720k',
    competitors800m: '11',
  },
  no: {
    biz: 'Boutique Gym',
    location: 'Joondalup, WA',
    score: 44,
    monthlyRevenue: '$14k–$20k',
    monthlyProfit: '-$3,400',
    breakEven: '70–90/day',
    annualRevenue: '$300k–$480k',
    competitors800m: '22',
  },
}
