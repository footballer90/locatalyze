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
    id: 'all-cafe',
    title: 'Cafe location analysis',
    problem: 'Cafe operators often sign leases before validating commuter flow and realistic rent-to-revenue fit.',
    solution: 'Locatalyze models foot traffic, suburb demand, and local saturation to show whether your daily transaction target is viable.',
    benefits: [
      'Estimate viable morning demand before lease commitment',
      'Benchmark nearby competitor intensity within 500m',
      'Pressure-test rent against conservative revenue assumptions',
    ],
    metrics: [
      { label: 'Peak window', value: '7:00-10:00 AM' },
      { label: 'Risk flag', value: 'Rent > 12%' },
      { label: 'Coverage', value: '500m competitor map' },
    ],
    primaryHref: onboardingRef('usecase_all_cafe_run'),
    toolHref: '/tools/business-viability-checker?ref=usecase_all_cafe_tool',
    reportHref: '/cafe/perth/subiaco',
    reportLabel: 'View suburb report',
    visualImage: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=1200&q=80',
    visualAlt: 'Cafe customers and coffee service',
  },
  {
    id: 'all-restaurant',
    title: 'Restaurant viability check',
    problem: 'Restaurants fail when evening demand and spend-per-visit assumptions are too optimistic for the local catchment.',
    solution: 'Use suburb-level demand and affordability signals to validate whether dinner trade supports staffing and occupancy targets.',
    benefits: [
      'Validate realistic evening demand and spend profile',
      'Identify market overcrowding versus concept gaps',
      'Pressure-test setup risk before capex decisions',
    ],
    metrics: [
      { label: 'Decision output', value: 'GO / CAUTION / NO' },
      { label: 'Demand confidence', value: 'Data-backed' },
      { label: 'Scenario view', value: 'Base/downside' },
    ],
    primaryHref: onboardingRef('usecase_all_restaurant_run'),
    toolHref: '/tools/business-viability-checker?ref=usecase_all_restaurant_tool',
    reportHref: '/restaurant/perth/fremantle',
    reportLabel: 'View suburb report',
    visualImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80',
    visualAlt: 'Restaurant evening dining',
  },
  {
    id: 'all-retail',
    title: 'Retail site selection',
    problem: 'Retail launches struggle when pedestrian intent and anchor draw do not match product category and ticket size.',
    solution: 'Evaluate corridor strength, demand fit, and competitive pressure before committing to a high fixed-cost tenancy.',
    benefits: [
      'Match suburb demographics to your retail category',
      'Avoid low-intent footfall corridors',
      'Benchmark lease risk against expected conversion volume',
    ],
    metrics: [
      { label: 'Site fit', value: 'Category-aligned demand' },
      { label: 'Competitor view', value: 'Nearby overlap' },
      { label: 'Lease risk', value: 'Affordability signal' },
    ],
    primaryHref: onboardingRef('usecase_all_retail_run'),
    toolHref: '/tools/break-even-foot-traffic?ref=usecase_all_retail_tool',
    reportHref: '/retail/melbourne/richmond',
    reportLabel: 'View suburb report',
    visualImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80',
    visualAlt: 'Retail street storefronts',
  },
  {
    id: 'all-gym',
    title: 'Gym demand analysis',
    problem: 'Fitness operators overestimate local membership depth and underestimate the impact of nearby premium chains.',
    solution: 'Map catchment demand against existing fitness supply to test whether your membership model has room to grow.',
    benefits: [
      'Estimate local demand depth by suburb profile',
      'Surface saturation risk before fit-out spend',
      'Validate membership economics against fixed rent',
    ],
    metrics: [
      { label: 'Catchment lens', value: 'Suburb profile' },
      { label: 'Risk scan', value: 'Saturation + affordability' },
      { label: 'Decision speed', value: 'Minutes' },
    ],
    primaryHref: onboardingRef('usecase_all_gym_run'),
    toolHref: '/tools/business-viability-checker?ref=usecase_all_gym_tool',
    reportHref: '/gym/sydney/bondi',
    reportLabel: 'View suburb report',
    visualImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80',
    visualAlt: 'Gym free weights and training area',
  },
  {
    id: 'all-rent',
    title: 'Rent affordability analysis',
    problem: 'Operators accept quoted rent without validating required customer volume and break-even pressure under conservative scenarios.',
    solution: 'Use break-even modelling to convert rent into a clear daily demand requirement and risk band before signing.',
    benefits: [
      'Translate rent into required daily customer volume',
      'Spot fragile economics before negotiation',
      'Use downside scenarios for better lease terms',
    ],
    metrics: [
      { label: 'Primary output', value: 'Daily customers needed' },
      { label: 'Risk label', value: 'Healthy / Caution' },
      { label: 'Use case fit', value: 'Lease negotiation' },
    ],
    primaryHref: onboardingRef('usecase_all_rent_run'),
    toolHref: '/tools/break-even-foot-traffic?ref=usecase_all_rent_tool',
    reportHref: '/cafe/sydney/newtown',
    reportLabel: 'View suburb report',
    visualImage: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1200&q=80',
    visualAlt: 'Financial planning and rent analysis workspace',
  },
]

export default function Page() {
  return (
    <UseCaseShowcase
      eyebrow="All business types"
      title="Real-world location intelligence use cases"
      subtitle="Explore how different operators use Locatalyze to validate location, rent, and demand before committing to a lease."
      sections={SECTIONS}
      topLinks={TOP_LINKS}
    />
  )
}
