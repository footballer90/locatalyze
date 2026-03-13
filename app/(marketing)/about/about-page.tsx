// Save to: app/(marketing)/about/page.tsx

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'About Locatalyze — Built by Perth Founders',
  description:
    "Meet the team behind Locatalyze. One co-founder ran businesses and felt the pain. The other built the systems that fix it. Together they made the tool they both wish existed.",
}

export default function AboutPage() {
  return (
    <main style={{
      maxWidth: 760,
      margin: '0 auto',
      padding: '5rem 1.5rem 6rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <div style={{ marginBottom: '3rem' }}>
        <span style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '.1em',
          textTransform: 'uppercase' as const, color: '#0FDECE',
          display: 'block', marginBottom: 12,
        }}>
          The team behind Locatalyze
        </span>
        <h1 style={{
          fontSize: 42, fontWeight: 800, lineHeight: 1.12,
          color: '#0F172A', margin: '0 0 16px',
        }}>
          {"We've been on both sides"}<br />of this problem
        </h1>
        <p style={{
          fontSize: 18, color: '#475569', lineHeight: 1.75,
          maxWidth: 560, margin: 0,
        }}>
          One co-founder ran businesses and felt the pain. The other built
          the systems that fix it. Together, we made the tool we both wish existed.
        </p>
      </div>

      {/* ── Founders grid ──────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 16,
        marginBottom: '2.5rem',
      }}>

        {/* Prash */}
        <div style={{
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: 16,
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column' as const,
        }}>
          <svg width="72" height="72" viewBox="0 0 72 72" style={{ marginBottom: 14, flexShrink: 0 }}>
            <circle cx="36" cy="36" r="36" fill="#0F766E"/>
            <circle cx="36" cy="36" r="33" fill="none" stroke="#0FDECE" strokeWidth="3"/>
            <circle cx="36" cy="27" r="11" fill="#5DCAA5"/>
            <ellipse cx="36" cy="58" rx="18" ry="13" fill="#5DCAA5"/>
            <circle cx="36" cy="27" r="9" fill="#E1F5EE"/>
            <text x="36" y="32" textAnchor="middle" fontSize="11" fontWeight="800" fill="#0F6E56" fontFamily="system-ui">PG</text>
          </svg>

          <h2 style={{ fontSize: 19, fontWeight: 700, color: '#0F172A', margin: '0 0 3px' }}>
            Prash Guleria
          </h2>
          <p style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '.08em',
            textTransform: 'uppercase' as const, color: '#0FDECE',
            margin: '0 0 12px',
          }}>
            Co-Founder &amp; Product · Perth, WA
          </p>
          <p style={{
            fontSize: 14, color: '#475569', lineHeight: 1.75,
            margin: '0 0 16px', flex: 1,
          }}>
            Serial business owner turned tech builder. Prash ran his own ventures
            across Perth and kept hitting the same wall — no affordable way to
            validate a location before committing to a lease. He learned to code,
            built the first version of Locatalyze on nights and weekends, and
            {"hasn't"} looked back since.
          </p>
          <a
            href="https://www.linkedin.com/in/prashantguleria/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              fontWeight: 600,
              color: '#0077B5',
              background: '#EFF8FF',
              padding: '6px 12px',
              borderRadius: 6,
              border: '1px solid #BFDBFE',
              textDecoration: 'none',
              width: 'fit-content',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#0077B5">
              <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/>
              <rect x="2" y="9" width="4" height="12"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
            Connect on LinkedIn
          </a>
        </div>

        {/* Aman */}
        <div style={{
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: 16,
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column' as const,
        }}>
          <svg width="72" height="72" viewBox="0 0 72 72" style={{ marginBottom: 14, flexShrink: 0 }}>
            <circle cx="36" cy="36" r="36" fill="#185FA5"/>
            <circle cx="36" cy="36" r="33" fill="none" stroke="#378ADD" strokeWidth="3"/>
            <circle cx="36" cy="27" r="11" fill="#85B7EB"/>
            <ellipse cx="36" cy="58" rx="18" ry="13" fill="#85B7EB"/>
            <circle cx="36" cy="27" r="9" fill="#E6F1FB"/>
            <text x="36" y="32" textAnchor="middle" fontSize="11" fontWeight="800" fill="#185FA5" fontFamily="system-ui">AM</text>
          </svg>

          <h2 style={{ fontSize: 19, fontWeight: 700, color: '#0F172A', margin: '0 0 3px' }}>
            Aman
          </h2>
          <p style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '.08em',
            textTransform: 'uppercase' as const, color: '#378ADD',
            margin: '0 0 12px',
          }}>
            Co-Founder &amp; Engineering · Perth, WA
          </p>
          <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.75, margin: 0, flex: 1 }}>
            Backend engineer with years inside one of {"Australia's"} major banks,
            building the infrastructure that handles millions of transactions a day.
            Aman brings that same enterprise-grade rigour to Locatalyze — designing
            the data pipelines, APIs, and analysis engine that make 60-second
            feasibility reports possible at scale.
          </p>
        </div>

      </div>

      {/* ── Stats row ──────────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        marginBottom: '3rem',
      }}>
        {[
          { num: '60s', label: 'Avg. report time' },
          { num: '$0', label: 'To get started' },
          { num: 'AU', label: 'Built for Australia' },
        ].map(({ num, label }) => (
          <div key={label} style={{
            background: '#F1F5F9',
            borderRadius: 10,
            padding: '1rem',
            textAlign: 'center' as const,
          }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#0FDECE', lineHeight: 1 }}>{num}</div>
            <div style={{ fontSize: 12, color: '#64748B', marginTop: 5 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* ── Story ──────────────────────────────────────────────────── */}
      <h2 style={{ fontSize: 24, fontWeight: 700, color: '#0F172A', marginBottom: 14 }}>
        Why we built this
      </h2>
      <p style={{ fontSize: 16, color: '#475569', lineHeight: 1.85, marginBottom: '1rem' }}>
        Prash spent years running his own businesses across Perth, constantly scouting
        locations. Each time, the process was the same — gut feel, a few weekends of
        research, maybe a paid consultant if the stakes were high enough. The data
        existed, but it was locked behind $5,000–$15,000 reports and two-week timelines.
      </p>
      <p style={{ fontSize: 16, color: '#475569', lineHeight: 1.85, marginBottom: '3rem' }}>
        Aman knew the technology could do better. Together they built Locatalyze —
        the tool they both wish had existed: AI-powered location feasibility in under
        60 seconds, for any Australian small business.
      </p>

      {/* ── Mission ────────────────────────────────────────────────── */}
      <div style={{
        borderLeft: '3px solid #0FDECE',
        paddingLeft: '1.5rem',
        marginBottom: '3rem',
      }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', marginBottom: 10 }}>
          Our mission
        </h2>
        <p style={{ fontSize: 16, color: '#475569', lineHeight: 1.85, margin: 0 }}>
          Democratise commercial property intelligence for Australian small businesses —
          so any founder can access the same insights as a $10,000 feasibility
          consultant, in 30 seconds, before signing anything.
        </p>
      </div>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #0F766E 0%, #0D9488 100%)',
        borderRadius: 16,
        padding: '2.25rem 2.5rem',
        textAlign: 'center' as const,
      }}>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: 'white', margin: '0 0 8px' }}>
          Want to get in touch?
        </h3>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.82)', margin: '0 0 20px' }}>
          Feedback, partnership ideas, or just want to talk shop — we're easy to reach.
        </p>
        <a
          href="mailto:hello@locatalyze.com"
          style={{
            display: 'inline-block',
            background: 'white',
            color: '#0F766E',
            padding: '11px 28px',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 15,
            textDecoration: 'none',
          }}
        >
          hello@locatalyze.com
        </a>
      </div>

    </main>
  )
}
