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
    id: 'restaurant-viability',
    title: 'Restaurant viability check',
    problem: 'Dinner-focused concepts fail when spend assumptions and evening demand are overestimated for the local catchment.',
    solution: 'Locatalyze combines demand strength, competition intensity, and rent pressure to show whether the location supports your service model.',
    benefits: [
      'Validate realistic evening demand before lease commitment',
      'Benchmark local competition and dining saturation',
      'Frame downside scenarios before staffing and fit-out spend',
    ],
    metrics: [
      { label: 'Decision output', value: 'GO / CAUTION / NO' },
      { label: 'Dinner lens', value: 'Evening viability' },
      { label: 'Risk focus', value: 'Demand vs rent' },
    ],
    primaryHref: onboardingRef('usecase_restaurants_run_1'),
    toolHref: '/tools/business-viability-checker?ref=usecase_restaurants_tool_1',
    reportHref: '/restaurant/perth/fremantle',
    reportLabel: 'View suburb report',
    visualImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80',
    visualAlt: 'Restaurant dining room at service',
  },
  {
    id: 'restaurant-site-selection',
    title: 'Restaurant site selection by trade profile',
    problem: 'Operators choose attractive venues that do not match their intended service profile (lunch-led vs dinner-led).',
    solution: 'Compare trade-area behavior and local customer mix to match concept style with the right suburb and corridor.',
    benefits: [
      'Match concept format to local demand profile',
      'Avoid overpaying for misaligned premium strips',
      'Shortlist sites with stronger long-term repeat trade',
    ],
    metrics: [
      { label: 'Selection lens', value: 'Trade profile fit' },
      { label: 'Segment signal', value: 'Catchment quality' },
      { label: 'Decision speed', value: 'Rapid shortlist' },
    ],
    primaryHref: onboardingRef('usecase_restaurants_run_2'),
    toolHref: '/tools/business-viability-checker?ref=usecase_restaurants_tool_2',
    reportHref: '/restaurant/perth/subiaco',
    reportLabel: 'View suburb report',
    visualImage: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80',
    visualAlt: 'Restaurant guests and plated meals',
  },
  {
    id: 'restaurant-rent',
    title: 'Rent affordability analysis for full-service venues',
    problem: 'High fixed rent with variable dinner volume creates hidden downside risk even when opening months look strong.',
    solution: 'Translate rent into required weekly covers and identify where economics become fragile under realistic demand swings.',
    benefits: [
      'Model required covers at conservative spend levels',
      'Flag lease structures that erase margin headroom',
      'Use quantified downside for negotiation leverage',
    ],
    metrics: [
      { label: 'Primary output', value: 'Covers needed' },
      { label: 'Risk flag', value: 'Lease fragility' },
      { label: 'Best use', value: 'Pre-lease review' },
    ],
    primaryHref: onboardingRef('usecase_restaurants_run_3'),
    toolHref: '/tools/break-even-foot-traffic?ref=usecase_restaurants_tool_3',
    reportHref: '/restaurant/sydney/newtown',
    reportLabel: 'View suburb report',
    visualImage: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=80',
    visualAlt: 'Restaurant bar and seating area',
  },
]

export default function Page() {
  return (
    <UseCaseShowcase
      eyebrow="Restaurants"
      title="Real-world location intelligence use cases"
      subtitle="See how restaurant operators evaluate demand, saturation, and lease risk before committing to high fixed-cost venues."
      sections={SECTIONS}
      topLinks={TOP_LINKS}
    />
  )
}
