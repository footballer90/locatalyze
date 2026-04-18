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
    id: 'retail-site',
    title: 'Retail site selection',
    problem: 'Retail leases are often chosen for aesthetics rather than footfall quality, leading to low conversion volume and margin pressure.',
    solution: 'Locatalyze evaluates corridor demand, intent signals, and demographic fit so you choose sites where traffic can convert to revenue.',
    benefits: [
      'Match product category to local spend profile',
      'Filter low-intent traffic corridors before lease commitment',
      'Validate whether rent aligns with realistic conversion volume',
    ],
    metrics: [
      { label: 'Traffic lens', value: 'Intent + volume' },
      { label: 'Fit signal', value: 'Category match' },
      { label: 'Risk check', value: 'Lease pressure' },
    ],
    primaryHref: onboardingRef('usecase_retail_run_1'),
    toolHref: '/tools/business-viability-checker?ref=usecase_retail_tool_1',
    reportHref: '/retail/melbourne/richmond',
    reportLabel: 'View suburb report',
    visualImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80',
    visualAlt: 'Retail shopping street',
  },
  {
    id: 'retail-anchor',
    title: 'Anchor-driven location scoring',
    problem: 'Independent stores underperform when anchor draw and nearby flow do not align with their target buyer behavior.',
    solution: 'Use anchor proximity and local movement patterns to prioritize sites with stronger habitual visit potential.',
    benefits: [
      'Score sites by anchor and corridor strength',
      'Compare adjacent strips with consistent methodology',
      'Reduce guesswork in shortlist decisions',
    ],
    metrics: [
      { label: 'Anchor lens', value: 'High / Medium / Low' },
      { label: 'Corridor fit', value: 'Ranked shortlist' },
      { label: 'Decision mode', value: 'Comparable sites' },
    ],
    primaryHref: onboardingRef('usecase_retail_run_2'),
    toolHref: '/tools/business-viability-checker?ref=usecase_retail_tool_2',
    reportHref: '/retail/perth/subiaco',
    reportLabel: 'View suburb report',
    visualImage: 'https://images.unsplash.com/photo-1481437156560-3205f6a55735?w=1200&q=80',
    visualAlt: 'Retail storefront and pedestrians',
  },
  {
    id: 'retail-rent',
    title: 'Rent affordability and break-even pressure',
    problem: 'Retail operators often underestimate how quickly fixed lease cost can erase margin in slower periods.',
    solution: 'Convert rent and operating assumptions into required transaction volume and identify fragile lease structures early.',
    benefits: [
      'Quantify minimum daily sales needed to survive',
      'See downside sensitivity before signing',
      'Strengthen rent negotiation with hard numbers',
    ],
    metrics: [
      { label: 'Primary output', value: 'Daily sales target' },
      { label: 'Risk level', value: 'Healthy/Caution' },
      { label: 'Negotiation aid', value: 'Data-backed' },
    ],
    primaryHref: onboardingRef('usecase_retail_run_3'),
    toolHref: '/tools/break-even-foot-traffic?ref=usecase_retail_tool_3',
    reportHref: '/retail/sydney/newtown',
    reportLabel: 'View suburb report',
    visualImage: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&q=80',
    visualAlt: 'Retail shelves and customer browsing',
  },
]

export default function Page() {
  return (
    <UseCaseShowcase
      eyebrow="Retail Stores"
      title="Real-world location intelligence use cases"
      subtitle="See how retail operators evaluate corridor demand, anchor impact, and lease pressure before committing to a site."
      sections={SECTIONS}
      topLinks={TOP_LINKS}
    />
  )
}
