/**
 * lib/marketing/testimonials.ts
 *
 * Single source of truth for social-proof quotes shown on marketing
 * surfaces.
 *
 * ─── Why this file starts empty ────────────────────────────────────────
 *
 * The audit repeatedly flagged "zero named users on a site with 2,000+
 * analyses run" as the single highest-converting trust gap remaining.
 * The fix is not to invent a quote — fabricated testimonials are a
 * worse failure mode than none (reputational + ACL Section 18 exposure).
 *
 * The infrastructure ships now so the moment you have a real sentence
 * from a real buyer, the UI is already wired and the drop-in is a
 * one-line append.
 *
 * ─── How to add a real testimonial ────────────────────────────────────
 *
 * 1. Get written consent from the person (even a short email is fine —
 *    "I'm happy for Locatalyze to quote this on your homepage, attributed
 *    to [my name / role]"). Keep the email; ACL + defamation risk is
 *    non-zero without it.
 *
 * 2. Append a new entry to `TESTIMONIALS` below. A good testimonial:
 *      - is specific (names a suburb, a number, or a lease outcome)
 *      - is short (<220 characters)
 *      - is recent (<12 months)
 *      - has attribution at minimum to role + city
 *        ("Café operator, inner-west Sydney" is acceptable;
 *         full name is stronger)
 *
 *    Attribution options, strongest → weakest:
 *      (a) Full name + role + business name (+ optional link)
 *      (b) First name + role + suburb ("Dan, café operator, Leederville")
 *      (c) Role + city ("Café operator, inner-west Sydney")
 *      NEVER ship an entry with no attribution at all — anonymous
 *      testimonials trigger trust discount, not trust boost.
 *
 * 3. The `<Testimonials />` component returns `null` while this array is
 *    empty, so nothing renders on the homepage until a real entry lands.
 *
 * ─── Not acceptable ────────────────────────────────────────────────────
 *
 *   - Paraphrasing a real conversation without written consent.
 *   - "Composite" testimonials assembled from common feedback themes.
 *   - Quotes with no attribution beyond "Business owner".
 *   - Quotes that reference specific numbers the person did not say.
 *
 *   All four violate ACL Section 18 (misleading or deceptive conduct).
 */

export interface Testimonial {
  /** The quote itself. Keep under ~220 chars so it reads fast. */
  quote: string
  /**
   * Who said it. Minimum: role + city. Better: first name + role +
   * suburb. Best: full name + role + business name.
   */
  attribution: string
  /**
   * Optional — the specific outcome the quote describes, shown as a
   * secondary tag under the attribution. Useful for framing ("$600/mo
   * off rent", "walked away from CAUTION site", "signed with CPI cap").
   */
  outcome?: string
  /**
   * Optional — ISO date the quote was captured. Shown as "Feb 2026"
   * so the testimonial doesn't age silently. Omit if unsure.
   */
  capturedAt?: string
  /**
   * Optional — link to a public reference (Trustpilot, LinkedIn post,
   * business website). Adds verifiability. Leave undefined if you
   * don't have one.
   */
  sourceUrl?: string
}

/**
 * Intentionally empty. Do not seed with fake entries. See the JSDoc
 * at the top of this file for how to add a real one.
 */
export const TESTIMONIALS: Testimonial[] = []
