import { ProductForm } from '@/components/dashboard/product-form'

export default function EditProductPage({ params }: { params: { id: string } }) {
  // TODO: Fetch product data from API
  const productData = {
    name: 'Organic Apples',
    category: 'Fresh Fruits',
    description: 'Premium quality organic apples sourced from certified farms.',
    price: '2.50',
    unit: 'kg',
    minOrder: '100',
    stock: '5000',
    origin: 'United States',
    certifications: ['Organic', 'FDA Approved'],
  }

  return (
    <div className="container max-w-3xl py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground mt-1">
          Update product information
        </p>
      </div>
      <ProductForm initialData={productData} productId={params.id} />
    </div>
  )
}
