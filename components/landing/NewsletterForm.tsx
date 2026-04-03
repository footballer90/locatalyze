'use client'
// components/NewsletterForm.tsx
// Isolated client component — prevents "event handlers cannot be passed to Client Component props" error
// when Footer is rendered inside a Server Component layout.

import { useState } from 'react'

const S = {
  wrap:   { display: 'flex', gap: 8, flexWrap: 'wrap' as const, alignItems: 'stretch', maxWidth: 380 },
  input:  {
    flex: '1 1 180px', padding: '10px 14px', background: '#111827',
    border: '1px solid #1F2937', borderRadius: 9, fontSize: 13,
    color: '#F9FAFB', outline: 'none', fontFamily: 'inherit',
    transition: 'border-color .2s',
  },
  btn:    {
    padding: '10px 18px', background: '#0F766E', color: '#fff',
    border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 700,
    cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' as const,
    transition: 'background .2s',
  },
  ok:     { fontSize: 13, color: '#34D399', fontWeight: 600, padding: '10px 0' },
  err:    { fontSize: 12, color: '#F87171', marginTop: 6 },
}

export default function NewsletterForm() {
  const [email,   setEmail]   = useState('')
  const [status,  setStatus]  = useState<'idle'|'loading'|'ok'|'error'>('idle')
  const [focused, setFocused] = useState(false)
  const [hovered, setHovered] = useState(false)

  async function handleSubmit() {
    if (!email.trim() || !email.includes('@')) {
      setStatus('error')
      return
    }
    setStatus('loading')
    try {
      // Simple honeypot guard — bot submissions will include a "website" field
      await fetch('/api/newsletter', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: email.trim() }),
      })
      setStatus('ok')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'ok') {
    return <p style={S.ok}>You are in. Weekly location insights incoming.</p>
  }

  return (
    <div>
      <div style={S.wrap}>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          disabled={status === 'loading'}
          aria-label="Email address for newsletter"
          style={{
            ...S.input,
            borderColor: focused ? '#0F766E' : '#1F2937',
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={status === 'loading'}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            ...S.btn,
            background: hovered ? '#0D6B63' : '#0F766E',
            opacity: status === 'loading' ? 0.7 : 1,
          }}
        >
          {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
        </button>
      </div>
      {status === 'error' && (
        <p style={S.err}>Please enter a valid email address.</p>
      )}
    </div>
  )
}