import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Locatalyze Tools | Free Location Intelligence Tools',
  description:
    'Explore free Locatalyze tools for smarter lease and location decisions. Check business viability and whether your suburb rent is overpriced before signing.',
  alternates: { canonical: 'https://www.locatalyze.com/tools' },
  openGraph: {
    title: 'Locatalyze Tools',
    description:
      'Free location intelligence tools to help Australian operators avoid bad leases.',
    type: 'website',
    url: 'https://www.locatalyze.com/tools',
  },
}

const TOOLS = [
  {
    title: 'Is This Rent Overpriced?',
    description:
      'Check if the rent you are about to sign is above market for your suburb and business type.',
    href: '/tools/rent-overpriced-checker',
    cta: 'Check Rent Now',
    badge: 'Lease intelligence',
  },
  {
    title: 'Business Viability Checker',
    description:
      'Get a fast GO / CAUTION / NO signal with revenue, break-even and fit indicators for a suburb.',
    href: '/tools/business-viability-checker',
    cta: 'Check Viability',
    badge: 'Suburb viability',
  },
  {
    title: 'How Many Customers Do You Need to Survive?',
    description:
      'Calculate the exact number of customers you need daily to break even and avoid losses.',
    href: '/tools/break-even-foot-traffic',
    cta: 'Calculate Now',
    badge: 'Break-even intelligence',
  },
]

const HUB_CSS = `
.lv-tools-hub {
  font-family: "DM Sans", "Geist", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
  background: #f8fafc !important;
  color: #0f172a !important;
}
.lv-tools-hub * { box-sizing: border-box; }
.lv-tools-hub h1, .lv-tools-hub h2, .lv-tools-hub h3, .lv-tools-hub p, .lv-tools-hub a, .lv-tools-hub span {
  font-family: inherit !important;
  text-transform: none !important;
  letter-spacing: normal !important;
}
.lv-tools-hub .lth-shell {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 24px;
}
.lv-tools-hub .lth-hero {
  padding: 72px 0 34px;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%) !important;
}
.lv-tools-hub .lth-eyebrow {
  margin: 0 0 10px !important;
  font-size: 11px !important;
  font-weight: 700 !important;
  letter-spacing: 0.08em !important;
  text-transform: uppercase !important;
  color: #0f766e !important;
}
.lv-tools-hub .lth-hero h1 {
  margin: 0 0 12px !important;
  font-size: clamp(32px, 5vw, 54px) !important;
  font-weight: 800 !important;
  letter-spacing: -0.025em !important;
  line-height: 1.08 !important;
}
.lv-tools-hub .lth-hero p {
  margin: 0 !important;
  max-width: 780px;
  font-size: 17px !important;
  line-height: 1.7 !important;
  color: #64748b !important;
}
.lv-tools-hub .lth-grid-wrap {
  padding: 30px 0 80px;
}
.lv-tools-hub .lth-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}
.lv-tools-hub .lth-card {
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  background: #ffffff !important;
  box-shadow: 0 8px 34px -24px rgba(15, 23, 42, 0.28);
  padding: 20px;
}
.lv-tools-hub .lth-badge {
  display: inline-flex;
  align-items: center;
  font-size: 11px !important;
  font-weight: 700 !important;
  color: #1d4ed8 !important;
  border: 1px solid #bfdbfe;
  background: #eff6ff !important;
  border-radius: 999px;
  padding: 4px 10px;
  margin-bottom: 12px;
}
.lv-tools-hub .lth-card h2 {
  margin: 0 0 8px !important;
  font-size: 22px !important;
  font-weight: 800 !important;
  line-height: 1.2 !important;
  letter-spacing: -0.02em !important;
}
.lv-tools-hub .lth-card p {
  margin: 0 0 16px !important;
  color: #64748b !important;
  font-size: 14px !important;
  line-height: 1.7 !important;
}
.lv-tools-hub .lth-btn {
  display: inline-flex;
  align-items: center;
  text-decoration: none !important;
  border-radius: 12px;
  background: #0f172a !important;
  color: #ffffff !important;
  padding: 10px 14px;
  font-size: 13px !important;
  font-weight: 700 !important;
}
.lv-tools-hub .lth-btn:hover {
  background: #1e293b !important;
}
@media (max-width: 768px) {
  .lv-tools-hub .lth-shell { padding: 0 16px; }
  .lv-tools-hub .lth-hero { padding: 52px 0 20px; }
  .lv-tools-hub .lth-grid-wrap { padding: 22px 0 56px; }
}
`

export default function ToolsHubPage() {
  return (
    <main className="lv-tools-hub">
      <style dangerouslySetInnerHTML={{ __html: HUB_CSS }} />

      <section className="lth-hero">
        <div className="lth-shell">
          <p className="lth-eyebrow">Free tools directory</p>
          <h1>Tools that stop expensive location mistakes.</h1>
          <p>
            Use these free intelligence tools to pressure-test rent, demand, and business fit before
            committing to a lease.
          </p>
        </div>
      </section>

      <section className="lth-grid-wrap">
        <div className="lth-shell">
          <div className="lth-grid">
            {TOOLS.map((tool) => (
              <article key={tool.href} className="lth-card">
                <span className="lth-badge">{tool.badge}</span>
                <h2>{tool.title}</h2>
                <p>{tool.description}</p>
                <Link href={tool.href} className="lth-btn">
                  {tool.cta}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
