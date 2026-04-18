'use client'

import { Suspense, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'
import { FUNNEL_EVENTS, type OnboardingEnteredProps, type SuburbIntelViewProps, type ToolEngagementProps } from '@/lib/analytics/funnel'

function useCaptureOnce(event: string, props: Record<string, unknown>) {
  const sent = useRef(false)
  const payload = useRef(props)
  payload.current = props
  useEffect(() => {
    if (sent.current) return
    sent.current = true
    try {
      posthog.capture(event, payload.current)
    } catch {
      /* no-op if PostHog not ready */
    }
  }, [event])
}

/** Fire once per mount — suburb programmatic SEO pages */
export function SuburbIntelCapture(p: SuburbIntelViewProps) {
  useCaptureOnce(FUNNEL_EVENTS.suburbIntelView, {
    business_type: p.business_type,
    city_slug: p.city_slug,
    suburb_slug: p.suburb_slug,
    path: p.path,
    source: p.source,
  })
  return null
}

/** Tools hub + tool pages */
export function ToolEngagementCapture(p: ToolEngagementProps) {
  useCaptureOnce(FUNNEL_EVENTS.toolEngagement, {
    tool_id: p.tool_id,
    step: p.step,
    path: p.path ?? (typeof window !== 'undefined' ? window.location.pathname : ''),
    ref: p.ref ?? null,
  })
  return null
}

function OnboardingCaptureInner() {
  const searchParams = useSearchParams()
  const ref = searchParams.get('ref')
  const path = typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : '/onboarding'
  useCaptureOnce(FUNNEL_EVENTS.onboardingEntered, {
    ref,
    path,
  } satisfies OnboardingEnteredProps)
  return null
}

/** /onboarding — full report funnel entry (reads ?ref= for attribution) */
export function OnboardingCapture() {
  return (
    <Suspense fallback={null}>
      <OnboardingCaptureInner />
    </Suspense>
  )
}

function ToolsHubCaptureInner() {
  const searchParams = useSearchParams()
  const ref = searchParams.get('ref')
  const path = typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : '/tools'
  useCaptureOnce(FUNNEL_EVENTS.toolEngagement, {
    tool_id: 'tools_hub',
    step: 'view',
    path,
    ref,
  } satisfies ToolEngagementProps)
  return null
}

export function ToolsHubCapture() {
  return (
    <Suspense fallback={null}>
      <ToolsHubCaptureInner />
    </Suspense>
  )
}

function ToolPageCaptureInner({ toolId }: { toolId: string }) {
  const searchParams = useSearchParams()
  const ref = searchParams.get('ref')
  const path = typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : ''
  useCaptureOnce(FUNNEL_EVENTS.toolEngagement, {
    tool_id: toolId,
    step: 'view',
    path,
    ref,
  } satisfies ToolEngagementProps)
  return null
}

/** Individual tool marketing pages (viability, break-even, rent, …) */
export function ToolPageCapture({ toolId }: { toolId: string }) {
  return (
    <Suspense fallback={null}>
      <ToolPageCaptureInner toolId={toolId} />
    </Suspense>
  )
}
