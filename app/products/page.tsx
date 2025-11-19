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
          country,
          verification_status,
          risk_score
        )
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[v0] Error fetching products:', error)
      return []
    }

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
      <main className="min-h-screen bg-white">
        <ProductsMarketplace products={products} />
      </main>
      <SiteFooter />
    </>
  )
}
