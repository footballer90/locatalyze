'use client'
// app/(marketing)/contact/page.tsx

import { useState } from 'react'
import Link from 'next/link'

const S = {
 brand: '#0F766E', brandLight: '#14B8A6',
 emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0',
 red: '#DC2626', redBg: '#FEF2F2', redBdr: '#FECACA',
 muted: '#64748B', border: '#E2E8F0',
 n50: '#FAFAF9', n100: '#F5F5F4', n200: '#E7E5E4',
 n400: '#A8A29E', n500: '#78716C', n700: '#44403C',
 n800: '#292524', n900: '#1C1917', white: '#FFFFFF',
}

const REASONS = [
 'General enquiry',
 'Partnership or integration',
 'Enterprise / franchise pricing',
 'Press or media',
 'Bug report',
 'Something else',
]

export default function ContactPage() {
 const [name, setName]       = useState('')
 const [email, setEmail]     = useState('')
 const [reason, setReason]   = useState(REASONS[0])
  const [message, setMessage] = useState('')
 const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)
  const [error, setError]     = useState<string | null>(null)

  async function handleSubmit() {
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in all fields.')
   return
    }
    if (!email.includes('@')) {
   setError('Please enter a valid email address.')
   return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, reason, message }),
      })
      const data = await res.json()
      if (data.success) {
        setDone(true)
      } else {
        setError(data.error || 'Something went wrong. Please try again.')
   }
    } catch {
      setError('Network error. Please try again.')
  }
    setLoading(false)
  }

  const inputStyle = {
    width: '100%', background: S.n50,
  border: `1.5px solid ${S.n200}`, borderRadius: 10,
    padding: '12px 14px', fontSize: 14, color: S.n800,
  outline: 'none', fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif",
  boxSizing: 'border-box' as const,
 }

  const labelStyle = {
    fontSize: 11, fontWeight: 700 as const, color: S.n700,
    display: 'block' as const, marginBottom: 7,
  textTransform: 'uppercase' as const, letterSpacing: '0.05em',
 }

  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif", color: S.n900 }}>
   <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>

   {/* Nav */}
      <nav style={{ background: S.white, borderBottom: `1px solid ${S.border}`, padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
     <div style={{ width: 30, height: 30, borderRadius: 9, background: `linear-gradient(135deg,${S.brand},${S.brandLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.white, fontWeight: 800, fontSize: 14 }}><img src="/logo-mark.svg" alt="" style={{ width: '13px', height: '13px' }} /></div>
     <span style={{ fontWeight: 800, fontSize: 15, color: S.n900, letterSpacing: '-0.02em' }}>Locatalyze</span>
    </Link>
        <Link href="/onboarding" style={{ background: S.brand, color: S.white, borderRadius: 10, padding: '8px 18px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>Get started free →</Link>
   </nav>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '52px 24px 80px', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 48, alignItems: 'start' }}>

    {/* Left — info */}
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 100, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: S.emerald, letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: 20 }}>
      Get in touch
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, color: S.n900, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 16 }}>
      We'd love to hear from you
     </h1>
          <p style={{ fontSize: 15, color: S.muted, lineHeight: 1.8, marginBottom: 32 }}>
            Whether you have a question about pricing, want to discuss a partnership, or just want to talk shop about location strategy — we're easy to reach and respond within one business day.
     </p>

          {/* Contact methods */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 36 }}>
      {[
              { icon: '', label: 'Email us directly', value: 'hello@locatalyze.com', href: 'mailto:hello@locatalyze.com' },
       { icon: '', label: 'Based in', value: 'Perth, Western Australia', href: null },
       { icon: '', label: 'Response time', value: 'Within 1 business day', href: null },
      ].map(({ icon, label, value, href }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
         {icon}
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{label}</p>
         {href
                    ? <a href={href} style={{ fontSize: 14, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>{value}</a>
          : <p style={{ fontSize: 14, fontWeight: 600, color: S.n800 }}>{value}</p>
                  }
                </div>
              </div>
            ))}
          </div>

          {/* Common questions */}
          <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '20px 22px' }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>Common questions</p>
      {[
              { q: 'Do you offer enterprise pricing?', a: 'Yes — for franchisors, commercial agents and teams analysing 20+ locations per month. Email us to discuss.' },
       { q: 'Can I use Locatalyze for New Zealand or UK?', a: 'Currently Australia only. NZ and UK are on the roadmap for 2026.' },
       { q: 'Do you offer API access?', a: 'API access for developers and enterprise clients is coming. Contact us to join the waitlist.' },
      ].map(({ q, a }) => (
              <div key={q} style={{ borderTop: `1px solid ${S.n100}`, paddingTop: 12, marginBottom: 12 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: S.n900, marginBottom: 4 }}>{q}</p>
                <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.65 }}>{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <div>
          {done ? (
            <div style={{ background: S.white, borderRadius: 20, border: `1px solid ${S.border}`, padding: 36, textAlign: 'center' }}>
       <div style={{ width: 60, height: 60, borderRadius: '50%', background: S.emeraldBg, border: `2px solid ${S.emeraldBdr}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 26 }}></div>
       <h2 style={{ fontSize: 22, fontWeight: 800, color: S.n900, marginBottom: 10, letterSpacing: '-0.03em' }}>Message sent</h2>
       <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.7, marginBottom: 24 }}>
                Thanks {name.split(' ')[0]}. We've received your message and will get back to you at <strong style={{ color: S.n800 }}>{email}</strong> within one business day.
       </p>
              <p style={{ fontSize: 13, color: S.n400 }}>Check your inbox — we've also sent you a confirmation.</p>
       <Link href="/" style={{ display: 'inline-block', marginTop: 24, fontSize: 13, fontWeight: 700, color: S.brand, textDecoration: 'none' }}>
        ← Back to homepage
              </Link>
            </div>
          ) : (
            <div style={{ background: S.white, borderRadius: 20, border: `1px solid ${S.border}`, padding: 32, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
       <h2 style={{ fontSize: 20, fontWeight: 800, color: S.n900, marginBottom: 6, letterSpacing: '-0.03em' }}>Send us a message</h2>
       <p style={{ fontSize: 13, color: S.muted, marginBottom: 24 }}>We read every message and reply personally.</p>

              {error && (
                <div style={{ marginBottom: 18, padding: '12px 14px', background: S.redBg, border: `1px solid ${S.redBdr}`, borderRadius: 10 }}>
         <p style={{ fontSize: 13, color: S.red }}>{error}</p>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div>
                  <label style={labelStyle}>Your name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="James Smith" style={inputStyle}/>
        </div>
                <div>
                  <label style={labelStyle}>Email address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" style={inputStyle}/>
        </div>
                <div>
                  <label style={labelStyle}>Reason for contact</label>
                  <select value={reason} onChange={e => setReason(e.target.value)}
                    style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
          {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Message</label>
                  <textarea value={message} onChange={e => setMessage(e.target.value)}
                    placeholder="Tell us what's on your mind..."
          rows={5}
                    style={{ ...inputStyle, resize: 'vertical' as const, lineHeight: 1.65 }}
         />
                </div>

                <button onClick={handleSubmit} disabled={loading}
                  style={{
                    width: '100%', padding: '13px', borderRadius: 10, border: 'none',
          background: loading ? S.n200 : S.brand,
                    color: loading ? S.n400 : S.white,
                    fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit', boxShadow: loading ? 'none' : '0 2px 8px rgba(15,118,110,0.25)',
          transition: 'all 0.15s',
         }}>
                  {loading ? 'Sending…' : 'Send message →'}
        </button>
              </div>

              <p style={{ fontSize: 11, color: S.n400, marginTop: 16, textAlign: 'center' }}>
        We reply within 1 business day · Perth, WA
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile responsive style */}
      <style>{`
        @media (max-width: 680px) {
          div[style*="grid-template-columns"] {
      grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}