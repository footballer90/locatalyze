'use client'
import { useState, useEffect } from 'react'
import { MapPin, Users, Home, BarChart2, Bot, TrendingUp, Map, Globe, RefreshCw, Lightbulb, LineChart, Navigation, Zap, Shield, Trophy, Target, Activity } from 'lucide-react'

export const L = {
  white:      '#FFFFFF',
  mint:       '#F0FDF4',
  emerald:    '#10B981',
  emeraldDk:  '#059669',
  emeraldLt:  '#D1FAE5',
  emeraldXlt: '#ECFDF5',
  slate:      '#0F172A',
  muted:      '#64748B',
  border:     '#E2E8F0',
  go:         '#059669',
  goBg:       '#ECFDF5',
  goBdr:      '#A7F3D0',
  caution:    '#D97706',
  cautionBg:  '#FFFBEB',
  cautionBdr: '#FDE68A',
  danger:     '#DC2626',
  dangerBg:   '#FEF2F2',
  dangerBdr:  '#FECACA',
  amber:      '#F59E0B',
}

export const D = {
  brand:  '#0F766E',
  bl:     '#14B8A6',
  glow:   '#0FDECE',
  e:      '#34D399',
  amber:  '#FBBF24',
  text1:  '#F0FDF9',
  text2:  'rgba(204,235,229,.55)',
  text3:  'rgba(148,210,198,.28)',
  border: 'rgba(20,184,166,.14)',
}

export const font = "'DM Sans','Inter','Helvetica Neue',Arial,sans-serif"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LI_MAP: Record<string, any> = {
  mapPin: MapPin, users: Users, home: Home, barChart: BarChart2, bot: Bot,
  trendingUp: TrendingUp, map: Map, globe: Globe, refreshCw: RefreshCw,
  lightbulb: Lightbulb, lineChart: LineChart, navigation: Navigation,
  zap: Zap, shield: Shield, trophy: Trophy, target: Target, activity: Activity,
}

export function LI({ n, size = 18, color = 'currentColor', sw = 2 }: { n: string; size?: number; color?: string; sw?: number }) {
  const C = LI_MAP[n]
  if (!C) return null
  return <C size={size} color={color} strokeWidth={sw}/>
}

export function useIsMobile() {
  const [v, setV] = useState(false)
  useEffect(() => {
    const c = () => setV(window.innerWidth < 768)
    c(); window.addEventListener('resize', c)
    return () => window.removeEventListener('resize', c)
  }, [])
  return v
}