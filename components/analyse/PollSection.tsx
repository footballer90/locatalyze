'use client'

import Link from 'next/link'
import { useState } from 'react'
import { C } from './AnalyseTheme'

interface Props {
  suburbName: string
  question?: string
  options?: string[]
  initialVotes?: number[]
}

export function PollSection({
  suburbName,
  question,
  options = ['Yes, the numbers work', 'Maybe — needs more research', "No, I'd look elsewhere"],
  initialVotes = [44, 33, 23],
}: Props) {
  const displayQuestion = question ?? `Would you open a business in ${suburbName}?`
  const [voted, setVoted] = useState<number | null>(null)
  const [votes, setVotes] = useState<number[]>(initialVotes)

  function handleVote(i: number) {
    if (voted !== null) return
    setVoted(i)
    setVotes((prev) => prev.map((v, idx) => (idx === i ? v + 1 : v)))
  }

  return (
    <section style={{ padding: '48px 24px', borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div
          style={{
            backgroundColor: C.white,
            border: `1px solid ${C.border}`,
            borderRadius: '14px',
            padding: '28px',
          }}
        >
          <h3
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: C.n900,
              marginBottom: '6px',
            }}
          >
            Reader poll
          </h3>
          <p
            style={{
              fontSize: '15px',
              color: C.muted,
              marginBottom: '8px',
            }}
          >
            {displayQuestion}
          </p>
          <p style={{ fontSize: '12px', color: C.mutedLight, marginBottom: '18px', lineHeight: 1.5 }}>
            Illustrative starting split for discussion — not survey research. Vote once to see how your choice shifts the chart on this visit.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {options.map((opt, i) => {
              const denom = votes.reduce((a, b) => a + b, 0)
              const pct = denom > 0 ? Math.round((votes[i] / denom) * 100) : 0
              const isWinner = voted !== null && votes[i] === Math.max(...votes)
              return (
                <button
                  key={opt}
                  onClick={() => handleVote(i)}
                  disabled={voted !== null}
                  style={{
                    position: 'relative',
                    border: `1.5px solid ${voted === i ? C.brand : isWinner && voted !== null ? C.emeraldBdr : C.border}`,
                    borderRadius: '8px',
                    padding: '12px 16px',
                    background: C.white,
                    cursor: voted === null ? 'pointer' : 'default',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                    overflow: 'hidden',
                  }}
                >
                  {voted !== null && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: `${pct}%`,
                        background:
                          voted === i
                            ? 'rgba(8,145,178,0.08)'
                            : 'rgba(226,232,240,0.5)',
                        transition: 'width 0.5s ease',
                      }}
                    />
                  )}
                  <div
                    style={{
                      position: 'relative',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: voted === i ? 700 : 500,
                        color: voted === i ? C.brand : C.n900,
                      }}
                    >
                      {opt}
                    </span>
                    {voted !== null && (
                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: 700,
                          color: voted === i ? C.brand : C.muted,
                        }}
                      >
                        {pct}%
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
          {voted !== null && (
            <div
              style={{
                marginTop: '16px',
                padding: '12px 14px',
                background: C.emeraldBg,
                border: `1px solid ${C.emeraldBdr}`,
                borderRadius: '8px',
              }}
            >
              <p style={{ fontSize: '13px', color: '#047857', margin: 0 }}>
                Want data-driven answers?{' '}
                <Link
                  href="/onboarding"
                  style={{ fontWeight: 700, color: C.emerald, textDecoration: 'underline' }}
                >
                  Run a free location analysis →
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
