'use client'

import Link from 'next/link'
import { C } from './AnalyseTheme'
import { VerdictBadge } from './VerdictBadge'

type Verdict = 'GO' | 'CAUTION' | 'RISKY' | 'NO'

interface Props {
  name: string
  slug: string
  citySlug: string
  description: string
  score: number
  verdict: Verdict
  rentRange?: string
}

export function SuburbCard({ name, slug, citySlug, description, score, verdict, rentRange }: Props) {
  return (
    <Link
      href={`/analyse/${citySlug}/${slug}`}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div
        style={{
          padding: '20px',
          backgroundColor: C.white,
          borderRadius: '10px',
          border: `1px solid ${C.border}`,
          height: '100%',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = C.brand
          el.style.boxShadow = '0 4px 16px rgba(8, 145, 178, 0.1)'
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = C.border
          el.style.boxShadow = 'none'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '8px',
          }}
        >
          <h4
            style={{
              fontSize: '15px',
              fontWeight: 700,
              color: C.n900,
              margin: 0,
              lineHeight: '1.3',
            }}
          >
            {name}
          </h4>
          <span
            style={{
              fontSize: '22px',
              fontWeight: 800,
              color: score >= 80 ? C.emerald : score >= 70 ? C.brand : C.amber,
              lineHeight: 1,
            }}
          >
            {score}
          </span>
        </div>
        <p
          style={{
            fontSize: '13px',
            color: C.muted,
            margin: '0 0 12px 0',
            lineHeight: '1.55',
          }}
        >
          {description}
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <VerdictBadge verdict={verdict} size="sm" />
          {rentRange && (
            <span style={{ fontSize: '12px', color: C.mutedLight, fontWeight: 500 }}>
              {rentRange}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
