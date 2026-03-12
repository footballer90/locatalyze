'use client'
import { useState, useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

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
  amber: '#D97706', amberBg: '#FFFBEB',
  red: '#DC2626', redBg: '#FEF2F2',
  sidebarBg: '#0C1F1C',
}

const BUSINESS_TYPES = [
  { id: 'cafe',        label: 'Cafe',         icon: '☕', avgTicket: 9,   shopSize: 75,  setupMid: 140000, baseCustomers: 85, color: '#92400E' },
  { id: 'restaurant',  label: 'Restaurant',   icon: '🍽', avgTicket: 28,  shopSize: 120, setupMid: 260000, baseCustomers: 55, color: '#7C2D12' },
  { id: 'bakery',      label: 'Bakery',        icon: '🥐', avgTicket: 7,   shopSize: 65,  setupMid: 95000,  baseCustomers: 90, color: '#78350F' },
  { id: 'gym',         label: 'Gym / Fitness', icon: '🏋', avgTicket: 65,  shopSize: 250, setupMid: 200000, baseCustomers: 40, color: '#166534' },
  { id: 'salon',       label: 'Hair Salon',    icon: '💇', avgTicket: 55,  shopSize: 60,  setupMid: 70000,  baseCustomers: 18, color: '#7C3AED' },
  { id: 'retail',      label: 'Retail Store',  icon: '🛍', avgTicket: 45,  shopSize: 150, setupMid: 130000, baseCustomers: 45, color: '#1D4ED8' },
  { id: 'bar',         label: 'Bar / Pub',     icon: '🍺', avgTicket: 18,  shopSize: 180, setupMid: 280000, baseCustomers: 60, color: '#1E3A5F' },
  { id: 'takeaway',    label: 'Takeaway',      icon: '🥡', avgTicket: 14,  shopSize: 50,  setupMid: 80000,  baseCustomers: 70, color: '#B45309' },
  { id: 'pharmacy',    label: 'Pharmacy',      icon: '💊', avgTicket: 35,  shopSize: 120, setupMid: 250000, baseCustomers: 30, color: '#0369A1' },
  { id: 'other',       label: 'Other',         icon: '📦', avgTicket: 20,  shopSize: 100, setupMid: 120000, baseCustomers: 40, color: '#374151' },
]

const BUDGET_RANGES = [
  { label: 'Under $50k',    value: 35000 },
  { label: '$50k – $100k',  value: 75000 },
  { label: '$100k – $200k', value: 150000 },
  { label: '$200k – $350k', value: 275000 },
  { label: '$350k+',        value: 400000 },
]

const SUBURB_RENT: Record<string, number> = {
  'sydney cbd': 120, 'city': 120, 'cbd': 100,
  'newtown': 75, 'surry hills': 95, 'paddington': 100,
  'balmain': 85, 'glebe': 72, 'pyrmont': 90,
  'darlinghurst': 88, 'redfern': 65, 'leichhardt': 72,
  'bondi': 90, 'manly': 95, 'mosman': 100, 'chatswood': 85,
  'parramatta': 60, 'penrith': 45, 'bankstown': 48, 'blacktown': 48,
  'melbourne cbd': 110, 'southbank': 95, 'fitzroy': 72, 'richmond': 85,
  'south yarra': 100, 'collingwood': 70, 'brunswick': 65, 'st kilda': 72,
  'toorak': 110, 'hawthorn': 90, 'camberwell': 85,
  'brisbane city': 95, 'west end': 68, 'new farm': 88, 'fortitude valley': 72,
  'perth cbd': 88, 'subiaco': 90, 'fremantle': 72, 'northbridge': 70,
  'adelaide cbd': 75, 'norwood': 70, 'glenelg': 65,
}
const STATE_RENT: Record<string, number> = {
  NSW: 72, VIC: 68, QLD: 65, WA: 65, SA: 58, ACT: 75, TAS: 52, NT: 60,
}

function estimateRent(address: string, shopSize: number): number {
  const lower = address.toLowerCase()
  for (const [suburb, rate] of Object.entries(SUBURB_RENT)) {
    if (lower.includes(suburb)) return Math.round(rate * shopSize)
  }
  const stateMatch = address.match(/\b(NSW|VIC|QLD|WA|SA|ACT|TAS|NT)\b/i)
  const stateRate = stateMatch ? (STATE_RENT[stateMatch[1].toUpperCase()] || 65) : 65
  return Math.round(stateRate * shopSize)
}

function extractSuburbLabel(address: string): string {
  const parts = address.split(',').map(s => s.trim())
  if (parts.length >= 2) return parts[parts.length - 2].replace(/\b(NSW|VIC|QLD|WA|SA|ACT|TAS|NT)\b/i, '').replace(/\d+/, '').trim()
  return address.split(' ').slice(-2).join(' ')
}

function confidenceScore(state: FormState): number {
  let score = 30
  if (state.businessType) score += 15
  if (state.address.length > 8) score += 20
  if (state.hasProperty && state.monthlyRent) score += 20
  if (!state.hasProperty) score += 10
  if (state.budgetRange !== null) score += 10
  if (state.adv.parking) score += 3
  if (state.adv.roadType) score += 3
  if (state.adv.anchors.length > 0) score += 4
  if (state.adv.ticketSize) score += 5
  return Math.min(score, 96)
}

interface FormState {
  businessType: string | null
  address: string
  hasProperty: boolean | null
  monthlyRent: string
  budgetRange: number | null
  adv: {
    ticketSize: string
    shopSize: string
    staffCount: string
    openDays: string
    parking: string
    roadType: string
    anchors: string[]
    incentiveMonths: string
  }
}

const ANCHOR_OPTIONS = ['Bunnings', 'Coles', 'Woolworths', 'ALDI', 'Harvey Norman', 'Kmart', "McDonald's", 'KFC', 'Chemist Warehouse', 'Officeworks', 'BCF / Anaconda', 'Dan Murphys']

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [geocoding, setGeocoding] = useState(false)
  const geocodeTimer = useRef<NodeJS.Timeout | null>(null)

  const [form, setForm] = useState<FormState>({
    businessType: null,
    address: '',
    hasProperty: null,
    monthlyRent: '',
    budgetRange: null,
    adv: { ticketSize: '', shopSize: '', staffCount: '', openDays: '6', parking: '', roadType: '', anchors: [], incentiveMonths: '' },
  })

  const selectedBiz = BUSINESS_TYPES.find(b => b.id === form.businessType)

  const estimates = useMemo(() => {
    const biz = selectedBiz || BUSINESS_TYPES[0]
    const shopSize = form.adv.shopSize ? parseInt(form.adv.shopSize) : biz.shopSize
    const estRent = form.hasProperty && form.monthlyRent
      ? parseInt(form.monthlyRent.replace(/[^0-9]/g, ''))
      : estimateRent(form.address, shopSize)
    const ticketSize = form.adv.ticketSize ? parseFloat(form.adv.ticketSize) : biz.avgTicket
    const customers = biz.baseCustomers
    const monthlyRevenue = Math.round(customers * ticketSize * 26)
    const netProfit = Math.round(monthlyRevenue * 0.62 - estRent * 1.45)
    const setupCost = form.budgetRange || biz.setupMid
    const payback = netProfit > 0 ? Math.ceil(setupCost / netProfit) : 99
    return { estRent, ticketSize, customers, monthlyRevenue, netProfit, payback, shopSize }
  }, [form, selectedBiz])

  const confidence = useMemo(() => confidenceScore(form), [form])

  useEffect(() => {
    if (form.address.length < 8) { setCoords(null); return }
    if (geocodeTimer.current) clearTimeout(geocodeTimer.current)
    geocodeTimer.current = setTimeout(async () => {
      setGeocoding(true)
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(form.address)}&format=json&limit=1&addressdetails=1&countrycodes=au`
        const res = await fetch(url, { headers: { 'User-Agent': 'Locatalyze/1.0' } })
        const data = await res.json()
        if (data?.[0]) setCoords({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) })
      } catch { /* silent */ } finally { setGeocoding(false) }
    }, 900)
    return () => { if (geocodeTimer.current) clearTimeout(geocodeTimer.current) }
  }, [form.address])

  const mapHtml = coords ? `<!DOCTYPE html><html><head>
    <meta charset="utf-8"/>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>html,body,#map{margin:0;padding:0;width:100%;height:100%;}</style>
  </head><body><div id="map"></div><script>
    var map = L.map('map',{zoomControl:true,scrollWheelZoom:false}).setView([${coords.lat},${coords.lng}],15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap',maxZoom:19}).addTo(map);
    var icon = L.divIcon({html:'<div style="width:16px;height:16px;background:#0F766E;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.35)"></div>',iconSize:[16,16],iconAnchor:[8,8],className:''});
    L.marker([${coords.lat},${coords.lng}],{icon:icon}).addTo(map);
    L.circle([${coords.lat},${coords.lng}],{radius:500,color:'#0F766E',fillColor:'#0F766E',fillOpacity:0.06,weight:1.5,dashArray:'6,4'}).addTo(map);
  </script></body></html>` : null

  const canProceed = useMemo(() => {
    if (step === 1) return !!form.businessType
    if (step === 2) return form.address.trim().length > 6
    if (step === 3) {
      if (form.hasProperty === null) return false
      if (form.hasProperty && !form.monthlyRent) return false
      if (form.budgetRange === null) return false
      return true
    }
    return false
  }, [step, form])

  function setField(key: keyof FormState, value: any) { setForm(f => ({ ...f, [key]: value })) }
  function setAdv(key: keyof FormState['adv'], value: any) { setForm(f => ({ ...f, adv: { ...f.adv, [key]: value } })) }
  function toggleAnchor(anchor: string) {
    setForm(f => ({ ...f, adv: { ...f.adv, anchors: f.adv.anchors.includes(anchor) ? f.adv.anchors.filter(a => a !== anchor) : [...f.adv.anchors, anchor] } }))
  }

  async function handleSubmit() {
    setSubmitting(true)
    setError('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const biz = selectedBiz!
    const shopSize = form.adv.shopSize ? parseInt(form.adv.shopSize) : biz.shopSize
    const monthlyRent = form.hasProperty && form.monthlyRent
      ? parseInt(form.monthlyRent.replace(/[^0-9]/g, ''))
      : estimates.estRent
    const avgTicketSize = form.adv.ticketSize ? parseFloat(form.adv.ticketSize) : biz.avgTicket
    const setupBudget = form.budgetRange || biz.setupMid

    const locationContext = {
      parking: form.adv.parking || null,
      roadType: form.adv.roadType || null,
      nearbyAnchors: form.adv.anchors,
      staffCount: form.adv.staffCount ? parseInt(form.adv.staffCount) : null,
      openDaysPerWeek: parseInt(form.adv.openDays) || 6,
      incentiveMonths: form.adv.incentiveMonths ? parseInt(form.adv.incentiveMonths) : 0,
      isExploring: !form.hasProperty,
      rentSource: form.hasProperty ? 'user_provided' : 'estimated',
    }

    try {
      const res = await fetch('/api/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': user.id },
        body: JSON.stringify({ businessType: biz.label, address: form.address.trim(), monthlyRent, setupBudget, avgTicketSize, userId: user.id, locationContext }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) { setError(data?.error?.message || 'Analysis failed. Please try again.'); setSubmitting(false); return }
      const reportId = data.report?.report_id || data.reportId || data.report?.reportId
      if (reportId) {
        await supabase.from('reports').update({ user_id: user.id, business_type: biz.label, address: form.address.trim(), monthly_rent: monthlyRent }).eq('report_id', reportId)
        router.push(`/dashboard/${reportId}`)
      } else { router.push('/dashboard') }
    } catch {
      setError('Network error. Please check your connection and try again.')
      setSubmitting(false)
    }
  }

  const fmt = (n: number) => '$' + n.toLocaleString('en-AU', { maximumFractionDigits: 0 })

  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: S.font, display: 'flex', flexDirection: 'column' }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        .biz-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.08) !important; }
        .biz-card { transition: all 0.15s ease !important; }
        .btn-primary:hover:not(:disabled) { background: #0D6B63 !important; transform: translateY(-1px); }
        .btn-primary { transition: all 0.15s ease !important; }
        input:focus { outline: none; border-color: #0F766E !important; box-shadow: 0 0 0 3px rgba(15,118,110,0.1) !important; }
      `}</style>

      {/* Nav */}
      <nav style={{ background: S.white, borderBottom: `1px solid ${S.n100}`, padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <button onClick={() => router.push('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', fontFamily: S.font }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg,${S.brand},${S.brandLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.white, fontWeight: 900, fontSize: 13 }}>L</div>
          <span style={{ fontWeight: 800, fontSize: 14, color: S.n900, letterSpacing: '-0.02em' }}>Locatalyze</span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {['Business', 'Location', 'Details'].map((label, i) => {
            const n = i + 1; const active = step === n; const done = step > n
            return (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, background: done ? S.emeraldBg : active ? S.brandFaded : S.n100, border: `1px solid ${done ? S.emeraldBdr : active ? S.brandBorder : S.n200}` }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: done ? S.emerald : active ? S.brand : S.n400, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: S.white, fontWeight: 800 }}>{done ? '✓' : n}</div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: done ? S.emerald : active ? S.brand : S.n500 }}>{label}</span>
                </div>
                {i < 2 && <div style={{ width: 16, height: 1, background: S.n200 }} />}
              </div>
            )
          })}
        </div>
        <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', fontSize: 12, color: S.n400, cursor: 'pointer', fontFamily: S.font }}>← Dashboard</button>
      </nav>

      {/* Main layout */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* LEFT: Form */}
        <div style={{ flex: '0 0 520px', overflowY: 'auto', padding: '36px 40px 60px', borderRight: `1px solid ${S.n100}` }}>

          {/* STEP 1 */}
          {step === 1 && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: S.brandFaded, border: `1px solid ${S.brandBorder}`, borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, color: S.brand, marginBottom: 14 }}>Step 1 of 3</div>
                <h1 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.04em', lineHeight: 1.2, marginBottom: 6 }}>What business are you planning?</h1>
                <p style={{ fontSize: 14, color: S.n500, lineHeight: 1.65 }}>This sets your financial model defaults — you can adjust everything later.</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {BUSINESS_TYPES.map(biz => {
                  const selected = form.businessType === biz.id
                  return (
                    <button key={biz.id} className="biz-card"
                      onClick={() => { setField('businessType', biz.id); setTimeout(() => setStep(2), 180) }}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: selected ? S.brandFaded : S.white, border: `2px solid ${selected ? S.brand : S.n200}`, borderRadius: 14, cursor: 'pointer', fontFamily: S.font, textAlign: 'left', boxShadow: selected ? `0 0 0 3px rgba(15,118,110,0.12)` : '0 1px 3px rgba(0,0,0,0.04)' }}
                    >
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: selected ? S.brandFaded : S.n50, border: `1px solid ${selected ? S.brandBorder : S.n100}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{biz.icon}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: selected ? S.brand : S.n800 }}>{biz.label}</div>
                        <div style={{ fontSize: 11, color: S.n400, marginTop: 1 }}>avg {fmt(biz.avgTicket)} ticket</div>
                      </div>
                      {selected && <div style={{ marginLeft: 'auto', width: 18, height: 18, borderRadius: '50%', background: S.brand, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.white, fontSize: 10, fontWeight: 900, flexShrink: 0 }}>✓</div>}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <button onClick={() => setStep(1)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', color: S.n400, fontSize: 12, cursor: 'pointer', fontFamily: S.font, marginBottom: 24 }}>← Back</button>
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: S.brandFaded, border: `1px solid ${S.brandBorder}`, borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, color: S.brand, marginBottom: 14 }}>{selectedBiz?.icon} {selectedBiz?.label} — Step 2 of 3</div>
                <h1 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.04em', lineHeight: 1.2, marginBottom: 6 }}>Where is the location?</h1>
                <p style={{ fontSize: 14, color: S.n500, lineHeight: 1.65 }}>Enter the full address. We'll geocode it and pull real competitor data for your area.</p>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: S.n700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Address</label>
                <div style={{ position: 'relative' }}>
                  <input autoFocus value={form.address} onChange={e => setField('address', e.target.value)}
                    placeholder="45 King St, Newtown NSW 2042"
                    style={{ width: '100%', padding: '14px 44px 14px 16px', border: `1.5px solid ${form.address.length > 6 && coords ? S.brandBorder : S.n200}`, borderRadius: 12, fontSize: 15, color: S.n900, background: S.white, fontFamily: S.font }}
                  />
                  <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 14 }}>
                    {geocoding ? <span style={{ color: S.n400 }}>⟳</span> : coords ? <span style={{ color: S.emerald }}>📍</span> : <span style={{ color: S.n400 }}>📍</span>}
                  </div>
                </div>
                {coords && <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6, fontSize: 12, color: S.emerald, fontWeight: 500 }}>✓ Location confirmed — {extractSuburbLabel(form.address)}</div>}
              </div>
              <div style={{ background: S.n50, border: `1px solid ${S.n100}`, borderRadius: 12, padding: '14px 16px', marginBottom: 24 }}>
                <p style={{ fontSize: 12, color: S.n500, lineHeight: 1.6 }}>💡 <strong style={{ color: S.n700 }}>Tip:</strong> Include the full suburb and state. e.g. "123 Main St, Fitzroy VIC"</p>
              </div>
              <button className="btn-primary" onClick={() => setStep(3)} disabled={!canProceed}
                style={{ width: '100%', padding: '15px', background: canProceed ? S.brand : S.n200, color: canProceed ? S.white : S.n400, border: 'none', borderRadius: 13, fontSize: 15, fontWeight: 800, cursor: canProceed ? 'pointer' : 'not-allowed', fontFamily: S.font }}>
                Continue →
              </button>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <button onClick={() => setStep(2)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', color: S.n400, fontSize: 12, cursor: 'pointer', fontFamily: S.font, marginBottom: 24 }}>← Back</button>
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: S.brandFaded, border: `1px solid ${S.brandBorder}`, borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, color: S.brand, marginBottom: 14 }}>{selectedBiz?.icon} {selectedBiz?.label} — Step 3 of 3</div>
                <h1 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.04em', lineHeight: 1.2, marginBottom: 6 }}>A few quick details</h1>
              </div>

              {/* Do you have a property? */}
              <div style={{ marginBottom: 22 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: S.n700, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Do you have a specific space in mind?</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[
                    { val: false, label: 'Just exploring', sub: "I'll explore options", icon: '🔍' },
                    { val: true,  label: 'Yes, I have one', sub: 'I have a space / lease offer', icon: '🏠' },
                  ].map(opt => (
                    <button key={String(opt.val)} onClick={() => setField('hasProperty', opt.val)}
                      style={{ padding: '14px', background: form.hasProperty === opt.val ? S.brandFaded : S.white, border: `2px solid ${form.hasProperty === opt.val ? S.brand : S.n200}`, borderRadius: 13, cursor: 'pointer', fontFamily: S.font, textAlign: 'left', transition: 'all 0.15s' }}>
                      <div style={{ fontSize: 22, marginBottom: 6 }}>{opt.icon}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: form.hasProperty === opt.val ? S.brand : S.n800 }}>{opt.label}</div>
                      <div style={{ fontSize: 11, color: S.n400, marginTop: 2 }}>{opt.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {form.hasProperty === true && (
                <div style={{ marginBottom: 22 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: S.n700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Monthly rent (from your lease)</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: S.n400, fontWeight: 600 }}>$</span>
                    <input value={form.monthlyRent} onChange={e => setField('monthlyRent', e.target.value)}
                      placeholder={`${fmt(estimates.estRent)} estimated`}
                      style={{ width: '100%', padding: '14px 14px 14px 26px', border: `1.5px solid ${form.monthlyRent ? S.brandBorder : S.n200}`, borderRadius: 12, fontSize: 15, color: S.n900, background: S.white, fontFamily: S.font }} />
                  </div>
                </div>
              )}

              {form.hasProperty === false && (
                <div style={{ marginBottom: 22, background: S.brandFaded, border: `1px solid ${S.brandBorder}`, borderRadius: 12, padding: '12px 16px' }}>
                  <p style={{ fontSize: 13, color: S.brand, fontWeight: 600 }}>📊 We'll estimate rent at {fmt(estimates.estRent)}/month based on {extractSuburbLabel(form.address) || 'your area'} averages.</p>
                </div>
              )}

              {/* Budget */}
              <div style={{ marginBottom: 28 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: S.n700, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total investment budget</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {BUDGET_RANGES.map(b => (
                    <button key={b.label} onClick={() => setField('budgetRange', b.value)}
                      style={{ padding: '9px 16px', background: form.budgetRange === b.value ? S.brand : S.white, color: form.budgetRange === b.value ? S.white : S.n700, border: `1.5px solid ${form.budgetRange === b.value ? S.brand : S.n200}`, borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: S.font }}>
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced */}
              <div style={{ border: `1px solid ${S.n200}`, borderRadius: 14, overflow: 'hidden', marginBottom: 24 }}>
                <button onClick={() => setShowAdvanced(!showAdvanced)}
                  style={{ width: '100%', padding: '14px 18px', background: showAdvanced ? S.n50 : S.white, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontFamily: S.font }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14 }}>⚙️</span>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: S.n800 }}>Refine your analysis <span style={{ color: S.n400, fontWeight: 500 }}>(optional)</span></div>
                      <div style={{ fontSize: 11, color: S.n500 }}>More detail = higher confidence score</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ fontSize: 11, color: S.brand, fontWeight: 700, background: S.brandFaded, padding: '2px 8px', borderRadius: 10, border: `1px solid ${S.brandBorder}` }}>{confidence}% confidence</div>
                    <span style={{ color: S.n400, fontSize: 14, display: 'inline-block', transform: showAdvanced ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
                  </div>
                </button>
                {showAdvanced && (
                  <div style={{ padding: '16px 18px 18px', background: S.n50, borderTop: `1px solid ${S.n100}` }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                      {[
                        { label: 'Avg order value ($)', key: 'ticketSize', placeholder: `$${selectedBiz?.avgTicket || 9}` },
                        { label: 'Shop size (m²)', key: 'shopSize', placeholder: `${selectedBiz?.shopSize || 100}m²` },
                        { label: 'Staff planned', key: 'staffCount', placeholder: 'e.g. 3' },
                        { label: 'Rent-free months', key: 'incentiveMonths', placeholder: '0' },
                      ].map(f => (
                        <div key={f.key}>
                          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: S.n700, marginBottom: 5 }}>{f.label}</label>
                          <input value={(form.adv as any)[f.key]} onChange={e => setAdv(f.key as any, e.target.value)} placeholder={f.placeholder}
                            style={{ width: '100%', padding: '9px 12px', border: `1px solid ${S.n200}`, borderRadius: 9, fontSize: 13, color: S.n900, background: S.white, fontFamily: S.font }} />
                        </div>
                      ))}
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: S.n700, marginBottom: 6 }}>Car parking</label>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {['Dedicated car park', 'Street parking only', 'Shared car park', 'No parking'].map(p => (
                          <button key={p} onClick={() => setAdv('parking', form.adv.parking === p ? '' : p)}
                            style={{ padding: '6px 12px', background: form.adv.parking === p ? S.brand : S.white, color: form.adv.parking === p ? S.white : S.n700, border: `1px solid ${form.adv.parking === p ? S.brand : S.n200}`, borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: S.font }}>
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: S.n700, marginBottom: 6 }}>Road visibility</label>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {['Corner / Main road', 'Main road', 'Side street', 'Shopping centre', 'Industrial area'].map(r => (
                          <button key={r} onClick={() => setAdv('roadType', form.adv.roadType === r ? '' : r)}
                            style={{ padding: '6px 12px', background: form.adv.roadType === r ? S.brand : S.white, color: form.adv.roadType === r ? S.white : S.n700, border: `1px solid ${form.adv.roadType === r ? S.brand : S.n200}`, borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: S.font }}>
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: S.n700, marginBottom: 6 }}>Nearby anchor tenants (within 500m)</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {ANCHOR_OPTIONS.map(a => (
                          <button key={a} onClick={() => toggleAnchor(a)}
                            style={{ padding: '5px 11px', background: form.adv.anchors.includes(a) ? S.brandFaded : S.white, color: form.adv.anchors.includes(a) ? S.brand : S.n700, border: `1px solid ${form.adv.anchors.includes(a) ? S.brand : S.n200}`, borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: S.font }}>
                            {form.adv.anchors.includes(a) ? '✓ ' : ''}{a}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {error && <div style={{ background: S.redBg, border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: S.red }}>{error}</div>}

              <button className="btn-primary" onClick={handleSubmit} disabled={!canProceed || submitting}
                style={{ width: '100%', padding: '16px', background: canProceed && !submitting ? S.brand : S.n200, color: canProceed && !submitting ? S.white : S.n400, border: 'none', borderRadius: 13, fontSize: 15, fontWeight: 800, cursor: canProceed && !submitting ? 'pointer' : 'not-allowed', fontFamily: S.font, boxShadow: canProceed && !submitting ? '0 4px 20px rgba(15,118,110,0.25)' : 'none' }}>
                {submitting ? '⏳ Analysing location…' : '🔍 Run analysis'}
              </button>
              <p style={{ fontSize: 11, color: S.n400, textAlign: 'center', marginTop: 10 }}>Takes 20–40 seconds · Full financial model + GO/CAUTION/NO verdict</p>
            </div>
          )}
        </div>

        {/* RIGHT: Map + estimates */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: S.white }}>
          <div style={{ flex: '0 0 55%', position: 'relative', background: S.n100, overflow: 'hidden' }}>
            {mapHtml ? (
              <iframe srcDoc={mapHtml} title="Location map" style={{ width: '100%', height: '100%', border: 'none' }} sandbox="allow-scripts" />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, ${S.brandFaded} 0%, ${S.n100} 100%)` }}>
                <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.4 }}>🗺</div>
                <p style={{ fontSize: 13, color: S.n500, fontWeight: 500 }}>{form.address.length > 6 ? 'Locating address…' : 'Enter an address to see the map'}</p>
              </div>
            )}
            {coords && (
              <div style={{ position: 'absolute', top: 12, left: 12, background: S.white, borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 700, color: S.n800, boxShadow: '0 2px 12px rgba(0,0,0,0.12)', border: `1px solid ${S.n100}` }}>
                📍 {extractSuburbLabel(form.address)}
              </div>
            )}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', borderTop: `1px solid ${S.n100}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: S.n700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Live estimates</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{ width: 80, height: 6, borderRadius: 3, background: S.n100, overflow: 'hidden' }}>
                  <div style={{ width: `${confidence}%`, height: '100%', background: confidence >= 80 ? S.emerald : confidence >= 60 ? S.brandLight : S.amber, borderRadius: 3, transition: 'width 0.4s ease' }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: confidence >= 80 ? S.emerald : confidence >= 60 ? S.brand : S.amber }}>{confidence}%</span>
              </div>
            </div>
            {!form.businessType ? (
              <p style={{ fontSize: 13, color: S.n400 }}>Select a business type to see estimates.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { label: 'Est. monthly rent', value: fmt(estimates.estRent), note: form.hasProperty && form.monthlyRent ? 'your input' : 'estimated', color: estimates.estRent / estimates.monthlyRevenue > 0.2 ? S.red : estimates.estRent / estimates.monthlyRevenue > 0.12 ? S.amber : S.emerald },
                  { label: 'Avg ticket size', value: fmt(estimates.ticketSize), note: form.adv.ticketSize ? 'your input' : 'estimated', color: S.n700 },
                  { label: 'Est. monthly revenue', value: fmt(estimates.monthlyRevenue), note: `~${estimates.customers} customers/day`, color: S.n700 },
                  { label: 'Est. monthly profit', value: fmt(estimates.netProfit), note: estimates.netProfit > 0 ? 'after all costs' : '⚠️ negative', color: estimates.netProfit > 2000 ? S.emerald : estimates.netProfit > 0 ? S.amber : S.red },
                  { label: 'Rent / revenue', value: `${((estimates.estRent / estimates.monthlyRevenue) * 100).toFixed(1)}%`, note: estimates.estRent / estimates.monthlyRevenue <= 0.12 ? '✓ healthy' : '⚠️ above 12%', color: estimates.estRent / estimates.monthlyRevenue > 0.2 ? S.red : S.amber },
                  { label: 'Est. payback', value: estimates.payback < 99 ? `${estimates.payback} mo` : 'n/a', note: estimates.payback <= 18 ? 'fast' : 'moderate', color: estimates.payback <= 18 ? S.emerald : S.amber },
                ].map(item => (
                  <div key={item.label} style={{ background: S.n50, border: `1px solid ${S.n100}`, borderRadius: 10, padding: '10px 12px' }}>
                    <div style={{ fontSize: 10, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{item.label}</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: item.color, letterSpacing: '-0.02em' }}>{item.value}</div>
                    <div style={{ fontSize: 10, color: S.n400, marginTop: 2 }}>{item.note}</div>
                  </div>
                ))}
              </div>
            )}
            <div style={{ marginTop: 14, padding: '10px 12px', background: S.amberBg, border: '1px solid #FDE68A', borderRadius: 10 }}>
              <p style={{ fontSize: 11, color: '#92400E', lineHeight: 1.55 }}>
                <strong>These are estimates</strong> — your actual report uses real competitor data and ABS census demographics for your exact location.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}