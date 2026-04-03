'use client'
import { useState } from 'react'

export default function ReferralPrompt({ reportScore, verdict }: { reportScore: number; verdict: string }) {
 const [copied, setCopied] = useState(false)

  // Only show for strong GO verdicts
  if (verdict !== 'GO' || reportScore < 70) return null

 const referralUrl = `https://www.locatalyze.com?ref=share`

  function handleCopy() {
    navigator.clipboard.writeText(referralUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div style={{
      margin: '24px 0',
   background: 'linear-gradient(135deg, #ECFDF5, #F0FDF4)',
   border: '1.5px solid #A7F3D0',
   borderRadius: 16,
      padding: '20px 24px',
   display: 'flex',
   alignItems: 'center',
   justifyContent: 'space-between',
   gap: 16,
      flexWrap: 'wrap' as const,
  }}>
      <div>
        <p style={{ fontSize: 15, fontWeight: 700, color: '#065F46', marginBottom: 4 }}>
     This looks like a strong location
        </p>
        <p style={{ fontSize: 13, color: '#047857', lineHeight: 1.6 }}>
     Know a business partner, accountant, or investor who should see this?<br/>
          Share Locatalyze — they get a free report too.
        </p>
      </div>
      <button
        onClick={handleCopy}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
     background: copied ? '#059669' : '#0F766E',
     color: '#fff', border: 'none', borderRadius: 10,
     padding: '11px 20px', fontSize: 13, fontWeight: 700,
     cursor: 'pointer', flexShrink: 0,
     transition: 'background 0.2s',
     fontFamily: 'inherit',
    }}
      >
        {copied ? ' Link copied!' : ' Copy share link →'}
   </button>
    </div>
  )
}