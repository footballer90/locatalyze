'use client'
// app/(marketing)/analyse/perth/page.tsx
// Perth hub page — unique angle: mining economy income advantage + best unit economics in Australia

import Link from 'next/link'
import CityBlogSection from '@/components/CityBlogSection'

const BUSINESS_TYPES = [
 {
    type: 'cafe',
  icon: '',
  label: 'Cafés & Coffee Shops',
  score: 82,
    topSuburb: 'Subiaco',
  topScore: 89,
    rent: '$4,200–$6,500/mo',
  angle: 'Mining income + low rents = best café economics in Australia',
  description: 'Perth combines higher-than-average household incomes from the mining sector with commercial rents 30–45% below Sydney equivalents. A well-located Perth café generates comparable revenue to Sydney at a fraction of the rent cost.',
  color: '#064E3B',
  accent: '#34D399',
  tag: 'Best unit economics',
 },
  {
    type: 'restaurant',
  icon: '',
  label: 'Restaurants',
  score: 79,
    topSuburb: 'Subiaco',
  topScore: 86,
    rent: '$4,500–$8,000/mo',
  angle: 'Perth dining is growing fastest of any Australian city',
  description: 'Perth\'s restaurant scene has undergone a transformation driven by rising incomes and a maturing food culture. Inner suburbs like Subiaco, Leederville and Northbridge are producing genuine dining destinations at rent levels that Sydney operators can only dream of.',
  color: '#1C0A00',
  accent: '#FDE68A',
  tag: 'Fastest growing',
 },
  {
    type: 'gym',
  icon: '',
  label: 'Gyms & Fitness Studios',
  score: 74,
    topSuburb: 'Subiaco',
  topScore: 82,
    rent: '$8,000–$14,000/mo',
  angle: 'Active lifestyle city — gym participation above national average',
  description: 'Perth has above-average gym participation rates driven by outdoor lifestyle culture and mining sector workers maintaining fitness during roster changeovers. Inner suburbs are underserved for boutique fitness compared to eastern city equivalents.',
  color: '#0F172A',
  accent: '#7DD3FC',
  tag: 'Underserved market',
 },
  {
    type: 'retail',
  icon: '',
  label: 'Retail Stores',
  score: 76,
    topSuburb: 'Subiaco',
  topScore: 84,
    rent: '$4,500–$8,500/mo',
  angle: 'Independent retail is thriving in Perth\'s inner strips',
  description: 'Oxford Street Subiaco and Beaufort Street Mount Lawley have maintained strong independent retail cultures. Perth consumers have above-average discretionary spending capacity — the mining income distribution creates a retail market that outperforms its population size.',
  color: '#1A0533',
  accent: '#E9D5FF',
  tag: 'High discretionary spend',
 },
  {
    type: 'bakery',
  icon: '🥐',
  label: 'Artisan Bakeries',
  score: 80,
    topSuburb: 'Leederville',
  topScore: 84,
    rent: '$3,500–$6,000/mo',
  angle: 'Artisan demand is growing — lower rents than east coast',
  description: 'Perth\'s artisan bakery market is 2–3 years behind Melbourne but growing rapidly. Lower rents mean the wholesale opportunity to supply local cafés creates margins that east coast bakeries cannot achieve at comparable revenue levels.',
  color: '#431407',
  accent: '#FED7AA',
  tag: 'Early mover advantage',
 },
  {
    type: 'salon',
  icon: '',
  label: 'Hair Salons',
  score: 77,
    topSuburb: 'Subiaco',
  topScore: 85,
    rent: '$3,800–$6,500/mo',
  angle: 'Mining income supports premium salon pricing',
  description: 'Perth\'s mining economy creates a premium salon customer base that doesn\'t exist at the same scale in other cities. FIFO workers returning from rotations consistently use premium grooming services — a demand pattern that sustains premium salons through economic cycles.',
  color: '#1A1A2E',
  accent: '#C4B5FD',
  tag: 'FIFO premium demand',
 },
]

const TOP_SUBURBS_OVERALL = [
  { name: 'Subiaco', postcode: '6008', scores: { cafe: 89, restaurant: 86, retail: 84, gym: 82, salon: 85 }, highlight: 'Oxford Street — Perth\'s strongest inner commercial strip' },
 { name: 'Leederville', postcode: '6007', scores: { cafe: 84, restaurant: 81, bakery: 84, retail: 78 }, highlight: 'Best rent-to-revenue in inner Perth — 20% below Subiaco rents' },
 { name: 'Mount Lawley', postcode: '6050', scores: { cafe: 81, restaurant: 79, bakery: 78, retail: 76 }, highlight: 'Beaufort Street — best entry timing in Perth right now' },
 { name: 'Northbridge', postcode: '6003', scores: { cafe: 72, restaurant: 78, gym: 74 }, highlight: 'Highest volume location — tight margins, requires differentiation' },
 { name: 'Fremantle', postcode: '6160', scores: { cafe: 68, restaurant: 74, retail: 72, bakery: 70 }, highlight: 'Tourism uplift + strong local demographic' },
]

const PERTH_STATS = [
 { value: '2.1M', label: 'metropolitan population', source: 'ABS 2025' },
 { value: '$78k', label: 'median household income', source: 'ABS 2023–24' },
 { value: '14%', label: 'annual inner café growth', source: 'ABS business counts 2026' },
 { value: '5–8%', label: 'typical café rent-to-revenue', source: 'REIWA + Locatalyze' },
]

const S = { brand: '#0F766E', brandLight: '#14B8A6', emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0', muted: '#64748B', border: '#E2E8F0', n50: '#FAFAF9', n100: '#F5F5F4', n900: '#1C1917', white: '#FFFFFF' }

function DataNote({ text }: { text: string }) { return <p style={{ fontSize: 11, color: '#94A3B8', fontStyle: 'italic', marginTop: 6, lineHeight: 1.6 }}>{text}</p> }

export default function PerthHubPage() {
 return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif", color: S.n900 }}>
   <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>

   <nav style={{ background: S.white, borderBottom: `1px solid ${S.border}`, padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
     <div style={{ width: 30, height: 30, borderRadius: 9, background: `linear-gradient(135deg,${S.brand},${S.brandLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.white, fontWeight: 800, fontSize: 14 }}><img src="/logo-mark.svg" alt="" style={{ width: '13px', height: '13px' }} /></div>
     <span style={{ fontWeight: 800, fontSize: 15, color: S.n900, letterSpacing: '-0.02em' }}>Locatalyze</span>
    </Link>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
     <Link href="/analyse" style={{ fontSize: 13, color: S.muted, textDecoration: 'none' }}>All cities</Link>
     <Link href="/onboarding" style={{ background: S.brand, color: S.white, borderRadius: 10, padding: '8px 18px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>Analyse free →</Link>
    </div>
      </nav>

      {/* Hero — green, distinct from Sydney's indigo */}
   <div style={{ background: 'linear-gradient(135deg, #022C22 0%, #064E3B 40%, #0F766E 80%, #0891B2 100%)', padding: '60px 24px 52px' }}>
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
     <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, flexWrap: 'wrap' as const }}>
      <Link href="/analyse" style={{ fontSize: 12, color: 'rgba(167,243,208,0.5)', textDecoration: 'none' }}>Location Guides</Link>
      <span style={{ fontSize: 12, color: 'rgba(167,243,208,0.3)' }}>›</span>
      <span style={{ fontSize: 12, color: 'rgba(167,243,208,0.7)' }}>Perth, WA</span>
     </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(15,118,110,0.3)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 100, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: '#34D399', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 18 }}>
       Perth Location Intelligence · Updated March 2026
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, color: '#F0FDF9', letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: 16, maxWidth: 760 }}>
      Opening a Business in Perth — Complete Location Guide
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(167,243,208,0.7)', maxWidth: 620, lineHeight: 1.75, marginBottom: 32 }}>
      Perth has Australia's best business unit economics right now. Mining-driven household incomes above the national average, commercial rents 30–45% below Sydney, and an inner suburb food and retail culture that is maturing rapidly. This guide covers all six business categories.
     </p>
          <div style={{ display: 'flex', gap: 28, flexWrap: : "wrap' as const, paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.1)" }}>
      {PERTH_STATS.map(({ value, label, source }) => (
              <div key={label}>
                <p style={{ fontSize: 22, fontWeight: 900, color: '#34D399', lineHeight: 1 }}>{value}</p>
        <p style={{ fontSize: 11, color: 'rgba(167,243,208,0.5)', marginTop: 3 }}>{label}</p>
        <p style={{ fontSize: 10, color: 'rgba(167,243,208,0.3)', marginTop: 1 }}>{source}</p>
       </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '52px 24px 80px' }}>

    <div style={{ background: '#F8FAFC', border: `1px solid ${S.border}`, borderRadius: 10, padding: '12px 16px', marginBottom: 40, display: 'flex', gap: 10 }}>
     <span style={{ fontSize: 16 }}></span>
          <p style={{ fontSize: 12, color: S.muted, lineHeight: 1.65 }}><strong style={{ color: '#44403C' }}>Data sources:</strong> ABS 2021 Census (2024–26 quarterly estimates), REIWA commercial listings Q4 2025, Geoapify Places API live competitor mapping, IBISWorld industry benchmarks, and Locatalyze's proprietary scoring model.</p>
    </div>

        <section style={{ marginBottom: 52 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>
      Why Perth's Business Location Economics Are the Best in Australia Right Now
     </h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>Perth is the most underrated business location in Australia. While investors and founders focus on Sydney and Melbourne, Perth has quietly developed the most favourable unit economics of any major Australian city — higher household incomes than the national average, combined with commercial rents that reflect a market two-to-three years behind the east coast on pricing.</p>
     <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>The mining sector creates an income distribution that doesn't exist elsewhere. A significant share of Perth's inner-suburb population earns $120,000–$200,000+ annually from mining and resources roles, creating a discretionary spending capacity that sustains premium cafés, restaurants, gyms and retail at price points that would struggle in lower-income markets.</p>
     <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85 }}>The key risk is picking the wrong suburb. Perth's strong overall market masks enormous variance — Subiaco and Leederville operate in different financial realities to Joondalup or Midland. The guides below map that variance for every business category.</p>

     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginTop: 24 }}>
      {[
              { label: 'Typical café rent-to-revenue', value: '5–8%', note: 'vs 19% average in Sydney', color: S.emerald },
       { label: 'Inner suburb rent vs Sydney', value: '-40%', note: 'Lower rents, similar revenue', color: '#0891B2' },
       { label: 'Median income advantage', value: '+19%', note: 'vs national average', color: '#7C3AED' },
       { label: 'Inner café growth rate', value: '14%/yr', note: 'Fastest in Australia', color: S.brand },
      ].map(({ label, value, note, color }) => (
              <div key={label} style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: '14px 16px', borderTop: `3px solid ${color}` }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{label}</p>
        <p style={{ fontSize: 22, fontWeight: 900, color }}>{value}</p>
                <p style={{ fontSize: 11, color: S.muted, marginTop: 3 }}>{note}</p>
              </div>
            ))}
          </div>
          <DataNote text="Rent data: REIWA commercial listings Q4 2025. Income: ABS 2023–24. Café growth: ABS business counts 2023–2026."/>
    </section>

        <section style={{ marginBottom: 52 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 8 }}>Perth Location Guides by Business Type</h2>
     <p style={{ fontSize: 14, color: S.muted, marginBottom: 28, lineHeight: 1.7 }}>Each guide covers the best and worst suburbs, financial modelling, and what specifically makes each business category succeed or fail in Perth.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
      {BUSINESS_TYPES.map((bt) => (
              <Link key={bt.type} href={`/analyse/perth/${bt.type}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 18, overflow: 'hidden', height: '100%', cursor: 'pointer' }}
         onMouseEnter={e => (e.currentTarget.style.borderColor = S.brand)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = S.border)}>
                  <div style={{ background: `linear-gradient(135deg, ${bt.color}, ${bt.color}DD)`, padding: '20px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
           <span style={{ fontSize: 28 }}>{bt.icon}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(255,255,255,0.15)', color: bt.accent, borderRadius: 6, padding: '3px 8px' }}>{bt.tag}</span>
          </div>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: bt.accent, marginBottom: 4, letterSpacing: '-0.02em' }}>{bt.label}</h3>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', fontStyle: 'italic' }}>{bt.angle}</p>
         </div>
                  <div style={{ padding: '18px 22px' }}>
          <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, marginBottom: 16 }}>{bt.description}</p>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' as const }}>
           <div>
                        <p style={{ fontSize: 10, fontWeight: 700, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Top suburb</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: S.n900 }}>{bt.topSuburb} — {bt.topScore}/100</p>
                      </div>
                      <div>
                        <p style={{ fontSize: 10, fontWeight: 700, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Typical rent</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: S.n900 }}>{bt.rent}</p>
                      </div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: S.brand }}>Read full {bt.label.toLowerCase()} guide →</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 52 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 8 }}>Perth's Best Suburbs — At a Glance</h2>
     <p style={{ fontSize: 14, color: S.muted, marginBottom: 20 }}>How Perth's top suburbs score across business categories. Scores above 70 are GO-rated.</p>
     <div style={{ overflowX: 'auto', borderRadius: 14, border: `1px solid ${S.border}` }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, background: S.white, minWidth: 640 }}>
       <thead>
                <tr style={{ borderBottom: `1px solid ${S.border}`, background: S.n50 }}>
                  {['Suburb','Postcode',' Café',' Restaurant',' Retail',' Gym','🥐 Bakery',' Salon','Highlight'].map(h => (
          <th key={h} style={{ textAlign: 'left', padding: '11px 14px', fontSize: 11, fontWeight: 700, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' as const }}>{h}</th>
         ))}
                </tr>
              </thead>
              <tbody>
                {TOP_SUBURBS_OVERALL.map((row, i) => (
                  <tr key={row.name} style={{ borderBottom: i < TOP_SUBURBS_OVERALL.length - 1 ? `1px solid ${S.n100}` : 'none' }}>
          <td style={{ padding: '11px 14px', fontWeight: 700 }}>{row.name}</td>
          <td style={{ padding: '11px 14px', color: S.muted }}>{row.postcode}</td>
          {['cafe','restaurant','retail','gym','bakery','salon'].map(type => {
           const score = (row.scores as any)[type]
                      return <td key={type} style={{ padding: '11px 14px', textAlign: 'center' }}>
            {score ? <span style={{ fontWeight: 700, color: score >= 80 ? S.emerald : score >= 70 ? '#0891B2' : '#94A3B8' }}>{score}</span> : <span style={{ color: '#E2E8F0' }}>—</span>}
           </td>
                    })}
                    <td style={{ padding: '11px 14px', fontSize: 12, color: S.muted, fontStyle: 'italic', minWidth: 200 }}>{row.highlight}</td>
         </tr>
                ))}
              </tbody>
            </table>
          </div>
          <DataNote text="Scores: Locatalyze model. ABS, REIWA, Geoapify data. March 2026."/>
    </section>

        <div style={{ background: S.emeraldBg, border: `1.5px solid ${S.emeraldBdr}`, borderRadius: 14, padding: '20px 24px', margin: '0 0 52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' as const }}>
     <div><p style={{ fontSize: 15, fontWeight: 700, color: '#065F46', marginBottom: 4 }}>Have a specific Perth address in mind?</p><p style={{ fontSize: 13, color: '#047857' }}>Get a full GO/CAUTION/NO verdict with competitor map and financial model in ~90 seconds. Free.</p></div>
     <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: S.emerald, color: S.white, borderRadius: 10, padding: '11px 20px', fontSize: 13, fontWeight: 700, textDecoration: 'none', flexShrink: 0 }}>Analyse my address →</Link>
    </div>

        <section style={{ marginBottom: 44 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: S.n900, marginBottom: 14 }}>Location guides for other Australian cities</h3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
      {[{href:'/analyse/sydney',label:' Sydney'},{href:'/analyse/melbourne',label:' Melbourne'},{href:'/analyse/brisbane',label:' Brisbane'},{href:'/analyse/adelaide',label:' Adelaide'}].map(({ href, label }) => (
       <Link key={href} href={href} style={{ fontSize: 13, color: S.brand, background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 8, padding: '8px 16px', textDecoration: 'none', fontWeight: 600 }}>{label} →</Link>
      ))}
          </div>
        </section>

        <CityBlogSection city="Perth" citySlug="perth" max={4} />

    <div style={{ background: 'linear-gradient(135deg, #022C22 0%, #064E3B 60%, #0F766E 100%)', borderRadius: 22, padding: '44px 36px', textAlign: 'center' }}>
     <div style={{ fontSize: 36, marginBottom: 12 }}></div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: '#F0FDF9', letterSpacing: '-0.03em', marginBottom: 10 }}>Ready to analyse your specific Perth address?</h2>
     <p style={{ fontSize: 15, color: 'rgba(167,243,208,0.65)', maxWidth: 500, margin: '0 auto 26px', lineHeight: 1.75 }}>Perth's strong market doesn't guarantee every location works. Run your specific address through Locatalyze before committing to anything.</p>
     <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#34D399', color: '#022C22', borderRadius: 14, padding: '15px 32px', fontSize: 15, fontWeight: 800, textDecoration: 'none' }}>Analyse my Perth address free →</Link>
     <p style={{ fontSize: 12, color: 'rgba(167,243,208,0.65)', marginTop: 10 }}>No credit card · 1 free report · ~90 seconds</p>
    </div>
      </div>
    </div>
  )
}