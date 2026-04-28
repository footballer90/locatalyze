#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'

const repoRoot = process.cwd()
const targetFiles = ['refactored-a2-agent.json', 'a2_workflow_patched.json']
const bannedSuburbs = ['fitzroy', 'collingwood', 'carlton']
const targetNodeHints = ['adjacent suburbs', 'category prices', 'area retail', 'cre area']

const issues = []

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch (error) {
    issues.push({
      file: path.basename(filePath),
      node: '(file)',
      detail: `Failed to parse JSON: ${error instanceof Error ? error.message : String(error)}`,
    })
    return null
  }
}

function extractQueryValue(node) {
  const params = node?.parameters ?? {}

  const queryParamRows = params?.queryParameters?.parameters
  if (Array.isArray(queryParamRows)) {
    const qRow = queryParamRows.find((p) => String(p?.name ?? '').toLowerCase() === 'q')
    if (qRow?.value != null) return String(qRow.value)
  }

  const bodyParamRows = params?.bodyParameters?.parameters
  if (Array.isArray(bodyParamRows)) {
    const qRow = bodyParamRows.find((p) => String(p?.name ?? '').toLowerCase() === 'q')
    if (qRow?.value != null) return String(qRow.value)
  }

  return ''
}

for (const rel of targetFiles) {
  const fullPath = path.join(repoRoot, rel)
  if (!fs.existsSync(fullPath)) continue

  const data = readJson(fullPath)
  if (!data || !Array.isArray(data.nodes)) continue

  for (const node of data.nodes) {
    const nodeName = String(node?.name ?? '')
    const nodeNameLc = nodeName.toLowerCase()
    if (!targetNodeHints.some((hint) => nodeNameLc.includes(hint))) continue

    const q = extractQueryValue(node).toLowerCase()
    if (!q) continue

    for (const suburb of bannedSuburbs) {
      if (q.includes(suburb)) {
        issues.push({
          file: rel,
          node: nodeName,
          detail: `Query contains hardcoded suburb token "${suburb}"`,
        })
      }
    }
  }
}

if (issues.length > 0) {
  console.error('A2 hardcoded suburb guard failed:')
  for (const issue of issues) {
    console.error(`- ${issue.file} :: ${issue.node} :: ${issue.detail}`)
  }
  process.exit(1)
}

console.log('A2 hardcoded suburb guard passed.')
