'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  DEMO_SCENARIOS,
  DEMO_SCENARIO_KEYS_IN_ORDER,
  type DemoScenarioKey,
} from '@/lib/marketing/demo-scenarios'

const ORDER = DEMO_SCENARIO_KEYS_IN_ORDER

export type HomepageDemoContextValue = {
  scenarioIndex: number
  /** Canonical score for the active scenario — always from DEMO_SCENARIOS (no counter state). */
  displayScore: number
  activeKey: DemoScenarioKey
  setScenarioIndex: (i: number) => void
}

const HomepageDemoContext = createContext<HomepageDemoContextValue | null>(null)

export function HomepageDemoProvider({ children }: { children: ReactNode }) {
  const [scenarioIndex, setScenarioIndexState] = useState(0)
  const activeKey = ORDER[scenarioIndex] ?? 'go'
  const displayScore = DEMO_SCENARIOS[activeKey].score

  const setScenarioIndex = useCallback((i: number) => {
    const n = ORDER.length
    setScenarioIndexState(((i % n) + n) % n)
  }, [])

  const value = useMemo(
    () => ({ scenarioIndex, displayScore, activeKey, setScenarioIndex }),
    [scenarioIndex, displayScore, activeKey, setScenarioIndex],
  )

  return <HomepageDemoContext.Provider value={value}>{children}</HomepageDemoContext.Provider>
}

export function useHomepageDemo(): HomepageDemoContextValue {
  const v = useContext(HomepageDemoContext)
  if (!v) {
    throw new Error('useHomepageDemo must be used within HomepageDemoProvider')
  }
  return v
}

export function scenarioIndexToVerdict(i: number): 'go' | 'warn' | 'no' {
  if (i === 0) return 'go'
  if (i === 1) return 'warn'
  return 'no'
}

export function verdictToScenarioIndex(v: 'go' | 'warn' | 'no'): number {
  if (v === 'go') return 0
  if (v === 'warn') return 1
  return 2
}
