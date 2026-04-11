// app/opengraph-image.tsx
// Next.js generates this automatically as /opengraph-image
// It replaces the static og-image.png reference
// No external dependencies needed — uses built-in ImageResponse

import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Locatalyze — AI Location Feasibility for Australian Businesses'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
 return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
     alignItems: 'center',
     padding: '0 80px',
     background: '#061412',
     fontFamily: 'sans-serif',
     position: 'relative',
    }}
      >
        {/* Background glow left */}
        <div style={{
          position: 'absolute', top: -100, left: -100,
     width: 500, height: 500, borderRadius: '50%',
     background: 'radial-gradient(circle, rgba(15,118,110,0.3) 0%, transparent 70%)',
     display: 'flex',
    }}/>

        {/* Background glow right */}
        <div style={{
          position: 'absolute', bottom: -80, right: 100,
     width: 400, height: 400, borderRadius: '50%',
     background: 'radial-gradient(circle, rgba(8,145,178,0.2) 0%, transparent 70%)',
     display: 'flex',
    }}/>

        {/* Bottom color strip */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 5,
     background: 'linear-gradient(90deg, #0F766E, #14B8A6, #0891B2)',
     display: 'flex',
    }}/>

        {/* Left content */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>

     {/* Logo row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
      <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: 'linear-gradient(135deg, #0F766E, #14B8A6)',
       display: 'flex', alignItems: 'center', justifyContent: 'center',
       fontSize: 20, fontWeight: 900, color: 'white',
      }}><img src="/logo-mark.svg" alt="" style={{ width: '13px', height: '13px' }} /></div>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#F0FDF9', letterSpacing: '-0.03em' }}>
       Locatalyze
            </span>
          </div>

          {/* Tag */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
      background: 'rgba(15,118,110,0.2)',
      border: '1px solid rgba(15,118,110,0.4)',
      borderRadius: 100, padding: '6px 16px',
      fontSize: 13, fontWeight: 700, color: '#34D399',
      letterSpacing: '0.08em', textTransform: 'uppercase',
      marginBottom: 22, width: 'fit-content',
     }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#34D399', display: 'flex' }}/>
      AI Location Intelligence
          </div>

          {/* Headline */}
          <div style={{ fontSize: 58, fontWeight: 900, color: '#F0FDF9', lineHeight: 1.05, letterSpacing: '-0.04em', marginBottom: 18, display: 'flex', flexDirection: 'column' }}>
      <span>The wrong location</span>
            <span>costs <span style={{ color: '#34D399' }}>$200,000+.</span></span>
     </div>

          {/* Sub */}
          <div style={{ fontSize: 19, color: 'rgba(204,235,229,0.6)', lineHeight: 1.6, maxWidth: 500, marginBottom: 32 }}>
      GO, CAUTION or NO verdict on any Australian address in ~90 seconds.
          </div>

          {/* Pills */}
          <div style={{ display: 'flex', gap: 10 }}>
      {[' Live competitor data', ' Financial model', ' Free to start'].map(p => (
       <div key={p} style={{
                background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 8, padding: '8px 16px',
        fontSize: 13, fontWeight: 600,
                color: 'rgba(204,235,229,0.7)',
        display: 'flex',
       }}>{p}</div>
            ))}
          </div>
        </div>

        {/* Right card */}
        <div style={{
          marginLeft: 60, flexShrink: 0,
          background: 'rgba(255,255,255,0.05)',
     border: '1px solid rgba(255,255,255,0.1)',
     borderRadius: 20, padding: '28px 32px', width: 280,
     display: 'flex', flexDirection: 'column',
    }}>
          <div style={{ fontSize: 11, color: 'rgba(204,235,229,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
      Sample report
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
      background: 'rgba(5,150,105,0.15)',
      border: '1.5px solid rgba(5,150,105,0.4)',
      borderRadius: 10, padding: '8px 16px', marginBottom: 16,
      width: 'fit-content',
     }}>
            <span style={{ fontSize: 18 }}></span>
            <span style={{ fontSize: 20, fontWeight: 900, color: '#34D399' }}>GO</span>
     </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
      <span style={{ fontSize: 52, fontWeight: 900, color: '#34D399', lineHeight: 1 }}>82</span>
      <span style={{ fontSize: 11, color: 'rgba(204,235,229,0.4)', marginTop: 4, letterSpacing: '0.06em' }}>/ 100 Feasibility Score</span>
     </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 14 }}/>

     {[
            ['Est. revenue', '$68k–$84k/mo'],
      ['Daily target', '35–50 cust/day'],
      ['Net profit/mo', '~$12k'],
     ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
       <span style={{ fontSize: 12, color: 'rgba(204,235,229,0.45)' }}>{label}</span>
       <span style={{ fontSize: 13, fontWeight: 700, color: '#F0FDF9' }}>{value}</span>
      </div>
          ))}

          <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginTop: 6, marginBottom: 12 }}/>

     {[['Demand', 85], ['Rent fit', 78], ['Competition', 72]].map(([label, val]) => (
      <div key={label as string} style={{ display: 'flex', flexDirection: 'column', marginBottom: 8 }}>
       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ fontSize: 11, color: 'rgba(204,235,229,0.4)' }}>{label}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#34D399' }}>{val}</span>
       </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 100, display: 'flex' }}>
        <div style={{ height: '100%', width: `${val}%`, background: '#34D399', borderRadius: 100, display: 'flex' }}/>
       </div>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
