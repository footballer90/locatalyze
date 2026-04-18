/**
 * PostHog funnel events — use these names in dashboards:
 * - suburb_intel_view      → which suburb × type pages get traffic
 * - tool_engagement        → hub + individual tools (step: view | primary_cta_click)
 * - onboarding_entered     → users who reach /onboarding (refs preserved)
 */

export const FUNNEL_EVENTS = {
  suburbIntelView: 'suburb_intel_view',
  toolEngagement: 'tool_engagement',
  onboardingEntered: 'onboarding_entered',
} as const

export type ToolEngagementProps = {
  tool_id: string
  step: 'view' | 'primary_cta_click' | 'secondary_link'
  path?: string
  ref?: string | null
}

export type SuburbIntelViewProps = {
  business_type: string
  city_slug: string
  suburb_slug: string
  path: string
  source: 'hand_crafted' | 'generated'
}

export type OnboardingEnteredProps = {
  ref: string | null
  path: string
}
