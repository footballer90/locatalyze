import Link from 'next/link'
import { C } from './AnalyseTheme'

interface Props {
  title?: string
  subtitle?: string
  buttonText?: string
  buttonHref?: string
  variant?: 'green' | 'teal' | 'dark'
}

export function CTASection({
  title = 'Ready to choose your location?',
  subtitle = 'Run a free analysis on any Australian address. Get foot traffic data, demographic breakdown, rent benchmarks, and competitive analysis.',
  buttonText = 'Analyse your address free →',
  buttonHref = '/onboarding',
  variant = 'green',
}: Props) {
  const bg =
    variant === 'green'
      ? C.emeraldBg
      : variant === 'teal'
      ? `linear-gradient(135deg, ${C.brandDark}, ${C.brand})`
      : C.n900

  const titleColor =
    variant === 'green' ? C.emerald : variant === 'teal' ? C.white : C.white

  const subtitleColor =
    variant === 'green' ? '#047857' : variant === 'teal' ? 'rgba(255,255,255,0.85)' : C.mutedLight

  const btnBg =
    variant === 'green' ? C.emerald : variant === 'teal' ? C.white : C.brand
  const btnColor =
    variant === 'green' ? C.white : variant === 'teal' ? C.brand : C.white

  return (
    <section
      style={{
        padding: '56px 24px',
        background: bg,
        borderTop: variant === 'green' ? `1px solid ${C.emeraldBdr}` : undefined,
      }}
    >
      <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
        <h2
          style={{
            fontSize: '28px',
            fontWeight: 700,
            color: titleColor,
            marginBottom: '14px',
            lineHeight: '1.3',
          }}
        >
          {title}
        </h2>
        <p
          style={{
            fontSize: '16px',
            color: subtitleColor,
            marginBottom: '28px',
            lineHeight: '1.65',
            maxWidth: '600px',
            margin: '0 auto 28px',
          }}
        >
          {subtitle}
        </p>
        <Link
          href={buttonHref}
          style={{
            display: 'inline-block',
            padding: '14px 32px',
            backgroundColor: btnBg,
            color: btnColor,
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '15px',
            fontWeight: 700,
            letterSpacing: '0.01em',
          }}
        >
          {buttonText}
        </Link>
      </div>
    </section>
  )
}
