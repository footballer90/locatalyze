'use client'

import { useState } from 'react'
import { C } from './AnalyseTheme'

interface FAQ {
  question: string
  answer: string
}

interface Props {
  faqs: FAQ[]
  title?: string
  id?: string
}

export function FAQSection({ faqs, title = 'Frequently Asked Questions', id }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  }

  return (
    <section id={id} style={{ padding: '56px 24px', backgroundColor: C.n50 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2
          style={{
            fontSize: '28px',
            fontWeight: 700,
            color: C.n900,
            marginBottom: '32px',
            lineHeight: '1.3',
          }}
        >
          {title}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <div
                key={i}
                style={{
                  backgroundColor: C.white,
                  borderRadius: '10px',
                  border: `1px solid ${isOpen ? C.brand : C.border}`,
                  overflow: 'visible',
                  transition: 'border-color 0.2s ease',
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    padding: '18px 20px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    gap: '16px',
                  }}
                  aria-expanded={isOpen}
                >
                  <span
                    style={{
                      fontSize: '15px',
                      fontWeight: 600,
                      color: C.n900,
                      lineHeight: '1.5',
                      flex: 1,
                    }}
                  >
                    {faq.question}
                  </span>
                  <span
                    style={{
                      flexShrink: 0,
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: isOpen ? C.brand : C.n100,
                      color: isOpen ? C.white : C.muted,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: 700,
                      transition: 'all 0.2s ease',
                      marginTop: '1px',
                    }}
                  >
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div
                    style={{
                      padding: '0 20px 20px 20px',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '14px',
                        lineHeight: '1.75',
                        color: C.muted,
                        margin: 0,
                        display: 'block',
                      }}
                    >
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
