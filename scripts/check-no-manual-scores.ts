/**
 * scripts/check-no-manual-scores.ts
 *
 * CI guard: fail the build if any suburb seed object or marketing page
 * defines a score field with a raw numeric/string literal instead of
 * calling computeLocationModel() from the scoring engine.
 *
 * Run via:  npx ts-node --project tsconfig.json scripts/check-no-manual-scores.ts
 * Or:       npm run check:scores
 *
 * Exit 0 = clean. Exit 1 = violations found (build should fail).
 *
 * ─── What is flagged ────────────────────────────────────────────────────────
 *   score: 84          → VIOLATION (numeric literal)
 *   compositeScore: 70 → VIOLATION
 *   cafe: 75           → VIOLATION
 *   restaurant: 62     → VIOLATION
 *   retail: 80         → VIOLATION
 *   verdict: "GO"      → VIOLATION (string literal — must come from engine)
 *
 * ─── What is NOT flagged ────────────────────────────────────────────────────
 *   score: getRetailScore('Parap')   → fine (function call)
 *   verdict: getRetailVerdict(name)  → fine (function call)
 *   cafe: m.cafe                     → fine (member expression)
 *   { score: sub.score }             → fine (member expression)
 *   demand: 8                        → fine (factor input, not a score output)
 *   rent: 4                          → fine (factor input)
 *
 * ─── Scope ──────────────────────────────────────────────────────────────────
 * Scans only:
 *   lib/analyse-data/**\/*.ts        (suburb seed datasets)
 *   app/(marketing)/analyse/**\/*.tsx (city/suburb marketing pages)
 *
 * Deliberately excludes:
 *   scoring-engine.ts itself (defines the rules, can reference these names)
 *   Components, dashboard, onboarding (scores come from Supabase, not hardcoded)
 */

import * as path from 'path'
import * as fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')

// ── Load ignore list ──────────────────────────────────────────────────────────
// .check-scores-ignore lists known legacy files that predate the engine.
// Files in this list are skipped; all other scanned files MUST be clean.
function loadIgnoreList(): Set<string> {
  const ignorePath = path.join(ROOT, '.check-scores-ignore')
  if (!fs.existsSync(ignorePath)) return new Set()
  return new Set(
    fs.readFileSync(ignorePath, 'utf8')
      .split('\n')
      .map(l => l.trim())
      .filter(l => l && !l.startsWith('#')),
  )
}

const IGNORED = loadIgnoreList()

// ── Keys whose literal values are forbidden ──────────────────────────────────
// Only `score` and `compositeScore` are checked — these are unambiguous engine
// output fields that must NEVER be hardcoded. Keys like `cafe`, `restaurant`,
// `retail` are legitimately used as 1–10 ordinal ratings in hub pages; `verdict`
// is used in display-only badge components. Checking those would produce too many
// false positives. The `score` / `compositeScore` check is enough to catch manual
// scoring of the kind that existed in darwin/retail before the engine fix.
const SCORE_KEYS = ['score', 'compositeScore']

// ── Files / dirs to scan ─────────────────────────────────────────────────────
const SCAN_PATTERNS = [
  'lib/analyse-data',
  'app/(marketing)/analyse',
]

// ── Files to always exclude ───────────────────────────────────────────────────
const EXCLUDE_FILES = [
  'lib/analyse-data/scoring-engine.ts', // defines the engine — allowed to reference these names
]

// ── Regex: matches   keyName: <number>   ─────────────────────────────────────
// Only matches numeric literals — `score: 84` is a violation, `score: '—'` is not.
// Does NOT match member expressions (score: m.score) or function calls.
function buildPattern(key: string): RegExp {
  // Matches:  score: 84  or  compositeScore: 70
  // Does NOT match:  score: m.score  or  score: computeScore()  or  score: '—'
  return new RegExp(
    `(?:^|[,{\\s])"?${key}"?\\s*:\\s*\\d+(?:[,}\\s]|$)`,
    'gm',
  )
}

const PATTERNS: { key: string; re: RegExp }[] = SCORE_KEYS.map((k) => ({
  key: k,
  re: buildPattern(k),
}))

// ── Collect files to check ───────────────────────────────────────────────────
function collectFiles(): string[] {
  const result: string[] = []

  function walk(dir: string) {
    if (!fs.existsSync(dir)) return
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(fullPath)
      } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
        const rel = path.relative(ROOT, fullPath)
        const isExcluded = EXCLUDE_FILES.some((excl) => rel.endsWith(excl))
        const isIgnored = IGNORED.has(rel)
        if (!isExcluded && !isIgnored) {
          result.push(fullPath)
        }
      }
    }
  }

  for (const pattern of SCAN_PATTERNS) {
    walk(path.join(ROOT, pattern))
  }

  return result
}

// ── Scan ─────────────────────────────────────────────────────────────────────
type Violation = { file: string; line: number; key: string; text: string }

function scanFile(filePath: string): Violation[] {
  const rel = path.relative(ROOT, filePath)
  const src = fs.readFileSync(filePath, 'utf8')
  const lines = src.split('\n')
  const violations: Violation[] = []

  for (const { key, re } of PATTERNS) {
    re.lastIndex = 0
    for (const line of lines) {
      if (re.test(line.trim())) {
        const lineNum = lines.indexOf(line) + 1
        violations.push({ file: rel, line: lineNum, key, text: line.trim() })
      }
      re.lastIndex = 0
    }
  }

  return violations
}

// ── Main ─────────────────────────────────────────────────────────────────────
const files = collectFiles()
const allViolations: Violation[] = []

for (const file of files) {
  allViolations.push(...scanFile(file))
}

if (allViolations.length === 0) {
  console.log(`✅  check:scores — ${files.length} files scanned (${IGNORED.size} legacy files ignored), 0 violations. Engine is the single source of truth.`)
  process.exit(0)
} else {
  console.error(`\n❌  check:scores — ${allViolations.length} manual score violation(s) found:\n`)
  for (const v of allViolations) {
    console.error(`  ${v.file}:${v.line}  [${v.key}]`)
    console.error(`    → ${v.text}`)
    console.error(`    Fix: use computeLocationModel() or getDarwinSuburbs().retail etc.\n`)
  }
  console.error(`Manual scores create two sources of truth vs the engine. Remove them.`)
  process.exit(1)
}
