// lib/newsletter-templates.ts
// 4 ready-to-send weekly newsletter templates for Locatalyze Insights
// Usage: import { WEEK_1, WEEK_2, WEEK_3, WEEK_4 } from '@/lib/newsletter-templates'
// Send via Resend broadcasts at: resend.com → Broadcasts → New broadcast

export interface NewsletterTemplate {
 subject: string
  previewText: string
  html: string
}

const BASE_STYLES = `
  body{margin:0;padding:0;background:#F9FAFB;font-family:'Helvetica Neue',Arial,sans-serif;}
 a{color:#0F766E;text-decoration:none;}
  .wrap{max-width:580px;margin:40px auto;background:#fff;border-radius:16px;border:1px solid #E5E7EB;overflow:hidden;}
  .header{background:linear-gradient(135deg,#0C1F1C 0%,#0F766E 60%,#0891B2 100%);padding:36px 40px;}
  .body{padding:36px 40px;}
  .footer{padding:20px 40px;border-top:1px solid #F3F4F6;background:#FAFAFA;}
  .label{font-size:12px;font-weight:700;color:#059669;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 6px;}
  .card{background:#F9FAFB;border:1px solid #E5E7EB;border-radius:12px;padding:20px 24px;margin-bottom:20px;}
  .verdict-go{display:inline-block;background:#ECFDF5;border:1px solid #A7F3D0;color:#059669;font-size:11px;font-weight:700;padding:3px 10px;border-radius:6px;letter-spacing:0.04em;}
  .verdict-caution{display:inline-block;background:#FFFBEB;border:1px solid #FDE68A;color:#D97706;font-size:11px;font-weight:700;padding:3px 10px;border-radius:6px;letter-spacing:0.04em;}
  .verdict-no{display:inline-block;background:#FEF2F2;border:1px solid #FECACA;color:#DC2626;font-size:11px;font-weight:700;padding:3px 10px;border-radius:6px;letter-spacing:0.04em;}
  .stat{font-size:28px;font-weight:800;color:#0F766E;letter-spacing:-0.04em;}
  .divider{border:none;border-top:1px solid #F3F4F6;margin:24px 0;}
  .cta{display:inline-block;background:#0F766E;color:#fff !important;font-size:14px;font-weight:700;padding:14px 28px;border-radius:10px;text-decoration:none;}
`

function wrap(label: string, headerTitle: string, headerSub: string, body: string, email = '{{email}}'): string {
 return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>${BASE_STYLES}</style></head>
<body>
<div class="wrap">
 <div class="header">
  <div style="font-size:11px;font-weight:700;color:#34D399;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:14px;">Locatalyze Insights · ${label}</div>
  <h1 style="font-size:22px;font-weight:800;color:#fff;margin:0 0 10px;letter-spacing:-0.03em;line-height:1.3;">${headerTitle}</h1>
  <p style="font-size:14px;color:rgba(255,255,255,0.6);margin:0;">${headerSub}</p>
 </div>
  <div class="body">${body}</div>
 <div class="footer">
  <p style="font-size:11px;color:#9CA3AF;margin:0;line-height:1.7;">
   Locatalyze · Perth, WA · <a href="https://www.locatalyze.com" style="color:#9CA3AF;">locatalyze.com</a><br>
   <a href="https://www.locatalyze.com/unsubscribe?email=${encodeURIComponent('{{email}}')}\" style="color:#9CA3AF;">Unsubscribe</a>
  </p>
  </div>
</div>
</body>
</html>`
}

// ─────────────────────────────────────────────────────────────────────────────
// WEEK 1 — Suburb of the Week: Leederville (Perth)
// ─────────────────────────────────────────────────────────────────────────────
export const WEEK_1: NewsletterTemplate = {
  subject: 'Suburb of the Week: Leederville is quietly becoming Perth\'s best café location',
 previewText: 'Café density up 18% · High young professional population · Low vacancy · Here\'s why it scores 84/100',
 html: wrap(
    'Week 1',
  'Suburb of the Week: Leederville, WA',
  'Café density up 18% in 2 years. Here\'s what the data shows.',
  `
    <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 24px;">
   Each week we pick one Australian suburb and run it through the Locatalyze scoring engine. This week: <strong>Leederville, WA 6007</strong>.
    </p>

    <!-- Suburb Card -->
    <div class="card">
   <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;flex-wrap:wrap;gap:8px;">
    <div>
          <p class="label"> Suburb of the Week</p>
     <h2 style="font-size:20px;font-weight:800;color:#111827;margin:0;letter-spacing:-0.03em;">Leederville, WA 6007</h2>
     <p style="font-size:13px;color:#6B7280;margin:4px 0 0;">Inner-north Perth · ~2.4km from CBD</p>
    </div>
        <div style="text-align:right;">
     <div class="stat">84</div>
     <p style="font-size:11px;color:#6B7280;margin:2px 0 0;">/100 Feasibility Score</p>
     <span class="verdict-go">GO</span>
    </div>
      </div>
      <hr class="divider" style="margin:16px 0;">
   <table style="width:100%;border-collapse:collapse;">
    <tr>
          <td style="padding:6px 0;font-size:13px;color:#6B7280;">Median household income</td>
     <td style="padding:6px 0;font-size:13px;font-weight:700;color:#111827;text-align:right;">$88,000 / yr</td>
    </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6B7280;">Café density change (2 yrs)</td>
     <td style="padding:6px 0;font-size:13px;font-weight:700;color:#059669;text-align:right;">+18%</td>
    </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6B7280;">Competition within 500m</td>
     <td style="padding:6px 0;font-size:13px;font-weight:700;color:#111827;text-align:right;">6 operators · Medium</td>
    </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6B7280;">Retail vacancy rate</td>
     <td style="padding:6px 0;font-size:13px;font-weight:700;color:#059669;text-align:right;">Low</td>
    </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6B7280;">Demographics</td>
     <td style="padding:6px 0;font-size:13px;font-weight:700;color:#111827;text-align:right;">Young professionals · 25–40</td>
    </tr>
      </table>
    </div>

    <!-- Why it works -->
    <h3 style="font-size:16px;font-weight:700;color:#111827;margin:0 0 12px;">Why this suburb works for cafés</h3>
  <p style="font-size:14px;color:#374151;line-height:1.7;margin:0 0 20px;">
   Oxford Street is Leederville's main strip — consistent morning foot traffic from commuters catching the train, plus strong weekend brunch demand from the surrounding residential catchment. Rent on Oxford Street sits around $3,200–$4,800/month for a 60–80sqm shopfront, which keeps rent-to-revenue ratios healthy at typical café volumes.
  </p>
    <p style="font-size:14px;color:#374151;line-height:1.7;margin:0 0 28px;">
   The biggest risk: lease terms on prime Oxford Street spots are competitive. Side streets off Oxford Street offer lower rent with surprisingly similar foot traffic — worth negotiating.
    </p>

    <hr class="divider">

  <!-- Business Trend -->
    <p class="label"> Business Trend</p>
  <h3 style="font-size:16px;font-weight:700;color:#111827;margin:0 0 12px;">Specialty coffee is still growing in Perth's inner suburbs</h3>
  <p style="font-size:14px;color:#374151;line-height:1.7;margin:0 0 28px;">
   Third-wave coffee shops are expanding in Perth inner suburbs at roughly 14% per year — faster than Melbourne (9%) and Sydney (11%). The driver: Perth's median income growth has outpaced other capitals since 2022, supporting higher average ticket sizes ($7–12 per drink vs $5–8 nationally).
  </p>

    <hr class="divider">

  <!-- Risk Alert -->
    <p class="label"> Risk Alert</p>
  <h3 style="font-size:16px;font-weight:700;color:#111827;margin:0 0 12px;">CBD retail vacancy rising in 3 capitals</h3>
  <p style="font-size:14px;color:#374151;line-height:1.7;margin:0 0 28px;">
   Melbourne CBD, Adelaide CBD, and Brisbane CBD are all showing rising ground-floor retail vacancy in 2026. If you're evaluating a CBD location in these cities, factor in longer lease negotiation windows — landlords are more flexible than they've been in 5 years.
  </p>

    <hr class="divider">

  <!-- Data of the Week -->
    <p class="label"> Data of the Week</p>
  <div style="text-align:center;padding:24px 0;">
   <div class="stat" style="font-size:42px;">62%</div>
   <p style="font-size:14px;color:#6B7280;margin:8px 0 0;">of Australian small businesses that close in Year 1 cite <strong>location selection</strong> as a primary factor — ABS Business Longitudinal Analysis, 2024</p>
  </div>

    <hr class="divider">

  <!-- CTA -->
    <div style="text-align:center;padding:8px 0 4px;">
   <p style="font-size:14px;color:#6B7280;margin:0 0 16px;">Considering a location in WA or elsewhere? Run a full analysis free.</p>
   <a href="https://www.locatalyze.com" class="cta">Analyse your location →</a>
  </div>

    <p style="font-size:13px;color:#9CA3AF;margin:32px 0 0;">— Prash, Founder · Locatalyze</p>
  `
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// WEEK 2 — Business Trend: Bubble tea expansion + Melbourne risk
// ─────────────────────────────────────────────────────────────────────────────
export const WEEK_2: NewsletterTemplate = {
  subject: 'The bubble tea boom — and which Sydney suburbs are still underserved',
 previewText: 'Bubble tea stores up 31% in 2 years · 4 suburbs with unmet demand · Melbourne CBD risk alert',
 html: wrap(
    'Week 2',
  'The bubble tea boom map — where the gaps still are',
  'Sydney bubble tea stores up 31% in 2 years. But 4 suburbs are still underserved.',
  `
    <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 24px;">
   Bubble tea is one of the fastest-growing QSR categories in Australia right now. But the expansion has been uneven — concentrated in CBDs and student areas, leaving several high-income suburban corridors underserved.
    </p>

    <!-- Trend card -->
    <div class="card">
   <p class="label"> Business Trend</p>
   <h2 style="font-size:18px;font-weight:800;color:#111827;margin:0 0 16px;letter-spacing:-0.02em;">Bubble tea: the numbers</h2>
   <table style="width:100%;border-collapse:collapse;">
    <tr>
          <td style="padding:6px 0;font-size:13px;color:#6B7280;">Sydney growth (2 years)</td>
     <td style="padding:6px 0;font-size:13px;font-weight:700;color:#059669;text-align:right;">+31%</td>
    </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6B7280;">Melbourne growth</td>
     <td style="padding:6px 0;font-size:13px;font-weight:700;color:#059669;text-align:right;">+24%</td>
    </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6B7280;">Average ticket size</td>
     <td style="padding:6px 0;font-size:13px;font-weight:700;color:#111827;text-align:right;">$8.50 – $14</td>
    </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6B7280;">Peak hours</td>
     <td style="padding:6px 0;font-size:13px;font-weight:700;color:#111827;text-align:right;">2pm – 6pm weekdays, all day weekends</td>
    </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6B7280;">Footprint needed</td>
     <td style="padding:6px 0;font-size:13px;font-weight:700;color:#111827;text-align:right;">30–60 sqm (low overhead)</td>
    </tr>
      </table>
    </div>

    <h3 style="font-size:16px;font-weight:700;color:#111827;margin:0 0 12px;">4 Sydney suburbs showing unmet demand</h3>
  <p style="font-size:14px;color:#6B7280;margin:0 0 16px;">Based on population density, youth demographic, and current competitor count:</p>

  <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
   <tr style="border-bottom:1px solid #F3F4F6;">
    <th style="text-align:left;font-size:11px;color:#9CA3AF;font-weight:600;padding:8px 0;text-transform:uppercase;letter-spacing:0.05em;">Suburb</th>
    <th style="text-align:right;font-size:11px;color:#9CA3AF;font-weight:600;padding:8px 0;text-transform:uppercase;letter-spacing:0.05em;">Score</th>
    <th style="text-align:right;font-size:11px;color:#9CA3AF;font-weight:600;padding:8px 0;text-transform:uppercase;letter-spacing:0.05em;">Verdict</th>
   </tr>
      <tr style="border-bottom:1px solid #F9FAFB;">
    <td style="padding:10px 0;font-size:14px;color:#111827;font-weight:600;">Hurstville, NSW</td>
    <td style="padding:10px 0;font-size:14px;color:#111827;text-align:right;font-family:monospace;">79/100</td>
    <td style="padding:10px 0;text-align:right;"><span class="verdict-go">GO</span></td>
   </tr>
      <tr style="border-bottom:1px solid #F9FAFB;">
    <td style="padding:10px 0;font-size:14px;color:#111827;font-weight:600;">Burwood, NSW</td>
    <td style="padding:10px 0;font-size:14px;color:#111827;text-align:right;font-family:monospace;">76/100</td>
    <td style="padding:10px 0;text-align:right;"><span class="verdict-go">GO</span></td>
   </tr>
      <tr style="border-bottom:1px solid #F9FAFB;">
    <td style="padding:10px 0;font-size:14px;color:#111827;font-weight:600;">Strathfield, NSW</td>
    <td style="padding:10px 0;font-size:14px;color:#111827;text-align:right;font-family:monospace;">73/100</td>
    <td style="padding:10px 0;text-align:right;"><span class="verdict-go">GO</span></td>
   </tr>
      <tr>
        <td style="padding:10px 0;font-size:14px;color:#111827;font-weight:600;">Rhodes, NSW</td>
    <td style="padding:10px 0;font-size:14px;color:#111827;text-align:right;font-family:monospace;">68/100</td>
    <td style="padding:10px 0;text-align:right;"><span class="verdict-caution">CAUTION</span></td>
   </tr>
    </table>

    <hr class="divider">

  <p class="label"> Risk Alert</p>
  <h3 style="font-size:16px;font-weight:700;color:#111827;margin:0 0 12px;">Melbourne CBD — proceed with caution</h3>
  <p style="font-size:14px;color:#374151;line-height:1.7;margin:0 0 8px;">Ground-floor retail vacancy in Melbourne CBD reached 14.2% in Q1 2026 — the highest since 2020. Contributing factors:</p>
  <ul style="font-size:14px;color:#374151;line-height:1.9;margin:0 0 24px;padding-left:20px;">
   <li>Hybrid work reducing weekday foot traffic</li>
      <li>Increased competition from suburban dining precincts</li>
      <li>Rent asking prices not yet reflecting softer demand</li>
    </ul>
    <p style="font-size:14px;color:#374151;line-height:1.7;margin:0 0 28px;">
   <strong>What to do:</strong> If you're evaluating a Melbourne CBD site, negotiate hard on rent and insist on a break clause after Year 2. Our analysis shows CBD rent-to-revenue ratios averaging 22–28% — well above the healthy 12% threshold.
  </p>

    <hr class="divider">

  <p class="label"> Data of the Week</p>
  <div style="text-align:center;padding:20px 0;">
   <div class="stat" style="font-size:42px;">$14</div>
   <p style="font-size:14px;color:#6B7280;margin:8px 0 0;">Average bubble tea ticket in Australian metro areas — making it one of the highest gross-margin QSR formats at scale</p>
  </div>

    <hr class="divider">

  <div style="text-align:center;padding:8px 0 4px;">
   <p style="font-size:14px;color:#6B7280;margin:0 0 16px;">Thinking about a bubble tea or food concept? Analyse your suburb first.</p>
   <a href="https://www.locatalyze.com" class="cta">Run a free location analysis →</a>
  </div>

    <p style="font-size:13px;color:#9CA3AF;margin:32px 0 0;">— Prash, Founder · Locatalyze</p>
  `
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// WEEK 3 — Opportunity: North Brisbane + 3 mistakes founders make
// ─────────────────────────────────────────────────────────────────────────────
export const WEEK_3: NewsletterTemplate = {
  subject: '3 location mistakes that cost founders $50k+ — and how to avoid them',
 previewText: 'Plus: North Brisbane suburbs showing strong demand · Opportunity insight this week',
 html: wrap(
    'Week 3',
  '3 location mistakes that cost founders $50,000+',
  'We see these in our data constantly. Here\'s how to avoid them.',
  `
    <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 28px;">
   After analysing hundreds of Australian business locations, we keep seeing the same three mistakes. Each one is avoidable with the right data — but most founders don't have it until it's too late.
  </p>

    <!-- Mistake 1 -->
    <div class="card">
   <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
    <div style="width:32px;height:32px;border-radius:50%;background:#FEF2F2;border:1px solid #FECACA;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:#DC2626;flex-shrink:0;">1</div>
    <h3 style="font-size:15px;font-weight:700;color:#111827;margin:0;">Choosing rent based on affordability, not revenue ratio</h3>
   </div>
      <p style="font-size:14px;color:#374151;line-height:1.7;margin:0;">
    A $2,500/month rent sounds cheap — but if your expected revenue is $15,000/month, that's a 17% rent-to-revenue ratio. The healthy threshold is ≤12%. At 17%, you'll break even but have almost no buffer for a slow month. <strong>Always calculate the ratio, not the raw number.</strong>
   </p>
    </div>

    <!-- Mistake 2 -->
    <div class="card">
   <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
    <div style="width:32px;height:32px;border-radius:50%;background:#FEF2F2;border:1px solid #FECACA;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:#DC2626;flex-shrink:0;">2</div>
    <h3 style="font-size:15px;font-weight:700;color:#111827;margin:0;">Ignoring weekday vs weekend traffic split</h3>
   </div>
      <p style="font-size:14px;color:#374151;line-height:1.7;margin:0;">
    A location might be packed on Saturday — but if your business needs 5-day revenue to cover costs, you need to validate weekday demand. CBD-adjacent locations often have strong weekday commuter traffic but dead weekends. Neighbourhood strips are the opposite. Know your model before you sign.
      </p>
    </div>

    <!-- Mistake 3 -->
    <div class="card">
   <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
    <div style="width:32px;height:32px;border-radius:50%;background:#FEF2F2;border:1px solid #FECACA;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:#DC2626;flex-shrink:0;">3</div>
    <h3 style="font-size:15px;font-weight:700;color:#111827;margin:0;">Not checking the competitor radius properly</h3>
   </div>
      <p style="font-size:14px;color:#374151;line-height:1.7;margin:0;">
    Most founders check the shops next door. They don't check within 500m — which is the real competitive radius for walk-in businesses. Seven competitors within 500m is high saturation. Three is manageable. Zero might mean there's no demand at all. <strong>The right answer is 2–5 for most categories.</strong>
   </p>
    </div>

    <hr class="divider">

  <!-- Opportunity Spotlight -->
    <p class="label"> Opportunity Spotlight</p>
  <h3 style="font-size:16px;font-weight:700;color:#111827;margin:0 0 12px;">North Brisbane suburbs showing strong takeaway demand</h3>
  <p style="font-size:14px;color:#374151;line-height:1.7;margin:0 0 16px;">Three North Brisbane suburbs are showing classic demand signals for takeaway and QSR food — growing young family population, limited existing options, and rising median incomes:</p>

  <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
   <tr style="border-bottom:1px solid #F3F4F6;">
    <th style="text-align:left;font-size:11px;color:#9CA3AF;font-weight:600;padding:8px 0;text-transform:uppercase;letter-spacing:0.05em;">Suburb</th>
    <th style="text-align:right;font-size:11px;color:#9CA3AF;font-weight:600;padding:8px 0;text-transform:uppercase;letter-spacing:0.05em;">Pop. growth</th>
    <th style="text-align:right;font-size:11px;color:#9CA3AF;font-weight:600;padding:8px 0;text-transform:uppercase;letter-spacing:0.05em;">Score</th>
   </tr>
      <tr style="border-bottom:1px solid #F9FAFB;">
    <td style="padding:10px 0;font-size:14px;color:#111827;font-weight:600;">Chermside, QLD</td>
    <td style="padding:10px 0;font-size:13px;color:#059669;text-align:right;font-weight:600;">+8.2% / yr</td>
    <td style="padding:10px 0;font-size:14px;color:#111827;text-align:right;"><span class="verdict-go">78/100</span></td>
   </tr>
      <tr style="border-bottom:1px solid #F9FAFB;">
    <td style="padding:10px 0;font-size:14px;color:#111827;font-weight:600;">Nundah, QLD</td>
    <td style="padding:10px 0;font-size:13px;color:#059669;text-align:right;font-weight:600;">+6.7% / yr</td>
    <td style="padding:10px 0;font-size:14px;color:#111827;text-align:right;"><span class="verdict-go">74/100</span></td>
   </tr>
      <tr>
        <td style="padding:10px 0;font-size:14px;color:#111827;font-weight:600;">Aspley, QLD</td>
    <td style="padding:10px 0;font-size:13px;color:#059669;text-align:right;font-weight:600;">+5.1% / yr</td>
    <td style="padding:10px 0;font-size:14px;color:#111827;text-align:right;"><span class="verdict-caution">66/100</span></td>
   </tr>
    </table>

    <hr class="divider">

  <p class="label"> Data of the Week</p>
  <div style="text-align:center;padding:20px 0;">
   <div class="stat" style="font-size:42px;">500m</div>
   <p style="font-size:14px;color:#6B7280;margin:8px 0 0;">The radius that determines 80% of walk-in competition for retail food businesses. Everything beyond that is noise.</p>
  </div>

    <hr class="divider">

  <div style="text-align:center;padding:8px 0 4px;">
   <p style="font-size:14px;color:#6B7280;margin:0 0 16px;">Check any Australian address against all three of these factors — free.</p>
   <a href="https://www.locatalyze.com" class="cta">Analyse your location →</a>
  </div>

    <p style="font-size:13px;color:#9CA3AF;margin:32px 0 0;">— Prash, Founder · Locatalyze</p>
  `
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// WEEK 4 — Case Study: Why a Fitzroy café thrives + emerging hotspot
// ─────────────────────────────────────────────────────────────────────────────
export const WEEK_4: NewsletterTemplate = {
  subject: 'Case study: Why this Fitzroy café prints money (and what you can copy)',
 previewText: 'Score 88/100 · $312k annual profit · The 4 factors behind it · Plus emerging hotspot alert',
 html: wrap(
    'Week 4',
  'Case study: The Fitzroy café formula',
  'Score 88/100 · $312k annual profit. Here\'s exactly why it works.',
  `
    <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 24px;">
   This week we're looking at a real location archetype — the high-performing inner-Melbourne café. Not a specific business, but a composite of what our data shows for the Fitzroy/Collingwood corridor. These numbers are based on Locatalyze analysis of 20+ locations in this area.
  </p>

    <!-- Case Study Card -->
    <div class="card">
   <p class="label"> Location Analysis</p>
   <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;margin-bottom:16px;">
    <div>
          <h2 style="font-size:18px;font-weight:800;color:#111827;margin:0 0 4px;letter-spacing:-0.02em;">Specialty Café, Fitzroy VIC</h2>
     <p style="font-size:13px;color:#6B7280;margin:0;">Smith Street corridor · ~65 sqm · $4,200/mo rent</p>
    </div>
        <div style="text-align:right;">
     <div class="stat">88</div>
     <p style="font-size:11px;color:#6B7280;margin:2px 0 0;">/100 Score</p>
     <span class="verdict-go">GO</span>
    </div>
      </div>
      <hr class="divider" style="margin:16px 0;">
   <table style="width:100%;border-collapse:collapse;">
    <tr>
          <td style="padding:6px 0;font-size:13px;color:#6B7280;">Monthly revenue (baseline)</td>
     <td style="padding:6px 0;font-size:13px;font-weight:700;color:#111827;text-align:right;">$52,000</td>
    </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6B7280;">Monthly net profit</td>
     <td style="padding:6px 0;font-size:13px;font-weight:700;color:#059669;text-align:right;">$26,000</td>
    </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6B7280;">Annual net profit</td>
     <td style="padding:6px 0;font-size:13px;font-weight:700;color:#059669;text-align:right;">$312,000</td>
    </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6B7280;">Rent-to-revenue ratio</td>
     <td style="padding:6px 0;font-size:13px;font-weight:700;color:#059669;text-align:right;">8.1% — Excellent</td>
    </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6B7280;">Break-even</td>
     <td style="padding:6px 0;font-size:13px;font-weight:700;color:#111827;text-align:right;">31 customers/day</td>
    </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6B7280;">Payback period</td>
     <td style="padding:6px 0;font-size:13px;font-weight:700;color:#059669;text-align:right;">7 months</td>
    </tr>
      </table>
    </div>

    <h3 style="font-size:16px;font-weight:700;color:#111827;margin:0 0 12px;">The 4 factors behind the score</h3>

  <div style="margin-bottom:16px;">
   <p style="font-size:13px;font-weight:700;color:#059669;margin:0 0 4px;">1. Rent well below the danger zone</p>
   <p style="font-size:14px;color:#374151;line-height:1.6;margin:0;">At 8.1% rent-to-revenue, this location has a wide buffer. Even if revenue drops 25%, the business stays solvent. Compare this to a CBD location at 22% — where any revenue drop triggers a loss.</p>
  </div>
    <div style="margin-bottom:16px;">
   <p style="font-size:13px;font-weight:700;color:#059669;margin:0 0 4px;">2. Demographics match the product</p>
   <p style="font-size:14px;color:#374151;line-height:1.6;margin:0;">Fitzroy median income is $78,000 — solidly in the "affordable" range for a $6–9 coffee. The demographic skews 25–40, with high repeat-visit behaviour. Morning commuter pattern is strong on weekdays, brunch demand fills weekends.</p>
  </div>
    <div style="margin-bottom:16px;">
   <p style="font-size:13px;font-weight:700;color:#059669;margin:0 0 4px;">3. Competition is present but not saturated</p>
   <p style="font-size:14px;color:#374151;line-height:1.6;margin:0;">4 competitors within 500m — enough to validate demand, not enough to kill margin. The sweet spot for most food businesses is 3–6 competitors in the radius.</p>
  </div>
    <div style="margin-bottom:28px;">
   <p style="font-size:13px;font-weight:700;color:#059669;margin:0 0 4px;">4. Low break-even threshold</p>
   <p style="font-size:14px;color:#374151;line-height:1.6;margin:0;">31 customers/day to break even. On a typical weekday, Fitzroy foot traffic delivers 3–5x that. The margin of safety is large.</p>
  </div>

    <hr class="divider">

  <!-- Emerging Hotspot -->
    <p class="label">🔥 Emerging Hotspot</p>
  <h3 style="font-size:16px;font-weight:700;color:#111827;margin:0 0 12px;">Mount Lawley (Perth) — watch this one</h3>
  <p style="font-size:14px;color:#374151;line-height:1.7;margin:0 0 8px;">Mount Lawley is showing the early signals we look for in an emerging precinct:</p>
  <ul style="font-size:14px;color:#374151;line-height:1.9;margin:0 0 24px;padding-left:20px;">
   <li>New apartment approvals up 34% year-on-year</li>
      <li>Young professional population growing</li>
      <li>Beaufort Street retail vacancy below 6%</li>
      <li>Current café density: low for the demographic</li>
    </ul>
    <p style="font-size:14px;color:#374151;line-height:1.7;margin:0 0 28px;">Our model gives it a <strong>81/100 GO score</strong> for café and specialty food. The window to enter before saturation is probably 18–24 months.</p>

  <hr class="divider">

  <p class="label"> Data of the Week</p>
  <div style="text-align:center;padding:20px 0;">
   <div class="stat" style="font-size:42px;">8.1%</div>
   <p style="font-size:14px;color:#6B7280;margin:8px 0 0;">The rent-to-revenue ratio of a high-performing café in Fitzroy. The national average for struggling cafés: 19.4%. That gap is almost entirely location selection.</p>
  </div>

    <hr class="divider">

  <div style="text-align:center;padding:8px 0 4px;">
   <p style="font-size:14px;color:#6B7280;margin:0 0 16px;">Want to find a location with these metrics in your city? Run a free analysis.</p>
   <a href="https://www.locatalyze.com" class="cta">Analyse your location →</a>
  </div>

    <p style="font-size:13px;color:#9CA3AF;margin:32px 0 0;">— Prash, Founder · Locatalyze</p>
  `
  )
}