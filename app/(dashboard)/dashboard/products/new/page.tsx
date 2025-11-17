import { ProductForm } from '@/components/dashboard/product-form'

export default function NewProductPage() {
  return (
    <div className="container max-w-3xl py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Add New Product</h1>
        <p className="text-muted-foreground mt-1">
          List a new product in your catalog
        </p>
      </div>
      <ProductForm />
    </div>
  )
}
