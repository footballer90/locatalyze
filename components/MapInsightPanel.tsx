'use client'

import { useState } from 'react'
import type { MapInsights, Competitor, Anchor } from './MapboxMap'

// ── Design tokens ─────────────────────────────────────────────────────────────
const S = {
  font:        "'DM Sans','Helvetica Neue',Arial,sans-serif",
  mono:        "'JetBrains Mono','Fira Mono','Courier New',monospace",
  brand:       '#0F766E',
  brandFaded:  '#F0FDFA',
  emerald:     '#059669',
  emeraldBg:   '#ECFDF5',
  amber:       '#D97706',
  amberBg:     '#FFFBEB',
  amberBdr:    '#FDE68A',
  red:         '#DC2626',
  redBg:       '#FEF2F2',
  indigo:      '#4338CA',
  indigoBg:    '#EEF2FF',
  slate400:    '#94A3B8',
  n50:         '#FAFAF9',
  n100:        '#F5F5F4',
  n200:        '#E7E5E4',
  n400:        '#A8A29E',
  n500:        '#78716C',
  n700:        '#44403C',
  n800:        '#292524',
  n900:        '#1C1917',
  white:       '#FFFFFF',
  iso5:        '#0F766E',
  iso10:       '#6366F1',
  iso10faded:  '#EEF2FF',
}

type Severity = 'low' | 'medium' | 'high' | 'moderate' | undefined

function sevColor(v: Severity) {
  if (!v) return S.slate400
  if (v === 'high')               return S.red
  if (v === 'moderate' || v === 'medium') return S.amber
  return S.emerald
}
function sevBg(v: Severity) {
  if (!v) return S.n50
  if (v === 'high')               return S.redBg
  if (v === 'moderate' || v === 'medium') return S.amberBg
  return S.emeraldBg
}

// Anchor kind → colour (matches MapboxMap ANCHOR_COLOR)
const ANCHOR_DOT: Record<string, string> = {
  supermarket: '#F59E0B',
  bigbox:      '#8B5CF6',
  qsr:         '#EF4444',
  pharmacy:    '#10B981',
  retail:      '#3B82F6',
}

// ── Radius presets per business type ─────────────────────────────────────────
const RADIUS_PRESETS: Record<string, number[]> = {
  cafe:       [400, 800, 1500],
  restaurant: [500, 1000, 2000],
  bakery:     [400, 800, 1500],
  gym:        [1500, 3000, 5000],
  salon:      [500, 1000, 2000],
  retail:     [800, 1500, 3000],
  bar:        [400, 800, 1500],
  takeaway:   [400, 800, 1500],
  pharmacy:   [800, 1500, 3000],
  other:      [500, 1000, 2000],
}

function fmtRadius(m: number) {
  return m >= 1000 ? `${m / 1000}km` : `${m}m`
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface MapInsightPanelProps {
  insights:             MapInsights | null
  competitors:          Competitor[]
  anchors?:             Anchor[]
  businessType:         string
  onBusinessTypeChange: (type: string) => void
  radius?:              number
  onRadiusChange?:      (r: number) => void
  showHeatmap:          boolean
  onToggleHeatmap:      () => void
  businessTypes:        Array<{ id: string; label: string }>
  showIsochrones?:      boolean
  onToggleIsochrones?:  () => void
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function MapInsightPanel({
  insights, competitors, anchors = [], businessType, onBusinessTypeChange,
  radius, onRadiusChange,
  showHeatmap, onToggleHeatmap, businessTypes,
  showIsochrones = true, onToggleIsochrones,
}: MapInsightPanelProps) {
  const [listExpanded, setListExpanded]       = useState(false)
  const [tierExpanded, setTierExpanded]       = useState(false)
  const [anchorsExpanded, setAnchorsExpanded] = useState(false)

  const hasInsights = !!insights
  const densityColor = sevColor(insights?.density)
  const riskColor    = sevColor(insights?.risk)

  const tierBk    = insights?.tierBreakdown
  const totalTier = (tierBk?.budget ?? 0) + (tierBk?.mid ?? 0) + (tierBk?.premium ?? 0)

  const presets   = RADIUS_PRESETS[businessType] || RADIUS_PRESETS.other
  // Active preset = first preset whose value matches, or closest one
  const activeRadius = radius ?? presets[1]

  return (
    <div style={{
      position: 'absolute', top: 12, right: 12, width: 272,
      background: 'rgba(255,255,255,0.98)',
      backdropFilter: 'blur(18px)',
      borderRadius: 14,
      boxShadow: '0 6px 32px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
      border: `1px solid ${S.n100}`,
      fontFamily: S.font,
      overflow: 'hidden',
      zIndex: 10,
    }}>

      {/* ── Header ── */}
      <div style={{ padding: '11px 13px 9px', borderBottom: `1px solid ${S.n100}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={S.n500} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <span style={{ fontSize: 10, fontWeight: 800, color: S.n700, textTransform: 'uppercase', letterSpacing: '0.09em' }}>
              Competitor Intelligence
            </span>
          </div>
          <button
            onClick={onToggleHeatmap}
            style={{
              fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
              border: `1px solid ${showHeatmap ? S.brand : S.n200}`,
              background: showHeatmap ? S.brandFaded : S.white,
              color: showHeatmap ? S.brand : S.n400,
              cursor: 'pointer', fontFamily: S.font, transition: 'all 0.15s',
            }}
          >
            {showHeatmap ? 'Heatmap on' : 'Heatmap'}
          </button>
        </div>
        <select
          value={businessType}
          onChange={e => onBusinessTypeChange(e.target.value)}
          style={{
            width: '100%', padding: '6px 9px', fontSize: 12, fontWeight: 600,
            border: `1px solid ${S.n200}`, borderRadius: 8, background: S.n50,
            color: S.n800, fontFamily: S.font, cursor: 'pointer',
            outline: 'none', appearance: 'auto' as any,
          }}
        >
          {businessTypes.map(bt => <option key={bt.id} value={bt.id}>{bt.label}</option>)}
        </select>

        {/* ── Radius presets ── */}
        {onRadiusChange && (
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: S.n500, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }}>
              Search radius
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {presets.map(p => {
                const active = activeRadius === p
                return (
                  <button
                    key={p}
                    onClick={() => onRadiusChange(p)}
                    style={{
                      flex: 1, padding: '4px 0', fontSize: 10, fontWeight: 700,
                      borderRadius: 6,
                      border: `1px solid ${active ? S.brand : S.n200}`,
                      background: active ? S.brandFaded : S.white,
                      color: active ? S.brand : S.n500,
                      cursor: 'pointer', fontFamily: S.font,
                      transition: 'all 0.12s',
                    }}
                  >
                    {fmtRadius(p)}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Type-specific insight (restaurant dine-in vs fast food, etc.) ── */}
      {insights?.typeSpecificInsight && (
        <div style={{
          padding: '8px 13px',
          background: '#F8FAFC', borderBottom: `1px solid ${S.n100}`,
          display: 'flex', alignItems: 'flex-start', gap: 7,
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p style={{ fontSize: 10, color: '#475569', fontWeight: 600, lineHeight: 1.5, margin: 0 }}>
            {insights.typeSpecificInsight}
          </p>
        </div>
      )}

      {/* ── Gap / opportunity alert ── */}
      {(insights?.gapOpportunity || insights?.anchorInsight) && (
        <div style={{
          margin: '0', padding: '9px 13px',
          background: insights?.gapOpportunity ? S.emeraldBg : '#FFFBEB',
          borderBottom: `1px solid ${insights?.gapOpportunity ? '#A7F3D0' : '#FDE68A'}`,
          display: 'flex', flexDirection: 'column', gap: 5,
        }}>
          {insights?.gapOpportunity && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={S.emerald} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              <p style={{ fontSize: 11, color: '#065F46', fontWeight: 600, lineHeight: 1.5, margin: 0 }}>
                {insights.gapOpportunity}
              </p>
            </div>
          )}
          {insights?.anchorInsight && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
              </svg>
              <p style={{ fontSize: 11, color: '#92400E', fontWeight: 600, lineHeight: 1.5, margin: 0 }}>
                {insights.anchorInsight}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Data limited warning ── */}
      {insights?.dataLimited && (
        <div style={{
          padding: '7px 13px',
          background: S.amberBg, borderBottom: `1px solid ${S.amberBdr}`,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={S.amber} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <p style={{ fontSize: 10, color: '#92400E', fontWeight: 600, margin: 0 }}>
            Data may be limited in this area
          </p>
        </div>
      )}

      {/* ── Metrics grid ── */}
      <div style={{ padding: '10px 13px', borderBottom: `1px solid ${S.n100}` }}>
        {!hasInsights ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
            <div style={{ width: 13, height: 13, borderRadius: '50%', border: '2px solid #CBD5E1', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
            <span style={{ fontSize: 12, color: S.n400 }}>Scanning area...</span>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : (
          <>
            {/* 2×2 stat tiles */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              <Tile value={String(insights!.competitorCount500m)} label="within 500m" valueStyle={{ fontFamily: S.mono }} />
              <Tile value={String(insights!.competitorCountTotal)} label="within 1km" valueStyle={{ fontFamily: S.mono }} />
              <Tile
                value={insights!.density}
                label="density"
                valueStyle={{ color: densityColor, textTransform: 'uppercase' }}
                bg={sevBg(insights!.density)}
              />
              <Tile
                value={insights!.risk}
                label="risk level"
                valueStyle={{ color: riskColor, textTransform: 'uppercase' }}
                bg={sevBg(insights!.risk)}
              />
            </div>

            {/* Direct vs indirect breakdown */}
            {(insights!.directCount !== undefined) && (
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#475569' }} />
                  <span style={{ fontSize: 11, color: S.n700, fontWeight: 600 }}>{insights!.directCount} direct</span>
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: S.n400 }} />
                  <span style={{ fontSize: 11, color: S.n500 }}>{insights!.indirectCount} indirect</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Tier breakdown ── */}
      {hasInsights && tierBk && totalTier > 0 && (
        <div style={{ padding: '9px 13px', borderBottom: `1px solid ${S.n100}` }}>
          <button
            onClick={() => setTierExpanded(v => !v)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: 'none', background: 'none', cursor: 'pointer', padding: '2px 0', fontFamily: S.font }}
          >
            <span style={{ fontSize: 10, fontWeight: 800, color: S.n700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Market positioning</span>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={S.n400} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: tierExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {/* Always-visible stacked bar */}
          <div style={{ height: 5, borderRadius: 3, background: S.n100, marginTop: 8, overflow: 'hidden', display: 'flex', gap: 1 }}>
            {tierBk.budget  > 0 && <div style={{ flex: tierBk.budget,  background: S.slate400, borderRadius: '3px 0 0 3px' }} />}
            {tierBk.mid     > 0 && <div style={{ flex: tierBk.mid,     background: '#475569' }} />}
            {tierBk.premium > 0 && <div style={{ flex: tierBk.premium, background: S.indigo, borderRadius: '0 3px 3px 0' }} />}
          </div>

          {tierExpanded && (
            <div style={{ marginTop: 7, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {([
                { key: 'budget',  label: 'Budget',      color: S.slate400, bg: S.n50 },
                { key: 'mid',     label: 'Mid-market',  color: '#475569',  bg: S.n50 },
                { key: 'premium', label: 'Premium',     color: S.indigo,   bg: S.indigoBg },
              ] as const).map(t => (
                <div key={t.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px', background: t.bg, borderRadius: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: t.color }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: S.n700 }}>{t.label}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 800, color: S.n900, fontFamily: S.mono }}>
                    {tierBk[t.key]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Catchment drive zones ── */}
      <div style={{ padding: '9px 13px', borderBottom: `1px solid ${S.n100}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: S.n700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Catchment zones
          </span>
          {onToggleIsochrones && (
            <button
              onClick={onToggleIsochrones}
              style={{
                fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 20,
                border: `1px solid ${showIsochrones ? S.iso10 : S.n200}`,
                background: showIsochrones ? S.iso10faded : S.white,
                color: showIsochrones ? S.iso10 : S.n400,
                cursor: 'pointer', fontFamily: S.font,
              }}
            >
              {showIsochrones ? 'Shown' : 'Show'}
            </button>
          )}
        </div>
        {[
          { color: S.iso5,  label: '5-min drive',  desc: 'Primary customer catchment' },
          { color: S.iso10, label: '10-min drive', desc: 'Extended reach' },
        ].map(z => (
          <div key={z.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <svg width="20" height="10"><line x1="0" y1="5" x2="20" y2="5" stroke={z.color} strokeWidth="2" strokeDasharray="4 2" /></svg>
            <span style={{ fontSize: 11, fontWeight: 600, color: S.n800 }}>{z.label}</span>
            <span style={{ fontSize: 10, color: S.n400 }}>{z.desc}</span>
          </div>
        ))}
      </div>

      {/* ── Competitor list ── */}
      {competitors.length > 0 && (
        <div style={{ padding: '7px 13px', borderBottom: `1px solid ${S.n100}` }}>
          <button
            onClick={() => setListExpanded(v => !v)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '3px 0', border: 'none', background: 'none', cursor: 'pointer', fontFamily: S.font }}
          >
            <span style={{ fontSize: 11, fontWeight: 700, color: S.n700 }}>
              Nearby ({competitors.length})
            </span>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={S.n400} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: listExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {listExpanded && (
            <div style={{ maxHeight: 160, overflowY: 'auto', marginTop: 5 }}>
              {competitors.slice(0, 12).map((c, i) => {
                const tierColor = c.tier === 'premium' ? S.indigo : c.tier === 'budget' ? S.n400 : '#475569'
                const isCritical = c.distance <= 500
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '5px 0',
                    borderBottom: i < Math.min(competitors.length, 12) - 1 ? `1px solid ${S.n100}` : 'none',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: tierColor, flexShrink: 0 }} />
                      <span style={{ fontSize: 11, color: S.n800, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.name}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0, marginLeft: 6 }}>
                      {c.tier && (
                        <span style={{ fontSize: 9, fontWeight: 700, color: tierColor, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {c.tier}
                        </span>
                      )}
                      <span style={{
                        fontSize: 10, fontWeight: 700, fontFamily: S.mono,
                        color: isCritical ? S.red : S.amber,
                        background: isCritical ? '#FEF2F2' : '#FFFBEB',
                        padding: '1px 5px', borderRadius: 4,
                      }}>
                        {Math.round(c.distance)}m
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Anchor tenants ── */}
      {anchors.length > 0 && (
        <div style={{ padding: '7px 13px', borderBottom: `1px solid ${S.n100}` }}>
          <button
            onClick={() => setAnchorsExpanded(v => !v)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '3px 0', border: 'none', background: 'none', cursor: 'pointer', fontFamily: S.font }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#92400E' }}>
                Anchor Tenants
              </span>
              <span style={{
                fontSize: 9, fontWeight: 800, padding: '1px 6px', borderRadius: 10,
                background: '#FEF3C7', color: '#92400E', letterSpacing: '0.04em',
              }}>
                {anchors.length}
              </span>
            </div>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={S.n400} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: anchorsExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {/* Collapsed: foot-traffic summary */}
          {!anchorsExpanded && (
            <p style={{ fontSize: 10, color: '#78716C', margin: '4px 0 0', lineHeight: 1.5 }}>
              {insights?.anchorInsight || `${anchors.length} major anchor${anchors.length > 1 ? 's' : ''} nearby — elevated foot traffic`}
            </p>
          )}

          {anchorsExpanded && (
            <div style={{ maxHeight: 150, overflowY: 'auto', marginTop: 5 }}>
              {anchors.map((a, i) => {
                const dotColor = ANCHOR_DOT[a.kind] || '#F59E0B'
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                    padding: '5px 0',
                    borderBottom: i < anchors.length - 1 ? `1px solid ${S.n100}` : 'none',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, flex: 1, minWidth: 0 }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: dotColor, flexShrink: 0, marginTop: 3 }} />
                      <div>
                        <div style={{ fontSize: 11, color: S.n800, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {a.name}
                        </div>
                        <div style={{ fontSize: 9, color: S.n500, marginTop: 1 }}>{a.footTraffic}</div>
                      </div>
                    </div>
                    <span style={{
                      fontSize: 10, fontWeight: 700, fontFamily: S.mono,
                      color: '#92400E', background: '#FEF3C7',
                      padding: '1px 5px', borderRadius: 4, flexShrink: 0, marginLeft: 6,
                    }}>
                      {Math.round(a.distance)}m
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Legend ── */}
      <div style={{ padding: '7px 13px', background: S.n50 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px 12px', marginBottom: 4 }}>
          {[
            { color: '#6366F1', label: 'Premium' },
            { color: '#475569', label: 'Casual' },
            { color: '#94A3B8', label: 'Budget' },
            { color: '#CBD5E1', label: 'Fast food' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: item.color }} />
              <span style={{ fontSize: 9, color: S.n500, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.label}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 9, color: S.n400, margin: 0 }}>
          Drag pin to explore &middot; updates automatically
        </p>
      </div>
    </div>
  )
}

// ── Small tile component ───────────────────────────────────────────────────────
function Tile({ value, label, valueStyle = {}, bg }: {
  value: string; label: string;
  valueStyle?: React.CSSProperties; bg?: string;
}) {
  return (
    <div style={{
      background: bg || '#FAFAF9', borderRadius: 9, padding: '9px 8px',
      textAlign: 'center', border: '1px solid #F5F5F4',
    }}>
      <div style={{
        fontSize: 20, fontWeight: 900, color: '#1C1917',
        letterSpacing: '-0.02em', lineHeight: 1, ...valueStyle,
      }}>
        {value}
      </div>
      <div style={{
        fontSize: 9, color: '#A8A29E', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4,
      }}>
        {label}
      </div>
    </div>
  )
}
