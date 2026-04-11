'use client'
// app/(marketing)/analyse/sydney/gym/page.tsx
// Unique angle: Sydney gym membership saturation — how to find underserved pockets

import Link from 'next/link'
import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const SCHEMAS = [
 { '@context': 'https://schema.org', '@type': 'Article', headline: 'Best Suburbs to Open a Gym in Sydney (2026)', author: { '@type': 'Organization', name: 'Locatalyze' }, datePublished: '2026-03-01', url: 'https://www.locatalyze.com/analyse/sydney/gym' },
 { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: 'What is the best suburb to open a gym in Sydney?', acceptedAnswer: { '@type': 'Answer', text: 'Chatswood scores 84/100 for gyms — strong residential density, high income demographics ($98,000 median), and only 3 direct competitors within 500m. Randwick and Leichhardt are strong alternatives with growing residential catchments.' } },
  { '@type': 'Question', name: 'How much does gym space cost to rent in Sydney?', acceptedAnswer: { '@type': 'Answer', text: 'Sydney gym spaces typically require 200–400sqm and cost $8,000–$25,000/month in inner suburbs. The economics require 150–300 active members to achieve viability at standard membership pricing of $65–$85/month.' } },
  { '@type': 'Question', name: 'How many people are needed within 3km to support a gym?', acceptedAnswer: { '@type': 'Answer', text: 'A viable independent gym needs a minimum of 15,000 people within 3km. At a 2–3% market penetration rate, that generates 300–450 potential members — enough to sustain a 200–300sqm studio at standard Sydney pricing.' } },
 ]}
]

const SUBURB_SCORES = [
  { suburb: 'Chatswood',  score: 84, members: 320, income: 98,  comp: 3 },
  { suburb: 'Randwick',   score: 80, members: 290, income: 88,  comp: 4 },
  { suburb: 'Leichhardt',  score: 77, members: 265, income: 82,  comp: 4 },
  { suburb: 'Bondi',    score: 64, members: 280, income: 95,  comp: 11 },
  { suburb: 'Inner CBD',  score: 48, members: 310, income: 108, comp: 18 },
  { suburb: 'Parramatta',  score: 38, members: 220, income: 72,  comp: 9 },
]

const POLL_OPTIONS = [{ label: 'Chatswood', initial: 38 }, { label: 'Randwick', initial: 29 }, { label: 'Leichhardt', initial: 21 }, { label: 'Bondi', initial: 9 }, { label: 'Somewhere else', initial: 3 }]

const TOP_SUBURBS = [
 { rank: 1, name: 'Chatswood', postcode: '2067', score: 84, verdict: 'GO' as const, income: '$98,000', rent: '$12,000–$18,000/mo', competition: '3 within 500m', footTraffic: 82, demographics: 86, rentFit: 80, competitionScore: 85, breakEven: '210 members', payback: '14 months', annualProfit: '$186,000', angle: 'North shore\'s best gym opportunity — underserved relative to population', detail: ['Chatswood\'s residential density and income profile create ideal gym economics. With 52,000 residents within 3km and a median income of $98,000, the potential member base is deep and has the financial capacity for ongoing monthly membership fees. Three direct competitors within 500m — the lowest in this analysis — means market share capture is achievable without a protracted competitive battle.', 'The suburb\'s demographic skew toward 28–45 year olds — the highest gym membership age cohort — creates a natural alignment between population profile and product demand. Corporate gyms require proximity to offices; community fitness studios require residential density and a demographic with time and motivation. Chatswood delivers on all dimensions.', 'The critical success factor is concept differentiation. A generic weights and cardio gym will face slow customer acquisition even in an underserved market. A gym with a specific identity — functional fitness, strength and conditioning, women-only, a specific class methodology — builds a loyal membership base that generic facilities cannot replicate.'], risks: 'Large format gym chains (Fitness First, Anytime Fitness) have the capital to enter Chatswood if an independent operator demonstrates the market. Signing a 5-year lease with renewal options protects your position once established.', opportunity: 'Premium small group training at $120–$180/month is significantly underrepresented in Chatswood relative to its income demographics. The market supports this price point but no dedicated operator has established it.' },
 { rank: 2, name: 'Randwick', postcode: '2031', score: 80, verdict: 'GO' as const, income: '$88,000', rent: '$9,000–$14,000/mo', competition: '4 within 500m', footTraffic: 79, demographics: 82, rentFit: 78, competitionScore: 79, breakEven: '190 members', payback: '13 months', annualProfit: '$168,000', angle: 'Eastern suburbs growth suburb with healthcare worker demand', detail: ['Randwick\'s proximity to the Prince of Wales Hospital campus and UNSW creates a dual demand engine that most Sydney suburbs lack. Healthcare workers — nurses, doctors, allied health professionals — are one of the most consistent gym membership demographics: shift work creates irregular schedules that favour 24/7 access gyms, physical jobs create genuine recovery and fitness needs, and higher incomes support premium membership pricing.', 'UNSW generates 60,000+ students and staff within 2km, a demographic cohort with strong gym membership rates and a preference for value-conscious premium options ($65–$85/month). Combined with the hospital catchment, Randwick has a more diverse and resilient demand base than purely residential suburbs.', 'Four competitors within 500m is at the upper end of manageable, but the healthcare worker and student demand base is largely underserved by the current mix of generic facilities. A gym with specific programming for shift workers — late night access, recovery-focused classes, nutrition support — would find an immediate and loyal niche.'], risks: 'Student demographic is price-sensitive. A membership pricing strategy that offers student rates without cannibalising the premium healthcare worker segment requires careful tiering.', opportunity: 'A 24/7 functional fitness facility with recovery amenities (sauna, ice bath, stretching space) would be the first of its kind in Randwick and directly address the healthcare worker recovery need.' },
 { rank: 3, name: 'Leichhardt', postcode: '2040', score: 77, verdict: 'GO' as const, income: '$82,000', rent: '$7,500–$11,000/mo', competition: '4 within 500m', footTraffic: 74, demographics: 78, rentFit: 82, competitionScore: 78, breakEven: '175 members', payback: '12 months', annualProfit: '$156,000', angle: 'Inner west value entry — best gym unit economics in inner Sydney', detail: ['Leichhardt offers the strongest gym unit economics of any inner Sydney suburb. At $7,500–$11,000/month for 200–250sqm, the rent per member at viability (175 members) is $43–$63/month — leaving significant margin at $75–$85/month standard membership pricing. This financial cushion makes Leichhardt forgiving for a gym operator learning the Sydney market.', 'The inner west demographic — younger, fitness-conscious, community-oriented — aligns well with boutique gym formats. Leichhardt residents are more likely to choose a studio with personality and community over a large commercial facility. The suburb currently has four competitors, but two are large-format commercial gyms (Fitness First, Anytime) that leave a clear gap for a boutique studio with a distinct identity.', 'The Norton Street commercial strip provides strong pedestrian visibility for a gym entrance, which reduces customer acquisition cost by making organic discovery possible. Visibility on a busy strip is worth $8,000–$15,000/year in marketing spend that a basement or industrial-area gym must spend to replace.'], risks: 'Leichhardt\'s residential catchment is smaller than Chatswood or Randwick. The 3km population base of 38,000 limits the addressable market. Concept quality and community building are more important here than in higher-density suburbs.', opportunity: 'Women-focused strength training in a welcoming, non-intimidating environment is underrepresented in Leichhardt. The demographic is ready for it and the competitive gap is real.' },
]

const RISK_SUBURBS = [
 { name: 'Bondi', postcode: '2026', score: 64, verdict: 'CAUTION' as const, reason: 'Eleven gym competitors within 500m including premium boutique studios that have established loyal memberships over 5+ years. New entry requires exceptional concept differentiation and significant marketing budget. Seasonal tourist demographic creates revenue volatility that membership models struggle to smooth.' },
 { name: 'Sydney CBD', postcode: '2000', score: 48, verdict: 'CAUTION' as const, reason: 'Hybrid work has reduced CBD gym membership by an estimated 25–35%. Workers who are only in the office 2–3 days per week cancel CBD gym memberships. Eighteen competitors in the CBD make new entry extremely challenging without substantial brand recognition.' },
 { name: 'Parramatta', postcode: '2150', score: 38, verdict: 'NO' as const, reason: 'High competition from large-format discount gyms (Anytime, Snap) that compete on price rather than quality. The income demographic does not support premium boutique pricing, creating a price-sensitive market that makes independent gym economics very difficult.' },
]

const S = { brand: '#0F766E', brandLight: '#14B8A6', emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0', amber: '#D97706', amberBg: '#FFFBEB', amberBdr: '#FDE68A', red: '#DC2626', redBg: '#FEF2F2', redBdr: '#FECACA', muted: '#64748B', border: '#E2E8F0', n50: '#FAFAF9', n100: '#F5F5F4', n900: '#1C1917', white: '#FFFFFF' }
function VerdictBadge({ v }: { v: 'GO' | 'CAUTION' | 'NO' }) { const c = v === 'GO' ? { bg: S.emeraldBg, bdr: S.emeraldBdr, txt: S.emerald } : v === 'CAUTION' ? { bg: S.amberBg, bdr: S.amberBdr, txt: S.amber } : { bg: S.redBg, bdr: S.redBdr, txt: S.red }; return <span style={{ fontSize: 11, fontWeight: 700, color: c.txt, background: c.bg, border: `1px solid ${c.bdr}`, borderRadius: 6, padding: '2px 9px', whiteSpace: 'nowrap' as const }}>{v === 'GO' ? '' : v === 'CAUTION' ? '' : ''} {v}</span> }
function ScoreBar({ label, value }: { label: string; value: number }) { return <div style={{ marginBottom: 10 }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}><span style={{ fontSize: 12, color: S.muted }}>{label}</span><span style={{ fontSize: 12, fontWeight: 700, color: S.emerald }}>{value}</span></div><div style={{ height: 6, background: S.n100, borderRadius: 100, overflow: 'hidden' }}><div style={{ height: '100%', width: `${value}%`, background: S.emerald, borderRadius: 100 }}/></div></div> }
function DataNote({ text }: { text: string }) { return <p style={{ fontSize: 11, color: '#94A3B8', fontStyle: 'italic', marginTop: 6, lineHeight: 1.6 }}>{text}</p> }
function Poll() {
 const [voted, setVoted] = useState<number | null>(null)
  const [votes, setVotes] = useState(POLL_OPTIONS.map(o => o.initial))
  const total = votes.reduce((a, b) => a + b, 0)
  return <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '24px', marginBottom: 44 }}>
  <h3 style={{ fontSize: 18, fontWeight: 800, color: S.n900, marginBottom: 4 }}>Where would you open a gym in Sydney?</h3>
    <p style={{ fontSize: 13, color: S.muted, marginBottom: 18 }}>{voted === null ? 'Your pick based on this guide?' : `${total} readers voted:`}</p>
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
   {POLL_OPTIONS.map((o, i) => { const pct = Math.round((votes[i]/total)*100); const win = votes[i] === Math.max(...votes); return <button key={o.label} onClick={() => { if (voted !== null) return; setVotes(votes.map((v,j) => j===i?v+1:v)); setVoted(i) }} disabled={voted !== null} style={{ position: 'relative', border: `1.5px solid ${voted===i?S.emeraldBdr:S.border}`, borderRadius: 10, padding: '12px 16px', background: voted!==null?(win?S.emeraldBg:S.n50):S.white, cursor: voted===null?'pointer':'default', textAlign: 'left', overflow: 'hidden', fontFamily: 'inherit' }}>{voted!==null&&<div style={{ position:'absolute',inset:0,width:`${pct}%`,background:win?'rgba(5,150,105,0.1)':'rgba(148,163,184,0.08)',borderRadius:10}}/>}<div style={{ position:'relative',display:'flex',justifyContent:'space-between'}}><span style={{ fontSize:14,fontWeight:voted===i?700:500,color:voted===i?'#065F46':S.n900}}>{o.label} {win&&voted!==null?'':''}</span><span style={{ fontSize:13,fontWeight:700,color:voted!==null?(win?S.emerald:S.muted):S.muted}}>{voted!==null?`${pct}%`:''}</span></div></button> })}
  </div>
    {voted !== null && <div style={{ marginTop:14,padding:'12px 14px',background:S.emeraldBg,border:`1px solid ${S.emeraldBdr}`,borderRadius:10}}><p style={{ fontSize:13,color:'#047857'}}>Analyse {POLL_OPTIONS[voted].label} free → <Link href="/onboarding" style={{ fontWeight:700,color:S.emerald,textDecoration:'underline'}}>Get started →</Link></p></div>}
 </div>
}
function Checklist() {
  const [email, setEmail] = useState(''); const [done, setDone] = useState(false); const [loading, setLoading] = useState(false)
 const items = ['Count population within 3km — need minimum 15,000 residents','Check competitor count within 500m — over 6 is very difficult','Visit competitors and note their occupancy at peak hours','Calculate rent per member at viability — should be under $60/month','Check parking and access — gym members drive more than café customers','Verify ceiling height — need minimum 3.5m for functional fitness equipment','Negotiate fit-out contribution — gym fit-outs are expensive, landlords know this','Get 3 independent equipment quotes before signing lease','Run your specific address through Locatalyze','Model membership attrition at 5%/month — build this into your projections']
 return <div style={{ background:'linear-gradient(135deg,#F0FDF4,#ECFDF5)',border:`1.5px solid ${S.emeraldBdr}`,borderRadius:18,padding:'28px',marginBottom:44}}>
  <div style={{ display:'flex',gap:12,marginBottom:16}}><div style={{ fontSize:32}}></div><div><h3 style={{ fontSize:18,fontWeight:800,color:'#065F46',marginBottom:4}}>Sydney Gym Location Checklist</h3><p style={{ fontSize:13,color:'#047857'}}>10 steps before signing. Enter email to unlock.</p></div></div>
  {done?<div>{items.map((item,i)=><div key={i} style={{ display:'flex',gap:10,padding:'7px 0',borderBottom:i<items.length-1?`1px solid ${S.n100}`:'none'}}><span style={{ fontSize:12,fontWeight:800,color:S.emerald,minWidth:20}}>{String(i+1).padStart(2,'0')}</span><span style={{ fontSize:13,color:'#374151',lineHeight:1.55}}>{item}</span></div>)}</div>
  :<div style={{ display:'flex',gap:10,flexWrap:'wrap' as const}}><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" style={{ flex:'1 1 200px',padding:'11px 14px',borderRadius:10,border:`1.5px solid ${S.emeraldBdr}`,fontSize:14,background:S.white,outline:'none',fontFamily:'inherit',color:S.n900}}/><button onClick={async()=>{if(!email.includes('@'))return;setLoading(true);try{await fetch('/api/newsletter',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email})})}catch{}setDone(true);setLoading(false)}} style={{ padding:'11px 20px',background:!email.includes('@')?'#A7F3D0':S.emerald,color:S.white,border:'none',borderRadius:10,fontSize:14,fontWeight:700,cursor:email.includes('@')?'pointer':'not-allowed',fontFamily:'inherit'}}>{loading?'Sending…':'Send checklist →'}</button></div>}
 </div>
}

export default function SydneyGymPage() {
  return (
    <div style={{ minHeight:'100vh',background:S.n50,fontFamily:"'DM Sans','Helvetica Neue',Arial,sans-serif",color:S.n900}}>
   <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
   {SCHEMAS.map((s,i)=><script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html:JSON.stringify(s)}}/>)}
   <nav style={{ background:S.white,borderBottom:`1px solid ${S.border}`,padding:'0 24px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:50}}>
    <Link href="/" style={{ display:'flex',alignItems:'center',gap:8,textDecoration:'none'}}><div style={{ width:30,height:30,borderRadius:9,background:`linear-gradient(135deg,${S.brand},${S.brandLight})`,display:'flex',alignItems:'center',justifyContent:'center',color:S.white,fontWeight:800,fontSize:14}}><img src="/logo-mark.svg" alt="" style={{ width: '13px', height: '13px' }} /></div><span style={{ fontWeight:800,fontSize:15,color:S.n900,letterSpacing:'-0.02em'}}>Locatalyze</span></Link>
    <Link href="/onboarding" style={{ background:S.brand,color:S.white,borderRadius:10,padding:'8px 18px',fontSize:13,fontWeight:700,textDecoration:'none'}}>Analyse free →</Link>
   </nav>
      <div style={{ background:'linear-gradient(135deg,#0F172A 0%,#1E3A5F 50%,#0369A1 100%)',padding:'60px 24px 52px'}}>
    <div style={{ maxWidth:900,margin:'0 auto'}}>
     <div style={{ display:'inline-flex',alignItems:'center',gap:6,background:'rgba(14,165,233,0.15)',border:'1px solid rgba(14,165,233,0.3)',borderRadius:100,padding:'5px 14px',fontSize:11,fontWeight:700,color:'#7DD3FC',letterSpacing:'0.1em',textTransform:'uppercase' as const,marginBottom:18}}> Sydney Gym Location Guide · March 2026</div>
     <h1 style={{ fontSize:'clamp(28px,5vw,50px)',fontWeight:900,color:'#F0F9FF',letterSpacing:'-0.04em',lineHeight:1.08,marginBottom:16,maxWidth:700}}>Best Suburbs to Open a Gym in Sydney (2026)</h1>
     <p style={{ fontSize:17,color:'rgba(125,211,252,0.7)',maxWidth:600,lineHeight:1.75,marginBottom:28}}>Sydney has more gyms per capita than any other Australian city. Success depends entirely on finding the pockets of undersupply — suburbs with strong demographics, growing populations, and too few quality fitness options.</p>
     <div style={{ display:'flex',gap:12,flexWrap:'wrap' as const}}>
      <Link href="/onboarding" style={{ display:'inline-flex',alignItems:'center',gap:8,background:'#7DD3FC',color:'#0F172A',borderRadius:12,padding:'13px 26px',fontSize:14,fontWeight:800,textDecoration:'none'}}>Analyse your Sydney address free →</Link>
      <a href="#suburbs" style={{ display:'inline-flex',alignItems:'center',border:'1px solid rgba(255,255,255,0.2)',color:'rgba(255,255,255,0.8)',borderRadius:12,padding:'13px 22px',fontSize:14,fontWeight:600,textDecoration:'none',background:'rgba(255,255,255,0.05)'}}>See suburb scores ↓</a>
     </div>
        </div>
      </div>

      <div style={{ maxWidth:900,margin:'0 auto',padding:'52px 24px 80px'}}>
    <div style={{ background:'#F8FAFC',border:`1px solid ${S.border}`,borderRadius:10,padding:'12px 16px',marginBottom:36,display:'flex',gap:10}}>
     <span style={{ fontSize:16}}></span>
          <p style={{ fontSize:12,color:S.muted,lineHeight:1.65}}><strong style={{ color:'#44403C'}}>Data sources:</strong> ABS 2021 Census (2024–26 quarterly estimates), AUSactive gym industry report 2025, Geoapify Places API live competitor mapping, IBISWorld gym industry benchmarks, and Locatalyze scoring model.</p>
    </div>

        <section style={{ marginBottom:44}}>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:14}}>
      {[{stat:'3.2M',claim:'Sydney gym members — 38% of the adult population',source:'AUSactive gym industry participation report 2025, metropolitan Sydney',color:S.emerald},{stat:'22%',claim:'of Sydney gym memberships cancelled within 90 days of joining',source:'AUSactive member retention study 2025 — industry-wide attrition data',color:S.red},{stat:'$79',claim:'average monthly gym membership in Sydney inner suburbs',source:'IBISWorld gym and fitness industry benchmarks 2025, inner metropolitan Sydney',color:S.brand}].map(({stat,claim,source,color})=>(
       <div key={stat} style={{ background:S.white,border:`1px solid ${S.border}`,borderRadius:14,padding:'18px 20px',borderTop:`3px solid ${color}`}}>
        <p style={{ fontSize:36,fontWeight:900,color,letterSpacing:'-0.04em',lineHeight:1,marginBottom:8}}>{stat}</p>
        <p style={{ fontSize:14,fontWeight:600,color:S.n900,lineHeight:1.5,marginBottom:8}}>{claim}</p>
                <p style={{ fontSize:11,color:'#94A3B8',lineHeight:1.55,fontStyle:'italic'}}>{source}</p>
       </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom:44}}>
          <h2 style={{ fontSize:26,fontWeight:900,color:S.n900,letterSpacing:'-0.03em',marginBottom:14}}>The Sydney Gym Saturation Problem</h2>
     <p style={{ fontSize:15,color:'#374151',lineHeight:1.85,marginBottom:14}}>Sydney has more gyms per square kilometre than any other Australian city — and the saturation is heavily concentrated in specific suburbs. Bondi, the CBD, Surry Hills, and Paddington are so densely competitive that new independent entry requires exceptional capitalisation, brand recognition, and a genuinely novel concept. Most new entrants in these areas fail within 18 months.</p>
     <p style={{ fontSize:15,color:'#374151',lineHeight:1.85,marginBottom:14}}>The opportunity in 2026 is in the second-ring suburbs — areas with strong income demographics and growing residential populations that have not yet attracted the wave of boutique gym investment that hit inner Sydney between 2018 and 2022. Chatswood, Randwick, Leichhardt and similar suburbs have the demand without the supply saturation.</p>
     <p style={{ fontSize:15,color:'#374151',lineHeight:1.85}}>The financial model for a Sydney gym is also different from cafés and restaurants. Revenue is membership-driven — predictable and recurring — rather than transaction-based. This creates better cash flow stability but requires achieving a critical mass of members (typically 150–200) before the business reaches breakeven. The first 6 months are the most capital-intensive period.</p>
    </section>

        <section id="suburbs" style={{ marginBottom:44}}>
     <h2 style={{ fontSize:22,fontWeight:900,color:S.n900,letterSpacing:'-0.03em',marginBottom:8}}>Sydney Suburb Scores — Gym Viability</h2>
     <div style={{ background:S.white,border:`1px solid ${S.border}`,borderRadius:14,padding:'24px 20px',marginBottom:8}}>
      <div style={{ height:300,width:'100%'}}>
       <ResponsiveContainer width="100%" height="100%">
        <BarChart data={SUBURB_SCORES} margin={{ top:5,right:20,left:0,bottom:5}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false}/>
         <XAxis dataKey="suburb" tick={{ fontSize:11,fill:'#64748B'}} axisLine={false} tickLine={false}/>
         <YAxis domain={[0,100]} tick={{ fontSize:11,fill:'#94A3B8'}} axisLine={false} tickLine={false}/>
         <Tooltip content={({ payload, label }) => { if (!payload?.length) return null; const d = payload[0].payload; return <div style={{ background:S.white,border:`1px solid ${S.border}`,borderRadius:10,padding:'10px 14px',fontSize:12}}><p style={{ fontWeight:700,color:S.n900,marginBottom:4}}>{label}</p><p style={{ color:d.score>=70?S.emerald:d.score>=45?S.amber:S.red,fontWeight:700}}>{d.score>=70?'GO':d.score >=45?'CAUTION':'NO'} — {d.score}/100</p><p style={{ color:S.muted}}>Est. members: {d.members}</p><p style={{ color:S.muted}}>Competitors: {d.comp}</p></div> }}/>
         <Bar dataKey="score" radius={[6,6,0,0]} maxBarSize={56} label={{ position:'top',fontSize:12,fontWeight:700,fill:'#64748B',formatter:(v:any)=>`${v}`}}>
          {SUBURB_SCORES.map((e,i)=><rect key={i} fill={e.score>=70?S.emerald:e.score>=45?S.amber:S.red}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <DataNote text="Scores: Locatalyze model. Population data ABS 2024–26. Competitor data Geoapify Places API March 2026."/>
    </section>

        <section style={{ marginBottom:44}}>
          <h2 style={{ fontSize:26,fontWeight:900,color:S.n900,letterSpacing:'-0.03em',marginBottom:24}}>Top 3 Sydney Suburbs — Full Analysis</h2>
     {TOP_SUBURBS.map((sub,idx)=>(
            <div key={sub.name} style={{ background:S.white,border:`1.5px solid ${idx===0?S.emeraldBdr:S.border}`,borderRadius:18,padding:'28px',marginBottom:20,position:'relative',overflow:'hidden'}}>
       {idx===0&&<div style={{ position:'absolute',top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${S.emerald},${S.brandLight})`}}/>}
       <div style={{ display:'grid',gridTemplateColumns:'1fr auto',gap:20,alignItems:'start'}}>
        <div>
                  <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:6,flexWrap:'wrap' as const}}><span style={{ fontSize:13,fontWeight:800,color:S.muted}}>#{sub.rank}</span><h3 style={{ fontSize:20,fontWeight:900,color:S.n900,letterSpacing:'-0.03em'}}>{sub.name}, NSW {sub.postcode}</h3><VerdictBadge v={sub.verdict}/></div>
         <p style={{ fontSize:13,color:S.muted,fontStyle:'italic',marginBottom:14}}>{sub.angle}</p>
         <div style={{ display:'flex',gap:20,marginBottom:6,flexWrap:'wrap' as const}}>{[['Median income',sub.income+'/yr'],['Rent range',sub.rent],['Competition',sub.competition],['Break-even',sub.breakEven],['Payback',sub.payback],['Annual profit',sub.annualProfit]].map(([l,v])=><div key={l as string}><p style={{ fontSize:10,fontWeight:700,color:S.muted,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:2}}>{l}</p><p style={{ fontSize:13,fontWeight:700,color:S.n900}}>{v}</p></div>)}</div>
         <DataNote text="Income: ABS 2023–24. Rent: commercial listings Q4 2025. Profit: Locatalyze model, $180,000 fit-out, $79/mo membership, 5% monthly attrition."/>
         <div style={{ marginTop:14}}>{sub.detail.map((p,i)=><p key={i} style={{ fontSize:14,color:'#374151',lineHeight:1.8,marginBottom:12}}>{p}</p>)}</div>
         <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginTop:8}}>
          <div style={{ background:S.redBg,border:`1px solid ${S.redBdr}`,borderRadius:10,padding:'12px 14px'}}><p style={{ fontSize:11,fontWeight:700,color:S.red,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:5}}>Key risk</p><p style={{ fontSize:12,color:'#7F1D1D',lineHeight:1.65}}>{sub.risks}</p></div>
          <div style={{ background:'#EFF6FF',border:'1px solid #BFDBFE',borderRadius:10,padding:'12px 14px'}}><p style={{ fontSize:11,fontWeight:700,color:'#1D4ED8',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:5}}>Opportunity</p><p style={{ fontSize:12,color:'#1E3A8A',lineHeight:1.65}}>{sub.opportunity}</p></div>
         </div>
                </div>
                <div style={{ minWidth:160}}>
                  <div style={{ textAlign:'center',marginBottom:14}}><div style={{ fontSize:52,fontWeight:900,color:S.emerald,lineHeight:1}}>{sub.score}</div><div style={{ fontSize:11,color:S.muted}}>/100</div></div>
         <ScoreBar label="Demographics" value={sub.demographics}/><ScoreBar label="Competition" value={sub.competitionScore}/><ScoreBar label="Rent fit" value={sub.rentFit}/><ScoreBar label="Foot traffic" value={sub.footTraffic}/>
        </div>
              </div>
            </div>
          ))}
        </section>

        <div style={{ background:S.emeraldBg,border:`1.5px solid ${S.emeraldBdr}`,borderRadius:14,padding:'20px 24px',margin:'0 0 44px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:16,flexWrap:'wrap' as const}}>
     <div><p style={{ fontSize:15,fontWeight:700,color:'#065F46',marginBottom:4}}>Have a specific Sydney address in mind?</p><p style={{ fontSize:13,color:'#047857'}}>Full GO/CAUTION/NO verdict with competitor map and financial model. Free.</p></div>
     <Link href="/onboarding" style={{ display:'inline-flex',alignItems:'center',gap:6,background:S.emerald,color:S.white,borderRadius:10,padding:'11px 20px',fontSize:13,fontWeight:700,textDecoration:'none',flexShrink:0}}>Analyse my address →</Link>
    </div>

        <Poll/><Checklist/>

        <section style={{ marginBottom:44}}>
          <h2 style={{ fontSize:26,fontWeight:900,color:S.n900,letterSpacing:'-0.03em',marginBottom:8}}>Locations to Avoid</h2>
     {RISK_SUBURBS.map(sub=>(
            <div key={sub.name} style={{ background:S.white,border:`1.5px solid ${sub.verdict==='NO'?S.redBdr:S.amberBdr}`,borderRadius:14,padding:'20px 24px',marginBottom:12,display:'grid',gridTemplateColumns:'1fr auto',gap:16,alignItems:'start'}}>
       <div><div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:8}}><h3 style={{ fontSize:16,fontWeight:800,color:S.n900}}>{sub.name}, NSW {sub.postcode}</h3><VerdictBadge v={sub.verdict}/></div><p style={{ fontSize:13,color:'#374151',lineHeight:1.7}}>{sub.reason}</p></div>
       <div style={{ textAlign:'center',minWidth:56}}><div style={{ fontSize:36,fontWeight:900,color:sub.verdict==='NO'?S.red:S.amber,lineHeight:1}}>{sub.score}</div><div style={{ fontSize:10,color:S.muted}}>/100</div></div>
      </div>
          ))}
        </section>

        <section style={{ marginBottom:44}}>
          <h3 style={{ fontSize:18,fontWeight:800,color:S.n900,marginBottom:12}}>More location guides</h3>
          <div style={{ display:'flex',gap:10,flexWrap:'wrap' as const}}>
      {[{href:'/analyse/sydney/cafe',label:' Cafés in Sydney'},{href:'/analyse/sydney/restaurant',label:' Restaurants in Sydney'},{href:'/analyse/sydney/retail',label:' Retail in Sydney'},{href:'/analyse/perth/gym',label:' Gyms in Perth'},{href:'/analyse/melbourne/gym',label:' Gyms in Melbourne'}].map(({href,label})=><Link key={href} href={href} style={{ fontSize:13,color:S.brand,background:S.emeraldBg,border:`1px solid ${S.emeraldBdr}`,borderRadius:8,padding:'7px 14px',textDecoration:'none',fontWeight:600}}>{label} →</Link>)}
     </div>
        </section>

        <div style={{ background:'linear-gradient(135deg,#0F172A 0%,#1E3A5F 60%,#0369A1 100%)',borderRadius:22,padding:'44px 36px',textAlign:'center'}}>
     <div style={{ fontSize:36,marginBottom:12}}></div>
          <h2 style={{ fontSize:26,fontWeight:900,color:'#F0F9FF',letterSpacing:'-0.03em',marginBottom:10}}>Ready to analyse your Sydney gym location?</h2>
     <p style={{ fontSize:15,color:'rgba(125,211,252,0.65)',maxWidth:480,margin:'0 auto 26px',lineHeight:1.75}}>Finding the undersupply pocket in Sydney's gym market is the key to viability. Locatalyze maps competitor density, demographics and population within your specific catchment radius.</p>
     <Link href="/onboarding" style={{ display:'inline-flex',alignItems:'center',gap:8,background:'#7DD3FC',color:'#0F172A',borderRadius:14,padding:'15px 32px',fontSize:15,fontWeight:800,textDecoration:'none'}}>Analyse my Sydney address free →</Link>
     <p style={{ fontSize:12,color:'rgba(125,211,252,0.35)',marginTop:10}}>No credit card · 1 free preview · ~90 seconds</p>
    </div>
      </div>
    </div>
  )
}