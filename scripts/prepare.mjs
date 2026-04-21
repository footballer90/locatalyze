#!/usr/bin/env node
/**
 * Skip Husky in CI (Vercel, GitHub Actions, etc.) — `husky` may try to write
 * `.git/config` and fail the entire `npm install` before `next build` runs.
 */
import { spawnSync } from 'node:child_process'
import process from 'node:process'

const skip =
  process.env.CI === 'true' ||
  process.env.CI === '1' ||
  Boolean(process.env.VERCEL) ||
  Boolean(process.env.GITHUB_ACTIONS)

if (skip) {
  process.exit(0)
}

const r = spawnSync('husky', { stdio: 'inherit', shell: true })
process.exit(r.status ?? 1)
