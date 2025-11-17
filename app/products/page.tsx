import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { ProductsMarketplace } from '@/components/products/products-marketplace'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

async function getPublishedProducts() {
  try {
    const supabase = await createClient()
    
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        company:companies!products_company_id_fkey (
          id,
          company_name,
          verification_status
        )
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[v0] Error fetching products:', error)
      return []
    }

    console.log('[v0] Fetched products count:', products?.length || 0)
    return products || []
  } catch (error) {
    console.error('[v0] Unexpected error fetching products:', error)
    return []
  }
}

export default async function ProductsPage() {
  const products = await getPublishedProducts()

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background">
        {/* Page Header */}
        <div className="bg-primary text-primary-foreground py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-3">Market Overview</h1>
            <p className="text-xl text-primary-foreground/90 mb-2">
              Browse bulk food products from verified suppliers worldwide.
            </p>
            <p className="text-sm text-primary-foreground/70">
              B2B only · Nuts, coffee, cocoa, dried fruits, spices, grains, oils & more.
            </p>
          </div>
        </div>

        <ProductsMarketplace products={products} />
      </main>
      <SiteFooter />
    </>
  )
}
