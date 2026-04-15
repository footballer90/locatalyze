'use client'

import dynamic from 'next/dynamic'
const MapboxMap = dynamic(() => import('@/components/MapboxMap'), { ssr: false })
const MapInsightPanel = dynamic(() => import('@/components/MapInsightPanel'), { ssr: false })

import Link from 'next/link'
import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import type { MapInsights, Competitor, Anchor } from '@/components/MapboxMap'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const S = {
  font: "'DM Sans','Helvetica Neue',Arial,sans-serif",
  brand: '#0F766E', brandLight: '#14B8A6', brandFaded: '#F0FDFA', brandBorder: '#99F6E4',
  n50: '#FAFAF9', n100: '#F5F5F4', n200: '#E7E5E4',
  n400: '#A8A29E', n500: '#78716C', n700: '#44403C',
  n800: '#292524', n900: '#1C1917', white: '#FFFFFF',
  emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0',
  amber: '#D97706', amberBg: '#FFFBEB',
  red: '#DC2626', redBg: '#FEF2F2',
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
    default: return (
      <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    )
  }
}

function CheckIcon({ size = 16, color = '#059669' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

function ChevronRightIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  )
}

function CloseIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
}

interface FormData {
  businessType: string | null
  address: string
  coords: { lat: number; lng: number } | null
  monthlyRent: string
}

export default function OnboardingPage() {
  const router = useRouter()
  const [businessType, setBusinessType] = useState<string | null>(null)
  const [address, setAddress] = useState('')
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [monthlyRent, setMonthlyRent] = useState('')
  const [suggestions, setSuggestions] = useState<Array<{ display_name: string; lat: string; lon: string }>>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [geocoding, setGeocoding] = useState(false)
  const geocodeTimer = useRef<NodeJS.Timeout | null>(null)
  const autocompleteTimer = useRef<NodeJS.Timeout | null>(null)

  const [mapInsights, setMapInsights] = useState<MapInsights | null>(null)
  const [mapCompetitors, setMapCompetitors] = useState<Competitor[]>([])
  const [mapAnchors, setMapAnchors] = useState<Anchor[]>([])
  const [mapRadius, setMapRadius] = useState<number | undefined>(undefined)
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [showIsochrones, setShowIsochrones] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(false)
  // Accuracy-improving optional fields
  const [operatingHours,  setOperatingHours]  = useState<string>('')
  const [seatingCapacity, setSeatingCapacity] = useState<string>('')
  const [businessMode,    setBusinessMode]    = useState<string>('')
  const [avgOrderValue,   setAvgOrderValue]   = useState<string>('')
  const [locationAccess,  setLocationAccess]  = useState<string>('')

  // Model accuracy score — purely presentational, maps filled fields to trust %
  const modelAccuracy = useMemo(() => {
    let score = 61 // base: business type + address
    if (monthlyRent)    score += 10 // rent is a core financial input
    if (operatingHours) score +=  9
    if (avgOrderValue)  score +=  8
    if (seatingCapacity && businessType && ['cafe','restaurant','bar','bakery','takeaway'].includes(businessType)) score += 6
    if (businessMode)   score +=  5
    if (locationAccess) score +=  5
    return Math.min(score, 98) // never show 100% — honest about uncertainty
  }, [monthlyRent, operatingHours, avgOrderValue, seatingCapacity, businessType, businessMode, locationAccess])

  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authDone, setAuthDone] = useState(false)
  const [analysing, setAnalysing] = useState(false)
  const [analysisError, setAnalysisError] = useState('')
  const [analysisStep, setAnalysisStep] = useState(0)

  // Named analysis steps — advances on a timer to show meaningful progress
  const ANALYSIS_STEPS = [
    { label: 'Scanning competitor intelligence...', sub: 'Google Maps + local data sources' },
    { label: 'Sourcing location & rent data...', sub: 'SerpApi commercial listings, suburb medians' },
    { label: 'Analysing market demand...', sub: 'Search trends, foot traffic signals' },
    { label: 'Building financial model...', sub: 'Costs, revenue benchmarks, staffing' },
    { label: 'Calibrating 3 revenue scenarios...', sub: 'Worst case, base case, best case' },
    { label: 'Finalising GO / CAUTION / NO verdict...', sub: 'Risk scoring, decision gates' },
  ]

  useEffect(() => {
    if (!analysing) { setAnalysisStep(0); return }
    const interval = setInterval(() => {
      setAnalysisStep(s => s < ANALYSIS_STEPS.length - 1 ? s + 1 : s)
    }, 5500)
    return () => clearInterval(interval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysing])

  const selectedBiz = BUSINESS_TYPES.find(b => b.id === businessType)

  // ── Live benchmark rent ──────────────────────────────────────────────────────
  // When seats are known we derive sqm (seats × 2.2) → more accurate rent estimate
  // than the generic shopSize default. Falls back to business type shopSize × $65/sqm.
  const benchmarkRent = useMemo(() => {
    const seats = parseInt(seatingCapacity)
    if (seats > 0 && businessType && ['restaurant', 'bar', 'cafe', 'bakery'].includes(businessType)) {
      const sqm = Math.round(seats * 2.2)
      return sqm * 65
    }
    return selectedBiz ? selectedBiz.shopSize * 65 : null
  }, [selectedBiz, seatingCapacity, businessType])

  // Estimated sqm — derived from seats when available, else business type default
  const estimatedSqm = useMemo(() => {
    const seats = parseInt(seatingCapacity)
    if (seats > 0 && businessType && ['restaurant', 'bar', 'cafe', 'bakery'].includes(businessType)) {
      return Math.round(seats * 2.2)
    }
    return selectedBiz?.shopSize ?? null
  }, [selectedBiz, seatingCapacity, businessType])

  const fmtRent = (n: number) => `$${n.toLocaleString('en-AU')}`

  // Run the full analysis using current form state (or supplied overrides from sessionStorage)
  const runAnalysis = useCallback(async (override?: { businessType: string | null; address: string; coords: { lat: number; lng: number } | null; monthlyRent: string }) => {
    const bt = override?.businessType ?? businessType
    const addr = override?.address ?? address
    const rent = override?.monthlyRent ?? monthlyRent

    if (!bt || !addr) return

    setAnalysing(true)
    setAnalysisError('')

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        sessionStorage.setItem('post_auth_action', 'runAnalysis')
        router.push('/auth/login?redirectTo=/onboarding')
        setAnalysing(false)
        return
      }

      const biz = BUSINESS_TYPES.find(b => b.id === bt)
      if (!biz) { setAnalysing(false); return }

      // Derive sqm from seats when available (seats × 2.2m²) — more accurate rent estimate
      const seatCount = seatingCapacity ? parseInt(seatingCapacity) || null : null
      const sqmFromSeats = (seatCount && ['cafe','restaurant','bar','bakery'].includes(bt))
        ? Math.round(seatCount * 2.2) : null
      const fallbackRent = sqmFromSeats
        ? sqmFromSeats * 65                  // seat-derived sqm × $65/sqm benchmark
        : biz.shopSize * 65                  // business type default
      const rentRaw = rent ? parseInt(rent.replace(/[^0-9]/g, '')) : null
      const monthlyRentNum = (rentRaw && rentRaw >= 100) ? rentRaw : fallbackRent
      const rentSource = (rentRaw && rentRaw >= 100) ? 'user_provided' : sqmFromSeats ? 'seat_derived' : 'benchmark'

      const setupBudget = biz.setupMid
      const avgTicketSize = avgOrderValue ? parseFloat(avgOrderValue) || biz.avgTicket : biz.avgTicket

      const res = await fetch('/api/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': user.id },
        body: JSON.stringify({
          businessType: biz.label,
          address: addr.trim(),
          monthlyRent: monthlyRentNum,
          setupBudget,
          avgTicketSize,
          userId: user.id,
          lat: (override?.coords ?? coords)?.lat ?? null,
          lng: (override?.coords ?? coords)?.lng ?? null,
          operatingHours:  operatingHours  || null,
          seatingCapacity: seatCount,
          businessMode:    businessMode    || null,
          avgOrderValue:   avgOrderValue   ? parseFloat(avgOrderValue) || null : null,
          locationAccess:  locationAccess  || null,
          // Accuracy metadata — passed to n8n for model calibration
          rentSource,
          estimatedSqm: sqmFromSeats ?? biz.shopSize,
        }),
      })

      const data = await res.json()
      const reportId = data.report?.report_id || data.reportId || data.report?.reportId

      if (reportId) {
        await supabase.from('reports').update({
          user_id: user.id,
          business_type: biz.label,
          address: addr.trim(),
          monthly_rent: monthlyRentNum,
        }).eq('report_id', reportId)
        router.push(`/dashboard/${reportId}`)
      } else {
        router.push('/dashboard')
      }
    } catch {
      setAnalysisError('Something went wrong. Please check your connection and try again.')
      setAnalysing(false)
    }
  }, [businessType, address, monthlyRent, router, coords, operatingHours, seatingCapacity, businessMode, avgOrderValue, locationAccess])

  useEffect(() => {
    const saved = sessionStorage.getItem('onboarding_data')
    let savedData: FormData | null = null
    if (saved) {
      try {
        savedData = JSON.parse(saved)
        setBusinessType(savedData!.businessType)
        setAddress(savedData!.address)
        setCoords(savedData!.coords)
        setMonthlyRent(savedData!.monthlyRent)
      } catch (e) {}
    }
    // If user just authenticated and wants to run analysis, trigger it directly here
    const action = sessionStorage.getItem('post_auth_action')
    if (action === 'runAnalysis') {
      sessionStorage.removeItem('post_auth_action')
      // Pass saved data directly — React state isn't committed yet at this point
      runAnalysis(savedData || undefined)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const data: FormData = { businessType, address, coords, monthlyRent }
    sessionStorage.setItem('onboarding_data', JSON.stringify(data))
  }, [businessType, address, coords, monthlyRent])

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setAddress(val)
    setShowSuggestions(val.length > 1)

    if (autocompleteTimer.current) clearTimeout(autocompleteTimer.current)
    if (val.length <= 1) { setSuggestions([]); return }
    autocompleteTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/autocomplete?q=${encodeURIComponent(val)}`)
        const data = await res.json()
        setSuggestions(Array.isArray(data) ? data.slice(0, 5) : [])
      } catch (err) {
        setSuggestions([])
      }
    }, 150)
  }

  const handleSelectSuggestion = async (suggestion: typeof suggestions[0]) => {
    setAddress(suggestion.display_name)
    setShowSuggestions(false)
    setSuggestions([])
    setGeocoding(true)

    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(suggestion.display_name)}`)
      const data = await res.json()
      if (data?.[0]) {
        setCoords({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) })
      }
    } catch (err) {
      console.error('Geocode error:', err)
    } finally {
      setGeocoding(false)
    }
  }

  const handleInsightsUpdate = useCallback((insights: MapInsights) => {
    setMapInsights(insights)
  }, [])

  const handleCompetitorsUpdate = useCallback((comps: Competitor[]) => {
    setMapCompetitors(comps)
  }, [])

  const handleAnchorsUpdate = useCallback((a: Anchor[]) => {
    setMapAnchors(a)
  }, [])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError('')

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email: authEmail,
        password: authPassword,
      })

      if (error) throw new Error(error.message)

      const data: FormData = { businessType, address, coords, monthlyRent }
      sessionStorage.setItem('onboarding_data', JSON.stringify(data))
      sessionStorage.setItem('post_auth_action', 'runAnalysis')

      setAuthDone(true)
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Sign up failed')
    } finally {
      setAuthLoading(false)
    }
  }

  const densityColor = !mapInsights ? S.n400 : mapInsights.density === 'high' ? S.red : mapInsights.density === 'medium' ? S.amber : S.emerald
  const riskColor = !mapInsights ? S.n400 : mapInsights.risk === 'high' ? S.red : mapInsights.risk === 'moderate' ? S.amber : S.emerald

  const getDensityText = (density?: string) => {
    if (!density) return 'Unknown'
    if (density === 'high') return 'High'
    if (density === 'medium') return 'Medium'
    return 'Low'
  }

  const getInsightText = () => {
    if (!mapInsights || !selectedBiz) return ''
    const { density } = mapInsights
    if (density === 'high') return `This area has high competition for ${selectedBiz.label}. New entrants face significant market share challenges.`
    if (density === 'medium') return 'Moderate competition detected. A differentiated concept could succeed here.'
    return `Low competition — this area may be underserved for ${selectedBiz.label}. Good entry conditions.`
  }

  return (
    <div style={{ fontFamily: S.font, backgroundColor: S.n50, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes modalIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        input:focus, select:focus { outline: none; border-color: ${S.brand} !important; box-shadow: 0 0 0 3px rgba(15,118,110,0.1) !important; }
      `}</style>

      <nav style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 24, paddingRight: 24, borderBottom: `1px solid ${S.n200}`, backgroundColor: S.white }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <img src="/logo.svg" alt="Locatalyze" style={{ height: 26 }} />
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 24, fontSize: 13, color: S.n700 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: S.brand, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.white, fontSize: 12, fontWeight: 600 }}>1</div>
              <span>Location</span>
            </div>
            <div style={{ width: 20, height: 1, backgroundColor: S.n200 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: S.n200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.n700, fontSize: 12, fontWeight: 600 }}>2</div>
              <span>Business</span>
            </div>
            <div style={{ width: 20, height: 1, backgroundColor: S.n200 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: S.n200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.n700, fontSize: 12, fontWeight: 600 }}>3</div>
              <span>Analysis</span>
            </div>
          </div>
        </div>

        <Link href="/auth/login" style={{ textDecoration: 'none', color: S.brand, fontSize: 14, fontWeight: 500 }}>Sign in</Link>
      </nav>

      <div style={{ flex: 1, display: 'flex', gap: 0 }}>
        <div style={{ width: 480, backgroundColor: S.white, borderRight: `1px solid ${S.n200}`, overflowY: 'auto', padding: 32 }}>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: S.n900, marginBottom: 8, marginTop: 0 }}>Check if this location is worth it</h1>
          <p style={{ fontSize: 14, color: S.n500, marginBottom: 24, lineHeight: 1.5 }}>Enter an address and business type to see competition data instantly. No signup needed.</p>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: S.n700, marginBottom: 8 }}>Business type</label>
            <select
              value={businessType || ''}
              onChange={(e) => setBusinessType(e.target.value || null)}
              style={{
                width: '100%', padding: '10px 12px', fontSize: 14, border: `1px solid ${S.n200}`, borderRadius: 6, backgroundColor: S.white,
                color: S.n900, fontFamily: S.font, cursor: 'pointer', transition: 'all 200ms'
              }}
            >
              <option value="">Select a business type</option>
              {BUSINESS_TYPES.map(b => (
                <option key={b.id} value={b.id}>{b.label}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 20, position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: S.n700 }}>Address</label>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: S.n400 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                Australia only
              </span>
            </div>
            <div style={{ position: 'relative' }}>
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={address ? S.brand : S.n400} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', transition: 'stroke 200ms' }}
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <input
                type="text"
                placeholder="Enter suburb, street, or full address (e.g. Subiaco WA or 88 Oxford St)"
                value={address}
                onChange={handleAddressChange}
                onFocus={(e) => { e.currentTarget.style.borderColor = S.brand; e.currentTarget.style.boxShadow = `0 0 0 3px ${S.brandFaded}` }}
                onBlur={(e) => { e.currentTarget.style.borderColor = S.n200; e.currentTarget.style.boxShadow = 'none' }}
                autoComplete="off"
                style={{
                  width: '100%', padding: '10px 12px 10px 34px', fontSize: 14,
                  border: `1px solid ${S.n200}`, borderRadius: 6, backgroundColor: S.white,
                  color: S.n900, fontFamily: S.font, boxSizing: 'border-box' as const,
                  transition: 'border-color 150ms, box-shadow 150ms', outline: 'none'
                }}
              />
            </div>
            <p style={{ margin: '5px 0 0', fontSize: 11, color: S.n400, lineHeight: 1.4 }}>
              Start typing — suburb, street, or exact address all work
            </p>
            {geocoding && (
              <p style={{ margin: '4px 0 0', fontSize: 11, color: S.brand }}>Locating on map...</p>
            )}
            {showSuggestions && suggestions.length > 0 && (
              <div style={{
                position: 'absolute', top: 'calc(100% - 4px)', left: 0, right: 0, backgroundColor: S.white,
                border: `1px solid ${S.n200}`, borderRadius: 8,
                boxShadow: '0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)',
                zIndex: 100, overflow: 'hidden'
              }}>
                {suggestions.map((s, i) => {
                  const parts = s.display_name.split(', ')
                  const primary = parts.slice(0, 2).join(', ')
                  const secondary = parts.slice(2).join(', ')
                  return (
                    <div
                      key={i}
                      onClick={() => handleSelectSuggestion(s)}
                      style={{
                        padding: '10px 12px', borderBottom: i < suggestions.length - 1 ? `1px solid ${S.n100}` : 'none',
                        cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 10,
                        transition: 'background-color 100ms',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = S.brandFaded)}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={S.n400} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 2, flexShrink: 0 }}>
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                      <div>
                        <div style={{ fontSize: 13, color: S.n900, fontWeight: 500 }}>{primary}</div>
                        {secondary && <div style={{ fontSize: 11, color: S.n500, marginTop: 1 }}>{secondary}</div>}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {address && (
            <div style={{ marginBottom: 20, animation: 'fadeIn 300ms ease-out' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: S.n700 }}>Monthly rent</label>
                {!monthlyRent && benchmarkRent ? (
                  <span style={{ fontSize: 11, color: S.brand, fontWeight: 600 }}>
                    Using {fmtRent(benchmarkRent)}/mo estimate
                  </span>
                ) : monthlyRent ? (
                  <span style={{ fontSize: 11, color: S.emerald, fontWeight: 600 }}>
                    Your quote — used in model
                  </span>
                ) : null}
              </div>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: S.n400, pointerEvents: 'none' }}>$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder={benchmarkRent ? benchmarkRent.toLocaleString('en-AU') : '3,500'}
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(e.target.value.replace(/[^0-9]/g, ''))}
                  style={{
                    width: '100%', padding: '10px 12px 10px 24px', fontSize: 14,
                    border: `1px solid ${monthlyRent ? S.brand : S.n200}`, borderRadius: 6,
                    backgroundColor: S.white, color: S.n900, fontFamily: S.font,
                    boxSizing: 'border-box' as const, transition: 'border-color 150ms',
                  }}
                />
              </div>
              <p style={{ fontSize: 11, color: S.n400, marginTop: 4, lineHeight: 1.4 }}>
                {monthlyRent
                  ? `Your actual rent — this replaces the ${fmtRent(benchmarkRent ?? 0)} suburb estimate in the financial model.`
                  : benchmarkRent
                    ? `Leave blank to use our ${fmtRent(benchmarkRent)}/mo estimate based on ${estimatedSqm}m² ${selectedBiz?.label ?? 'business'} benchmarks. Enter your quote for a more accurate result.`
                    : 'Optional. Enter your actual rent quote for a more accurate financial model.'
                }
              </p>
            </div>
          )}

          {/* ── Calibrate your model ──────────────────────────────────────────── */}
          <div style={{ marginBottom: 4 }}>
            {/* Accuracy score header — always visible once address is set */}
            {(businessType || address) && (
              <div
                onClick={() => setShowAdvanced(a => !a)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 12px', backgroundColor: showAdvanced ? S.brandFaded : S.n50,
                  border: `1px solid ${showAdvanced ? S.brandBorder : S.n200}`, borderRadius: showAdvanced ? '8px 8px 0 0' : 8,
                  cursor: 'pointer', userSelect: 'none', transition: 'all 200ms'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={S.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: S.n800 }}>Calibrate your model</div>
                    <div style={{ fontSize: 10, color: S.n500, marginTop: 1 }}>
                      Replace benchmarks with your own numbers for a more accurate report
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {/* Live accuracy score pill */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '3px 8px', borderRadius: 20,
                    backgroundColor: modelAccuracy >= 85 ? S.emeraldBg : modelAccuracy >= 70 ? S.amberBg : S.n100,
                    border: `1px solid ${modelAccuracy >= 85 ? S.emeraldBdr : modelAccuracy >= 70 ? '#FDE68A' : S.n200}`
                  }}>
                    <div style={{
                      width: 5, height: 5, borderRadius: '50%',
                      backgroundColor: modelAccuracy >= 85 ? S.emerald : modelAccuracy >= 70 ? S.amber : S.n400
                    }} />
                    <span style={{
                      fontSize: 11, fontWeight: 700,
                      color: modelAccuracy >= 85 ? S.emerald : modelAccuracy >= 70 ? S.amber : S.n500
                    }}>
                      {modelAccuracy}% accuracy
                    </span>
                  </div>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={S.n400} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transform: showAdvanced ? 'rotate(90deg)' : 'none', transition: 'transform 200ms', flexShrink: 0 }}>
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              </div>
            )}

            {showAdvanced && (
              <div style={{ padding: 14, backgroundColor: S.brandFaded, border: `1px solid ${S.brandBorder}`, borderTop: 'none', borderRadius: '0 0 8px 8px', display: 'flex', flexDirection: 'column', gap: 12 }}>

                {/* Avg order value — most impactful single input */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: S.n800 }}>
                      What&apos;s your expected spend per customer? ($)
                    </label>
                    {selectedBiz && !avgOrderValue && (
                      <span style={{ fontSize: 10, color: S.n400, fontStyle: 'italic' }}>
                        Using ${selectedBiz.avgTicket} benchmark
                      </span>
                    )}
                  </div>
                  <input
                    type="number"
                    placeholder={`e.g. ${selectedBiz?.avgTicket ?? 15}`}
                    value={avgOrderValue}
                    onChange={e => setAvgOrderValue(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', fontSize: 13, backgroundColor: S.white, color: S.n900, border: `1px solid ${avgOrderValue ? S.brand : S.n200}`, borderRadius: 5, fontFamily: S.font, boxSizing: 'border-box' as const, transition: 'border-color 150ms' }}
                  />
                  {avgOrderValue && selectedBiz && parseFloat(avgOrderValue) > 0 && (
                    <p style={{ fontSize: 10, color: S.brand, marginTop: 3, fontWeight: 600 }}>
                      ↑ Replacing ${selectedBiz.avgTicket} benchmark with your ${avgOrderValue} → revenue projection updated
                    </p>
                  )}
                </div>

                {/* Operating hours */}
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: S.n800, marginBottom: 4 }}>
                    When will you trade?
                  </label>
                  <select
                    value={operatingHours}
                    onChange={e => setOperatingHours(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', fontSize: 13, backgroundColor: S.white, color: S.n900, border: `1px solid ${operatingHours ? S.brand : S.n200}`, borderRadius: 5, fontFamily: S.font, transition: 'border-color 150ms' }}
                  >
                    <option value="">Select trading hours...</option>
                    <option value="breakfast_lunch">Breakfast &amp; lunch only (6am–3pm)</option>
                    <option value="lunch_dinner">Lunch &amp; dinner (11am–10pm)</option>
                    <option value="all_day">All day (7am–10pm)</option>
                    <option value="dinner_evening">Dinner &amp; evening only (4pm–11pm)</option>
                    <option value="weekends_only">Weekends only</option>
                  </select>
                  {!operatingHours && (
                    <p style={{ fontSize: 10, color: S.n400, marginTop: 3 }}>Using lunch &amp; dinner baseline by default</p>
                  )}
                </div>

                {/* Seating / floor area — food businesses only */}
                {businessType && ['cafe', 'restaurant', 'bar', 'bakery', 'takeaway'].includes(businessType) && (
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: S.n800, marginBottom: 4 }}>
                      {['restaurant', 'bar'].includes(businessType) ? 'How many seats?' : 'Floor area (m²)'}
                    </label>
                    <input
                      type="number"
                      placeholder={['restaurant', 'bar'].includes(businessType) ? 'e.g. 40 covers' : 'e.g. 60 m²'}
                      value={seatingCapacity}
                      onChange={e => setSeatingCapacity(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', fontSize: 13, backgroundColor: S.white, color: S.n900, border: `1px solid ${seatingCapacity ? S.brand : S.n200}`, borderRadius: 5, fontFamily: S.font, boxSizing: 'border-box' as const, transition: 'border-color 150ms' }}
                    />
                    <p style={{ fontSize: 10, color: S.n400, marginTop: 3 }}>
                      {['restaurant', 'bar'].includes(businessType)
                        ? 'Caps daily customer estimate based on physical capacity'
                        : 'Used to calibrate staffing benchmarks'}
                    </p>
                  </div>
                )}

                {/* Location access type — replaces parking + road visibility */}
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: S.n800, marginBottom: 4 }}>
                    How do customers find this location?
                  </label>
                  <select
                    value={locationAccess}
                    onChange={e => setLocationAccess(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', fontSize: 13, backgroundColor: S.white, color: S.n900, border: `1px solid ${locationAccess ? S.brand : S.n200}`, borderRadius: 5, fontFamily: S.font, transition: 'border-color 150ms' }}
                  >
                    <option value="">Select access type...</option>
                    <option value="street_frontage">Main street — high foot traffic, visible from road</option>
                    <option value="transport_hub">Near train / bus — commuter foot traffic</option>
                    <option value="shopping_centre">Inside shopping centre or food court</option>
                    <option value="side_street">Side street — some passing trade</option>
                    <option value="arcade">Arcade, laneway, or underground — destination only</option>
                  </select>
                  {locationAccess === 'side_street' || locationAccess === 'arcade' ? (
                    <p style={{ fontSize: 10, color: S.amber, marginTop: 3, fontWeight: 600 }}>
                      Warning Lower foot traffic — customer projections adjusted down
                    </p>
                  ) : locationAccess === 'street_frontage' || locationAccess === 'transport_hub' ? (
                    <p style={{ fontSize: 10, color: S.emerald, marginTop: 3, fontWeight: 600 }}>
                      ↑ Premium exposure — customer projections adjusted up
                    </p>
                  ) : null}
                </div>

                {/* Business mode */}
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: S.n800, marginBottom: 4 }}>
                    What stage is this business at?
                  </label>
                  <select
                    value={businessMode}
                    onChange={e => setBusinessMode(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', fontSize: 13, backgroundColor: S.white, color: S.n900, border: `1px solid ${businessMode ? S.brand : S.n200}`, borderRadius: 5, fontFamily: S.font, transition: 'border-color 150ms' }}
                  >
                    <option value="">Select...</option>
                    <option value="new_startup">New business — starting from zero</option>
                    <option value="relocating">Relocating an existing business here</option>
                    <option value="buying_existing">Buying an existing business at this address</option>
                  </select>
                  <p style={{ fontSize: 10, color: S.n400, marginTop: 3 }}>Affects ramp-up time and Year 1 revenue assumptions</p>
                </div>

              </div>
            )}
          </div>

          {coords && mapInsights && (
            <div style={{
              marginTop: 20, padding: 16, backgroundColor: S.brandFaded, border: `1px solid ${S.brandBorder}`, borderRadius: 8,
              animation: 'slideUp 400ms ease-out'
            }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: S.n900, marginTop: 0, marginBottom: 10 }}>Competition snapshot</h3>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
                <span style={{ fontSize: 28, fontWeight: 900, color: S.brand }}>{mapInsights.competitorCount500m}</span>
                <span style={{ fontSize: 12, color: S.n500 }}>competitors within 500m</span>
              </div>
              <div style={{ fontSize: 12, color: S.n500, marginBottom: 10 }}>{mapInsights.competitorCountTotal} total within 1km</div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  backgroundColor: densityColor === S.red ? S.redBg : densityColor === S.amber ? S.amberBg : S.emeraldBg,
                  borderRadius: 4, padding: '4px 8px'
                }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: densityColor }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: densityColor }}>{getDensityText(mapInsights.density)} density</span>
                </div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  backgroundColor: riskColor === S.red ? S.redBg : riskColor === S.amber ? S.amberBg : S.emeraldBg,
                  borderRadius: 4, padding: '4px 8px'
                }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: riskColor }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: riskColor }}>{mapInsights.risk} risk</span>
                </div>
              </div>

              <p style={{ fontSize: 12, color: S.n700, lineHeight: 1.5, margin: '10px 0 0' }}>{getInsightText()}</p>
            </div>
          )}

          <div style={{ marginTop: 20 }}>
            <button
              onClick={async () => {
                if (!businessType) {
                  const sel = document.querySelector('select') as HTMLSelectElement
                  sel?.focus()
                  return
                }
                // Save form data so dashboard/new can pre-fill it
                try {
                  sessionStorage.setItem('onboarding_data', JSON.stringify({ businessType, address, coords, monthlyRent }))
                } catch {}
                // If already signed in run analysis directly, otherwise show inline auth modal
                const supabase = createClient()
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                  runAnalysis()
                } else {
                  sessionStorage.setItem('post_auth_action', 'runAnalysis')
                  setShowAuthModal(true)
                }
              }}
              disabled={analysing}
              style={{
                width: '100%', padding: '14px 16px',
                backgroundColor: analysing ? '#0D5D55' : (businessType && coords ? S.brand : S.n200),
                color: businessType && coords ? S.white : S.n500, border: 'none', borderRadius: 8,
                fontSize: 15, fontWeight: 700, cursor: analysing ? 'default' : (businessType && coords ? 'pointer' : 'default'),
                transition: 'all 200ms', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
              }}
              onMouseEnter={(e) => { if (businessType && coords && !analysing) e.currentTarget.style.backgroundColor = '#0D5D55' }}
              onMouseLeave={(e) => { if (businessType && coords && !analysing) e.currentTarget.style.backgroundColor = S.brand }}
            >
              {analysing ? (
                <>
                  <svg width="15" height="15" viewBox="0 0 48 48" fill="none" style={{ animation: 'spin 0.85s linear infinite', flexShrink: 0 }}>
                    <circle cx="24" cy="24" r="20" stroke="rgba(255,255,255,0.25)" strokeWidth="4"/>
                    <path d="M24 4 A20 20 0 0 1 44 24" stroke="white" strokeWidth="4" strokeLinecap="round"/>
                  </svg>
                  Submitting…
                </>
              ) : (
                <>
                  Run full analysis
                  <svg style={{ flexShrink: 0 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </>
              )}
            </button>
            <div style={{ fontSize: 11, color: S.n500, marginTop: 6, textAlign: 'center', lineHeight: 1.5 }}>
              {!businessType
                ? 'Select a business type and address to continue'
                : !coords
                  ? 'Enter an address to enable analysis'
                  : 'Takes 20\u201340 seconds \u00b7 Full financial model + GO/CAUTION/NO verdict'
              }
            </div>
          </div>
        </div>

        <div style={{ flex: 1, backgroundColor: S.n50, position: 'relative', minHeight: 0 }}>
          {coords ? (
            <>
              <MapboxMap
                lat={coords.lat}
                lng={coords.lng}
                businessType={businessType || 'cafe'}
                radius={mapRadius}
                onInsightsUpdate={handleInsightsUpdate}
                onCompetitorsUpdate={handleCompetitorsUpdate}
                onAnchorsUpdate={handleAnchorsUpdate}
                showHeatmap={showHeatmap}
                showIsochrones={showIsochrones}
              />
              <MapInsightPanel
                insights={mapInsights}
                competitors={mapCompetitors}
                anchors={mapAnchors}
                businessType={businessType || 'cafe'}
                onBusinessTypeChange={setBusinessType}
                radius={mapRadius}
                onRadiusChange={setMapRadius}
                showHeatmap={showHeatmap}
                onToggleHeatmap={() => setShowHeatmap(h => !h)}
                businessTypes={BUSINESS_TYPES}
                showIsochrones={showIsochrones}
                onToggleIsochrones={() => setShowIsochrones(v => !v)}
              />
            </>
          ) : (
            <div style={{
              width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              backgroundColor: S.n100, color: S.n500, fontSize: 14, textAlign: 'center', padding: 40, gap: 16
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={S.n400} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <div>
                <p style={{ fontSize: 16, fontWeight: 600, color: S.n700, marginBottom: 6, marginTop: 0 }}>Competition map will appear here</p>
                <p style={{ fontSize: 13, color: S.n500, margin: 0 }}>Enter an address on the left to see nearby competitors instantly</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {analysisError && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10,
          padding: '12px 20px', zIndex: 2000, display: 'flex', alignItems: 'center', gap: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)', fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif"
        }}>
          <span style={{ fontSize: 13, color: '#DC2626' }}>{analysisError}</span>
          <button
            onClick={() => { setAnalysing(false); setAnalysisError('') }}
            style={{ fontSize: 12, color: '#0F766E', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, whiteSpace: 'nowrap' }}
          >
            Try again
          </button>
        </div>
      )}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.85); } }
      `}</style>

      {showAuthModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fadeIn 200ms ease-out'
        }} onClick={() => !authLoading && setShowAuthModal(false)}>
          <div
            style={{
              backgroundColor: S.white, borderRadius: 12, maxWidth: 440, width: '90%', padding: 32,
              animation: 'modalIn 300ms ease-out', position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAuthModal(false)}
              disabled={authLoading}
              style={{
                position: 'absolute', top: 16, right: 16, backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
                color: S.n400, padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <CloseIcon size={20} />
            </button>

            <h2 style={{ fontSize: 20, fontWeight: 900, color: S.n900, marginTop: 0, marginBottom: 8 }}>One step away from your report</h2>
            <p style={{ fontSize: 14, color: S.n500, marginBottom: 24, lineHeight: 1.5 }}>Create a free account — your analysis will start immediately and includes:</p>

            <ul style={{ listStyle: 'none', padding: 0, marginBottom: 24, fontSize: 13, color: S.n700 }}>
              {['Revenue estimate based on your location', 'Rent-to-revenue viability score', 'GO / CAUTION / NO verdict', 'Competitor density map', '5-year financial projection'].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <CheckIcon size={18} />
                  {item}
                </li>
              ))}
            </ul>

            {authDone ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>Email</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: S.n900, marginBottom: 8 }}>Check your email</h3>
                <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.6 }}>
                  We sent a confirmation link to <strong style={{ color: S.n800 }}>{authEmail}</strong>.<br />
                  Click it to verify your account — your analysis will run automatically.
                </p>
              </div>
            ) : (
            <>
            <form onSubmit={handleSignUp}>
              <input
                type="email"
                placeholder="Email address"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                disabled={authLoading}
                required
                style={{
                  width: '100%', padding: '10px 12px', fontSize: 14, border: `1px solid ${S.n200}`, borderRadius: 6, marginBottom: 12,
                  backgroundColor: S.white, color: S.n900, fontFamily: S.font, boxSizing: 'border-box'
                }}
              />
              <input
                type="password"
                placeholder="Password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                disabled={authLoading}
                required
                style={{
                  width: '100%', padding: '10px 12px', fontSize: 14, border: `1px solid ${S.n200}`, borderRadius: 6, marginBottom: 16,
                  backgroundColor: S.white, color: S.n900, fontFamily: S.font, boxSizing: 'border-box'
                }}
              />

              {authError && (
                <div style={{
                  padding: 10, backgroundColor: S.redBg, border: `1px solid ${S.red}`, borderRadius: 6, marginBottom: 16,
                  fontSize: 12, color: S.red
                }}>
                  {authError}
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                style={{
                  width: '100%', padding: '12px 16px', backgroundColor: S.brand, color: S.white, border: 'none', borderRadius: 6,
                  fontSize: 14, fontWeight: 600, cursor: authLoading ? 'not-allowed' : 'pointer', opacity: authLoading ? 0.7 : 1,
                  transition: 'all 200ms'
                }}
              >
                {authLoading ? 'Creating account...' : 'Create account and see report'}
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0', opacity: 0.5 }}>
              <div style={{ flex: 1, height: 1, backgroundColor: S.n200 }} />
              <span style={{ fontSize: 12, color: S.n500 }}>or</span>
              <div style={{ flex: 1, height: 1, backgroundColor: S.n200 }} />
            </div>

            <Link
              href="/auth/signup?provider=google"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '10px 16px',
                backgroundColor: S.white, color: S.n700, border: `1px solid ${S.n200}`, borderRadius: 6, fontSize: 13, fontWeight: 500,
                textDecoration: 'none', cursor: 'pointer', transition: 'all 200ms'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
              </svg>
              Continue with Google
            </Link>

            <div style={{ textAlign: 'center', marginTop: 16, fontSize: 12 }}>
              Already have an account?{' '}
              <Link href="/auth/login" style={{ color: S.brand, textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
            </div>
            </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
