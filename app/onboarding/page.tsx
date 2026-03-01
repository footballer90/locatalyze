// This tells Next.js this page runs in the browser (not server)
'use client'

// These are React tools we need
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// The main component for this page
export default function OnboardingPage() {

  // Stores all the form data as user fills it in
  const [formData, setFormData] = useState({
    business_type: '',
    industry_category: '',
    business_stage: '',
    franchise_flag: false,
    city: '',
    area: '',
    locality: '',
    landmark_hint: '',
    space_size_range: '',
    monthly_rent_budget_min: 10000,
    monthly_rent_budget_max: 30000,
    setup_budget: 300000,
    target_customer_segments: [] as string[],
    pricing_positioning: '',
    avg_ticket_min: 200,
    avg_ticket_max: 500,
    staff_count_range: '',
    risk_appetite: '',
    operating_timeline: '',
    primary_concerns: [] as string[],
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  // This runs when user clicks Submit
  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Send the form data to our API
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      // Go to the dashboard with the submission ID
      router.push(`/dashboard/${result.submission_id}`)

    } catch (error) {
      console.error('Submit failed:', error)
      alert('Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  // Helper: toggle items in an array (for multi-select checkboxes)
  const toggleArray = (field: string, value: string) => {
    setFormData(prev => {
      const arr = prev[field as keyof typeof prev] as string[]
      return {
        ...prev,
        [field]: arr.includes(value)
          ? arr.filter(v => v !== value)
          : [...arr, value]
      }
    })
  }

  // NOTE: Replace this return with the full HTML form template
  // For now this is a simple placeholder — swap the HTML template in here
  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Locatalyze Onboarding</h1>
      <p>Form goes here — see the HTML template file</p>

      {/* Quick test: just a city input and submit button */}
      <input
        type="text"
        placeholder="City"
        value={formData.city}
        onChange={e => setFormData({...formData, city: e.target.value})}
        style={{ display: 'block', margin: '16px 0', padding: '12px', width: '100%' }}
      />

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        style={{ padding: '12px 24px', background: '#f5a623', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  )
}