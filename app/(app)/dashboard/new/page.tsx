'use client'
import dynamic from 'next/dynamic'
const MapboxMap = dynamic(() => import('@/components/MapboxMap'), { ssr: false })
const MapInsightPanel = dynamic(() => import('@/components/MapInsightPanel'), { ssr: false })
import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import type { MapInsights, Competitor } from '@/components/MapboxMap'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { whatIfCalc, breakEvenMonthsCalc } from '@/lib/compute/client-calc'
import { Logo } from '@/components/Logo'
import { lzRateLimitHeaders } from '@/lib/lz-rate-limit-headers'

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
 { id: 'cafe',    label: 'Cafe',     icon: 'cafe', avgTicket: 9,  shopSize: 75,  setupMid: 140000, baseCustomers: 85, color: '#92400E' },
 { id: 'restaurant', label: 'Restaurant',  icon: 'restaurant', avgTicket: 28, shopSize: 120, setupMid: 260000, baseCustomers: 55, color: '#7C2D12' },
 { id: 'bakery',   label: 'Bakery',    icon: 'bakery', avgTicket: 7,  shopSize: 65,  setupMid: 95000,  baseCustomers: 90, color: '#78350F' },
 { id: 'gym',     label: 'Gym / Fitness', icon: 'gym', avgTicket: 65, shopSize: 250, setupMid: 200000, baseCustomers: 40, color: '#166534' },
 { id: 'salon',    label: 'Hair Salon',  icon: 'salon', avgTicket: 55, shopSize: 60,  setupMid: 70000,  baseCustomers: 18, color: '#7C3AED' },
 { id: 'retail',   label: 'Retail Store', icon: 'retail', avgTicket: 45, shopSize: 150, setupMid: 130000, baseCustomers: 45, color: '#1D4ED8' },
 { id: 'bar',     label: 'Bar / Pub',   icon: 'bar', avgTicket: 18, shopSize: 180, setupMid: 280000, baseCustomers: 60, color: '#1E3A5F' },
 { id: 'takeaway',  label: 'Takeaway',   icon: 'takeaway', avgTicket: 14, shopSize: 50,  setupMid: 80000,  baseCustomers: 70, color: '#B45309' },
 { id: 'pharmacy',  label: 'Pharmacy',   icon: 'pharmacy', avgTicket: 35, shopSize: 120, setupMid: 250000, baseCustomers: 30, color: '#0369A1' },
 { id: 'other',    label: 'Other',     icon: 'other', avgTicket: 20, shopSize: 100, setupMid: 120000, baseCustomers: 40, color: '#374151' },
]

const BUDGET_RANGES = [
 { label: 'Under $50k',  value: 35000 },
  { label: '$50k – $100k', value: 75000 },
  { label: '$100k – $200k', value: 150000 },
 { label: '$200k – $350k', value: 275000 },
 { label: '$350k+',    value: 400000 },
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

function BizIcon({ id, color, size = 20 }: { id: string; color: string; size?: number }) {
 const s = { width: size, height: size, display: 'block' as const }
 switch (id) {
    case 'cafe': return (
   <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
   </svg>
    )
    case 'restaurant': return (
   <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>
   </svg>
    )
    case 'bakery': return (
   <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22a7 7 0 007-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 007 7z"/>
   </svg>
    )
    case 'gym': return (
   <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8h1a2 2 0 010 4h-1"/><path d="M6 8H5a2 2 0 000 4h1"/><line x1="6" y1="10" x2="18" y2="10"/><line x1="8" y1="6" x2="8" y2="14"/><line x1="16" y1="6" x2="16" y2="14"/>
   </svg>
    )
    case 'salon': return (
   <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/>
   </svg>
    )
    case 'retail': return (
   <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
   </svg>
    )
    case 'bar': return (
   <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 22h8"/><path d="M12 11v11"/><path d="M20 2H4l6 9.46V17l4 .01V11.46L20 2z"/>
   </svg>
    )
    case 'takeaway': return (
   <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12H3l9-9 9 9h-2"/><path d="M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/><rect x="9" y="12" width="6" height="9"/>
   </svg>
    )
    case 'pharmacy': return (
   <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
   </svg>
    )
    case 'other': return (
   <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
   </svg>
    )
    default: return (
      <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
   </svg>
    )
  }
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
 const [showAdvanced, setShowAdvanced] = useState(false)
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [geocoding, setGeocoding] = useState(false)
  const geocodeTimer = useRef<NodeJS.Timeout | null>(null)
  const autocompleteTimer = useRef<NodeJS.Timeout | null>(null)
  const [suggestions, setSuggestions] = useState<Array<{display_name: string; lat: string; lon: string}>>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const [form, setForm] = useState<FormState>({
    businessType: null,
    address: '',
  hasProperty: null,
    monthlyRent: '',
  budgetRange: null,
    adv: { ticketSize: '', shopSize: '', staffCount: '', openDays: '6', parking: '', roadType: '', anchors: [], incentiveMonths: '' },
 })

  const [mapInsights, setMapInsights] = useState<MapInsights | null>(null)
  const [mapCompetitors, setMapCompetitors] = useState<Competitor[]>([])
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [mapBusinessType, setMapBusinessType] = useState(form.businessType || 'cafe')

 const handleInsightsUpdate = useCallback((insights: MapInsights) => setMapInsights(insights), [])
  const handleCompetitorsUpdate = useCallback((comps: Competitor[]) => setMapCompetitors(comps), [])

  const selectedBiz = BUSINESS_TYPES.find(b => b.id === form.businessType)

  const estimates = useMemo(() => {
    const biz = selectedBiz || BUSINESS_TYPES[0]
    const shopSize = form.adv.shopSize ? parseInt(form.adv.shopSize) : biz.shopSize
    const estRent = form.hasProperty && form.monthlyRent
      ? parseInt(form.monthlyRent.replace(/[^0-9]/g, ''))
   : estimateRent(form.address, shopSize)
    const ticketSize = form.adv.ticketSize ? parseFloat(form.adv.ticketSize) : biz.avgTicket

    // Use shared whatIfCalc — same formulas as the compute engine (benchmark path)
    const calc = whatIfCalc({
      businessType: biz.id,
      monthlyRent: estRent,
      avgTicketSize: ticketSize,
      // dailyCustomers: null → uses benchmark default for this business type
    })

    const setupCost = form.budgetRange || biz.setupMid
    const payback = breakEvenMonthsCalc(setupCost, calc.netProfit) ?? 99
    return {
      estRent,
      ticketSize,
      customers: calc.dailyCustomers,
      monthlyRevenue: calc.monthlyRevenue,
      netProfit: calc.netProfit,
      payback,
      shopSize,
    }
  }, [form, selectedBiz])

  const confidence = useMemo(() => confidenceScore(form), [form])

  // Pre-fill from onboarding page sessionStorage (set when user clicks "Run full analysis" on /onboarding)
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('onboarding_data')
      if (saved) {
        sessionStorage.removeItem('onboarding_data')
        const d = JSON.parse(saved)
        if (d.businessType) setField('businessType', d.businessType)
        if (d.address) setField('address', d.address)
        if (d.coords) setCoords(d.coords)
        if (d.monthlyRent) {
          setField('hasProperty', true)
          setField('monthlyRent', String(d.monthlyRent))
        }
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync map business type when form changes
  useEffect(() => {
    if (form.businessType) setMapBusinessType(form.businessType)
  }, [form.businessType])

  useEffect(() => {
    if (form.address.length < 8) { setCoords(null); return }
    if (geocodeTimer.current) clearTimeout(geocodeTimer.current)
    geocodeTimer.current = setTimeout(async () => {
      setGeocoding(true)
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(form.address)}`, { headers: { ...lzRateLimitHeaders() } })
        const data = await res.json()
        if (data?.[0]) setCoords({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) })
      } catch { /* silent */ } finally { setGeocoding(false) }
    }, 900)
    return () => { if (geocodeTimer.current) clearTimeout(geocodeTimer.current) }
  }, [form.address])
  // Autocomplete: fetch suggestions as user types
  useEffect(() => {
    if (form.address.length < 3) { setSuggestions([]); return }
    if (autocompleteTimer.current) clearTimeout(autocompleteTimer.current)
    autocompleteTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/autocomplete?q=${encodeURIComponent(form.address)}`, { headers: { ...lzRateLimitHeaders() } })
        const data = await res.json()
        setSuggestions(Array.isArray(data) ? data.slice(0, 5) : [])
        setShowSuggestions(true)
      } catch { setSuggestions([]) }
    }, 350)
    return () => { if (autocompleteTimer.current) clearTimeout(autocompleteTimer.current) }
  }, [form.address])


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
    if (!user) { router.push('/auth/login?redirectTo=/dashboard/new'); return }

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
    headers: { 'Content-Type': 'application/json', 'x-user-id': user.id, ...lzRateLimitHeaders() },
    body: JSON.stringify({ businessType: biz.label, address: form.address.trim(), monthlyRent, setupBudget, avgTicketSize, userId: user.id, locationContext }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) { setError(data?.error?.message || 'Analysis failed. Please try again.'); setSubmitting(false); return }
   const reportId = data.report?.report_id || data.reportId || data.report?.reportId
      if (reportId) {
        await supabase.from('reports').update({ user_id: user.id, business_type: biz.label, address: form.address.trim(), monthly_rent: monthlyRent }).eq('report_id', reportId)
    router.push(`/dashboard/${reportId}?tab=decision`)
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
     <Logo variant="light" size="md" />
    </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
     {['Business', 'Location', 'Details'].map((label, i) => {
      const n = i + 1; const active = step === n; const done = step > n
            return (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, background: done ? S.emeraldBg : active ? S.brandFaded : S.n100, border: `1px solid ${done ? S.emeraldBdr : active ? S.brandBorder : S.n200}` }}>
         <div style={{ width: 16, height: 16, borderRadius: '50%', background: done ? S.emerald : active ? S.brand : S.n400, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: S.white, fontWeight: 800 }}>{done ? '' : n}</div>
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
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: selected ? S.brandFaded : S.n50, border: `1px solid ${selected ? S.brandBorder : S.n100}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
           <BizIcon id={biz.id} color={selected ? biz.color : S.n500} size={20} />
                    </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: selected ? S.brand : S.n800 }}>{biz.label}</div>
                        <div style={{ fontSize: 11, color: S.n400, marginTop: 1 }}>avg {fmt(biz.avgTicket)} ticket</div>
                      </div>
                      {selected && <div style={{ marginLeft: 'auto', width: 18, height: 18, borderRadius: '50%', background: S.brand, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.white, fontSize: 10, fontWeight: 900, flexShrink: 0 }}></div>}
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
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: S.brandFaded, border: `1px solid ${S.brandBorder}`, borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, color: S.brand, marginBottom: 14 }}>{selectedBiz?.label} — Step 2 of 3</div>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.04em', lineHeight: 1.2, marginBottom: 6 }}>Where is the location?</h1>
        <p style={{ fontSize: 14, color: S.n500, lineHeight: 1.65 }}>Enter the full address. We'll geocode it and pull real competitor data for your area.</p>
       </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: S.n700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Address</label>
        <div style={{ position: 'relative' }}>
         <input
                    autoFocus
                    value={form.address}
                    onChange={e => { setField('address', e.target.value); setShowSuggestions(true) }}
          onKeyDown={e => { if (e.key === 'Enter') { setShowSuggestions(false) } }}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    placeholder="e.g. College Ave, Shellharbour NSW — suburb is enough"
          style={{ width: '100%', padding: '14px 44px 14px 16px', border: `1.5px solid ${form.address.length > 6 && coords ? S.brandBorder : S.n200}`, borderRadius: 12, fontSize: 15, color: S.n900, background: S.white, fontFamily: S.font, outline: 'none' }}
         />
                  <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
          {geocoding
                      ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={S.n400} strokeWidth="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
           : coords
                        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={S.emerald} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={S.n400} strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          }
                  </div>
                  {showSuggestions && suggestions.length > 0 && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, background: S.white, border: `1.5px solid ${S.n200}`, borderRadius: 12, marginTop: 4, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.10)' }}>
           {suggestions.map((s, i) => (
                        <div
                          key={i}
                          onMouseDown={() => {
                            setField('address', s.display_name.split(',').slice(0, 4).join(',').trim())
              setCoords({ lat: parseFloat(s.lat), lng: parseFloat(s.lon) })
                            setSuggestions([])
                            setShowSuggestions(false)
                          }}
                          style={{ padding: '11px 16px', fontSize: 13, color: S.n800, cursor: 'pointer', borderBottom: i < suggestions.length - 1 ? `1px solid ${S.n100}` : 'none', display: 'flex', alignItems: 'center', gap: 10 }}
             onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = S.brandFaded }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={S.brand} strokeWidth="2" style={{ flexShrink: 0 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
             <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
             {s.display_name.split(',').slice(0, 3).join(',').replace(/, (New South Wales|Victoria|Queensland|Western Australia|South Australia|Tasmania|Australian Capital Territory|Northern Territory)/g, m => ',' + m.split(', ')[1]).trim()}
            </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {coords && <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, fontSize: 12, color: S.emerald, fontWeight: 600 }}>
         <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
         Location confirmed — {extractSuburbLabel(form.address)}
                </div>}
              </div>
              <div style={{ background: S.n50, border: `1px solid ${S.n100}`, borderRadius: 10, padding: '12px 16px', marginBottom: 24 }}>
        <p style={{ fontSize: 12, color: S.n500, lineHeight: 1.6 }}>Suburb + state is enough for analysis accuracy. Select a suggestion or just type your suburb and continue.</p>
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
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: S.brandFaded, border: `1px solid ${S.brandBorder}`, borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, color: S.brand, marginBottom: 14 }}>{selectedBiz?.label} — Step 3 of 3</div>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.04em', lineHeight: 1.2, marginBottom: 6 }}>A few quick details</h1>
       </div>

              {/* Do you have a property? */}
              <div style={{ marginBottom: 22 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: S.n700, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Do you have a specific space in mind?</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
         {[
                    { val: false, label: 'Just exploring', sub: "I'll explore options", icon: '' },
          { val: true,  label: 'Yes, I have one', sub: 'I have a space / lease offer', icon: '' },
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
         <p style={{ fontSize: 13, color: S.brand, fontWeight: 600 }}> We'll estimate rent at {fmt(estimates.estRent)}/month based on {extractSuburbLabel(form.address) || 'your area'} averages.</p>
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
          <span style={{ fontSize: 14 }}></span>
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
              {form.adv.anchors.includes(a) ? ' ' : ''}{a}
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
        {submitting ? ' Analysing location…' : ' Run analysis'}
       </button>
              <p style={{ fontSize: 11, color: S.n400, textAlign: 'center', marginTop: 10 }}>Takes 60–90 seconds · Full financial model + GO/CAUTION/NO verdict</p>
      </div>
          )}
        </div>

        {/* RIGHT: Map + estimates */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: S.white }}>
     <div style={{ flex: '0 0 60%', position: 'relative', background: S.n100, overflow: 'hidden' }}>
      {coords ? (
              <>
                <MapboxMap
                  lat={coords.lat}
                  lng={coords.lng}
                  businessType={mapBusinessType}
                  onInsightsUpdate={handleInsightsUpdate}
                  onCompetitorsUpdate={handleCompetitorsUpdate}
                  showHeatmap={showHeatmap}
                />
                {/* Suburb label */}
                <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 700, color: S.n800, boxShadow: '0 2px 12px rgba(0,0,0,0.10)', border: `1px solid ${S.n100}` }}>
         {extractSuburbLabel(form.address)}
                </div>
                {/* Insight panel */}
                <MapInsightPanel
                  insights={mapInsights}
                  competitors={mapCompetitors}
                  businessType={mapBusinessType}
                  onBusinessTypeChange={setMapBusinessType}
                  showHeatmap={showHeatmap}
                  onToggleHeatmap={() => setShowHeatmap(h => !h)}
                  businessTypes={BUSINESS_TYPES.map(b => ({ id: b.id, label: b.label }))}
                />
                {/* Legend */}
                <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', gap: 12, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', borderRadius: 8, padding: '6px 12px', boxShadow: '0 1px 6px rgba(0,0,0,0.08)', border: `1px solid ${S.n100}` }}>
         {[
                    { color: '#EF4444', label: 'Competitor' },
          { color: '#3B82F6', label: 'Transport' },
          { color: '#22C55E', label: 'Park' },
          { color: '#8B5CF6', label: 'School' },
          { color: '#F59E0B', label: 'Mall' },
         ].map(item => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
           <div style={{ width: 6, height: 6, borderRadius: '50%', background: item.color }} />
           <span style={{ fontSize: 9, color: S.n500, fontWeight: 600 }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 8 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
        <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>Enter an address to see the map</p>
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
         { label: 'Est. monthly profit', value: fmt(estimates.netProfit), note: estimates.netProfit > 0 ? 'after all costs' : ' negative', color: estimates.netProfit > 2000 ? S.emerald : estimates.netProfit > 0 ? S.amber : S.red },
         { label: 'Rent / revenue', value: `${((estimates.estRent / estimates.monthlyRevenue) * 100).toFixed(1)}%`, note: estimates.estRent / estimates.monthlyRevenue <= 0.12 ? ' healthy' : ' above 12%', color: estimates.estRent / estimates.monthlyRevenue > 0.2 ? S.red : S.amber },
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