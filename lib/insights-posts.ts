// Data stories: original research and benchmarks (shared Section model with blog)
import type { Section } from '@/lib/blog-posts'

export interface InsightFaq {
  question: string
  answer: string
}

export interface InsightPost {
  slug: string
  title: string
  seoTitle: string
  metaDescription: string
  primaryKeyword: string
  secondaryKeywords: string[]
  /** Topic label, e.g. Benchmarks, Foot traffic */
  category: string
  date: string
  dateIso: string
  readTime: string
  /** One line under the hero badge — the “why read this” hook */
  dataHook: string
  heroImg: string
  intro: string
  sections: Section[]
  tags: string[]
  author?: string
  authorRole?: string
  authorBio?: string
  faqs?: InsightFaq[]
}

export const INSIGHTS: Record<string, InsightPost> = {
  'rent-to-revenue-bands-hospitality-australia': {
    slug: 'rent-to-revenue-bands-hospitality-australia',
    title: 'Rent-to-revenue bands for Australian hospitality: what the benchmarks actually mean',
    seoTitle: 'Hospitality rent-to-revenue benchmarks Australia | Locatalyze Insights',
    metaDescription:
      'How café and restaurant operators use rent-to-revenue ratios with Census-backed context. Industry bands, when averages mislead, and how to test your own address in minutes.',
    primaryKeyword: 'restaurant rent to revenue ratio Australia',
    secondaryKeywords: [
      'café rent percentage turnover',
      'commercial rent hospitality benchmark',
      'rent affordability Australia small business',
    ],
    category: 'Benchmarks',
    date: 'April 2, 2026',
    dateIso: '2026-04-02',
    readTime: '6 min read',
    dataHook:
      'Published benchmarks are a starting point. Your quoted rent, trading hours, and actual basket size decide whether you sit inside a healthy band.',
    heroImg:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=85',
    tags: ['Rent', 'Hospitality', 'ABS 2021', 'Methodology'],
    author: 'Locatalyze Research',
    authorRole: 'Data & methodology, Locatalyze',
    authorBio:
      'The Locatalyze team combines ABS Census 2021 employment and dwelling mix at fine geography with competition distance scoring to give suburb-level context before you model a specific address. We publish short data stories so operators can line up public benchmarks with their own numbers.',
    intro:
      'Industry guides often quote 8–12% of revenue to rent for well-run cafés and low-teens to mid-teens for full-service restaurants, depending on format and market. Those figures are useful guardrails, but they hide enormous variation: the same percentage at different rents, trading hours, and average spends produces completely different break-even foot traffic. This note ties public bands to the variables you control, and to how Locatalyze layers ABS-backed suburb context on top of your actual lease and revenue assumptions.',
    faqs: [
      {
        question: 'Is there a single “right” rent-to-revenue ratio for my café or restaurant?',
        answer:
          'No. Trade associations and operator surveys publish typical bands (often roughly 8–12% for many cafés and higher ranges for some restaurant formats) as rough guides. The ratio that works for you depends on rent dollars, days open, average spend, and margin structure. You should model your own address rather than target a single percentage.',
      },
      {
        question: 'How does Locatalyze relate benchmarks to a specific address?',
        answer:
          'Locatalyze combines ABS Census 2021 job density, dwelling mix, and local competition into a composite view of suburb context, and pairs that with your inputs (for example rent and spend assumptions) in free tools such as the rent checker and break-even foot traffic calculator. The output is a site-specific read, not a national average on its own.',
      },
      {
        question: 'Do these benchmarks replace a lease negotiation or professional advice?',
        answer:
          'No. They help you triage a site and align expectations before you sign. For lease terms, fit-out, and legal obligations you should still use qualified advisors.',
      },
    ],
    sections: [
      {
        type: 'stats',
        items: [
          { value: '8–12%', label: 'Typical cited rent-to-revenue band for many cafés (R&CA / operator survey ranges — illustrative, not a target for every site)' },
          { value: '~10–15%', label: 'Often-cited band for some family and casual dining models (industry roundtables; varies by location and format)' },
          { value: '~90s', label: 'Typical time to run Locatalyze’s free viability and break-even tools for one address' },
        ],
      },
      { type: 'h2', text: 'Why a percentage without dollars misleads' },
      {
        type: 'p',
        text:
          'Ten percent of $40,000 monthly revenue is $4,000 in rent. Ten percent of $120,000 is $12,000. The “same” ratio on paper implies very different walk-past, seat turn, and staffing needs. A strip where operators quote 10% in surveys may still be unsuitable for your format if your model cannot reach the revenue that makes that 10% affordable.',
      },
      {
        type: 'p',
        text:
          'That is why we treat rent-to-revenue as an output of your model, not an input. You first fix realistic monthly rent, average transaction value, and trading pattern; then you solve for the revenue required and see whether the location plausibly delivers the traffic and conversion.',
      },
      { type: 'h2', text: 'How Census data changes the story at suburb level' },
      {
        type: 'p',
        text:
          'ABS Census 2021, at fine geography, tells you how many people work in the area, how many dwellings sit within a short walk, and broad income and age structure. Those are demand proxies: they do not replace a door count, but they explain why an inner-urban 10% and a regional 10% face different headwinds. Locatalyze’s engine uses that Census layer together with a competition distance score to characterise a suburb before you add your lease and trading assumptions for a site.',
      },
      {
        type: 'table',
        headers: ['Data layer', 'What it informs', 'What it does not do'],
        rows: [
          ['Census job counts / worker density', 'Lunch and weekday coffee demand; office-led trade', 'Replace hour-by-hour footfall counts'],
          [
            'Dwelling / residential mix (ABS)',
            'Evening and weekend catchment; takeaway vs dine-in',
            'Tell you competitor quality or fit-out need',
          ],
          [
            'Competition distance score (modelled in Locatalyze)',
            'How crowded the offer is for your category near the pin',
            'Substitute for your brand strength or menu pricing',
          ],
        ],
      },
      { type: 'h2', text: 'A practical order of operations' },
      {
        type: 'numbered',
        heading: 'Before you treat a benchmark as a target',
        items: [
          'Write down monthly rent, trading days, and expected average spend (conservative, not your dream case).',
          'Compute the revenue you need to hit an 8%, 10%, and 12% rent share. Are those numbers plausible for the catchment you can actually serve?',
          'Compare your quoted rent to local norms with the free rent-overpriced check, then model required foot traffic with the break-even tool.',
        ],
      },
      {
        type: 'callout',
        icon: '',
        title: 'One Locatalyze-specific check',
        body:
          'In our composite scoring layer, a suburb with strong job counts but long competitor lists still scores “context only” until you enter a lease line and AOV. The point is to stop optimising a ratio in the abstract and instead see whether the address can clear the actual dollars.',
        variant: 'teal',
      },
      {
        type: 'inline-cta',
        hook: 'Test whether a quoted rent is in band for your city and category, then see implied daily covers.',
        label: 'Rent and break-even tools',
        href: '/tools',
      },
      {
        type: 'h2', text: 'When to go deeper than free tools' },
      {
        type: 'p',
        text:
          'Free tools answer “can this rent plausibly work with my numbers?” for a candidate site. A full Locatalyze run adds a GO / CAUTION / NO verdict, mapped competition, and exportable numbers for a specific Australian address when you are ready to brief a landlord or your accountant.',
      },
      {
        type: 'pullquote',
        text:
          'A national benchmark is a headline. The rent you sign, the customers you can reach, and the margin you can defend are the story.',
      },
    ],
  },
  'foot-traffic-vs-catchment-density-australia': {
    slug: 'foot-traffic-vs-catchment-density-australia',
    title: 'Foot traffic vs catchment density: what predicts demand better for a new site?',
    seoTitle: 'Foot traffic vs catchment density for site selection | Locatalyze Insights',
    metaDescription:
      'A practical framework for balancing observed foot traffic with ABS-backed catchment context when selecting Australian hospitality and retail sites.',
    primaryKeyword: 'foot traffic analysis Australia',
    secondaryKeywords: [
      'catchment density retail site selection',
      'ABS Census demand proxies',
      'location demand validation',
    ],
    category: 'Data',
    date: 'April 11, 2026',
    dateIso: '2026-04-11',
    readTime: '7 min read',
    dataHook:
      'Door counts tell you what happened in one hour. Catchment context helps you judge whether that hour is repeatable across the week.',
    heroImg:
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=85',
    tags: ['Demand', 'Foot traffic', 'ABS 2021', 'Site selection'],
    author: 'Locatalyze Research',
    authorRole: 'Data & methodology, Locatalyze',
    authorBio:
      'We test site-selection assumptions against observed signals and public datasets. The focus is simple: avoid overconfidence from a single metric before you lock in a lease.',
    intro:
      'Operators often ask whether they should trust a manual door count or demographic context when evaluating a site. The answer is not either/or. A quick footfall count captures immediate behaviour at a moment in time, while catchment density and workforce context indicate whether demand can persist outside that single window. This piece outlines how to combine both before committing to rent.',
    faqs: [
      {
        question: 'Can strong foot traffic alone justify signing a site?',
        answer:
          'Not reliably. A short count can overstate demand if it is event-driven, weather-driven, or tied to a narrow daypart. You still need pricing fit, conversion assumptions, and cost structure.',
      },
      {
        question: 'Why include ABS-backed catchment context?',
        answer:
          'Catchment context (worker concentration, dwelling mix, age and income structure) helps explain if demand is likely to recur over time. It complements, rather than replaces, observed traffic.',
      },
      {
        question: 'What does Locatalyze add beyond these two checks?',
        answer:
          'Locatalyze blends catchment and competition context with your own lease and revenue assumptions, then produces a deterministic score and verdict so you can compare candidate sites consistently.',
      },
    ],
    sections: [
      {
        type: 'stats',
        items: [
          { value: '10 min', label: 'Useful baseline for a manual peak-window door count before deeper modelling' },
          { value: '2 lenses', label: 'Observed behaviour (traffic) + structural context (catchment and competition)' },
          { value: '~90s', label: 'Time to run a first-pass viability screen in Locatalyze tools' },
        ],
      },
      { type: 'h2', text: 'Why single-metric decisions fail' },
      {
        type: 'p',
        text:
          'A busy block can hide weak commercial intent. You may count commuters who never stop, students with low spend, or destination traffic that bypasses your frontage. Conversely, a moderate count in a high-intent strip can outperform a louder location with poor conversion.',
      },
      {
        type: 'callout',
        icon: '',
        title: 'Use traffic as evidence, not verdict',
        body:
          'Treat counts as one input. If your model only works under perfect conversion assumptions, the site is fragile even with good walk-past numbers.',
        variant: 'amber',
      },
      { type: 'h2', text: 'A simple combine-both framework' },
      {
        type: 'numbered',
        heading: 'Sequence for first-pass screening',
        items: [
          'Run a manual count at your core daypart (for many cafes this is weekday morning; for many restaurants, lunch and evening separately).',
          'Map catchment context: worker density, nearby dwellings, and basic income mix from Census-aligned data.',
          'Check nearby category saturation so you do not mistake market activity for open demand.',
          'Translate rent into required daily transactions and compare that threshold with plausible conversion from observed traffic.',
        ],
      },
      {
        type: 'table',
        headers: ['Signal', 'Strong when...', 'Weak when...'],
        rows: [
          ['Manual footfall', 'Consistent across multiple comparable days', 'Measured once during unusual conditions'],
          ['Catchment density', 'Matches your core customer profile and trading hours', 'Looks healthy but conflicts with your concept'],
          ['Competition proximity', 'Nearby players suggest proven demand with room to differentiate', 'Density is high and you lack a clear positioning edge'],
        ],
      },
      {
        type: 'callout',
        icon: '',
        title: 'One Locatalyze-specific insight',
        body:
          'In our scoring flow, a site can show strong demand proxies yet still downgrade if rent pushes required daily transactions beyond realistic conversion from local walk-past. That prevents a common error: chasing activity without checking affordability.',
        variant: 'teal',
      },
      {
        type: 'inline-cta',
        hook: 'Run the quick viability pass first, then compare the rent burden against expected demand.',
        label: 'Open free tools',
        href: '/tools',
      },
      { type: 'h2', text: 'What to do before lease negotiations' },
      {
        type: 'list',
        heading: 'Pre-negotiation checklist',
        items: [
          'Collect at least two comparable daypart counts, not one snapshot.',
          'Document your expected average spend and conversion assumptions explicitly.',
          'Estimate required daily transactions from quoted rent before discussing terms.',
          'Bring a single-page assumptions summary so adviser feedback can challenge the right variables.',
        ],
      },
      {
        type: 'pullquote',
        text:
          'Traffic tells you people are present. Catchment tells you who they are. Rent tells you whether presence becomes a viable business.',
      },
    ],
  },
}

function sortByDateDesc(a: InsightPost, b: InsightPost): number {
  return b.dateIso.localeCompare(a.dateIso)
}

export const INSIGHT_LIST: InsightPost[] = Object.values(INSIGHTS).sort(sortByDateDesc)