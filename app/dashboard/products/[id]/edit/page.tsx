import { redirect } from 'next/navigation'

export default function EditProductPage({ params }: { params: { id: string } }) {
  // Redirect to products page with edit mode enabled
  redirect(`/dashboard/products?editing=${params.id}`)
}
