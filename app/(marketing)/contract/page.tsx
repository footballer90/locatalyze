'use client'
import { useState } from 'react'
import Link from 'next/link'

const S = {
  brand: '#0F766E', brandLight: '#14B8A6', brandFaded: '#F0FDFA', brandBorder: '#99F6E4',
  n50: '#FAFAF9', n100: '#F5F5F4', n200: '#E7E5E4', n400: '#A8A29E', n500: '#78716C',
  n700: '#44403C', n800: '#292524', n900: '#1C1917', white: '#FFFFFF',
  emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0',
  red: '#DC2626', redBg: '#FEF2F2', redBdr: '#FECACA',
  headerBg: '#0C1F1C', font: "'DM Sans', sans-serif",
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', type: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (!form.name || !form.email || !form.message) { setError('Please fill in all required fields.'); return }
    setLoading(true)
    setError('')
    // Simulate send — replace with your actual email/form service
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setSent(true)
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ minHeight: '100vh', background: S.n50, fontFamily: S.font }}>

        {/* Hero */}
        <div style={{ background: S.headerBg, padding: '60px 24px 48px', textAlign: 'center' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 32 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg,${S.brand},${S.brandLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 13 }}>L</div>
            <span style={{ fontWeight: 800, fontSize: 15, color: '#F9FAFB', letterSpacing: '-0.02em' }}>Locatalyze</span>
          </Link>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(15,118,110,0.15)', border: '1px solid rgba(15,118,110,0.3)', borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, color: S.brandLight, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 16 }}>Contact</div>
          <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#F9FAFB', letterSpacing: '-0.5px', marginBottom: 12 }}>Get in touch</h1>
          <p style={{ fontSize: 15, color: '#9CA3AF', maxWidth: 480, margin: '0 auto' }}>Have a question, feedback, or issue with a report? We read every message.</p>
        </div>

        <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px 80px', display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 40 }}>

          {/* Left — info */}
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: S.n900, marginBottom: 20 }}>How can we help?</h2>
            {[
              { icon: '🐛', title: 'Report a bug', desc: 'Something broken in your report or the app?' },
              { icon: '💡', title: 'Feature request', desc: 'Got an idea that would make Locatalyze better?' },
              { icon: '📊', title: 'Data question', desc: 'Unsure about a score or number in your report?' },
              { icon: '💳', title: 'Billing issue', desc: 'Payment, refund, or subscription problem?' },
              { icon: '🤝', title: 'Partnership', desc: 'Want to work with us or integrate Locatalyze?' },
            ].map(item => (
              <div key={item.title} style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: S.brandFaded, border: `1px solid ${S.brandBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: S.n800, marginBottom: 2 }}>{item.title}</p>
                  <p style={{ fontSize: 12, color: S.n500, lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              </div>
            ))}

            <div style={{ marginTop: 32, padding: '16px', background: S.brandFaded, border: `1px solid ${S.brandBorder}`, borderRadius: 10 }}>
              <p style={{ fontSize: 12, color: S.brand, fontWeight: 600, marginBottom: 4 }}>📬 Email us directly</p>
              <a href="mailto:hello@locatalyze.com.au" style={{ fontSize: 13, color: S.brand, fontWeight: 700 }}>hello@locatalyze.com.au</a>
              <p style={{ fontSize: 11, color: S.n500, marginTop: 6 }}>We aim to respond within 24 hours on business days.</p>
            </div>
          </div>

          {/* Right — form */}
          <div style={{ background: S.white, borderRadius: 16, border: `1px solid ${S.n200}`, padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: S.emeraldBg, border: `2px solid ${S.emeraldBdr}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 24 }}>✅</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: S.n900, marginBottom: 8 }}>Message sent!</h3>
                <p style={{ fontSize: 14, color: S.n500, lineHeight: 1.6 }}>Thanks for reaching out. We'll get back to you within 24 hours.</p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', type: '', message: '' }) }}
                  style={{ marginTop: 24, padding: '10px 24px', background: S.brand, color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: S.font }}>
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: S.n900, marginBottom: 24 }}>Send us a message</h3>

                {error && <div style={{ background: S.redBg, border: `1px solid ${S.redBdr}`, borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: S.red }}>{error}</div>}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: S.n700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name *</label>
                    <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name"
                      style={{ width: '100%', padding: '10px 12px', border: `1.5px solid ${S.n200}`, borderRadius: 9, fontSize: 14, fontFamily: S.font, color: S.n900, outline: 'none' }}
                      onFocus={e => e.target.style.borderColor = S.brand} onBlur={e => e.target.style.borderColor = S.n200} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: S.n700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email *</label>
                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com"
                      style={{ width: '100%', padding: '10px 12px', border: `1.5px solid ${S.n200}`, borderRadius: 9, fontSize: 14, fontFamily: S.font, color: S.n900, outline: 'none' }}
                      onFocus={e => e.target.style.borderColor = S.brand} onBlur={e => e.target.style.borderColor = S.n200} />
                  </div>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: S.n700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>What is this about?</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', border: `1.5px solid ${S.n200}`, borderRadius: 9, fontSize: 14, fontFamily: S.font, color: form.type ? S.n900 : S.n400, outline: 'none', background: S.white }}>
                    <option value="">Select a topic...</option>
                    <option value="bug">🐛 Bug report</option>
                    <option value="feature">💡 Feature request</option>
                    <option value="data">📊 Data / report question</option>
                    <option value="billing">💳 Billing issue</option>
                    <option value="partnership">🤝 Partnership</option>
                    <option value="other">💬 Other</option>
                  </select>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: S.n700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Message *</label>
                  <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Tell us what's on your mind..." rows={5}
                    style={{ width: '100%', padding: '10px 12px', border: `1.5px solid ${S.n200}`, borderRadius: 9, fontSize: 14, fontFamily: S.font, color: S.n900, outline: 'none', resize: 'vertical' }}
                    onFocus={e => e.target.style.borderColor = S.brand} onBlur={e => e.target.style.borderColor = S.n200} />
                </div>

                <button onClick={handleSubmit} disabled={loading}
                  style={{ width: '100%', padding: '13px', background: loading ? S.brandLight : S.brand, color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: S.font }}>
                  {loading ? 'Sending…' : 'Send message →'}
                </button>
                <p style={{ fontSize: 11, color: S.n400, textAlign: 'center', marginTop: 10 }}>We respond within 24 hours on business days.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}