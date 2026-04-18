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
    id: 'gym-demand',
    title: 'Gym demand analysis',
    problem: 'Fitness concepts often overestimate local member depth and underestimate saturation from nearby chain operators.',
    solution: 'Locatalyze maps suburb demand, local supply mix, and affordability pressure to identify whether your format has space to win.',
    benefits: [
      'Estimate membership depth before fit-out spend',
      'Surface saturation risk across competing formats',
      'Validate fixed rent against conservative member assumptions',
    ],
    metrics: [
      { label: 'Catchment lens', value: 'Suburb profile' },
      { label: 'Supply scan', value: 'Nearby formats' },
      { label: 'Risk mode', value: 'Demand vs rent' },
    ],
    primaryHref: onboardingRef('usecase_gyms_run_1'),
    toolHref: '/tools/business-viability-checker?ref=usecase_gyms_tool_1',
    reportHref: '/gym/sydney/bondi',
    reportLabel: 'View suburb report',
    visualImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80',
    visualAlt: 'Gym training floor and equipment',
  },
  {
    id: 'gym-site-fit',
    title: 'Fitness site fit by catchment quality',
    problem: 'Sites with strong visibility can still fail if nearby households do not match the target member profile.',
    solution: 'Evaluate catchment composition and local behavior patterns so site choice is based on member potential, not storefront optics.',
    benefits: [
      'Align concept pricing with local affordability',
      'Prioritize suburbs with stronger repeat-member potential',
      'Reduce launch risk through data-backed shortlisting',
    ],
    metrics: [
      { label: 'Fit score', value: 'Member potential' },
      { label: 'Lens', value: 'Catchment-first' },
      { label: 'Outcome', value: 'Shortlist ready' },
    ],
    primaryHref: onboardingRef('usecase_gyms_run_2'),
    toolHref: '/tools/business-viability-checker?ref=usecase_gyms_tool_2',
    reportHref: '/gym/melbourne/richmond',
    reportLabel: 'View suburb report',
    visualImage: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&q=80',
    visualAlt: 'Boutique fitness studio workout',
  },
  {
    id: 'gym-rent',
    title: 'Rent affordability for fitness operators',
    problem: 'Large floorplate rent can become unsustainable when member growth lags during early months.',
    solution: 'Convert lease and operating assumptions into clear member targets to expose downside before committing to tenancy.',
    benefits: [
      'See required active members for break-even',
      'Detect fragile economics under slower ramp-up',
      'Use quantified downside in lease discussions',
    ],
    metrics: [
      { label: 'Primary output', value: 'Members needed' },
      { label: 'Downside test', value: 'Ramp-up scenarios' },
      { label: 'Best stage', value: 'Pre-lease' },
    ],
    primaryHref: onboardingRef('usecase_gyms_run_3'),
    toolHref: '/tools/break-even-foot-traffic?ref=usecase_gyms_tool_3',
    reportHref: '/gym/perth/subiaco',
    reportLabel: 'View suburb report',
    visualImage: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=80',
    visualAlt: 'Gym user with weights',
  },
]

export default function Page() {
  return (
    <UseCaseShowcase
      eyebrow="Gyms & Fitness"
      title="Real-world location intelligence use cases"
      subtitle="See how fitness operators validate demand depth, saturation, and lease pressure before committing to floorplate-heavy sites."
      sections={SECTIONS}
      topLinks={TOP_LINKS}
    />
  )
}
