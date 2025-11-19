'use client'

import { Sparkles, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'

interface AIMarketSummaryProps {
  timeRange: number
}

export function AIMarketSummary({ timeRange }: AIMarketSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSummary() {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/ai/market-insights-summary?timeRange=${timeRange}d`)
        const data = await response.json()
        
        if (data.success) {
          setSummary(data.summary)
        } else {
          setError(data.error || 'Failed to generate summary')
        }
      } catch (err) {
        console.error('[v0] AI Market Summary: Fetch error:', err)
        setError('Failed to load market summary')
      } finally {
        setLoading(false)
      }
    }
    
    fetchSummary()
  }, [timeRange])

  return (
    <div className="mb-20 border border-[#E2E2E2] bg-[#DDE9F8] p-8">
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="h-8 w-8 text-[#0D1117]" />
        <h2 className="text-headline-medium font-bold text-[#0D1117]">
          AI Market Summary
        </h2>
      </div>
      <p className="text-body-medium text-[#7A7A7A] mb-8">
        AI-generated intelligence report based on current buyer demand patterns
      </p>
      
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#0D1117]" />
          <span className="ml-3 text-body-medium text-[#7A7A7A]">
            Analyzing market data...
          </span>
        </div>
      )}
      
      {error && (
        <div className="p-6 bg-white border border-red-200">
          <p className="text-body-medium text-red-800">{error}</p>
        </div>
      )}
      
      {summary && !loading && (
        <div className="bg-white border border-[#E2E2E2] p-8">
          <div className="text-body-medium text-[#0D1117] whitespace-pre-line leading-relaxed">
            {summary}
          </div>
        </div>
      )}
    </div>
  )
}
