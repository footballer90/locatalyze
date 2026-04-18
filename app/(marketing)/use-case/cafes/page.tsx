import { onboardingRef } from '@/lib/funnel-links'
import UseCaseShowcase, { type UseCaseSection } from '../_components/UseCaseShowcase'

const TOP_LINKS = [
  { label: 'Cafes & Coffee', href: '/use-case/cafes' },
  { label: 'Restaurants', href: '/use-case/restaurants' },
  { label: 'Retail Stores', href: '/use-case/retail' },
  { label: 'Gyms & Fitness', href: '/use-case/gyms' },
  { label: 'Takeaway', href: '/use-case/takeaway' },
  { label: 'All business types', href: '/use-case/all' },
]

const SECTIONS: UseCaseSection[] = [
  {
    id: 'cafe-location',
    title: 'Cafe location analysis',
    problem: 'Many cafe leases are signed before validating morning trade potential, leading to thin margins and slow cash cycles.',
    solution: 'Locatalyze combines commuter patterns, nearby saturation, and affordability signals so you can validate whether breakfast trade can support the site.',
    benefits: [
      'Model morning demand before committing to long leases',
      'Check competitor density and positioning gaps within 500m',
      'Validate whether rent aligns with realistic daily cover targets',
    ],
    metrics: [
      { label: 'Peak trading', value: '7:00-10:00 AM' },
      { label: 'Risk threshold', value: 'Rent > 12%' },
      { label: 'Competitor lens', value: '500m radius' },
    ],
    primaryHref: onboardingRef('usecase_cafes_run_1'),
    toolHref: '/tools/business-viability-checker?ref=usecase_cafes_tool_1',
    reportHref: '/cafe/perth/subiaco',
    reportLabel: 'View suburb report',
    visualImage: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=1200&q=80',
    visualAlt: 'Cafe morning trade scene',
  },
  {
    id: 'cafe-rent',
    title: 'Rent affordability analysis for cafes',
    problem: 'Operators often evaluate rent in isolation, without translating it into required customer volume and downside risk.',
    solution: 'Use break-even modelling to convert rent into a clear survival number and detect fragile lease structures before signing.',
    benefits: [
      'Translate monthly rent into daily customer requirements',
      'Stress-test conservative downside scenarios',
      'Negotiate from data instead of optimism',
    ],
    metrics: [
      { label: 'Output', value: 'Daily covers needed' },
      { label: 'Risk label', value: 'Healthy/Caution' },
      { label: 'Use case', value: 'Lease negotiation' },
    ],
    primaryHref: onboardingRef('usecase_cafes_run_2'),
    toolHref: '/tools/break-even-foot-traffic?ref=usecase_cafes_tool_2',
    reportHref: '/cafe/sydney/newtown',
    reportLabel: 'View suburb report',
    visualImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80',
    visualAlt: 'Coffee shop counter and service area',
  },
  {
    id: 'cafe-viability',
    title: 'Suburb viability check before fit-out',
    problem: 'Fit-out spend is committed too early when suburb-level demand and competition dynamics are still uncertain.',
    solution: 'Run a fast GO/CAUTION/NO read before capex so you shortlist only locations with stronger demand-to-cost balance.',
    benefits: [
      'Prioritize suburbs with better downside protection',
      'Avoid generic high-competition strips',
      'Shortlist sites before spending on design and permits',
    ],
    metrics: [
      { label: 'Decision', value: 'GO/CAUTION/NO' },
      { label: 'Speed', value: 'Minutes' },
      { label: 'Coverage', value: 'AU suburbs' },
    ],
    primaryHref: onboardingRef('usecase_cafes_run_3'),
    toolHref: '/tools/business-viability-checker?ref=usecase_cafes_tool_3',
    reportHref: '/cafe/sydney/surry-hills',
    reportLabel: 'View suburb report',
    visualImage: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&q=80',
    visualAlt: 'Busy cafe interior with customers',
  },
]

export default function Page() {
  return (
    <UseCaseShowcase
      eyebrow="Cafes & Coffee"
      title="Real-world location intelligence use cases"
      subtitle="See how cafe operators validate morning demand, lease pressure, and suburb fit before committing to fit-out spend."
      sections={SECTIONS}
      topLinks={TOP_LINKS}
    />
  )
}
