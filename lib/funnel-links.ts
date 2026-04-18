/**
 * Attribution for the core funnel: traffic to /tools → clicks to /onboarding (full / paid report).
 * Filter by `ref` in analytics (PostHog, Plausible, GA) to measure tool → paid conversion.
 */
export function toolsHubRef(source: string): string {
  return `/tools?ref=${encodeURIComponent(source)}`
}

export function onboardingRef(source: string, extra?: Record<string, string | undefined>): string {
  const p = new URLSearchParams()
  p.set('ref', source)
  if (extra) {
    for (const [k, v] of Object.entries(extra)) {
      if (v != null && v !== '') p.set(k, v)
    }
  }
  const q = p.toString()
  return `/onboarding?${q}`
}
