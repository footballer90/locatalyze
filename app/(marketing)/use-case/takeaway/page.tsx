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
    id: 'takeaway-hybrid',
    title: 'Takeaway location analysis (walk-in + delivery)',
    problem: 'Takeaway operators frequently optimize for one channel and overlook the trade-off between lunchtime walk-in and delivery zone depth.',
    solution: 'Locatalyze evaluates both street demand and household delivery potential so your site works across channels, not just one.',
    benefits: [
      'Balance lunch traffic with delivery catchment viability',
      'Map saturation by cuisine and service radius',
      'Prioritize sites with stronger all-day order potential',
    ],
    metrics: [
      { label: 'Operating model', value: 'Hybrid channel' },
      { label: 'Delivery lens', value: '3-5km radius' },
      { label: 'Risk check', value: 'Demand overlap' },
    ],
    primaryHref: onboardingRef('usecase_takeaway_run_1'),
    toolHref: '/tools/business-viability-checker?ref=usecase_takeaway_tool_1',
    reportHref: '/restaurant/melbourne/richmond',
    reportLabel: 'View suburb report',
    visualImage: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=1200&q=80',
    visualAlt: 'Takeaway food and service counter',
  },
  {
    id: 'takeaway-gap',
    title: 'Cuisine gap and competitor pressure',
    problem: 'Entering an already saturated cuisine cluster raises acquisition costs and compresses margin from day one.',
    solution: 'Use local supply mapping and demand context to identify genuine cuisine gaps rather than guessing from anecdotal observations.',
    benefits: [
      'Spot underserved cuisine opportunities by suburb',
      'Avoid direct overlap with dense incumbents',
      'Improve launch positioning and channel efficiency',
    ],
    metrics: [
      { label: 'Market scan', value: 'Cuisine density' },
      { label: 'Opportunity', value: 'Gap quality' },
      { label: 'Decision', value: 'Go / avoid' },
    ],
    primaryHref: onboardingRef('usecase_takeaway_run_2'),
    toolHref: '/tools/business-viability-checker?ref=usecase_takeaway_tool_2',
    reportHref: '/restaurant/sydney/newtown',
    reportLabel: 'View suburb report',
    visualImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&q=80',
    visualAlt: 'Takeaway pizza and delivery prep',
  },
  {
    id: 'takeaway-rent',
    title: 'Rent affordability for takeaway operators',
    problem: 'Operators take on premium frontage rents that require unrealistic order throughput to sustain.',
    solution: 'Convert lease assumptions into daily order and margin targets to choose sites with stronger downside resilience.',
    benefits: [
      'Quantify minimum orders needed to stay healthy',
      'Test downside with realistic basket assumptions',
      'Negotiate rent with clearer revenue constraints',
    ],
    metrics: [
      { label: 'Output', value: 'Daily orders' },
      { label: 'Risk label', value: 'Healthy/Caution' },
      { label: 'Best use', value: 'Lease decision' },
    ],
    primaryHref: onboardingRef('usecase_takeaway_run_3'),
    toolHref: '/tools/break-even-foot-traffic?ref=usecase_takeaway_tool_3',
    reportHref: '/restaurant/perth/fremantle',
    reportLabel: 'View suburb report',
    visualImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80',
    visualAlt: 'Takeaway meal prep in restaurant kitchen',
  },
]

export default function Page() {
  return (
    <UseCaseShowcase
      eyebrow="Takeaway"
      title="Real-world location intelligence use cases"
      subtitle="See how takeaway operators evaluate hybrid demand, cuisine saturation, and lease pressure before committing to a site."
      sections={SECTIONS}
      topLinks={TOP_LINKS}
    />
  )
}
