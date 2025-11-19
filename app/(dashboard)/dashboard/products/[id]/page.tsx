import { ProductForm } from '@/components/dashboard/product-form'
import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { getCurrentCompany } from '@/lib/auth/current-company'

export const dynamic = 'force-dynamic'

export default async function EditProductPage({ 
  params 
}: { 
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  const session = await getCurrentCompany()
  
  if (!session || !session.company) {
    redirect('/login?error=unauthorized')
  }

  const supabase = await createClient()
  
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('company_id', session.company.id)
    .single()
  
  if (error || !product) {
    notFound()
  }

  const productData = {
    name: product.product_name,
    category: product.category || '',
    description: product.description || '',
    price: product.min_order_price?.toString() || '',
    unit: product.pricing_unit || 'kg',
    minOrder: product.min_order_quantity?.toString() || '',
    stock: product.available_quantity?.toString() || '',
    origin: product.origin_country || '',
    certifications: product.certifications || [],
  }

  return (
    <div className="container max-w-3xl py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground mt-1">
          Update product information
        </p>
      </div>
      <ProductForm initialData={productData} productId={id} />
    </div>
  )
}
