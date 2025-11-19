'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    <Card className="mb-16 border-2 border-[#FFB84D] bg-gradient-to-br from-white to-yellow-50">
      <CardHeader>
        <CardTitle className="text-headline-large font-bold text-black flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-[#FFB84D]" />
          AI Market Summary
        </CardTitle>
        <p className="text-body-large text-muted-foreground">
          AI-generated intelligence report based on current buyer demand patterns
        </p>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#FFB84D]" />
            <span className="ml-3 text-body-large text-muted-foreground">
              Analyzing market data...
            </span>
          </div>
        )}
        
        {error && (
          <div className="p-6 bg-red-50 border-2 border-red-200 rounded-lg">
            <p className="text-body-large text-red-800">{error}</p>
          </div>
        )}
        
        {summary && !loading && (
          <div className="prose prose-lg max-w-none">
            <div className="text-body-large text-black/80 whitespace-pre-line leading-relaxed">
              {summary}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
