import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  calculateScore,
  calculateBreakEven,
  calculateProjections,
  calculateRiskScenarios,
  deriveVerdict,
} from '@/lib/scoring/engine'
import type { ReportInput } from '@/types/report'

const FREE_LIMIT = 1

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: reports, error } = await supabase
    .from('reports')
    .select('id, verdict, location_name, address, business_type, monthly_rent, location_score, status, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ reports: reports ?? [] })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, reports_used')
    .eq('id', user.id)
    .single()

  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  if (profile.plan === 'free' && profile.reports_used >= FREE_LIMIT) {
    return NextResponse.json(
      { error: 'Free report limit reached', code: 'UPGRADE_REQUIRED' },
      { status: 403 }
    )
  }

  const input: ReportInput = await req.json()

  // Replace with real external API calls in production
  const externalData = {
    footTrafficScore: 68,
    medianIncome: 62000,
    competitorCount: 4,
    populationDensity: 3200,
  }

  const score = calculateScore(input, externalData)
  const breakEven = calculateBreakEven(input)
  const projection = calculateProjections(input)
  const risk = calculateRiskScenarios(input)
  const verdict = deriveVerdict(score.overall)
  const rentToRevenueRatio = input.monthlyRent / (input.avgTransactionValue * input.expectedMonthlyCustomers)

  const resultData = {
    score,
    breakEven,
    projection,
    risk,
    competitors: {
      count: externalData.competitorCount,
      saturationLevel: externalData.competitorCount > 6 ? 'high' : externalData.competitorCount > 3 ? 'medium' : 'low',
      nearbyBusinesses: [],
    },
    demographics: {
      medianIncome: externalData.medianIncome,
      populationDensity: externalData.populationDensity,
      ageDistribution: { '18-34': 28, '35-54': 35, '55+': 37 },
      incomeAffordabilityScore: score.demographics,
    },
    rentAnalysis: {
      marketMedianRent: Math.round(input.monthlyRent * 0.95),
      rentToRevenueRatio,
      affordabilityRating:
        score.rentAffordability >= 80 ? 'excellent'
        : score.rentAffordability >= 55 ? 'good'
        : score.rentAffordability >= 30 ? 'marginal'
        : 'risky',
    },
    swot: {
      strengths: ['High foot traffic corridor', 'Below-market rent'],
      weaknesses: ['Moderate competitor density', 'Limited parking'],
      opportunities: ['Growing residential catchment', 'Underserved demographic'],
      threats: ['Upcoming competitor openings', 'Lease escalation clauses'],
    },
    verdict,
    aiSummary: `This location scores ${score.overall}/100, placing it in the ${verdict} category. Break-even requires ${breakEven.dailyCustomersRequired} customers per day. Rent-to-revenue ratio: ${(rentToRevenueRatio * 100).toFixed(1)}%.`,
  }

  const { data: report, error } = await supabase
    .from('reports')
    .insert({
      user_id: user.id,
      status: 'complete',
      verdict,
      location_name: input.locationName,
      address: input.address,
      business_type: input.businessType,
      monthly_rent: input.monthlyRent,
      location_score: score.overall,
      input_data: input,
      result_data: resultData,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await supabase
    .from('profiles')
    .update({ reports_used: profile.reports_used + 1 })
    .eq('id', user.id)

  return NextResponse.json({ report })
}