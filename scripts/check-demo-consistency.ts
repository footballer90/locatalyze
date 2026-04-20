/**
 * scripts/check-demo-consistency.ts
 *
 * CI guard against the regression class that kept shipping a `0/100`
 * hero mini-card for 9 months: duplicated scenario data on two
 * separate marketing-demo components that drifted apart on every edit.
 *
 * This check does NOT render React. It parses the source files and
 * asserts the invariants a real browser test would catch. Cheaper to
 * run than Playwright; catches the same bug class.
 *
 * Run via:  npx ts-node --project tsconfig.json scripts/check-demo-consistency.ts
 * Or:       npm run check:demo
 *
 * Exit 0 = clean. Exit 1 = drift detected (build should fail).
 *
 * ─── Invariants enforced ────────────────────────────────────────────────────
 *   1. `DEMO_SCENARIOS` in lib/marketing/demo-scenarios.ts has one
 *      entry each for `go`, `caution`, `no`, each with a non-zero
 *      numeric `score`, a positive `rent`, and positive revenue bounds.
 *      (Catches the literal "score: 0" / stuck-at-zero class.)
 *   2. The three scenarios in components/ReportDemoSection.tsx
 *      (go / warn / no, in file order) carry scores that match the
 *      DEMO_SCENARIOS values for (go / caution / no). Prevents the
 *      drift where the mini-card said NO=44 and the full demo said
 *      NO=38 on the same site.
 *   3. `rent` is internally consistent within each ReportDemoSection
 *      scenario — i.e. the "Rent" finRow and the "Rent/mo" locRow
 *      must be the same number. Pre-fix the GO scenario had both
 *      $3,800 and $3,500 in the same file.
 *   4. `rentToRevenueLabel()` in DEMO_SCENARIOS produces output
 *      within a plausible range given the declared rent and revenue
 *      bounds (sanity against the ~9–11% hardcoded era).
 *   5. The rent value shown in each ReportDemoSection scenario matches
 *      `DEMO_SCENARIOS[key].rent`. Prevents the cross-file drift class
 *      where the ReportDemoSection renders one rent figure while the
 *      hero mini-card (via DEMO_SCENARIOS) renders another. The dead
 *      PremiumReport surface that used to hold a third rent figure
 *      was deleted — if a new surface reintroduces drift, this
 *      invariant will be where we extend the check.
 */

import * as path from 'path'
import * as fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')

const DEMO_FILE = path.join(ROOT, 'lib/marketing/demo-scenarios.ts')
const DEMOSECTION_FILE = path.join(ROOT, 'components/ReportDemoSection.tsx')

type Violation = { where: string; detail: string }
const violations: Violation[] = []

function readFile(p: string): string {
  if (!fs.existsSync(p)) {
    violations.push({ where: 'fs', detail: `Required file not found: ${path.relative(ROOT, p)}` })
    return ''
  }
  return fs.readFileSync(p, 'utf8')
}

// ── 1. Parse DEMO_SCENARIOS ─────────────────────────────────────────────────
// The shape is stable and written by us; regex is fine. We specifically want
// the declared score, rent, and revenue bounds for each scenario.

interface DemoFields {
  score: number
  rent: number
  revLo: number
  revHi: number
  rentToRev: string | null
}

function extractScenario(src: string, key: 'go' | 'caution' | 'no'): DemoFields | null {
  // Match `<key>: { … }` block — non-greedy to stop at the next scenario.
  const block = new RegExp(`${key}:\\s*\\{([\\s\\S]*?)\\n\\s*\\},`).exec(src)
  if (!block) return null
  const body = block[1]

  const n = (label: string): number | null => {
    const m = new RegExp(`${label}:\\s*(-?\\d+)\\b`).exec(body)
    return m ? parseInt(m[1], 10) : null
  }

  const score = n('score')
  const rent = n('rent')
  const revLo = n('monthlyRevenueLo')
  const revHi = n('monthlyRevenueHi')

  if (score === null || rent === null || revLo === null || revHi === null) {
    violations.push({
      where: `DEMO_SCENARIOS.${key}`,
      detail: `Missing one of score / rent / monthlyRevenueLo / monthlyRevenueHi`,
    })
    return null
  }

  // Derive the rent-to-revenue label the same way rentToRevenueLabel() does,
  // so the CI check stays aligned with runtime output without importing the
  // TS module at check time.
  const lo = Math.round((rent / revHi) * 100)
  const hi = Math.round((rent / revLo) * 100)
  const rentToRev = lo === hi ? `~${lo}%` : `~${lo}–${hi}%`

  return { score, rent, revLo, revHi, rentToRev }
}

const demoSrc = readFile(DEMO_FILE)
const demoGo = extractScenario(demoSrc, 'go')
const demoCaution = extractScenario(demoSrc, 'caution')
const demoNo = extractScenario(demoSrc, 'no')

// Invariant 1: non-zero score, positive rent, sane revenue bounds
for (const [name, s] of [
  ['go', demoGo],
  ['caution', demoCaution],
  ['no', demoNo],
] as const) {
  if (!s) continue
  if (s.score <= 0 || s.score > 100) {
    violations.push({ where: `DEMO_SCENARIOS.${name}`, detail: `score ${s.score} out of (0, 100] — hero will show a broken number` })
  }
  if (s.rent <= 0) {
    violations.push({ where: `DEMO_SCENARIOS.${name}`, detail: `rent ${s.rent} must be positive` })
  }
  if (s.revLo <= 0 || s.revHi < s.revLo) {
    violations.push({ where: `DEMO_SCENARIOS.${name}`, detail: `revenue bounds invalid: lo=${s.revLo}, hi=${s.revHi}` })
  }
}

// Invariant 4: rent-to-revenue is within a plausible single-digit-to-thirty-ish
// range for any reasonable marketing scenario. Catches the old hardcoded
// "~9–11%" era where the rent string didn't match the displayed revenue.
for (const [name, s] of [
  ['go', demoGo],
  ['caution', demoCaution],
  ['no', demoNo],
] as const) {
  if (!s) continue
  const lo = Math.round((s.rent / s.revHi) * 100)
  const hi = Math.round((s.rent / s.revLo) * 100)
  if (lo < 1 || hi > 80) {
    violations.push({
      where: `DEMO_SCENARIOS.${name}`,
      detail: `derived rent-to-revenue ${lo}–${hi}% is outside plausible range (check rent=${s.rent}, rev=${s.revLo}–${s.revHi})`,
    })
  }
}

// ── 2. Parse ReportDemoSection.tsx ─────────────────────────────────────────
// Three scenarios, three top-level `score: N` lines in file order: go, warn, no.

const sectionSrc = readFile(DEMOSECTION_FILE)
const sectionScores = Array.from(sectionSrc.matchAll(/^\s{4}score:\s*(\d+),/gm))
  .map((m) => parseInt(m[1], 10))

// Invariant 2: ReportDemoSection scores match DEMO_SCENARIOS scores
function cmp(name: string, a: number | undefined, b: number | undefined) {
  if (a === undefined || b === undefined) {
    violations.push({ where: 'cross-check', detail: `Missing ${name} score on one side (DEMO_SCENARIOS=${b}, ReportDemoSection=${a})` })
  } else if (a !== b) {
    violations.push({
      where: 'cross-check',
      detail: `${name} score drift: ReportDemoSection=${a}, DEMO_SCENARIOS=${b}. Fix by reading from DEMO_SCENARIOS or syncing the number.`,
    })
  }
}

if (sectionScores.length < 3) {
  violations.push({
    where: 'components/ReportDemoSection.tsx',
    detail: `Expected 3 top-level scenario \`score: N\` lines, found ${sectionScores.length}. The regex lives in scripts/check-demo-consistency.ts — update both if the scenario layout changed.`,
  })
} else {
  cmp('go', sectionScores[0], demoGo?.score)
  cmp('caution/warn', sectionScores[1], demoCaution?.score)
  cmp('no', sectionScores[2], demoNo?.score)
}

// Invariant 3: rent is internally consistent within each scenario of
// ReportDemoSection. Split the file into three top-level scenarios and
// assert all "$N,NNN" rent tokens in each scenario are identical.

function splitScenarios(src: string): { key: string; body: string }[] {
  // The file labels scenarios with `// ── GO ──`, `// ── CAUTION ──`, `// ── NO ──`
  // dividers; slice on those.
  const labels = ['GO', 'CAUTION', 'NO']
  const out: { key: string; body: string }[] = []
  for (let i = 0; i < labels.length; i++) {
    const startRe = new RegExp(`//\\s*──\\s*${labels[i]}[^\\n]*\\n`)
    const startMatch = startRe.exec(src)
    if (!startMatch) continue
    const start = startMatch.index
    let end = src.length
    if (i < labels.length - 1) {
      const nextRe = new RegExp(`//\\s*──\\s*${labels[i + 1]}[^\\n]*\\n`)
      const nextMatch = nextRe.exec(src)
      if (nextMatch) end = nextMatch.index
    }
    out.push({ key: labels[i], body: src.slice(start, end) })
  }
  return out
}

// Map the file-order label in ReportDemoSection (GO / CAUTION / NO) back
// to the DEMO_SCENARIOS key so we can compare rent across files.
const DEMO_BY_LABEL: Record<string, DemoFields | null> = {
  GO: demoGo,
  CAUTION: demoCaution,
  NO: demoNo,
}

for (const { key, body } of splitScenarios(sectionSrc)) {
  // Match rent-shaped dollar amounts that follow a Rent / Rent/mo label.
  // The object literals in ReportDemoSection.tsx use unquoted shorthand
  // keys (`{ l: 'Rent', v: '$3,500' }` — not `'l':` / `'v':`), which an
  // earlier version of this regex did not handle; both rent invariants
  // silently matched zero tokens and never fired.
  //
  // Accepts either `l:` / `k:` (shorthand) or `'l':` / `'k':` (quoted).
  const rentMatches = Array.from(
    body.matchAll(/(?:['"]?)(?:l|k)(?:['"]?):\s*['"]Rent[^'"]*['"]\s*,\s*(?:['"]?)v(?:['"]?):\s*['"]\$([\d,]+)['"]/g),
  ).map((m) => m[1])
  const unique = Array.from(new Set(rentMatches))
  if (unique.length > 1) {
    violations.push({
      where: `ReportDemoSection.${key}`,
      detail: `Rent drift within scenario: found ${unique.map((v) => '$' + v).join(', ')}. A single scenario must show one canonical rent figure.`,
    })
  }

  // Invariant 5: cross-file rent drift. If ReportDemoSection renders a
  // single consistent rent figure, that figure must match
  // DEMO_SCENARIOS[key].rent. This is the check that would have fired
  // on the deleted PremiumReport surface had it been live.
  const demo = DEMO_BY_LABEL[key]
  if (unique.length === 1 && demo) {
    const rentInt = parseInt(unique[0].replace(/,/g, ''), 10)
    if (Number.isFinite(rentInt) && rentInt !== demo.rent) {
      violations.push({
        where: `cross-check (${key})`,
        detail: `ReportDemoSection rent $${unique[0]} does not match DEMO_SCENARIOS.${key.toLowerCase()}.rent=$${demo.rent.toLocaleString()}. The hero mini-card and the full demo will show different rents for the same scenario.`,
      })
    }
  }
}

// ── Report ─────────────────────────────────────────────────────────────────

if (violations.length === 0) {
  console.log(
    `✅  check:demo — DEMO_SCENARIOS and ReportDemoSection are consistent. Scores (go/caution/no): ${demoGo?.score}/${demoCaution?.score}/${demoNo?.score}. Rent ratios: ${demoGo?.rentToRev} / ${demoCaution?.rentToRev} / ${demoNo?.rentToRev}.`,
  )
  process.exit(0)
}

console.error(`\n❌  check:demo — ${violations.length} drift / integrity violation(s):\n`)
for (const v of violations) {
  console.error(`  [${v.where}]`)
  console.error(`    → ${v.detail}\n`)
}
console.error(
  `The 0/100 hero regression kept coming back because two demo surfaces\n` +
    `duplicated the same data. Make DEMO_SCENARIOS the single source and\n` +
    `keep ReportDemoSection's scenario-level numbers aligned with it.\n`,
)
process.exit(1)
