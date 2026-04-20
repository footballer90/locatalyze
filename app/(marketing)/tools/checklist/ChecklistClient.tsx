'use client'

/**
 * Before-you-sign location checklist
 *
 * A printable / save-as-PDF guide distilled from the Café Location
 * Checklist blog post. Three timing sections (before you visit / at the
 * site / before you sign) map directly to the three moments in a lease
 * decision where the checklist actually gets used.
 *
 * Design decisions:
 *   - Checkboxes are interactive on-screen so the user can tick items
 *     off as they complete them — there is no save state; this is a
 *     one-session tool, not a dashboard.
 *   - Print CSS hides all chrome (navbar, footer, CTAs, print button)
 *     and formats the page as a clean A4 document. window.print() →
 *     "Save as PDF" is the download mechanism; no library required.
 *   - Three items are marked CRITICAL — these are the ones that, if
 *     skipped, most reliably produce failed businesses. They get a
 *     distinct visual treatment.
 *   - The "lease table numbers" block at the bottom is the one thing
 *     the user fills in for their specific location. It frames the
 *     entire checklist around their actual numbers, not generic rules.
 */

import { useState, useRef } from 'react'
import Link from 'next/link'
import { onboardingRef } from '@/lib/funnel-links'

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  emerald:    '#059669',
  emeraldBg:  '#ECFDF5',
  emeraldBdr: '#A7F3D0',
  emeraldDk:  '#065F46',
  amber:      '#D97706',
  amberBg:    '#FFFBEB',
  amberBdr:   '#FDE68A',
  amberDk:    '#92400E',
  red:        '#DC2626',
  redBg:      '#FEF2F2',
  redBdr:     '#FECACA',
  redDk:      '#991B1B',
  blue:       '#2563EB',
  blueBg:     '#EFF6FF',
  blueBdr:    '#BFDBFE',
  blueDk:     '#1E3A8A',
  brand:      '#0F766E',
  brandFaded: '#F0FDFA',
  brandBdr:   '#99F6E4',
  slate:      '#0F172A',
  n50:        '#FAFAF9',
  n100:       '#F5F5F4',
  n200:       '#E7E5E4',
  n400:       '#A8A29E',
  n500:       '#78716C',
  n700:       '#44403C',
  n800:       '#292524',
  n900:       '#1C1917',
  white:      '#FFFFFF',
  font:       "'DM Sans','Helvetica Neue',Arial,sans-serif",
  mono:       "'JetBrains Mono','Fira Mono',monospace",
}

// ─── Checklist data ───────────────────────────────────────────────────────────

type CheckItem = {
  id:       string
  text:     string
  detail:   string
  critical?: boolean   // these are the three things that kill businesses
}

type Section = {
  id:     string
  timing: string
  title:  string
  color:  string
  bg:     string
  bdr:    string
  dk:     string
  items:  CheckItem[]
}

const SECTIONS: Section[] = [
  {
    id:     'before-visit',
    timing: 'Before you visit',
    title:  'At your desk — before the site trip',
    color:  T.blue,
    bg:     T.blueBg,
    bdr:    T.blueBdr,
    dk:     T.blueDk,
    items: [
      {
        id:       'rent-test',
        text:     'Run the rent-to-revenue test',
        detail:   'Monthly rent ÷ 0.10 = required monthly revenue. Divide by avg ticket ÷ 26 trading days = required daily transactions. Know this number before you visit.',
        critical: true,
      },
      {
        id:       'break-even',
        text:     'Calculate your survival floor',
        detail:   'Monthly rent ÷ gross margin per customer = daily transactions needed to cover rent alone. This is your downside — not your target.',
      },
      {
        id:       'demographics',
        text:     'Check suburb demographics',
        detail:   'Median household income above $90k, age skew 25–45, high full-time employment. ABS 2021 Census (SA2 level) via abs.gov.au — or run a Locatalyze report.',
      },
      {
        id:       'comp-map',
        text:     'Map competitors within 200m',
        detail:   '0–1: verify demand exists first. 2–3: healthy market. 4–5: requires clear positioning. 6+: avoid unless foot traffic is exceptional (150+/hr).',
      },
    ],
  },
  {
    id:     'at-site',
    timing: 'At the site',
    title:  'Physical inspection — bring this with you',
    color:  T.emerald,
    bg:     T.emeraldBg,
    bdr:    T.emeraldBdr,
    dk:     T.emeraldDk,
    items: [
      {
        id:       'foot-traffic',
        text:     '7am foot-traffic test',
        detail:   'Arrive at 7am on a Tuesday. Count pedestrians for exactly 10 minutes, multiply by 6. Under 30/hr: very difficult. 30–60/hr: viable if positioned well. 60–120/hr: solid. 120+/hr: strong — focus on the lease.',
        critical: true,
      },
      {
        id:       'physical',
        text:     'Physical site inspection',
        detail:   'Corner visibility (two-direction exposure). Existing kitchen infrastructure (saves $30–80k). Outdoor seating potential — north or east facing. On-street parking or transport within 200m. Wide footpath for queue formation.',
      },
      {
        id:       'neighbours',
        text:     'Neighbouring business health check',
        detail:   'Are they thriving or struggling? Foot-traffic anchors nearby (gym, train station, supermarket, office complex)? Turnover of previous tenants at this specific address?',
      },
      {
        id:       'evening',
        text:     'Second visit — peak trading hours',
        detail:   'Café: Saturday 8–10am. Restaurant: Friday 7:30–9pm. Are nearby operators busy? Are people looking for somewhere to eat? 15 minutes of observation beats any dataset.',
      },
    ],
  },
  {
    id:     'before-sign',
    timing: 'Before you sign',
    title:  'The lease table — do not skip these',
    color:  T.amber,
    bg:     T.amberBg,
    bdr:    T.amberBdr,
    dk:     T.amberDk,
    items: [
      {
        id:       'lease-terms',
        text:     'Negotiate the three must-haves',
        detail:   '(1) CPI-capped rent reviews — prevents uncapped landlord increases that push you through the 12% threshold. (2) 12-month break clause — your exit if trading assumptions prove wrong. (3) Permitted use broad enough to cover your full concept including any future pivots.',
        critical: true,
      },
      {
        id:       'solicitor',
        text:     'Get a commercial tenancy solicitor',
        detail:   '$500–1,500 to review. Non-negotiable. Check: rent review mechanism, make-good obligation, personal guarantee scope, option-to-renew terms, assignment rights (can you sell the business with the lease?).',
      },
      {
        id:       'flip-numbers',
        text:     'Know your CAUTION and NO rent numbers',
        detail:   'CAUTION threshold: revenue × 0.13. NO threshold: revenue × 0.15. These are your walkaway numbers in negotiation. Fill them in for your location in the box below.',
      },
      {
        id:       'dca',
        text:     'Check council development applications',
        detail:   'Search the local council\'s DA register for the address and surrounding 200m. An approved development that removes car parks, changes street access, or adds a major competitor can change your model before you open.',
      },
    ],
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function ChecklistClient() {
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [goRent,  setGoRent]  = useState('')
  const [aov,     setAov]     = useState('')

  const total   = SECTIONS.reduce((n, s) => n + s.items.length, 0)
  const done    = checked.size
  const allDone = done === total

  function toggle(id: string) {
    setChecked(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  // Derived lease numbers from user inputs
  const rentNum = parseFloat(goRent.replace(/[^0-9.]/g, '')) || 0
  const aovNum  = parseFloat(aov.replace(/[^0-9.]/g, ''))   || 0
  const reqRevenue    = rentNum > 0 ? Math.round(rentNum / 0.10)            : null
  const reqDaily      = reqRevenue && aovNum > 0 ? Math.round(reqRevenue / aovNum / 26) : null
  const cautionRent   = rentNum > 0 ? Math.round((rentNum / 0.11) * 0.13 / 100) * 100  : null
  const noRent        = rentNum > 0 ? Math.round((rentNum / 0.11) * 0.15 / 100) * 100  : null

  // More precise: given rent, compute the revenue it implies at current ratio (11.2%),
  // then the rent that maps to 13% and 15% of that same revenue
  // revenue = rent / ratio → cautionRent = revenue * 0.13, noRent = revenue * 0.15
  // But we don't know the user's current ratio. Simpler: if user enters a rent,
  // compute the revenue needed to make that rent 10% (the target), then derive 13%/15% rents.
  const impliedRevenue = rentNum > 0 ? rentNum / 0.10 : null
  const cautionRentCalc = impliedRevenue ? Math.round(impliedRevenue * 0.13 / 100) * 100 : null
  const noRentCalc      = impliedRevenue ? Math.round(impliedRevenue * 0.15 / 100) * 100 : null

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F8FAFC; }

        @media print {
          body { background: white; font-size: 11pt; }
          .no-print { display: none !important; }
          .checklist-section { page-break-inside: avoid; break-inside: avoid; }
          .checklist-page { max-width: 100%; padding: 0; }
          .section-card { border: 1pt solid #E7E5E4 !important; box-shadow: none !important; }
          .item-row { padding: 6pt 0 !important; }
          .print-watermark { display: block !important; }
        }

        .print-watermark { display: none; }

        .checklist-item-checkbox {
          width: 18px; height: 18px;
          border-radius: 4px;
          border: 2px solid;
          cursor: pointer;
          flex-shrink: 0;
          appearance: none;
          -webkit-appearance: none;
          display: flex; align-items: center; justify-content: center;
          transition: background 160ms, border-color 160ms;
          position: relative;
        }
        .checklist-item-checkbox:checked {
          background: ${T.brand};
          border-color: ${T.brand};
        }
        .checklist-item-checkbox:checked::after {
          content: '';
          position: absolute;
          width: 10px; height: 6px;
          border-left: 2px solid white;
          border-bottom: 2px solid white;
          transform: rotate(-45deg) translate(1px, -1px);
        }

        .progress-bar-fill {
          height: 100%;
          background: ${T.brand};
          border-radius: 100px;
          transition: width 300ms cubic-bezier(.4,0,.2,1);
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: T.font, color: T.n900 }}>

        {/* ── Dark header ─────────────────────────────────────────────── */}
        <div className="no-print" style={{ background: '#0B1512', borderBottom: '1px solid rgba(167,243,208,0.12)' }}>
          <div style={{ maxWidth: 860, margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' as const }}>
            <Link href="/tools" style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontWeight: 600 }}>← Tools</Link>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>/</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Before-you-sign checklist</span>
          </div>
        </div>

        {/* Print watermark — visible only in print */}
        <div className="print-watermark" style={{ textAlign: 'center', paddingBottom: 12, paddingTop: 6 }}>
          <span style={{ fontSize: 9, color: '#A8A29E', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: T.font }}>
            Locatalyze · locatalyze.com — Location intelligence for Australian operators
          </span>
        </div>

        {/* ── Hero ────────────────────────────────────────────────────── */}
        <div style={{ background: '#0B1512', padding: '48px 24px 40px', borderBottom: '1px solid rgba(167,243,208,0.08)' }} className="no-print">
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(5,150,105,0.14)', border: '1px solid rgba(5,150,105,0.3)', borderRadius: 20, padding: '4px 12px', fontSize: 10, fontWeight: 700, color: T.emerald, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>
              Free resource
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 900, color: '#F8FAFC', letterSpacing: '-0.04em', lineHeight: 1.15, marginBottom: 14, maxWidth: 640 }}>
              Before-You-Sign Location Checklist
            </h1>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 580, marginBottom: 24 }}>
              12 checks across three phases — at your desk, at the site, and at the lease table. Print it, tick it off, and take the numbers in the final section into negotiation.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
              <button
                onClick={() => window.print()}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  background: T.brand, color: '#fff', border: 'none',
                  borderRadius: 10, padding: '11px 20px', fontSize: 13, fontWeight: 800,
                  cursor: 'pointer', fontFamily: T.font,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
                Print / Save as PDF
              </button>
              <Link
                href={onboardingRef('checklist_hero')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', borderRadius: 10, padding: '11px 18px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}
              >
                Run a full report →
              </Link>
            </div>
          </div>
        </div>

        {/* Print page title */}
        <div className="print-watermark" style={{ maxWidth: 860, margin: '0 auto', padding: '16pt 0 8pt' }}>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: T.n900, letterSpacing: '-0.03em' }}>
            Before-You-Sign Location Checklist
          </h1>
          <p style={{ fontSize: 11, color: T.n500, marginTop: 4 }}>12 checks · 3 phases · café & restaurant operators · locatalyze.com</p>
        </div>

        {/* ── Progress bar ─────────────────────────────────────────────── */}
        <div className="no-print" style={{ background: '#fff', borderBottom: `1px solid ${T.n200}`, padding: '12px 24px' }}>
          <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 12, color: allDone ? T.emeraldDk : T.n500, fontWeight: 700, whiteSpace: 'nowrap' as const }}>
              {allDone ? '✓ All checks complete' : `${done} / ${total} checks`}
            </span>
            <div style={{ flex: 1, height: 6, background: T.n100, borderRadius: 100, overflow: 'hidden' }}>
              <div className="progress-bar-fill" style={{ width: `${(done / total) * 100}%` }} />
            </div>
            {done > 0 && (
              <button
                onClick={() => setChecked(new Set())}
                style={{ fontSize: 11, color: T.n400, background: 'none', border: 'none', cursor: 'pointer', fontFamily: T.font, fontWeight: 600 }}
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* ── Sections ─────────────────────────────────────────────────── */}
        <div className="checklist-page" style={{ maxWidth: 860, margin: '0 auto', padding: '24px 24px 0' }}>

          {SECTIONS.map((section, si) => (
            <div key={section.id} className="checklist-section" style={{ marginBottom: 20 }}>
              {/* Section header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{
                  background: section.bg, border: `1px solid ${section.bdr}`,
                  borderRadius: 20, padding: '4px 12px',
                  fontSize: 10, fontWeight: 800, color: section.color,
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                }}>
                  Phase {si + 1} · {section.timing}
                </div>
              </div>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: T.n800, marginBottom: 12, letterSpacing: '-0.02em' }}>
                {section.title}
              </h2>

              {/* Items */}
              <div className="section-card" style={{ background: T.white, borderRadius: 14, border: `1px solid ${T.n200}`, overflow: 'hidden', boxShadow: '0 1px 3px rgba(15,23,42,0.04)' }}>
                {section.items.map((item, ii) => {
                  const isChecked = checked.has(item.id)
                  return (
                    <div
                      key={item.id}
                      className="item-row"
                      onClick={() => toggle(item.id)}
                      style={{
                        display: 'flex', gap: 14, alignItems: 'flex-start',
                        padding: '16px 20px',
                        borderBottom: ii < section.items.length - 1 ? `1px solid ${T.n100}` : 'none',
                        cursor: 'pointer',
                        background: isChecked ? T.n50 : T.white,
                        transition: 'background 160ms',
                      }}
                    >
                      <input
                        type="checkbox"
                        className="checklist-item-checkbox no-print"
                        checked={isChecked}
                        onChange={() => toggle(item.id)}
                        onClick={e => e.stopPropagation()}
                        style={{ borderColor: isChecked ? T.brand : T.n200, marginTop: 2 }}
                        aria-label={item.text}
                      />
                      {/* Print checkbox */}
                      <span className="print-watermark" style={{ display: 'inline-block', width: 14, height: 14, border: `1pt solid #A8A29E`, borderRadius: 2, flexShrink: 0, marginTop: 2 }} />

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' as const }}>
                          <span style={{
                            fontSize: 14, fontWeight: 700,
                            color: isChecked ? T.n400 : T.n900,
                            textDecoration: isChecked ? 'line-through' : 'none',
                            transition: 'color 160ms',
                          }}>
                            {item.text}
                          </span>
                          {item.critical && (
                            <span style={{
                              fontSize: 9, fontWeight: 800, color: T.redDk,
                              background: T.redBg, border: `1px solid ${T.redBdr}`,
                              borderRadius: 4, padding: '2px 6px',
                              textTransform: 'uppercase', letterSpacing: '0.07em',
                            }}>
                              Critical
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: 12, color: isChecked ? T.n400 : T.n500, lineHeight: 1.65, transition: 'color 160ms' }}>
                          {item.detail}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          {/* ── Your Numbers — fill in for your location ──────────────── */}
          <div className="checklist-section" style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: T.n800, marginBottom: 6, letterSpacing: '-0.02em' }}>
              Your lease-table numbers
            </h2>
            <p style={{ fontSize: 12, color: T.n500, marginBottom: 12, lineHeight: 1.6 }}>
              Fill these in for your specific location. Take them into negotiation — your CAUTION and NO numbers are your walkaway points.
            </p>
            <div style={{ background: T.white, borderRadius: 14, border: `1px solid ${T.n200}`, padding: '20px 22px', boxShadow: '0 1px 3px rgba(15,23,42,0.04)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: T.n500, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>
                    Quoted monthly rent ($)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="e.g. 7600"
                    value={goRent}
                    onChange={e => setGoRent(e.target.value)}
                    className="no-print"
                    style={{
                      width: '100%', padding: '10px 12px', fontSize: 15, fontWeight: 700,
                      border: `1.5px solid ${T.n200}`, borderRadius: 10, outline: 'none',
                      fontFamily: T.mono, color: T.n900, background: T.n50,
                    }}
                  />
                  {/* Print line */}
                  <div className="print-watermark" style={{ borderBottom: '1pt solid #A8A29E', paddingBottom: 12, marginTop: 4 }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: T.n500, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>
                    Average order value ($)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="e.g. 18"
                    value={aov}
                    onChange={e => setAov(e.target.value)}
                    className="no-print"
                    style={{
                      width: '100%', padding: '10px 12px', fontSize: 15, fontWeight: 700,
                      border: `1.5px solid ${T.n200}`, borderRadius: 10, outline: 'none',
                      fontFamily: T.mono, color: T.n900, background: T.n50,
                    }}
                  />
                  <div className="print-watermark" style={{ borderBottom: '1pt solid #A8A29E', paddingBottom: 12, marginTop: 4 }} />
                </div>
              </div>

              {/* Derived numbers — show once rent is entered */}
              {rentNum > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {[
                    { label: 'Required revenue',   value: reqRevenue     ? `$${reqRevenue.toLocaleString()}/mo`  : '—', sub: 'to keep rent at 10%',     color: T.n900 },
                    { label: 'Required daily txns', value: reqDaily       ? `${reqDaily}/day`                    : 'Enter AOV', sub: `at $${aovNum || '?'} AOV · 26 days`, color: reqDaily && reqDaily > 200 ? T.red : T.n900 },
                    { label: 'GO threshold',        value: `<$${Math.round(rentNum * (10/11)).toLocaleString()}/mo`,  sub: 'below 12% of implied revenue', color: T.emeraldDk },
                    { label: 'CAUTION threshold',   value: cautionRentCalc ? `$${cautionRentCalc.toLocaleString()}/mo` : '—', sub: '13% — negotiate below this',  color: T.amberDk },
                    { label: 'NO threshold',         value: noRentCalc     ? `$${noRentCalc.toLocaleString()}/mo`     : '—', sub: '15% — walk away',             color: T.redDk },
                    { label: 'Rent-to-revenue',      value: reqRevenue     ? `${((rentNum / reqRevenue) * 100 * (1/0.10) * 0.11).toFixed(1)}%` : '—', sub: 'at 10% target ≈ 10.0%',    color: T.brand },
                  ].map(n => (
                    <div key={n.label} style={{ background: T.n50, border: `1px solid ${T.n200}`, borderRadius: 10, padding: '11px 13px' }}>
                      <p style={{ fontSize: 9, fontWeight: 700, color: T.n400, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>{n.label}</p>
                      <p style={{ fontSize: 15, fontWeight: 900, color: n.color, fontFamily: T.mono, lineHeight: 1 }}>{n.value}</p>
                      <p style={{ fontSize: 10, color: T.n400, marginTop: 3 }}>{n.sub}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ background: T.n50, border: `1px solid ${T.n200}`, borderRadius: 10, padding: '14px 16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {['GO threshold', 'CAUTION threshold', 'NO threshold'].map(label => (
                    <div key={label} style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: 9, fontWeight: 700, color: T.n400, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>{label}</p>
                      <div style={{ borderBottom: '1pt solid #E7E5E4', paddingBottom: 10 }} className="print-watermark" />
                      <p style={{ fontSize: 13, color: T.n400, fontStyle: 'italic' }} className="no-print">Enter rent →</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── What a strong lease looks like ───────────────────────── */}
          <div className="checklist-section" style={{ marginBottom: 20 }}>
            <div style={{ background: T.emeraldBg, border: `1px solid ${T.emeraldBdr}`, borderRadius: 14, padding: '18px 20px' }}>
              <p style={{ fontSize: 11, fontWeight: 800, color: T.emeraldDk, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>What a strong lease looks like</p>
              {[
                { term: '5-year term', why: 'Long enough to build a customer base; worth the commitment if the numbers work.' },
                { term: 'CPI-capped rent reviews', why: 'Prevents landlord from pushing you through the 12% threshold at renewal. The rent review clause is the single clause most likely to kill a profitable business.' },
                { term: '12-month break clause', why: 'Your exit if trading assumptions prove wrong. Worth paying a small premium for.' },
                { term: 'No uncapped market reviews', why: 'Market reviews can double your rent. If the landlord insists on them, require a cap (e.g. no more than 10% in any review period).' },
                { term: 'Permitted use: broad and specific', why: 'Must cover your full concept including any future food/drink pivots. Narrow permitted use can prevent you from serving alcohol, changing the menu format, or subletting.' },
                { term: 'Make-good: limited and defined', why: 'Restoration to original condition can cost $20,000–$80,000 at end of lease. Negotiate "fair wear and tear" exclusion and a clear definition of "original condition".' },
              ].map((row, i) => (
                <div key={row.term} style={{ display: 'flex', gap: 12, paddingTop: i === 0 ? 0 : 10, marginTop: i === 0 ? 0 : 10, borderTop: i === 0 ? 'none' : `1px solid ${T.emeraldBdr}` }}>
                  <span style={{ fontSize: 10, color: T.emerald, fontWeight: 900, marginTop: 2, flexShrink: 0 }}>✓</span>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: T.emeraldDk, marginBottom: 2 }}>{row.term}</p>
                    <p style={{ fontSize: 12, color: T.emeraldDk, opacity: 0.75, lineHeight: 1.6 }}>{row.why}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── Bottom CTA ───────────────────────────────────────────────── */}
        <div className="no-print" style={{ background: '#0B1512', borderTop: '1px solid rgba(167,243,208,0.08)', padding: '40px 24px', marginTop: 20 }}>
          <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' as const }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: T.emerald, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
                This checklist tells you what to look for. A Locatalyze report does it for you.
              </p>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: '#F8FAFC', letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: 10 }}>
                Get a GO / CAUTION / NO verdict in ~90 seconds
              </h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, maxWidth: 480 }}>
                Competitor map, rent-to-revenue check, demographic score, break-even calc and a 3-year financial model — for any Australian address. First report free, no credit card.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10, flexShrink: 0, alignSelf: 'center' }}>
              <Link
                href={onboardingRef('checklist_footer')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#34D399', color: '#064E3B', borderRadius: 12, padding: '14px 28px', fontSize: 14, fontWeight: 800, textDecoration: 'none', whiteSpace: 'nowrap' as const }}
              >
                Run my free analysis →
              </Link>
              <Link
                href="/sample-report"
                style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', fontWeight: 600 }}
              >
                See a sample report first
              </Link>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
