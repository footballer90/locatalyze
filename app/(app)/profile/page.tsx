'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Logo } from '@/components/Logo'

const S = {
 font:        "'DM Sans','Helvetica Neue',Arial,sans-serif",
 brand:       '#0F766E',
 brandLight:  '#14B8A6',
 brandFaded:  '#F0FDFA',
 brandBorder: '#99F6E4',
 n50:  '#FAFAF9', n100: '#F5F5F4', n200: '#E7E5E4',
 n400: '#A8A29E', n500: '#78716C', n700: '#44403C',
 n800: '#292524', n900: '#1C1917', white: '#FFFFFF',
 emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0',
 amber: '#D97706', amberBg: '#FFFBEB', amberBdr: '#FDE68A',
 red: '#DC2626', redBg: '#FEF2F2', redBdr: '#FECACA',
 blue: '#2563EB', blueBg: '#EFF6FF', blueBdr: '#BFDBFE',
 sidebarBg: '#0C1F1C',
 sidebarBorder: 'rgba(255,255,255,0.07)',
 sidebarText: 'rgba(255,255,255,0.55)',
 sidebarActive: 'rgba(255,255,255,0.08)',
}

const FREE_LIMIT = 1

export default function ProfilePage() {
 const router = useRouter()
  const [user, setUser]         = useState<any>(null)
  const [reports, setReports]   = useState<any[]>([])
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [displayName, setDisplayName] = useState('')
 const [editingName, setEditingName] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
   setUser(user)
      setDisplayName(user.user_metadata?.display_name || user.email?.split('@')[0] || '')
   const { data: rpts } = await supabase
        .from('reports')
    .select('id, report_id, verdict, overall_score, business_type, location_name, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
   setReports(rpts || [])
      setLoading(false)
    }
    load()
  }, [router])

  async function saveName() {
    if (!user) return
    setSaving(true)
    const supabase = createClient()
    await supabase.auth.updateUser({ data: { display_name: displayName.trim() } })
    setSaving(false)
    setSaved(true)
    setEditingName(false)
    setTimeout(() => setSaved(false), 2500)
  }

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
 }

  // ── Stats ─────────────────────────────────────────────────────────────────
  const used      = reports.length
  const pct       = Math.min((used / FREE_LIMIT) * 100, 100)
  const goCount   = reports.filter(r => r.verdict === 'GO').length
 const avgScore  = reports.length ? Math.round(reports.reduce((a, r) => a + (r.overall_score || 0), 0) / reports.length) : null
  const bestScore = reports.length ? Math.max(...reports.map(r => r.overall_score || 0)) : null
  const quotaColor = pct >= 100 ? S.red : pct >= 80 ? S.amber : S.brand

  function verdictColor(v: string | null) {
    if (v === 'GO') return S.emerald
  if (v === 'CAUTION') return S.amber
  return S.red
  }

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 60) return `${m}m ago`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}h ago`
    return `${Math.floor(h / 24)}d ago`
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: S.n50, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: S.font }}>
   <div style={{ width: 28, height: 28, borderRadius: '50%', border: `3px solid ${S.n200}`, borderTopColor: S.brand, animation: 'spin 0.8s linear infinite' }} />
   <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: S.n50, fontFamily: S.font }}>
   <link rel="preconnect" href="https://fonts.googleapis.com" />
   <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap" />
   <style>{`*{box-sizing:border-box;margin:0;padding:0;} button{font-family:inherit;cursor:pointer;} @keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* ── Sidebar ── */}
      <aside style={{ width: 220, background: S.sidebarBg, display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
    {/* Logo */}
        <div style={{ padding: '20px 16px 12px' }}>
     <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Logo variant="dark" size="md" />
      <div>
              <p style={{ fontSize: 14, fontWeight: 800, color: S.white, letterSpacing: '-0.02em' }}>Locatalyze</p>
       <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>Location Intelligence</p>
      </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: '0 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
     {[
            { label: 'Dashboard',  icon: '', href: '/dashboard' },
      { label: 'New Analysis', icon: 'Add', href: '/onboarding' },
      { label: 'Profile',   icon: '', href: '/profile', active: true },
     ].map(item => (
            <a key={item.label} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
       borderRadius: 10, textDecoration: 'none',
       background: item.active ? S.sidebarActive : 'transparent',
      }}>
              <span style={{ fontSize: 15 }}>{item.icon}</span>
              <span style={{ fontSize: 13, fontWeight: item.active ? 700 : 600, color: item.active ? S.white : S.sidebarText }}>{item.label}</span>
            </a>
          ))}
        </nav>

        {/* User footer */}
        <div style={{ padding: '12px', borderTop: `1px solid ${S.sidebarBorder}` }}>
     <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.04)' }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', background: `linear-gradient(135deg,${S.brand},${S.brandLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.white, fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
       {user?.email?.[0]?.toUpperCase() || 'U'}
      </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: S.white, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName || user?.email?.split('@')[0]}</p>
       <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>Free plan</p>
      </div>
            <button onClick={signOut} title="Sign out" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', fontSize: 14, cursor: 'pointer', padding: '4px', borderRadius: 6 }}>↩</button>
     </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main style={{ flex: 1, padding: '32px', maxWidth: 900, animation: 'fadeIn 0.3s ease' }}>

    {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 4 }}>Your Profile</h1>
     <p style={{ fontSize: 13, color: S.n500 }}>Manage your account details and view your activity</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

     {/* ── Account details ── */}
          <div style={{ background: S.white, borderRadius: 20, border: `1px solid ${S.n200}`, padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', gridColumn: '1 / -1' }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: S.n400, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 18 }}>Account Details</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
       {/* Display name */}
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: S.n700, marginBottom: 8 }}>Display Name</p>
                {editingName ? (
                  <div style={{ display: 'flex', gap: 8 }}>
          <input
                      autoFocus
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setEditingName(false) }}
           style={{ flex: 1, border: `1.5px solid ${S.brand}`, borderRadius: 9, padding: '8px 12px', fontSize: 14, fontFamily: S.font, outline: 'none', color: S.n900 }}
          />
                    <button onClick={saveName} disabled={saving} style={{ background: S.brand, color: S.white, border: 'none', borderRadius: 9, padding: '8px 14px', fontSize: 13, fontWeight: 700, opacity: saving ? 0.7 : 1 }}>
           {saving ? '…' : 'Save'}
          </button>
                    <button onClick={() => setEditingName(false)} style={{ background: S.n100, color: S.n700, border: 'none', borderRadius: 9, padding: '8px 12px', fontSize: 13, fontWeight: 600 }}>X</button>
         </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, background: S.n50, borderRadius: 9, padding: '9px 12px', fontSize: 14, color: S.n900, border: `1px solid ${S.n200}` }}>
           {displayName || <span style={{ color: S.n400 }}>Not set</span>}
                    </div>
                    <button onClick={() => setEditingName(true)} style={{ background: S.n100, color: S.n700, border: 'none', borderRadius: 9, padding: '9px 12px', fontSize: 12, fontWeight: 600 }}>Edit</button>
         </div>
                )}
                {saved && <p style={{ fontSize: 11, color: S.emerald, marginTop: 6, fontWeight: 600 }}> Saved</p>}
              </div>

              {/* Email */}
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: S.n700, marginBottom: 8 }}>Email</p>
                <div style={{ background: S.n50, borderRadius: 9, padding: '9px 12px', fontSize: 14, color: S.n500, border: `1px solid ${S.n200}` }}>
         {user?.email}
                </div>
                <p style={{ fontSize: 11, color: S.n400, marginTop: 6 }}>Email cannot be changed here</p>
              </div>

              {/* Plan */}
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: S.n700, marginBottom: 8 }}>Current Plan</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
         <span style={{ background: S.brandFaded, color: S.brand, border: `1px solid ${S.brandBorder}`, borderRadius: 100, padding: '4px 12px', fontSize: 12, fontWeight: 700 }}>
          Free
                  </span>
                  <button onClick={() => router.push('/upgrade')} style={{ background: S.brand, color: S.white, border: 'none', borderRadius: 9, padding: '6px 14px', fontSize: 12, fontWeight: 700 }}>
          Upgrade →
                  </button>
                </div>
              </div>

              {/* Member since */}
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: S.n700, marginBottom: 8 }}>Member Since</p>
                <div style={{ background: S.n50, borderRadius: 9, padding: '9px 12px', fontSize: 14, color: S.n700, border: `1px solid ${S.n200}` }}>
         {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
        </div>
              </div>
            </div>
          </div>

          {/* ── Usage stats ── */}
          <div style={{ background: S.white, borderRadius: 20, border: `1px solid ${S.n200}`, padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: S.n400, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 18 }}>Usage This Month</p>

      {/* Quota bar */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: S.n700, fontWeight: 600 }}>Reports used</span>
                <span style={{ fontSize: 14, fontWeight: 900, color: quotaColor }}>{used} / {FREE_LIMIT}</span>
              </div>
              <div style={{ height: 8, background: S.n100, borderRadius: 100, overflow: 'hidden', marginBottom: 6 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: quotaColor, borderRadius: 100, transition: 'width 0.6s ease' }} />
       </div>
              <p style={{ fontSize: 11, color: S.n400 }}>
                {pct >= 100 ? 'Free report used — unlock full reports from $29' : `${FREE_LIMIT - used} free report remaining`}
       </p>
            </div>

            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
       {[
                { label: 'Total Reports', value: used,           color: S.n900 },
                { label: 'GO Verdicts',  value: goCount,        color: S.emerald },
                { label: 'Best Score',   value: bestScore ?? '—', color: S.brand },
        { label: 'Avg Score',   value: avgScore ?? '—', color: S.n700 },
              ].map(s => (
                <div key={s.label} style={{ background: S.n50, borderRadius: 12, padding: '12px 14px', border: `1px solid ${S.n200}` }}>
         <p style={{ fontSize: 10, color: S.n400, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</p>
         <p style={{ fontSize: 24, fontWeight: 900, color: s.color as string, lineHeight: 1 }}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Upgrade card ── */}
          <div style={{ background: `linear-gradient(135deg,${S.sidebarBg},#1a3530)`, borderRadius: 20, border: `1px solid rgba(255,255,255,0.08)`, padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>Pro Plan</p>
      <p style={{ fontSize: 22, fontWeight: 900, color: S.white, letterSpacing: '-0.03em', marginBottom: 6 }}>$19 <span style={{ fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.4)' }}>/ month</span></p>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 20, lineHeight: 1.6 }}>or $49 once-off lifetime</p>
      {[
              'Unlimited location reports',
       'Decision summary PDF export for every report',
       'Compare up to 5 locations',
       'Priority analysis speed',
       'Data export (CSV)',
      ].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ color: S.brandLight, fontSize: 13, flexShrink: 0 }}></span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>{f}</span>
       </div>
            ))}
            <button
              onClick={() => router.push('/upgrade')}
       style={{ width: '100%', marginTop: 16, background: S.brand, color: S.white, border: 'none', borderRadius: 12, padding: '12px', fontSize: 14, fontWeight: 700, boxShadow: '0 4px 16px rgba(15,118,110,0.4)' }}
      >
              Upgrade now →
            </button>
          </div>

          {/* ── Recent reports ── */}
          {reports.length > 0 && (
            <div style={{ background: S.white, borderRadius: 20, border: `1px solid ${S.n200}`, padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', gridColumn: '1 / -1' }}>
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: S.n400, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Recent Reports</p>
        <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', fontSize: 12, color: S.brand, fontWeight: 700, cursor: 'pointer' }}>View all →</button>
       </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {reports.slice(0, 5).map(r => (
                  <div
                    key={r.id}
                    onClick={() => router.push(`/dashboard/${r.report_id || r.id}?tab=decision`)}
                    style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: S.n50, borderRadius: 12, border: `1px solid ${S.n200}`, cursor: 'pointer', transition: 'border-color 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = S.brandBorder)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = S.n200)}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: `${verdictColor(r.verdict)}15`, border: `1px solid ${verdictColor(r.verdict)}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
           <span style={{ fontSize: 12, fontWeight: 900, color: verdictColor(r.verdict) }}>{r.overall_score ?? '—'}</span>
          </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: S.n900 }}>{r.business_type}</p>
                      <p style={{ fontSize: 11, color: S.n400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}> {r.location_name}</p>
          </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
           <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, color: verdictColor(r.verdict), background: `${verdictColor(r.verdict)}15`, borderRadius: 100, padding: '2px 8px', marginBottom: 2 }}>{r.verdict}</span>
           <p style={{ fontSize: 10, color: S.n400 }}>{timeAgo(r.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Danger zone ── */}
          <div style={{ background: S.white, borderRadius: 20, border: `1px solid ${S.redBdr}`, padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', gridColumn: '1 / -1' }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: S.red, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>Account Actions</p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
       <button
                onClick={signOut}
                style={{ background: S.n100, color: S.n700, border: `1px solid ${S.n200}`, borderRadius: 10, padding: '10px 18px', fontSize: 13, fontWeight: 600 }}
       >
                ↩ Sign out
              </button>
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  style={{ background: S.redBg, color: S.red, border: `1px solid ${S.redBdr}`, borderRadius: 10, padding: '10px 18px', fontSize: 13, fontWeight: 600 }}
        >
                  Delete Delete account
                </button>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: S.redBg, border: `1px solid ${S.redBdr}`, borderRadius: 10, padding: '10px 16px' }}>
         <p style={{ fontSize: 13, color: S.red, fontWeight: 600 }}>Are you sure? This cannot be undone.</p>
                  <button onClick={() => setShowDeleteConfirm(false)} style={{ background: S.white, border: `1px solid ${S.n200}`, color: S.n700, borderRadius: 8, padding: '5px 12px', fontSize: 12, fontWeight: 600 }}>Cancel</button>
         <button
                    onClick={async () => {
                      const supabase = createClient()
                      await supabase.auth.signOut()
                      router.push('/')
          }}
                    style={{ background: S.red, border: 'none', color: S.white, borderRadius: 8, padding: '5px 12px', fontSize: 12, fontWeight: 700 }}
         >
                    Yes, delete
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}