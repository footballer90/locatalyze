'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

// ─────────────────────────────────────────────────────────────────
// Design tokens — exact match to page.tsx dark sections
// ─────────────────────────────────────────────────────────────────
const D = {
  brand:  '#0F766E',
  bl:     '#14B8A6',
  glow:   '#0FDECE',
  e:      '#34D399',
  amber:  '#FBBF24',
  red:    '#EF4444',
  text1:  '#F0FDF9',
  text2:  'rgba(204,235,229,.55)',
  text3:  'rgba(148,210,198,.28)',
}

// Dark surface palette — matches DarkShowcase / data-sources section
const S = {
  card:  'rgba(10,18,16,.92)',
  card2: 'rgba(255,255,255,.04)',
  line:  'rgba(255,255,255,.07)',
  line2: 'rgba(255,255,255,.10)',
}

const font = "'DM Sans','Inter','Helvetica Neue',Arial,sans-serif"

// ─────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────
type Verdict = 'go' | 'warn' | 'no'
type Tab     = 'overview' | 'financials' | 'market' | 'swot'

interface VConfig {
  color:   string
  dim:     string
  bdr:     string
  cardBdr: string
  label:   string
}

const VERDICT_CONFIG: Record<Verdict, VConfig> = {
  go:   { color: D.e,     dim: 'rgba(52,211,153,.10)',  bdr: 'rgba(52,211,153,.22)', cardBdr: 'rgba(52,211,153,.20)', label: 'GO'      },
  warn: { color: D.amber, dim: 'rgba(251,191,36,.10)',  bdr: 'rgba(251,191,36,.22)', cardBdr: 'rgba(251,191,36,.18)', label: 'CAUTION' },
  no:   { color: D.red,   dim: 'rgba(239,68,68,.08)',   bdr: 'rgba(239,68,68,.20)',  cardBdr: 'rgba(239,68,68,.18)', label: 'NO'      },
}

// ─────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────
interface MarkerData {
  x: number; y: number
  t: 'target' | 'comp' | 'ind' | 'anc'
  n: string; c: string
  d?: string; r?: string; note?: string
}

interface ReportData {
  loc:            string
  biz:            string
  type:           string
  score:          number
  metrics:        { l: string; v: string; d: string; c: string }[]
  ai:             string
  pentagon:       { name: string; val: number; color: string }[]
  finCards:       { l: string; v: string; s: string }[]
  finRows:        { l: string; v: string; div?: boolean; hi?: boolean; pos?: boolean }[]
  mapMarkers:     MarkerData[]
  compStats:      { v: string; l: string; c: string }[]
  swot:           { s: string[]; w: string[]; o: string[]; t: string[] }
  scoreBreakdown: { n: string; v: number; c: string; w?: string }[]
  locRows:        { k: string; v: string; hi: string }[]
  nearest:        { n: string; d: string; r: string; c: string }[]
}

const DATA: Record<Verdict, ReportData> = {

  // ── GO ──────────────────────────────────────────────────────────
  go: {
    loc:   'Subiaco, WA — Perth',
    biz:   'Specialty Coffee Shop',
    type:  'Cafe / Hospitality',
    score: 82,
    metrics: [
      { l: 'Est. monthly revenue', v: '$78k–$88k', d: 'range estimate', c: D.e },
      { l: 'Monthly Profit',   v: '$27,200',  d: '~33% margin',       c: D.e },
      { l: 'Break-even (est.)',   v: '35–50/day', d: 'assumptions-based', c: D.e },
      { l: 'Competitors 800m', v: '4',        d: 'Low density',       c: D.e },
    ],
    ai: 'Strong directional signal. Competitor density is low and demographic income is above average for this category. This location warrants further investigation — visit in person and validate foot traffic before committing.',
    pentagon: [
      { name: 'Rent Afford.',  val: 78, color: D.e     },
      { name: 'Profitability', val: 90, color: D.e     },
      { name: 'Competition',   val: 72, color: D.amber },
      { name: 'Demographics',  val: 88, color: D.e     },
    ],
    finCards: [
      { l: 'Est. monthly revenue', v: '$78k–$88k', s: 'range estimate' },
      { l: 'Monthly Profit',  v: '$27,200',  s: 'After all costs'   },
      { l: 'Est. annual revenue', v: '$936k–$1.06m', s: 'range estimate' },
      { l: 'Setup Cost Est.', v: '$185,000', s: 'Fit-out + equip.'  },
    ],
    finRows: [
      { l: 'Rent',            v: '$3,800'  },
      { l: 'Staff (3 FTE)',   v: '$22,000' },
      { l: 'COGS (28%)',      v: '$23,240' },
      { l: 'Utilities & ops', v: '$4,800'  },
      { l: 'Marketing',       v: '$2,000'  },
      { l: 'Total Expenses',  v: '$55,840', div: true },
      { l: 'Est. gross revenue', v: '$78k–$88k', div: true },
      { l: 'Net Profit',      v: '$27,200', div: true, hi: true, pos: true },
    ],
    mapMarkers: [
      { x: 50, y: 50, t: 'target', n: 'Your Location',       c: D.e     },
      { x: 63, y: 37, t: 'comp',   n: 'Subi Espresso',       c: D.red,  d: '210m', r: '4.2' },
      { x: 36, y: 44, t: 'comp',   n: 'Park Lane Coffee',    c: D.red,  d: '320m', r: '4.5' },
      { x: 67, y: 63, t: 'ind',    n: 'Grill House Subiaco', c: D.amber,d: '360m', r: '4.1' },
      { x: 37, y: 30, t: 'anc',    n: 'Subiaco Library',     c: '#60A5FA', d: '270m', note: 'Foot traffic driver'  },
      { x: 57, y: 68, t: 'anc',    n: 'Subiaco Station',     c: '#60A5FA', d: '400m', note: '580 daily commuters' },
    ],
    compStats: [
      { v: '4',   l: 'Direct (800m)', c: D.red     },
      { v: '3',   l: 'Indirect',      c: D.amber   },
      { v: '580', l: 'Daily anchors', c: '#60A5FA' },
    ],
    swot: {
      s: ['High-income catchment — avg $88k household income within 1km', 'Only 4 cafes in 800m vs suburb avg of 9 — clear market gap', '580 daily commuters via Subiaco station'],
      w: ['Rent at $3,800/mo is above suburb average', 'Limited parking on Rokeby Road'],
      o: ['Hospital precinct drives 7-day trade', 'Underserved lunch market — no direct competitor within 600m'],
      t: ['Two premium independents with strong existing loyalty', 'Lease renewal risk in years 2–3'],
    },
    scoreBreakdown: [
      { n: 'Rent Affordability', v: 78, c: D.e,     w: '30%' },
      { n: 'Profitability',      v: 90, c: D.e,     w: '25%' },
      { n: 'Competition',        v: 72, c: D.amber, w: '25%' },
      { n: 'Area Demographics',  v: 88, c: D.e,     w: '20%' },
    ],
    locRows: [
      { k: 'Suburb',       v: 'Subiaco',  hi: ''    },
      { k: 'Avg Income',   v: '$88,000',  hi: D.e   },
      { k: 'Population',   v: '18,000',   hi: ''    },
      { k: 'Location Activity', v: '80 / 100', hi: D.e   },
      { k: 'Competition',  v: 'Low',      hi: D.e   },
      { k: 'Rent/mo',      v: '$3,500',   hi: ''    },
    ],
    nearest: [
      { n: 'Subi Espresso',    d: '210m', r: '4.2', c: D.red   },
      { n: 'Park Lane Coffee', d: '320m', r: '4.5', c: D.red   },
      { n: 'The Larder',       d: '440m', r: '4.3', c: D.amber },
    ],
  },

  // ── CAUTION ─────────────────────────────────────────────────────
  warn: {
    loc:   'Victoria Park, WA — Perth',
    biz:   'Specialty Coffee Shop',
    type:  'Cafe / Hospitality',
    score: 61,
    metrics: [
      { l: 'Monthly Revenue',  v: '$54,400',   d: '-8% vs benchmark', c: D.amber },
      { l: 'Monthly Profit',   v: '$9,200',    d: '17% margin',       c: D.amber },
      { l: 'Break-even (est.)',   v: '60–80/day', d: 'higher risk', c: D.red },
      { l: 'Competitors 800m', v: '11',        d: 'Moderate density', c: D.amber },
    ],
    ai: 'Mixed signals. Moderate foot traffic and a competitive market create uncertainty. Revenue projections are below benchmark. This location can work with a strong concept differentiator — a generic offering will struggle here.',
    pentagon: [
      { name: 'Rent Afford.',  val: 74, color: D.e     },
      { name: 'Profitability', val: 58, color: D.amber },
      { name: 'Competition',   val: 44, color: D.red   },
      { name: 'Demographics',  val: 68, color: D.amber },
    ],
    finCards: [
      { l: 'Monthly Revenue', v: '$54,400',  s: 'Projected year 1'  },
      { l: 'Monthly Profit',  v: '$9,200',   s: 'After all costs'   },
      { l: 'Est. annual revenue', v: '$480k–$720k', s: 'range estimate' },
      { l: 'Setup Cost Est.', v: '$175,000', s: 'Fit-out + equip.'  },
    ],
    finRows: [
      { l: 'Rent',             v: '$2,100'  },
      { l: 'Staff (2.5 FTE)',  v: '$18,500' },
      { l: 'COGS (28%)',       v: '$15,232' },
      { l: 'Utilities & ops',  v: '$4,200'  },
      { l: 'Marketing',        v: '$2,500'  },
      { l: 'Total Expenses',   v: '$42,532', div: true },
      { l: 'Gross Revenue',    v: '$54,400', div: true },
      { l: 'Net Profit',       v: '$9,200',  div: true, hi: true, pos: true },
    ],
    mapMarkers: [
      { x: 50, y: 50, t: 'target', n: 'Your Location',           c: D.amber },
      { x: 38, y: 36, t: 'comp',   n: 'The Vic Park Roaster',    c: D.red,  d: '180m', r: '4.4' },
      { x: 62, y: 60, t: 'comp',   n: 'Albany Highway Brew',     c: D.red,  d: '240m', r: '3.9' },
      { x: 34, y: 58, t: 'comp',   n: 'Morning Ritual',          c: D.red,  d: '310m', r: '4.2' },
      { x: 66, y: 38, t: 'comp',   n: 'Pressed and Co',          c: D.red,  d: '380m', r: '4.0' },
      { x: 64, y: 26, t: 'anc',    n: 'Vic Park Shopping Strip', c: '#60A5FA', d: '350m', note: 'Main retail precinct' },
    ],
    compStats: [
      { v: '11', l: 'Direct (800m)', c: D.red     },
      { v: '6',  l: 'Indirect',      c: D.amber   },
      { v: '200',l: 'Daily anchors', c: '#60A5FA' },
    ],
    swot: {
      s: ['Low rent at $2,100/mo provides buffer in slow periods', 'Gentrifying suburb — rising resident income trend'],
      w: ['High competition density — 11 cafes within 800m', 'Below-average foot traffic vs benchmark suburbs'],
      o: ['No specialty third-wave concept in suburb yet', 'Growing residential density from new apartments'],
      t: ['Market close to saturation for standard cafe format', 'Two new venues opening on Albany Highway in Q3'],
    },
    scoreBreakdown: [
      { n: 'Rent Affordability', v: 74, c: D.e,     w: '30%' },
      { n: 'Profitability',      v: 58, c: D.amber, w: '25%' },
      { n: 'Competition',        v: 44, c: D.red,   w: '25%' },
      { n: 'Area Demographics',  v: 68, c: D.amber, w: '20%' },
    ],
    locRows: [
      { k: 'Suburb',       v: 'Victoria Park', hi: ''      },
      { k: 'Avg Income',   v: '$70,000',       hi: ''      },
      { k: 'Population',   v: '14,000',        hi: ''      },
      { k: 'Foot Traffic', v: '65 / 100',      hi: D.amber },
      { k: 'Competition',  v: 'Moderate',      hi: D.amber },
      { k: 'Rent/mo',      v: '$2,100',        hi: D.e     },
    ],
    nearest: [
      { n: 'The Vic Park Roaster', d: '180m', r: '4.4', c: D.red },
      { n: 'Albany Highway Brew',  d: '240m', r: '3.9', c: D.red },
      { n: 'Morning Ritual',       d: '310m', r: '4.2', c: D.red },
    ],
  },

  // ── NO ──────────────────────────────────────────────────────────
  no: {
    loc:   'Northbridge, WA — Perth',
    biz:   'Specialty Coffee Shop',
    type:  'Cafe / Hospitality',
    score: 38,
    metrics: [
      { l: 'Monthly Revenue',  v: '$42,100',    d: '-31% vs benchmark', c: D.red },
      { l: 'Monthly Profit',   v: '-$3,400',    d: 'Net loss',          c: D.red },
      { l: 'Break-even (est.)',   v: '80–100/day', d: 'very high risk', c: D.red },
      { l: 'Competitors 800m', v: '22',         d: 'Saturated',         c: D.red },
    ],
    ai: 'Not recommended. Saturated market with 22 direct competitors within 800m. Daytime foot traffic is weak for a cafe format — this suburb activates post 6pm. Revenue projections do not support a profitable operation within a reasonable timeframe.',
    pentagon: [
      { name: 'Rent Afford.',  val: 44, color: D.red   },
      { name: 'Profitability', val: 32, color: D.red   },
      { name: 'Competition',   val: 24, color: D.red   },
      { name: 'Demographics',  val: 52, color: D.amber },
    ],
    finCards: [
      { l: 'Monthly Revenue', v: '$42,100',  s: 'Projected year 1'   },
      { l: 'Monthly Profit',  v: '-$3,400',  s: 'Net loss projected'  },
      { l: 'Annual Loss',     v: '-$40,800', s: 'Year 1 projection'  },
      { l: 'Setup Cost Est.', v: '$195,000', s: 'Fit-out + equip.'   },
    ],
    finRows: [
      { l: 'Rent',            v: '$4,200'  },
      { l: 'Staff (3 FTE)',   v: '$22,000' },
      { l: 'COGS (28%)',      v: '$11,788' },
      { l: 'Utilities & ops', v: '$5,200'  },
      { l: 'Marketing',       v: '$2,200'  },
      { l: 'Total Expenses',  v: '$45,388', div: true },
      { l: 'Gross Revenue',   v: '$42,100', div: true },
      { l: 'Net Profit',      v: '-$4,388', div: true, hi: true, pos: false },
    ],
    mapMarkers: [
      { x: 50, y: 50, t: 'target', n: 'Your Location',        c: D.red },
      { x: 38, y: 36, t: 'comp',   n: 'Northbridge Espresso', c: D.red, d: '150m', r: '4.1' },
      { x: 63, y: 40, t: 'comp',   n: 'Perth City Roasters',  c: D.red, d: '200m', r: '4.3' },
      { x: 40, y: 62, t: 'comp',   n: 'Daily Grind NB',       c: D.red, d: '280m', r: '3.8' },
      { x: 64, y: 60, t: 'comp',   n: 'Culture Coffee',       c: D.red, d: '310m', r: '4.4' },
      { x: 28, y: 52, t: 'comp',   n: 'Brew Lab Perth',       c: D.red, d: '370m', r: '4.2' },
      { x: 56, y: 28, t: 'anc',    n: 'Arts Precinct NB',     c: '#60A5FA', d: '130m', note: 'Evening only' },
    ],
    compStats: [
      { v: '22', l: 'Direct (800m)', c: D.red     },
      { v: '9',  l: 'Indirect',      c: D.amber   },
      { v: '80', l: 'Daytime foot',  c: '#60A5FA' },
    ],
    swot: {
      s: ['High foot traffic on weekends and evenings', 'Cultural diversity enables niche positioning'],
      w: ['Market saturated — 22 cafes in 800m', 'Daytime trade weak — suburb activates post 6pm', 'Rent at $4,200/mo unviable for cafe format'],
      o: ['Late-night dessert cafe format could differentiate'],
      t: ['3 new venues pending development approval', 'High staff turnover in entertainment precincts'],
    },
    scoreBreakdown: [
      { n: 'Rent Affordability', v: 44, c: D.red,   w: '30%' },
      { n: 'Profitability',      v: 32, c: D.red,   w: '25%' },
      { n: 'Competition',        v: 24, c: D.red,   w: '25%' },
      { n: 'Area Demographics',  v: 52, c: D.amber, w: '20%' },
    ],
    locRows: [
      { k: 'Suburb',       v: 'Northbridge', hi: ''      },
      { k: 'Avg Income',   v: '$68,000',     hi: D.amber },
      { k: 'Population',   v: '5,000',       hi: D.red   },
      { k: 'Foot Traffic', v: 'Eve. only',   hi: D.amber },
      { k: 'Competition',  v: 'Very High',   hi: D.red   },
      { k: 'Rent/mo',      v: '$4,200',      hi: D.red   },
    ],
    nearest: [
      { n: 'Northbridge Espresso', d: '150m', r: '4.1', c: D.red },
      { n: 'Perth City Roasters',  d: '200m', r: '4.3', c: D.red },
      { n: 'Daily Grind NB',       d: '280m', r: '3.8', c: D.red },
    ],
  },
}

// ─────────────────────────────────────────────────────────────────
// Pentagon — pure JSX SVG, name + value labels at each axis tip
// ─────────────────────────────────────────────────────────────────
function Pentagon({ items }: { items: { name: string; val: number; color: string }[] }) {
  const cx = 140, cy = 140, R = 82, N = items.length
  const ang = (i: number) => (i * 2 * Math.PI / N) - Math.PI / 2
  const pt  = (i: number, scale: number): [number, number] => [
    cx + R * scale * Math.cos(ang(i)),
    cy + R * scale * Math.sin(ang(i)),
  ]
  const dataPts   = items.map((item, i) => pt(i, item.val / 100))
  const avg       = Math.round(items.reduce((a, b) => a + b.val, 0) / N)
  const fillColor = avg >= 75 ? D.e : avg >= 55 ? D.amber : D.red

  return (
    <svg width="280" height="280" viewBox="0 0 280 280"
      style={{ display: 'block', margin: '0 auto', flexShrink: 0 }}>
      {/* Grid rings */}
      {[0.25, 0.5, 0.75, 1].map(s => (
        <polygon key={s}
          points={items.map((_, i) => pt(i, s).join(',')).join(' ')}
          fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
      ))}
      {/* Spokes */}
      {items.map((_, i) => {
        const [x, y] = pt(i, 1)
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y}
          stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
      })}
      {/* Data fill */}
      <polygon
        points={dataPts.map(p => p.join(',')).join(' ')}
        fill={`${fillColor}20`} stroke={fillColor}
        strokeWidth="1.5" strokeLinejoin="round"/>
      {/* Vertex dots */}
      {dataPts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4"
          fill={items[i].color} stroke={S.card} strokeWidth="2"/>
      ))}
      {/* Axis labels — name line then value line at each tip */}
      {items.map((item, i) => {
        const [tx, ty] = pt(i, 1.30)
        const anchor   = tx < cx - 8 ? 'end' : tx > cx + 8 ? 'start' : 'middle'
        const nameY    = ty < cy ? ty - 6   : ty + 6
        const valY     = ty < cy ? nameY - 13 : nameY + 13
        return (
          <g key={i}>
            <text x={+tx.toFixed(1)} y={+nameY.toFixed(1)}
              textAnchor={anchor as 'start'|'end'|'middle'}
              fill={D.text2} fontSize={11} fontWeight={500}
              fontFamily="DM Sans,sans-serif">
              {item.name}
            </text>
            <text x={+tx.toFixed(1)} y={+valY.toFixed(1)}
              textAnchor={anchor as 'start'|'end'|'middle'}
              fill={item.color} fontSize={13} fontWeight={700}
              fontFamily="DM Sans,sans-serif">
              {item.val}
            </text>
          </g>
        )
      })}
      {/* Centre avg circle */}
      <circle cx={cx} cy={cy} r="26"
        fill={S.card} stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
      <text x={cx} y={cy - 3} textAnchor="middle"
        fill={D.text1} fontSize={17} fontWeight={800}
        fontFamily="DM Sans,sans-serif">
        {avg}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle"
        fill={D.text3} fontSize={8} fontWeight={700}
        fontFamily="DM Sans,sans-serif" letterSpacing={1.2}>
        SCORE
      </text>
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────────
// Map — pure SVG street grid + React markers with hover tooltips
// ─────────────────────────────────────────────────────────────────
function MapMock({
  markers, compStats, color,
}: {
  markers:   MarkerData[]
  compStats: { v: string; l: string; c: string }[]
  color:     string
}) {
  const [hov, setHov] = useState<number | null>(null)

  return (
    <div>
      {/* Legend */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 10 }}>
        {[
          { c: color,     l: 'Your location'        },
          { c: D.red,     l: 'Direct competitors'   },
          { c: D.amber,   l: 'Indirect'             },
          { c: '#60A5FA', l: 'Foot traffic anchors' },
        ].map(item => (
          <div key={item.l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: D.text2 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.c, flexShrink: 0 }}/>
            {item.l}
          </div>
        ))}
      </div>

      {/* Map canvas */}
      <div style={{
        position: 'relative', height: 240, borderRadius: 10,
        border: `1px solid ${S.line2}`, overflow: 'hidden',
        background: '#071A14', marginBottom: 12,
      }}>
        {/* SVG street grid */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          viewBox="0 0 100 100" preserveAspectRatio="none">
          {[20, 35, 50, 65, 80].map(v => (
            <g key={v}>
              <line x1={v} y1={0}   x2={v}   y2={100} stroke="rgba(255,255,255,.04)" strokeWidth=".7"/>
              <line x1={0} y1={v}   x2={100} y2={v}   stroke="rgba(255,255,255,.04)" strokeWidth=".7"/>
            </g>
          ))}
          {([
            [22,22,11,11],[35,22,13,11],[22,35,11,13],[35,35,13,13],
            [50,22,13,11],[65,22,13,11],[50,35,13,13],[65,35,13,11],
            [22,50,11,13],[35,50,13,13],[22,65,11,13],[35,65,13,11],
            [50,50,13,13],[65,50,13,11],[50,65,13,13],[65,65,13,11],
          ] as [number,number,number,number][]).map(([x,y,w,h], i) => (
            <rect key={i} x={x} y={y} width={w} height={h}
              fill="rgba(15,118,110,.06)" stroke="rgba(20,184,166,.06)" strokeWidth=".4"/>
          ))}
          {/* 800m radius ring */}
          <circle cx="50" cy="50" r="32" fill="none"
            stroke={`${color}35`} strokeWidth=".8" strokeDasharray="2 2"/>
        </svg>

        {/* Markers */}
        {markers.map((m, i) => {
          const isTarget = m.t === 'target'
          const size     = isTarget ? 16 : 11
          return (
            <div key={i}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
              style={{
                position: 'absolute',
                left: `${m.x}%`, top: `${m.y}%`,
                transform: 'translate(-50%,-50%)',
                zIndex: isTarget ? 10 : 5,
                cursor: 'default',
              }}>
              <div style={{
                width: size, height: size, borderRadius: '50%',
                background: m.c,
                border: `${isTarget ? 3 : 2}px solid rgba(255,255,255,${isTarget ? .9 : .65})`,
                boxShadow: isTarget
                  ? `0 0 0 5px ${m.c}28, 0 2px 10px rgba(0,0,0,.6)`
                  : `0 2px 8px rgba(0,0,0,.5)`,
                transition: 'transform .15s',
                transform: hov === i ? 'scale(1.3)' : 'scale(1)',
              }}/>
              {/* Tooltip */}
              {hov === i && (
                <div style={{
                  position: 'absolute',
                  bottom: 'calc(100% + 7px)', left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#0C1E18',
                  border: '1px solid rgba(45,212,191,.22)',
                  borderRadius: 8, padding: '8px 11px',
                  minWidth: 144, zIndex: 20,
                  boxShadow: '0 6px 24px rgba(0,0,0,.7)',
                  pointerEvents: 'none', whiteSpace: 'nowrap',
                }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: D.text1, marginBottom: 3 }}>{m.n}</p>
                  {m.t === 'anc'
                    ? <p style={{ fontSize: 11, color: '#60A5FA' }}>{m.note}</p>
                    : m.t !== 'target'
                    ? <p style={{ fontSize: 11, color: D.text2 }}>{m.d} &middot; {m.r} stars</p>
                    : null
                  }
                </div>
              )}
            </div>
          )
        })}

        {/* You label */}
        <div style={{
          position: 'absolute', left: '50%', top: 'calc(50% + 11px)',
          transform: 'translateX(-50%)',
          background: color, color: '#fff',
          borderRadius: 4, padding: '1px 6px',
          fontSize: 9, fontWeight: 800, zIndex: 10, letterSpacing: '.04em',
        }}>
          You
        </div>
      </div>

      {/* Comp stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
        {compStats.map(s => (
          <div key={s.l} style={{
            background: S.card2, border: `1px solid ${S.line}`,
            borderRadius: 9, padding: '11px 10px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: s.c, marginBottom: 3 }}>{s.v}</div>
            <div style={{
              fontSize: 10, fontWeight: 600, color: D.text3,
              textTransform: 'uppercase', letterSpacing: '.06em',
            }}>
              {s.l}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// Animated score bar
// ─────────────────────────────────────────────────────────────────
function ScoreBar({ n, v, c, delay, fired, w }: {
  n: string; v: number; c: string; delay: number; fired: boolean; w?: string
}) {
  return (
    <div style={{ marginBottom: 9 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, color: D.text2 }}>{n}</span>
          {w && <span style={{ fontSize: 10, color: D.text3, fontWeight: 600 }}>{w}</span>}
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: c }}>{v}</span>
      </div>
      <div style={{ height: 3, background: S.line2, borderRadius: 2, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 2, background: c,
          width: fired ? `${v}%` : '0%',
          transition: `width 1s cubic-bezier(.4,0,.2,1) ${delay}s`,
        }}/>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────
export default function ReportDemoSection() {
  const [verdict, setVerdict] = useState<Verdict>('go')
  const [tab,     setTab]     = useState<Tab>('overview')
  const [fading,  setFading]  = useState(false)
  const [fired,   setFired]   = useState(false)
  const [score,   setScore]   = useState(0)
  const [visible, setVisible] = useState(true)  // start visible so score animates immediately
  const sectionRef = useRef<HTMLElement>(null)

  const d  = DATA[verdict]
  const vc = VERDICT_CONFIG[verdict]

  function switchTo(v: Verdict) {
    if (v === verdict) return
    setFading(true)
    setTimeout(() => {
      setVerdict(v); setTab('overview')
      setFading(false); setFired(false); setScore(0)
    }, 160)
  }

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    setScore(0)
    const target = d.score
    let n = 0
    const id = setInterval(() => {
      n = Math.min(n + 2, target); setScore(n)
      if (n >= target) clearInterval(id)
    }, 14)
    return () => clearInterval(id)
  }, [visible, verdict])

  useEffect(() => {
    setFired(false)
    const id = setTimeout(() => setFired(true), 240)
    return () => clearTimeout(id)
  }, [verdict, tab])

  const date = new Date().toLocaleDateString('en-AU', {
    day: '2-digit', month: 'short', year: 'numeric',
  })

  const SWOT_Q = [
    { key: 's' as const, label: 'Strengths',     hc: D.e     },
    { key: 'w' as const, label: 'Weaknesses',    hc: D.amber },
    { key: 'o' as const, label: 'Opportunities', hc: D.bl    },
    { key: 't' as const, label: 'Threats',       hc: D.red   },
  ]

  const TABS: { id: Tab; label: string }[] = [
    { id: 'overview',   label: 'Overview'   },
    { id: 'financials', label: 'Financials' },
    { id: 'market',     label: 'Market Map' },
    { id: 'swot',       label: 'SWOT'       },
  ]

  return (
    <section ref={sectionRef} style={{
      background: `
        radial-gradient(ellipse 80% 60% at 10% 20%, rgba(15,118,110,.18) 0%, transparent 55%),
        radial-gradient(ellipse 60% 50% at 90% 80%, rgba(6,95,70,.15)   0%, transparent 55%),
        linear-gradient(160deg, #061412 0%, #030C0B 50%, #071814 100%)
      `,
      padding: '80px 24px 100px',
      fontFamily: font,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, ${'#14B8A6'}80 50%, transparent)`, zIndex: 5,
      }}/>
      {/* Bottom accent line */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, ${'#14B8A6'}50 50%, transparent)`, zIndex: 5,
      }}/>

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 2 }}>

        {/* Section header */}
        <div style={{ marginBottom: 44 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'rgba(15,118,110,.14)',
            border: '1px solid rgba(15,222,206,.25)',
            borderRadius: 30, padding: '4px 14px 4px 10px',
            fontSize: 11, fontWeight: 700, color: D.glow,
            letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 18,
          }}>
            <span style={{
              width: 5, height: 5, borderRadius: '50%',
              background: D.glow, display: 'inline-block',
              animation: 'rds-pulse 2s infinite',
            }}/>
            Live product demo
          </div>
          <h2 style={{
            fontSize: 'clamp(28px,3.5vw,46px)',
            fontWeight: 800, letterSpacing: '-.5px', lineHeight: 1.1, marginBottom: 12,
            background: `linear-gradient(135deg, ${D.text1} 30%, ${D.glow} 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            See exactly what your report looks like
          </h2>
          <p style={{ fontSize: 15, color: D.text2, lineHeight: 1.7, maxWidth: 500 }}>
            Switch between verdict scenarios. Real scoring logic, real data structure — generated from your address.
          </p>
        </div>

        {/* Verdict switcher */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
          {(['go', 'warn', 'no'] as Verdict[]).map(v => {
            const c      = VERDICT_CONFIG[v]
            const active = verdict === v
            return (
              <button key={v} onClick={() => switchTo(v)} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 18px', borderRadius: 8, cursor: 'pointer',
                border: `1px solid ${active ? c.bdr : S.line2}`,
                background: active ? c.dim : S.card2,
                color: active ? c.color : D.text2,
                fontFamily: font, fontSize: 13, fontWeight: 600,
                transition: 'all .18s',
              }}>
                <span style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: active ? c.color : D.text3,
                  flexShrink: 0, transition: 'background .18s',
                }}/>
                {v === 'go' ? 'GO — Best case' : v === 'warn' ? 'CAUTION — Mixed signals' : 'NO — Avoid'}
              </button>
            )
          })}
        </div>

        {/* Main layout — main card + sidebar */}
        <div className="rds-grid" style={{
          opacity: fading ? 0 : 1, transition: 'opacity .16s',
          display: 'grid', gridTemplateColumns: '1fr 320px',
          gap: 12, alignItems: 'start',
        }}>

          {/* Main card */}
          <div style={{
            background: S.card, borderRadius: 14,
            border: `1px solid ${vc.cardBdr}`, overflow: 'hidden',
            transition: 'border-color .3s',
          }}>

            {/* Top bar */}
            <div style={{
              padding: '18px 20px 14px', borderBottom: `1px solid ${S.line}`,
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'flex-start', gap: 12, flexWrap: 'wrap',
            }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: D.text3, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 4 }}>{d.loc}</div>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, color: D.text1 }}>{d.biz}</div>
                <div style={{ fontSize: 12, color: D.text2, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span>{date}</span>
                  <span style={{ color: D.text3 }}>·</span>
                  <span>{d.type}</span>
                  <span style={{ color: D.text3 }}>·</span>
                  <span style={{
                    background: 'rgba(52,211,153,.1)', border: '1px solid rgba(52,211,153,.22)',
                    borderRadius: 4, padding: '1px 7px', fontSize: 10, fontWeight: 700, color: D.e,
                  }}>Live data</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '5px 12px', borderRadius: 6,
                  border: `1px solid ${vc.bdr}`, background: vc.dim,
                  fontSize: 13, fontWeight: 700, color: vc.color,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: vc.color, flexShrink: 0 }}/>
                  {vc.label}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1, color: D.text1, opacity: 1 }}>
                    {score > 0 ? score : d.score}<span style={{ fontSize: 14, fontWeight: 400, color: D.text3 }}>/100</span>
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: D.text3, letterSpacing: '.07em', textTransform: 'uppercase' }}>
                    Feasibility Score
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics strip */}
            <div className="rds-metrics" style={{
              display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
              borderBottom: `1px solid ${S.line}`,
            }}>
              {d.metrics.map((m, i) => (
                <div key={i} style={{ padding: '12px 16px', borderRight: i < 3 ? `1px solid ${S.line}` : 'none' }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: D.text3, letterSpacing: '.07em', textTransform: 'uppercase', marginBottom: 4 }}>{m.l}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1, marginBottom: 3, color: D.text1 }}>{m.v}</div>
                  <div style={{ fontSize: 11, fontWeight: 500, color: m.c }}>{m.d}</div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', padding: '0 20px', borderBottom: `1px solid ${S.line}` }}>
              {TABS.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)} style={{
                  padding: '11px 14px', fontSize: 13, fontWeight: 600,
                  color: tab === t.id ? D.text1 : D.text2,
                  border: 'none', background: 'transparent', cursor: 'pointer',
                  borderBottom: `2px solid ${tab === t.id ? D.bl : 'transparent'}`,
                  marginBottom: -1, transition: 'all .15s', fontFamily: font,
                }}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab panes */}
            <div style={{ padding: 20 }}>

              {/* OVERVIEW */}
              {tab === 'overview' && (
                <div>
                  <div style={{
                    background: S.card2, borderLeft: `3px solid ${D.bl}`,
                    borderRadius: '0 8px 8px 0', padding: '12px 14px', marginBottom: 20,
                  }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: D.bl, letterSpacing: '.09em', textTransform: 'uppercase', marginBottom: 6 }}>
                      AI Analysis
                    </div>
                    <div style={{ fontSize: 13, color: D.text2, lineHeight: 1.7 }}>{d.ai}</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Pentagon items={d.pentagon}/>
                  </div>
                </div>
              )}

              {/* FINANCIALS */}
              {tab === 'financials' && (
                <div>
                  <div className="rds-fincards" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
                    {d.finCards.map((c, i) => (
                      <div key={i} style={{ background: S.card2, border: `1px solid ${S.line}`, borderRadius: 10, padding: '13px 15px' }}>
                        <div style={{ fontSize: 10, fontWeight: 600, color: D.text3, letterSpacing: '.07em', textTransform: 'uppercase', marginBottom: 5 }}>{c.l}</div>
                        <div style={{ fontSize: 19, fontWeight: 700, marginBottom: 2, lineHeight: 1, color: c.v.startsWith('-') ? D.red : D.text1 }}>{c.v}</div>
                        <div style={{ fontSize: 11, color: D.text2 }}>{c.s}</div>
                      </div>
                    ))}
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr>
                        <th style={{ fontSize: 10, fontWeight: 700, color: D.text3, letterSpacing: '.07em', textTransform: 'uppercase', padding: '0 0 9px', textAlign: 'left', borderBottom: `1px solid ${S.line}` }}>Cost Item</th>
                        <th style={{ fontSize: 10, fontWeight: 700, color: D.text3, letterSpacing: '.07em', textTransform: 'uppercase', padding: '0 0 9px', textAlign: 'right', borderBottom: `1px solid ${S.line}` }}>Monthly Est.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {d.finRows.map((r, i) => (
                        <tr key={i}>
                          <td style={{ padding: '8px 0', borderBottom: i < d.finRows.length - 1 ? `1px solid ${S.line}` : 'none', borderTop: r.div ? `1px solid ${S.line2}` : 'none', color: r.div ? D.text1 : D.text2, fontWeight: r.div ? 600 : 400 }}>{r.l}</td>
                          <td style={{ padding: '8px 0', borderBottom: i < d.finRows.length - 1 ? `1px solid ${S.line}` : 'none', borderTop: r.div ? `1px solid ${S.line2}` : 'none', textAlign: 'right', fontWeight: 600, color: r.hi ? (r.pos ? D.e : D.red) : D.text1 }}>{r.v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* MARKET MAP */}
              {tab === 'market' && (
                <MapMock markers={d.mapMarkers} compStats={d.compStats} color={vc.color}/>
              )}

              {/* SWOT */}
              {tab === 'swot' && (
                <div className="rds-swot" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, borderRadius: 10, overflow: 'hidden' }}>
                  {SWOT_Q.map(q => (
                    <div key={q.key} style={{ background: S.card2, padding: '14px 16px' }}>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.09em', textTransform: 'uppercase', marginBottom: 11, display: 'flex', alignItems: 'center', gap: 8, color: q.hc }}>
                        {q.label}
                        <span style={{ flex: 1, height: 1, background: q.hc, opacity: .2 }}/>
                      </div>
                      {d.swot[q.key].map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: 7, marginBottom: 7, fontSize: 12, color: D.text2, lineHeight: 1.55, alignItems: 'flex-start' }}>
                          <div style={{ width: 4, height: 4, borderRadius: '50%', background: q.hc, flexShrink: 0, marginTop: 5.5 }}/>
                          <div>{item}</div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
          {/* End main card */}

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

            {/* Score Breakdown */}
            <div style={{ background: S.card, border: `1px solid ${S.line2}`, borderRadius: 14, padding: '16px 18px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: D.text3, letterSpacing: '.09em', textTransform: 'uppercase', marginBottom: 14 }}>Score Breakdown</div>
              {d.scoreBreakdown.map((s, i) => (
                <ScoreBar key={i} n={s.n} v={s.v} c={s.c} delay={i * 0.08} fired={fired} w={s.w}/>
              ))}
            </div>

            {/* Location Profile */}
            <div style={{ background: S.card, border: `1px solid ${S.line2}`, borderRadius: 14, padding: '16px 18px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: D.text3, letterSpacing: '.09em', textTransform: 'uppercase', marginBottom: 14 }}>Location Profile</div>
              {d.locRows.map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: i < d.locRows.length - 1 ? `1px solid ${S.line}` : 'none' }}>
                  <span style={{ fontSize: 12, color: D.text3 }}>{r.k}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: r.hi || D.text1 }}>{r.v}</span>
                </div>
              ))}
            </div>

            {/* Nearest Competitors */}
            <div style={{ background: S.card, border: `1px solid ${S.line2}`, borderRadius: 14, padding: '16px 18px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: D.text3, letterSpacing: '.09em', textTransform: 'uppercase', marginBottom: 14 }}>Nearest Competitors</div>
              {d.nearest.map((n, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px', background: S.card2, border: `1px solid ${S.line}`, borderRadius: 8, marginBottom: i < d.nearest.length - 1 ? 6 : 0 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: n.c, flexShrink: 0 }}/>
                  <div style={{ fontSize: 12, fontWeight: 600, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: D.text1 }}>{n.n}</div>
                  <div style={{ fontSize: 11, color: D.text2, flexShrink: 0 }}>{n.d}</div>
                  <div style={{ fontSize: 11, color: D.amber, flexShrink: 0 }}>{n.r}&#9733;</div>
                </div>
              ))}
            </div>

          </div>
          {/* End sidebar */}

        </div>
        {/* End layout */}

        {/* CTA banner */}
        <div style={{
          marginTop: 36, background: S.card, border: `1px solid ${S.line2}`,
          borderRadius: 14, padding: '26px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 20, flexWrap: 'wrap', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${D.e}, transparent)` }}/>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: D.bl, letterSpacing: '.09em', textTransform: 'uppercase', marginBottom: 6 }}>Sample data only</div>
            <div style={{ fontSize: 19, fontWeight: 700, marginBottom: 4, color: D.text1 }}>Your real report uses your exact address</div>
            <div style={{ fontSize: 13, color: D.text2, lineHeight: 1.6 }}>Live competitor mapping, ABS income data, AI financial model. Every report is unique.</div>
          </div>
          <Link href="/analyse" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 24px', borderRadius: 9,
            background: `linear-gradient(135deg, ${D.brand}, #0B9488)`,
            color: '#fff', fontSize: 14, fontWeight: 700,
            fontFamily: font, textDecoration: 'none',
            boxShadow: '0 4px 20px rgba(15,118,110,.35)', flexShrink: 0,
          }}>
            Get my free report
            <svg width="14" height="14" fill="none" stroke="#fff" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        <p style={{ textAlign: 'center', marginTop: 12, fontSize: 11, color: D.text3 }}>
          Sample data for demonstration only. Real reports are generated from your specific address.
        </p>

      </div>

      <style>{`
        @keyframes rds-pulse {
          0%,100% { opacity:1; transform:scale(1) }
          50%      { opacity:.3; transform:scale(.65) }
        }
        @media (max-width: 900px) {
          .rds-grid     { grid-template-columns: 1fr !important }
          .rds-metrics  { grid-template-columns: 1fr 1fr !important }
          .rds-swot     { grid-template-columns: 1fr !important }
        }
        @media (max-width: 600px) {
          .rds-fincards { grid-template-columns: 1fr !important }
        }
      `}</style>
    </section>
  )
}
