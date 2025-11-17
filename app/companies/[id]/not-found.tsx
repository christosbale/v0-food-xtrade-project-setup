import { Button } from '@/components/ui/button'
import { Building2 } from 'lucide-react'
import Link from 'next/link'

export default function CompanyNotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
          <Building2 className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-bold mb-3">Company Not Found</h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          The company you're looking for doesn't exist or has been removed from our platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="outline">
            <Link href="/products">Browse Products</Link>
          </Button>
          <Button asChild className="bg-[#9FE870] text-black hover:bg-[#8DD760]">
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
