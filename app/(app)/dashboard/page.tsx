'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const S = {
  font: "'DM Sans','Helvetica Neue',Arial,sans-serif",
  brand: '#0F766E', brandLight: '#14B8A6',
  n50: '#FAFAF9', n100: '#F5F5F4', n200: '#E7E5E4',
  n400: '#A8A29E', n500: '#78716C', n700: '#44403C', n800: '#292524', n900: '#1C1917',
  white: '#FFFFFF',
  emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBorder: '#A7F3D0',
  amber: '#D97706', amberBg: '#FFFBEB', amberBorder: '#FDE68A',
  red: '#DC2626', redBg: '#FEF2F2', redBorder: '#FECACA',
}

const card = (extra = {}) => ({
  background: S.white, borderRadius: 18,
  border: `1px solid ${S.n200}`,
  boxShadow: '0 1px 3px rgba(0,0,0,0.04),0 4px 12px rgba(0,0,0,0.04)',
  overflow: 'hidden', ...extra,
})

function verdictStyle(v: string | null) {
  if (v === 'GO')      return { bg: S.emeraldBg, text: S.emerald,  border: S.emeraldBorder, dot: S.emerald  }
  if (v === 'CAUTION') return { bg: S.amberBg,   text: S.amber,    border: S.amberBorder,   dot: S.amber    }
  return                      { bg: S.redBg,     text: S.red,      border: S.redBorder,     dot: S.red      }
}

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

interface Report {
  id: string
  report_id: string | null
  verdict: string | null
  overall_score: number | null
  location_name: string | null
  business_type: string | null
  monthly_rent: number | null
  created_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('there')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      setUserName(user.email?.split('@')[0] || 'there')
      const { data } = await supabase
        .from('reports')
        .select('id,report_id,verdict,overall_score,location_name,business_type,monthly_rent,created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (data) setReports(data as Report[])
      setLoading(false)
    }
    load()
  }, [router])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: S.n50, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: S.font }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 36, height: 36, border: `3px solid ${S.n100}`, borderTopColor: S.brand, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
        <p style={{ fontSize: 13, color: S.n400 }}>Loading your reports...</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  const goCount = reports.filter(r => r.verdict === 'GO').length
  const cautionCount = reports.filter(r => r.verdict === 'CAUTION').length
  const noCount = reports.filter(r => r.verdict === 'NO').length

  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: S.font }}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0;} @keyframes spin{to{transform:rotate(360deg)}} a{text-decoration:none;color:inherit;} button{font-family:inherit;cursor:pointer;}`}</style>

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(16px)', borderBottom: `1px solid ${S.n100}`, padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: `linear-gradient(135deg, ${S.brand}, ${S.brandLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.white, fontWeight: 800, fontSize: 14 }}>L</div>
          <span style={{ fontWeight: 800, fontSize: 16, color: S.n900, letterSpacing: '-0.02em' }}>Locatalyze</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, color: S.n400, background: S.n100, border: `1px solid ${S.n200}`, borderRadius: 100, padding: '3px 10px', fontWeight: 600 }}>FREE</span>
          <Link href="/onboarding" style={{ fontSize: 13, background: S.brand, color: S.white, borderRadius: 9, padding: '7px 16px', fontWeight: 700 }}>+ New Analysis</Link>
          <button onClick={handleSignOut} style={{ fontSize: 12, color: S.n400, background: 'none', border: 'none' }}>Sign out</button>
        </div>
      </nav>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 20px 80px' }}>

        {/* Welcome card */}
        <div style={{ background: `linear-gradient(135deg, ${S.brand} 0%, #0891B2 100%)`, borderRadius: 22, padding: '26px 28px', marginBottom: 18, position: 'relative', overflow: 'hidden', boxShadow: '0 8px 32px rgba(15,118,110,0.2)' }}>
          <div style={{ position: 'absolute', top: -30, right: -20, width: 100, height: 100, background: 'rgba(255,255,255,0.07)', borderRadius: '50%' }} />
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 4 }}>Welcome back, {userName} 👋</p>
          <h1 style={{ color: S.white, fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 18 }}>Ready to analyse your next location?</h1>
          <Link href="/onboarding" style={{ display: 'inline-block', background: S.white, color: S.brand, borderRadius: 10, padding: '9px 20px', fontWeight: 700, fontSize: 13 }}>New Analysis →</Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'Total', value: reports.length, color: S.n800 },
            { label: 'GO', value: goCount, color: S.emerald },
            { label: 'CAUTION', value: cautionCount, color: S.amber },
            { label: 'NO', value: noCount, color: S.red },
          ].map(s => (
            <div key={s.label} style={card({ padding: '16px 14px' })}>
              <p style={{ fontSize: 26, fontWeight: 900, color: s.color, letterSpacing: '-0.03em' }}>{s.value}</p>
              <p style={{ fontSize: 11, color: S.n400, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginTop: 3 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Reports */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <h2 style={{ fontSize: 12, fontWeight: 700, color: S.n500, textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>Active Reports</h2>
          <span style={{ fontSize: 11, color: S.n400 }}>{reports.length} location{reports.length !== 1 ? 's' : ''}</span>
        </div>

        {reports.length === 0 ? (
          <div style={card({ padding: '48px 24px', textAlign: 'center' })}>
            <div style={{ fontSize: 36, marginBottom: 14 }}>📍</div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: S.n900, marginBottom: 8, letterSpacing: '-0.02em' }}>No analyses yet</h3>
            <p style={{ fontSize: 13, color: S.n400, marginBottom: 20, lineHeight: 1.6 }}>Run your first location analysis to find out if a site will make you money before you sign the lease.</p>
            <Link href="/onboarding" style={{ display: 'inline-block', background: S.brand, color: S.white, borderRadius: 12, padding: '12px 24px', fontWeight: 700, fontSize: 14 }}>Analyse your first location →</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {reports.map(r => {
              const vs = verdictStyle(r.verdict)
              return (
                <div key={r.id} onClick={() => router.push(`/dashboard/${r.report_id || r.id}`)}
                  style={card({ padding: '16px 20px', cursor: 'pointer' })}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: S.n900, letterSpacing: '-0.01em' }}>{r.business_type || 'Report'}</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: vs.bg, color: vs.text, border: `1.5px solid ${vs.border}`, borderRadius: 100, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: vs.dot }} />
                          {r.verdict || '—'}
                        </span>
                      </div>
                      <p style={{ fontSize: 12, color: S.n400 }}>📍 {r.location_name || '—'}</p>
                    </div>
                    <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexShrink: 0 }}>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: 20, fontWeight: 900, color: vs.text, letterSpacing: '-0.02em', lineHeight: 1 }}>{r.overall_score ?? '—'}</p>
                        <p style={{ fontSize: 10, color: S.n400, textTransform: 'uppercase' as const, letterSpacing: '0.05em', fontWeight: 600 }}>Score</p>
                      </div>
                      {r.monthly_rent && (
                        <div style={{ textAlign: 'center' }}>
                          <p style={{ fontSize: 13, fontWeight: 700, color: S.n700 }}>${r.monthly_rent.toLocaleString()}</p>
                          <p style={{ fontSize: 10, color: S.n400, textTransform: 'uppercase' as const, letterSpacing: '0.05em', fontWeight: 600 }}>Rent/mo</p>
                        </div>
                      )}
                      <p style={{ fontSize: 11, color: S.n400 }}>{timeAgo(r.created_at)}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}