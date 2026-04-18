'use client'

import Link from 'next/link'
import { onboardingRef, toolsHubRef } from '@/lib/funnel-links'

type UseCase = {
  id: string
  title: string
  problem: string
  solution: string
  benefits: string[]
  metrics: { label: string; value: string }[]
  primaryHref: string
  toolHref: string
  reportHref: string
  reportLabel: string
}

const USE_CASES: UseCase[] = [
  {
    id: 'cafe',
    title: 'Cafe location analysis',
    problem:
      'Cafe operators often sign leases before validating commuter flow, competitor density, and realistic rent-to-revenue fit.',
    solution:
      'Locatalyze models foot traffic, trade-area demographics, and local saturation to show whether the site can sustain your daily transaction target.',
    benefits: [
      'Estimate viable daily covers before lease commitment',
      'Benchmark nearby competitor intensity within 500m',
      'Stress-test rent against conservative revenue assumptions',
    ],
    metrics: [
      { label: 'Peak window', value: '7:00-10:00 AM' },
      { label: 'Typical risk flag', value: 'Rent > 12% revenue' },
      { label: 'Coverage radius', value: '500m competitor map' },
    ],
    primaryHref: onboardingRef('usecase_cafe_run'),
    toolHref: '/tools/business-viability-checker?ref=usecase_cafe_tool',
    reportHref: '/cafe/perth/subiaco',
    reportLabel: 'View suburb report',
  },
  {
    id: 'restaurant',
    title: 'Restaurant viability check',
    problem:
      'Restaurants fail when evening demand and spend-per-visit assumptions are too optimistic for the local catchment.',
    solution:
      'Use suburb-level demand and affordability signals to validate whether dinner trade can support staffing and occupancy targets.',
    benefits: [
      'Validate realistic evening demand and spend profile',
      'Identify market overcrowding versus true concept gaps',
      'Pressure-test setup risk before capex decisions',
    ],
    metrics: [
      { label: 'Decision output', value: 'GO / CAUTION / NO' },
      { label: 'Demand confidence', value: 'Data-backed signal' },
      { label: 'Scenario view', value: 'Base / downside framing' },
    ],
    primaryHref: onboardingRef('usecase_restaurant_run'),
    toolHref: '/tools/business-viability-checker?ref=usecase_restaurant_tool',
    reportHref: '/restaurant/perth/fremantle',
    reportLabel: 'View suburb report',
  },
  {
    id: 'retail',
    title: 'Retail site selection',
    problem:
      'Retail launches struggle when pedestrian intent and anchor draw do not match the product category or ticket size.',
    solution:
      'Evaluate corridor strength, demand fit, and competitive pressure before committing to a high fixed-cost tenancy.',
    benefits: [
      'Match suburb demographics to your retail category',
      'Avoid low-intent footfall locations',
      'Benchmark lease risk against expected conversion volume',
    ],
    metrics: [
      { label: 'Site fit', value: 'Category-aligned demand' },
      { label: 'Competitor view', value: 'Nearby overlap scan' },
      { label: 'Lease risk', value: 'Affordability signal' },
    ],
    primaryHref: onboardingRef('usecase_retail_run'),
    toolHref: '/tools/break-even-foot-traffic?ref=usecase_retail_tool',
    reportHref: '/retail/melbourne/richmond',
    reportLabel: 'View suburb report',
  },
  {
    id: 'gym',
    title: 'Gym demand analysis',
    problem:
      'Fitness operators overestimate local membership depth and underestimate the impact of nearby premium chains.',
    solution:
      'Map true catchment demand against existing fitness supply to test whether your membership model has enough room.',
    benefits: [
      'Estimate local demand depth by suburb profile',
      'Surface saturation risk before fit-out spend',
      'Validate membership economics against fixed rent',
    ],
    metrics: [
      { label: 'Catchment lens', value: 'Suburb demand profile' },
      { label: 'Risk scan', value: 'Saturation + affordability' },
      { label: 'Decision speed', value: 'Minutes, not weeks' },
    ],
    primaryHref: onboardingRef('usecase_gym_run'),
    toolHref: '/tools/business-viability-checker?ref=usecase_gym_tool',
    reportHref: '/gym/sydney/bondi',
    reportLabel: 'View suburb report',
  },
  {
    id: 'rent',
    title: 'Rent affordability analysis',
    problem:
      'Many operators accept quoted rent without validating required foot traffic and break-even pressure under conservative assumptions.',
    solution:
      'Use break-even modelling to convert rent into a clear daily customer requirement and risk band before signing.',
    benefits: [
      'Translate rent into required daily customer volume',
      'Spot fragile economics before negotiation',
      'Use downside scenarios to negotiate with confidence',
    ],
    metrics: [
      { label: 'Primary output', value: 'Daily customers needed' },
      { label: 'Risk label', value: 'Healthy / Caution / High risk' },
      { label: 'Use case fit', value: 'Lease negotiation prep' },
    ],
    primaryHref: onboardingRef('usecase_rent_run'),
    toolHref: '/tools/break-even-foot-traffic?ref=usecase_rent_tool',
    reportHref: '/cafe/sydney/newtown',
    reportLabel: 'View suburb report',
  },
]

const PAGE_CSS = `
.ucx-page { background:#f8fafc; color:#0f172a; font-family:"DM Sans","Inter","Geist",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; }
.ucx-page * { box-sizing:border-box; }
.ucx-shell { max-width:1120px; margin:0 auto; padding:0 24px; }
.ucx-hero { padding:72px 0 52px; background:linear-gradient(180deg,#0b1220 0%,#111827 100%); color:#f8fafc; border-bottom:1px solid rgba(255,255,255,.08); }
.ucx-eyebrow { margin:0 0 10px; font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:.08em; color:#5eead4; }
.ucx-hero h1 { margin:0 0 14px; font-size:clamp(30px,4.4vw,52px); line-height:1.08; letter-spacing:-.03em; }
.ucx-hero p { margin:0 0 26px; font-size:17px; line-height:1.7; color:#cbd5e1; max-width:760px; }
.ucx-btn-primary { display:inline-flex; align-items:center; justify-content:center; min-height:48px; padding:0 22px; border-radius:12px; text-decoration:none; background:#0f766e; color:#fff; font-size:14px; font-weight:700; box-shadow:0 8px 20px -10px rgba(15,118,110,.55); }
.ucx-main { padding:56px 0 30px; }
.ucx-section { display:grid; grid-template-columns:1.08fr .92fr; gap:28px; margin-bottom:24px; border:1px solid #e2e8f0; border-radius:20px; background:#fff; box-shadow:0 14px 34px -26px rgba(15,23,42,.35); padding:28px; }
.ucx-section--reverse { grid-template-columns:.92fr 1.08fr; }
.ucx-content h2 { margin:0 0 10px; font-size:clamp(24px,2.8vw,32px); line-height:1.2; letter-spacing:-.02em; }
.ucx-kicker { margin:0 0 10px; font-size:11px; text-transform:uppercase; letter-spacing:.08em; font-weight:800; color:#0f766e; }
.ucx-problem, .ucx-solution { margin:0 0 10px; color:#475569; line-height:1.7; font-size:14px; }
.ucx-list { margin:12px 0 16px; padding:0; list-style:none; }
.ucx-list li { margin:0 0 8px; padding-left:18px; position:relative; color:#334155; font-size:13px; line-height:1.55; }
.ucx-list li:before { content:""; position:absolute; left:0; top:7px; width:8px; height:8px; border-radius:999px; background:#14b8a6; }
.ucx-actions { display:flex; flex-wrap:wrap; gap:10px; align-items:center; margin-top:8px; }
.ucx-btn-secondary { display:inline-flex; align-items:center; justify-content:center; min-height:44px; padding:0 16px; border-radius:10px; text-decoration:none; border:1px solid #d1d5db; color:#0f172a; font-size:13px; font-weight:700; background:#fff; }
.ucx-link-inline { font-size:13px; color:#0f766e; font-weight:700; text-decoration:none; }
.ucx-visual { border:1px solid #e2e8f0; border-radius:16px; padding:16px; background:linear-gradient(160deg,#f8fafc 0%,#ffffff 100%); }
.ucx-visual-top { display:flex; justify-content:space-between; gap:8px; margin-bottom:10px; align-items:flex-start; }
.ucx-visual-title { font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:.06em; color:#64748b; margin:0; }
.ucx-chip { font-size:11px; font-weight:700; color:#0f766e; border:1px solid #99f6e4; background:#ecfeff; border-radius:999px; padding:4px 10px; }
.ucx-metrics { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-bottom:12px; }
.ucx-metric { border:1px solid #e2e8f0; border-radius:10px; padding:10px; background:#fff; }
.ucx-metric .v { display:block; font-size:13px; font-weight:800; color:#0f172a; margin-bottom:2px; }
.ucx-metric .l { display:block; font-size:11px; color:#64748b; line-height:1.4; }
.ucx-bars { display:grid; gap:8px; }
.ucx-bar-row { display:grid; grid-template-columns:88px 1fr; align-items:center; gap:8px; }
.ucx-bar-row span { font-size:11px; color:#64748b; }
.ucx-bar { height:8px; border-radius:999px; background:#e2e8f0; overflow:hidden; }
.ucx-bar i { display:block; height:100%; border-radius:999px; background:linear-gradient(90deg,#0f766e,#14b8a6); }
.ucx-final { margin:12px 0 66px; border-radius:20px; padding:34px 28px; background:linear-gradient(135deg,#0f172a 0%,#0f766e 110%); color:#fff; text-align:center; }
.ucx-final h3 { margin:0 0 10px; font-size:clamp(24px,2.8vw,34px); letter-spacing:-.02em; }
.ucx-final p { margin:0 auto 22px; max-width:640px; color:#d1d5db; line-height:1.65; font-size:15px; }
@media (max-width: 920px) {
  .ucx-shell { padding:0 16px; }
  .ucx-main { padding-top:34px; }
  .ucx-section, .ucx-section--reverse { grid-template-columns:1fr; padding:20px; gap:16px; }
  .ucx-metrics { grid-template-columns:1fr; }
}
`

function UseCaseVisual({ item }: { item: UseCase }) {
  return (
    <div className="ucx-visual" aria-hidden>
      <div className="ucx-visual-top">
        <p className="ucx-visual-title">Use case preview</p>
        <span className="ucx-chip">Live signal</span>
      </div>
      <div className="ucx-metrics">
        {item.metrics.map((m) => (
          <div className="ucx-metric" key={m.label}>
            <span className="v">{m.value}</span>
            <span className="l">{m.label}</span>
          </div>
        ))}
      </div>
      <div className="ucx-bars">
        <div className="ucx-bar-row"><span>Demand fit</span><div className="ucx-bar"><i style={{ width: '76%' }} /></div></div>
        <div className="ucx-bar-row"><span>Rent fit</span><div className="ucx-bar"><i style={{ width: '68%' }} /></div></div>
        <div className="ucx-bar-row"><span>Competition</span><div className="ucx-bar"><i style={{ width: '61%' }} /></div></div>
      </div>
    </div>
  )
}

function UseCaseSection({ item, reverse }: { item: UseCase; reverse: boolean }) {
  return (
    <section className={`ucx-section ${reverse ? 'ucx-section--reverse' : ''}`}>
      <div className="ucx-content">
        <p className="ucx-kicker">Use case</p>
        <h2>{item.title}</h2>
        <p className="ucx-problem"><strong>Problem:</strong> {item.problem}</p>
        <p className="ucx-solution"><strong>How Locatalyze solves it:</strong> {item.solution}</p>
        <ul className="ucx-list">
          {item.benefits.map((b) => <li key={b}>{b}</li>)}
        </ul>
        <div className="ucx-actions">
          <Link href={item.primaryHref} className="ucx-btn-primary">Run analysis</Link>
          <Link href={item.toolHref} className="ucx-btn-secondary">Try tool</Link>
          <Link href={item.reportHref} className="ucx-link-inline">{item.reportLabel}</Link>
        </div>
      </div>
      <UseCaseVisual item={item} />
    </section>
  )
}

export default function Page() {
  return (
    <main className="ucx-page">
      <style dangerouslySetInnerHTML={{ __html: PAGE_CSS }} />

      <section className="ucx-hero">
        <div className="ucx-shell">
          <p className="ucx-eyebrow">Use Cases</p>
          <h1>Real-world location intelligence use cases</h1>
          <p>
            See how operators use Locatalyze to de-risk leases, validate demand, and choose locations with stronger downside protection.
          </p>
          <a href="#use-cases" className="ucx-btn-primary">Explore use cases</a>
        </div>
      </section>

      <div id="use-cases" className="ucx-main">
        <div className="ucx-shell">
          {USE_CASES.map((item, i) => (
            <UseCaseSection key={item.id} item={item} reverse={i % 2 === 1} />
          ))}

          <section className="ucx-final">
            <h3>Move from guesswork to decision-grade location planning</h3>
            <p>
              Start with free tools, then run a full analysis when you have a real address. Keep one clear path from exploration to confident lease decisions.
            </p>
            <div className="ucx-actions" style={{ justifyContent: 'center' }}>
              <Link href={onboardingRef('usecase_final_run')} className="ucx-btn-primary">Run analysis</Link>
              <Link href={toolsHubRef('usecase_final_tools')} className="ucx-btn-secondary">Try tool</Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}