#!/usr/bin/env node
// node fix-remaining.js
const fs = require('fs')

const LOGO = `<img src="/logo.svg" alt="Locatalyze" style={{ height: 26, width: 'auto', display: 'block' }} />`

// Fix ALL files in the project that have the mangled pattern
const { execSync } = require('child_process')

// Find every tsx file with the mangled pattern
const result = execSync(
 'grep -rl "style=style=" app/ 2>/dev/null || true',
 { encoding: 'utf8' }
).trim()

if (!result) {
 console.log('No mangled files found')
 process.exit(0)
}

const files = result.split('\n').filter(Boolean)
console.log('Mangled files found:', files)

for (const f of files) {
 let c = fs.readFileSync(f, 'utf8')
 const orig = c

  // Fix: <div style=style={{ display: 'none' }}></div> + optional <span>Locatalyze</span>
 c = c.replace(
    /<div style=style=\{\{ display: 'none' \}\}><\/div>\s*<span[^>]*>Locatalyze<\/span>/g,
  LOGO
  )
  // Fix standalone (no span after)
  c = c.replace(
    /<div style=style=\{\{ display: 'none' \}\}><\/div>/g,
  LOGO
  )

  if (c !== orig) {
    fs.writeFileSync(f, c)
    console.log('', f)
 }
}

console.log('\nDeploy:')
console.log(" git add -A && git commit -m 'fix: all mangled logo divs' && git push")
