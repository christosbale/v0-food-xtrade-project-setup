import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function AnalyticsLoading() {
  return (
    <div className="container py-8">
      <Card>
        <CardContent className="py-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-muted-foreground mt-4">Loading analytics...</p>
        </CardContent>
      </Card>
    </div>
  )
}
