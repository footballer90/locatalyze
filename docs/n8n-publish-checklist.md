# n8n Publish + Rollback Checklist

Use this every time workflow JSON changes are shipped from repo to n8n.

## 1) Create rollback copies first

- Duplicate each currently active workflow in n8n before importing updates:
  - Master orchestrator
  - A2 workflow
  - A6 workflow
- Name duplicates with timestamp suffix, for example:
  - `A2-Rent-V3-SerpApi__backup_2026-04-28_1925`

## 2) Import updated JSONs

- Import the latest repository files:
  - `refactored-a2-agent.json`
  - `a2_workflow_patched.json` (if this is your active A2 variant)
  - `refactored-a6-agent.json`
- Ensure imported versions are wired to the same webhook/trigger paths expected by the orchestrator.

## 3) Validate critical anti-regression points

### A2 checks

- Confirm query nodes are dynamic and use input fields:
  - Adjacent suburbs query includes `$json.area` and `$json.city`
  - Category prices query includes `$json.area` and `$json.city`
- Confirm no hardcoded suburb terms in query strings (`Fitzroy`, `Collingwood`, `Carlton`).

### A6 checks

- In `Extract Coordinates & Postcode` code node:
  - CBD proximity check uses city-specific reference coordinates.
  - `useHardcoded` fallback is not tied to Melbourne-only CBD coordinates.

## 4) Activate and route traffic

- Save all changed workflows.
- Activate:
  - A2 updated workflow
  - A6 updated workflow
  - Master orchestrator version that points to updated A2/A6
- Confirm active toggles stayed on after save.

## 5) Run smoke payloads (3-city minimum)

- Execute at least one payload each for:
  - Melbourne suburb
  - Sydney suburb
  - Brisbane suburb
- For each run, verify:
  - A2 output reflects the input suburb/city context.
  - A6 `used_hardcoded_centroid` behavior is sensible.
  - No Melbourne-centric fallback on non-Melbourne inputs.

## 6) UI spot check (one real report)

- Generate one non-Melbourne report in product UI.
- Verify:
  - Decision tab is default.
  - Compare -> View full report lands on `?tab=decision`.
  - Rent/location context matches the selected suburb.

## 7) Rollback plan (if any check fails)

- Deactivate new workflows.
- Reactivate the backup copies created in step 1.
- Re-run one payload to confirm rollback behavior.
- Log failure cause and capture problematic node/output snippet before retrying publish.
