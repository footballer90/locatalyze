'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import Link from 'next/link'

const S = {
  brand: '#0F766E', brandLight: '#14B8A6', brandFaded: '#F0FDFA', brandBorder: '#99F6E4',
  n50: '#FAFAF9', n100: '#F5F5F4', n200: '#E7E5E4', n400: '#A8A29E', n500: '#78716C',
  n700: '#44403C', n900: '#1C1917', white: '#FFFFFF',
  emerald: '#059669', emeraldBg: '#ECFDF5',
  headerBg: '#0C1F1C', font: "'DM Sans', sans-serif",
}

const TOPICS = ['General enquiry', 'Report a bug', 'Feature request', 'Billing question', 'Partnership', 'Press / media']

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', topic: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!form.name || !form.email || !form.message) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setSent(true)
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ minHeight: '100vh', background: S.n50, fontFamily: S.font }}>

        <div style={{ background: S.headerBg, padding: '56px 24px 48px', textAlign: 'center' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 28 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#0F766E,#14B8A6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 13 }}>L</div>
            <span style={{ fontWeight: 800, fontSize: 15, color: '#F9FAFB', letterSpacing: '-0.02em' }}>Locatalyze</span>
          </Link>
          <h1 style={{ fontSize: 'clamp(28px,5vw,38px)', fontWeight: 800, color: '#F9FAFB', letterSpacing: '-0.04em', marginBottom: 10 }}>Get in touch</h1>
          <p style={{ fontSize: 15, color: '#9CA3AF', maxWidth: 440, margin: '0 auto' }}>We reply to every message within one business day.</p>
        </div>

        <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 20px 80px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 32, alignItems: 'start' }}>

            <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 18, padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              {sent ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: S.n900, marginBottom: 8 }}>Message sent!</h3>
                  <p style={{ fontSize: 14, color: S.n500, marginBottom: 24, lineHeight: 1.7 }}>Thanks {form.name}. We will get back to you at {form.email} within one business day.</p>
                  <button onClick={() => { setSent(false); setForm({ name: '', email: '', topic: '', message: '' }) }}
                    style={{ padding: '10px 20px', background: S.brandFaded, color: S.brand, border: `1px solid ${S.brandBorder}`, borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: S.font }}>
                    Send another
                  </button>
                </div>
              ) : (
                <>
                  <h2 style={{ fontSize: 17, fontWeight: 800, color: S.n900, marginBottom: 22 }}>Send us a message</h2>
                  {(['name', 'email'] as const).map(key => (
                    <div key={key} style={{ marginBottom: 16 }}>
                      <label style={{ fontSize: 12, fontWeight: 700, color: S.n700, display: 'block', marginBottom: 6, textTransform: 'capitalize' }}>{key === 'name' ? 'Your name' : 'Email address'}</label>
                      <input
                        type={key === 'email' ? 'email' : 'text'}
                        placeholder={key === 'name' ? 'Jane Smith' : 'jane@yourbusiness.com'}
                        value={form[key]}
                        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: 9, border: `1.5px solid ${S.n200}`, fontSize: 14, fontFamily: S.font, outline: 'none', color: S.n900, boxSizing: 'border-box', background: S.n50 }} />
                    </div>
                  ))}
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: S.n700, display: 'block', marginBottom: 6 }}>Topic</label>
                    <select value={form.topic} onChange={e => setForm(p => ({ ...p, topic: e.target.value }))}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 9, border: `1.5px solid ${S.n200}`, fontSize: 14, fontFamily: S.font, outline: 'none', color: S.n700, background: S.n50, boxSizing: 'border-box' }}>
                      <option value="">Select a topic</option>
                      {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div style={{ marginBottom: 22 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: S.n700, display: 'block', marginBottom: 6 }}>Message</label>
                    <textarea placeholder="Tell us what you need..." value={form.message} rows={5}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 9, border: `1.5px solid ${S.n200}`, fontSize: 14, fontFamily: S.font, outline: 'none', resize: 'vertical', color: S.n900, background: S.n50, boxSizing: 'border-box' }} />
                  </div>
                  <button onClick={handleSubmit} disabled={loading || !form.name || !form.email || !form.message}
                    style={{ width: '100%', padding: '13px', background: (!form.name || !form.email || !form.message) ? S.n200 : S.brand, color: (!form.name || !form.email || !form.message) ? S.n400 : '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: (!form.name || !form.email || !form.message) ? 'not-allowed' : 'pointer', fontFamily: S.font }}>
                    {loading ? 'Sending…' : 'Send message →'}
                  </button>
                </>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { icon: '✉️', title: 'Email us directly', body: 'hello@locatalyze.com', sub: 'We reply within one business day.' },
                { icon: '🕐', title: 'Business hours', body: 'Mon – Fri, 9am – 5pm AEST', sub: 'We are based in Australia.' },
                { icon: '💬', title: 'Help Centre', body: 'Browse common questions', sub: 'Most answers are there already.', link: '/help' },
              ].map(item => (
                <div key={item.title} style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 14, padding: '20px' }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 9, background: S.brandFaded, border: `1px solid ${S.brandBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{item.icon}</div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: S.n900, marginBottom: 3 }}>{item.title}</p>
                      {item.link
                        ? <Link href={item.link} style={{ fontSize: 14, color: S.brand, fontWeight: 700, textDecoration: 'none' }}>{item.body}</Link>
                        : <p style={{ fontSize: 14, color: S.brand, fontWeight: 700, marginBottom: 2 }}>{item.body}</p>}
                      <p style={{ fontSize: 12, color: S.n400, marginTop: 2 }}>{item.sub}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div style={{ background: S.brandFaded, border: `1px solid ${S.brandBorder}`, borderRadius: 14, padding: '20px' }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: S.brand, marginBottom: 6 }}>🚀 Not a customer yet?</p>
                <p style={{ fontSize: 13, color: S.n700, marginBottom: 14, lineHeight: 1.65 }}>Try Locatalyze free — analyse any Australian business location in 30 seconds. No credit card required.</p>
                <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: S.brand, color: '#fff', borderRadius: 9, padding: '9px 16px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                  Start free →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}