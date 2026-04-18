import Link from 'next/link'

export type UseCaseSection = {
  id: string
  title: string
  problem: string
  solution: string
  benefits: string[]
  metrics?: { label: string; value: string }[]
  primaryHref: string
  toolHref: string
  reportHref: string
  reportLabel: string
  visualImage: string
  visualAlt: string
}

export type UseCaseShowcaseProps = {
  eyebrow: string
  title: string
  subtitle: string
  exploreLabel?: string
  sections: UseCaseSection[]
  topLinks?: { label: string; href: string }[]
}

const SHOWCASE_CSS = `
.ucs-page { background:#f8fafc; color:#0f172a; font-family:"DM Sans","Inter","Geist",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; }
.ucs-page * { box-sizing:border-box; }
.ucs-shell { max-width:1120px; margin:0 auto; padding:0 24px; }
.ucs-hero { padding:72px 0 52px; background:linear-gradient(180deg,#0b1220 0%,#111827 100%); color:#f8fafc; border-bottom:1px solid rgba(255,255,255,.08); }
.ucs-eyebrow { margin:0 0 10px; font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:.08em; color:#5eead4; }
.ucs-hero h1 { margin:0 0 14px; font-size:clamp(30px,4.4vw,52px); line-height:1.08; letter-spacing:-.03em; }
.ucs-hero p { margin:0 0 24px; font-size:17px; line-height:1.7; color:#cbd5e1; max-width:760px; }
.ucs-btn-primary { display:inline-flex; align-items:center; justify-content:center; min-height:48px; padding:0 22px; border-radius:12px; text-decoration:none; background:#0f766e; color:#fff; font-size:14px; font-weight:700; box-shadow:0 8px 20px -10px rgba(15,118,110,.55); }
.ucs-link-row { display:flex; flex-wrap:wrap; gap:8px; margin-top:18px; }
.ucs-link-chip { text-decoration:none; font-size:12px; color:#d1d5db; border:1px solid rgba(255,255,255,.18); border-radius:999px; padding:6px 12px; }
.ucs-main { padding:56px 0 24px; }
.ucs-section { display:grid; grid-template-columns:1.05fr .95fr; gap:28px; margin-bottom:24px; border:1px solid #e2e8f0; border-radius:20px; background:#fff; box-shadow:0 14px 34px -26px rgba(15,23,42,.35); padding:28px; }
.ucs-section--reverse { grid-template-columns:.95fr 1.05fr; }
.ucs-content h2 { margin:0 0 10px; font-size:clamp(24px,2.8vw,32px); line-height:1.2; letter-spacing:-.02em; }
.ucs-kicker { margin:0 0 10px; font-size:11px; text-transform:uppercase; letter-spacing:.08em; font-weight:800; color:#0f766e; }
.ucs-problem, .ucs-solution { margin:0 0 10px; color:#475569; line-height:1.7; font-size:14px; }
.ucs-list { margin:12px 0 16px; padding:0; list-style:none; }
.ucs-list li { margin:0 0 8px; padding-left:18px; position:relative; color:#334155; font-size:13px; line-height:1.55; }
.ucs-list li:before { content:""; position:absolute; left:0; top:7px; width:8px; height:8px; border-radius:999px; background:#14b8a6; }
.ucs-actions { display:flex; flex-wrap:wrap; gap:10px; align-items:center; margin-top:8px; }
.ucs-btn-secondary { display:inline-flex; align-items:center; justify-content:center; min-height:44px; padding:0 16px; border-radius:10px; text-decoration:none; border:1px solid #d1d5db; color:#0f172a; font-size:13px; font-weight:700; background:#fff; }
.ucs-link-inline { font-size:13px; color:#0f766e; font-weight:700; text-decoration:none; }
.ucs-visual { border:1px solid #e2e8f0; border-radius:16px; padding:14px; background:linear-gradient(160deg,#f8fafc 0%,#ffffff 100%); }
.ucs-visual img { width:100%; height:220px; object-fit:cover; border-radius:12px; border:1px solid #e2e8f0; display:block; margin-bottom:10px; }
.ucs-metrics { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; }
.ucs-metric { border:1px solid #e2e8f0; border-radius:10px; padding:10px; background:#fff; }
.ucs-metric .v { display:block; font-size:13px; font-weight:800; color:#0f172a; margin-bottom:2px; }
.ucs-metric .l { display:block; font-size:11px; color:#64748b; line-height:1.4; }
@media (max-width: 920px) {
  .ucs-shell { padding:0 16px; }
  .ucs-main { padding-top:34px; }
  .ucs-section, .ucs-section--reverse { grid-template-columns:1fr; padding:20px; gap:16px; }
  .ucs-metrics { grid-template-columns:1fr; }
}
`

function SectionVisual({ item }: { item: UseCaseSection }) {
  return (
    <div className="ucs-visual">
      <img src={item.visualImage} alt={item.visualAlt} />
      {item.metrics && item.metrics.length > 0 ? (
        <div className="ucs-metrics">
          {item.metrics.slice(0, 3).map((m) => (
            <div className="ucs-metric" key={m.label}>
              <span className="v">{m.value}</span>
              <span className="l">{m.label}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function UseCaseBlock({ item, reverse }: { item: UseCaseSection; reverse: boolean }) {
  return (
    <section className={`ucs-section ${reverse ? 'ucs-section--reverse' : ''}`}>
      <div className="ucs-content">
        <p className="ucs-kicker">Use case</p>
        <h2>{item.title}</h2>
        <p className="ucs-problem">
          <strong>Problem:</strong> {item.problem}
        </p>
        <p className="ucs-solution">
          <strong>How Locatalyze solves it:</strong> {item.solution}
        </p>
        <ul className="ucs-list">
          {item.benefits.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <div className="ucs-actions">
          <Link href={item.primaryHref} className="ucs-btn-primary">
            Run analysis
          </Link>
          <Link href={item.toolHref} className="ucs-btn-secondary">
            Try tool
          </Link>
          <Link href={item.reportHref} className="ucs-link-inline">
            {item.reportLabel}
          </Link>
        </div>
      </div>
      <SectionVisual item={item} />
    </section>
  )
}

export default function UseCaseShowcase(props: UseCaseShowcaseProps) {
  const { eyebrow, title, subtitle, sections, exploreLabel = 'Explore use cases', topLinks } = props

  return (
    <main className="ucs-page">
      <style dangerouslySetInnerHTML={{ __html: SHOWCASE_CSS }} />

      <section className="ucs-hero">
        <div className="ucs-shell">
          <p className="ucs-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{subtitle}</p>
          <a href="#use-cases" className="ucs-btn-primary">
            {exploreLabel}
          </a>
          {topLinks && topLinks.length > 0 ? (
            <div className="ucs-link-row">
              {topLinks.map((t) => (
                <Link key={t.href} href={t.href} className="ucs-link-chip">
                  {t.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <div id="use-cases" className="ucs-main">
        <div className="ucs-shell">
          {sections.map((section, i) => (
            <UseCaseBlock key={section.id} item={section} reverse={i % 2 === 1} />
          ))}
        </div>
      </div>
    </main>
  )
}
