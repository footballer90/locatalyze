'use client'
// app/(app)/admin/newsletter/client.tsx

import { useState } from 'react'

const S = {
 brand: '#0F766E', brandLight: '#14B8A6',
 n50: '#FAFAF9', n100: '#F5F5F4', n200: '#E7E5E4',
 n400: '#A8A29E', n500: '#78716C', n700: '#44403C',
 n800: '#292524', n900: '#1C1917', white: '#FFFFFF',
 emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0',
 red: '#DC2626', redBg: '#FEF2F2', redBdr: '#FECACA',
 amber: '#D97706', amberBg: '#FFFBEB', amberBdr: '#FDE68A',
}

const WEEKS = [
 {
    id: 'week1',
  label: 'Week 1 — Suburb of the Week: Leederville',
  subject: "Suburb of the Week: Leederville is quietly becoming Perth's best café location",
  preview: 'Café density up 18% · High young professional population · Low vacancy · Here\'s why it scores 84/100',
 },
  {
    id: 'week2',
  label: 'Week 2 — The bubble tea boom map',
  subject: 'The bubble tea boom — and which Sydney suburbs are still underserved',
  preview: 'Bubble tea stores up 31% in 2 years · 4 suburbs with unmet demand · Melbourne CBD risk alert',
 },
  {
    id: 'week3',
  label: 'Week 3 — 3 mistakes that cost founders $50k+',
  subject: '3 location mistakes that cost founders $50,000+ — and how to avoid them',
  preview: 'Plus: North Brisbane suburbs showing strong demand · Opportunity insight this week',
 },
  {
    id: 'week4',
  label: 'Week 4 — Fitzroy café case study',
  subject: 'Case study: Why this Fitzroy café prints money (and what you can copy)',
  preview: 'Score 88/100 · $312k annual profit · The 4 factors behind it · Plus emerging hotspot alert',
 },
]

export default function NewsletterAdminClient() {
  const [selected, setSelected] = useState(WEEKS[0].id)
  const [status, setStatus]     = useState<'idle'|'sending'|'done'|'error'>('idle')
 const [result, setResult]     = useState<{ sent: number } | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

 const week = WEEKS.find(w => w.id === selected)!

  async function handleSend() {
    if (!confirm(`Send "${week.label}" to ALL subscribers now?\n\nThis cannot be undone.`)) return
  setStatus('sending')
  setErrorMsg('')
  try {
      const res = await fetch('/api/admin/newsletter-send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ weekId: selected }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Send failed')
   setResult(data)
      setStatus('done')
  } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : 'Something went wrong')
   setStatus('error')
  }
  }

  const inputStyle = {
    width: '100%', background: S.white, border: `1.5px solid ${S.n200}`,
  borderRadius: 10, padding: '11px 14px', fontSize: 14, color: S.n800,
  outline: 'none', boxSizing: 'border-box' as const,
  fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif",
 }

  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif", padding: '40px 20px' }}>
   <div style={{ maxWidth: 560, margin: '0 auto' }}>

    {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Admin</p>
     <h1 style={{ fontSize: 24, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 6 }}>Newsletter Broadcasts</h1>
     <p style={{ fontSize: 14, color: S.n500 }}>Pick a newsletter and send to all subscribers in one click.</p>
        </div>

        {/* Card */}
        <div style={{ background: S.white, borderRadius: 16, border: `1px solid ${S.n200}`, padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>

     {status === 'done' ? (
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
       <div style={{ width: 56, height: 56, borderRadius: '50%', background: S.emeraldBg, border: `2px solid ${S.emeraldBdr}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 24 }}></div>
       <h2 style={{ fontSize: 20, fontWeight: 800, color: S.n900, marginBottom: 8 }}>Sent successfully</h2>
              <p style={{ fontSize: 14, color: S.n500, marginBottom: 24 }}>
                <strong style={{ color: S.n800 }}>{week.label}</strong> was sent to all subscribers.
              </p>
              <button onClick={() => { setStatus('idle'); setResult(null) }}
        style={{ background: S.n100, border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 600, color: S.n700, cursor: 'pointer' }}>
        Send another
              </button>
            </div>
          ) : (
            <>
              {/* Select newsletter */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: S.n700, display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
         Select newsletter
                </label>
                <select value={selected} onChange={e => setSelected(e.target.value)} style={inputStyle}>
                  {WEEKS.map(w => (
                    <option key={w.id} value={w.id}>{w.label}</option>
                  ))}
                </select>
              </div>

              {/* Preview */}
              <div style={{ background: S.n50, borderRadius: 10, padding: '14px 16px', marginBottom: 24, border: `1px solid ${S.n100}` }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Preview</p>
        <p style={{ fontSize: 13, fontWeight: 600, color: S.n800, marginBottom: 4 }}>Subject: {week.subject}</p>
                <p style={{ fontSize: 12, color: S.n500 }}>Preview: {week.preview}</p>
              </div>

              {/* Error */}
              {status === 'error' && (
        <div style={{ marginBottom: 20, padding: '12px 14px', background: S.redBg, border: `1px solid ${S.redBdr}`, borderRadius: 10 }}>
         <p style={{ fontSize: 13, color: S.red }}>{errorMsg}</p>
                </div>
              )}

              {/* Send button */}
              <button
                onClick={handleSend}
                disabled={status === 'sending'}
        style={{
                  width: '100%', padding: '13px', borderRadius: 10, border: 'none',
         background: status === 'sending' ? S.n200 : S.brand,
         color: status === 'sending' ? S.n400 : S.white,
         fontWeight: 700, fontSize: 15, cursor: status === 'sending' ? 'not-allowed' : 'pointer',
         fontFamily: 'inherit', transition: 'all 0.15s',
        }}
              >
                {status === 'sending' ? 'Sending to all subscribers…' : 'Send to all subscribers →'}
       </button>

              <p style={{ fontSize: 12, color: S.n400, textAlign: 'center', marginTop: 12 }}>
        This sends immediately to everyone in your Resend audience.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}