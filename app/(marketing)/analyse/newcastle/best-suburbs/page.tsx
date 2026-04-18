// app/(marketing)/analyse/newcastle/best-suburbs/page.tsx
// This route has been consolidated into /analyse/newcastle/
// The redirect in next.config.ts handles the 301 before this component renders.
// This component is a safety fallback only.

import { redirect } from 'next/navigation'

export default function BestSuburbsRedirect() {
  redirect('/analyse/newcastle')
}
