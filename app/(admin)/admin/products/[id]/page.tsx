import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ProductModerationActions } from '@/components/admin/product-moderation-actions'
import Image from 'next/image'

export default async function AdminProductDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  
  // Fetch product with company information
  const { data: product } = await supabase
    .from('products')
    .select(`
      *,
      companies:company_id (
        company_name,
        country,
        business_email
      )
    `)
    .eq('id', params.id)
    .single()

  if (!product) {
    notFound()
  }

  // Fetch product images
  const { data: images } = await supabase
    .from('product_images')
    .select('*')
    .eq('product_id', params.id)
    .order('is_primary', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Product Review</h2>
          <p className="text-muted-foreground">
            Review and moderate product listing
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/products">Back to Products</Link>
        </Button>
      </div>

      {/* Status Badges */}
      <div className="flex items-center gap-2">
        <Badge variant={product.status === 'published' ? 'default' : 'secondary'}>
          {product.status}
        </Badge>
        {product.reviewed_by && (
          <Badge className="bg-green-500">
            Reviewed
          </Badge>
        )}
      </div>

      {/* Product Images */}
      {images && images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((image: any) => (
                <div key={image.id} className="relative aspect-square rounded-lg overflow-hidden border">
                  <Image
                    src={image.image_url || "/placeholder.svg"}
                    alt="Product image"
                    fill
                    className="object-cover"
                  />
                  {image.is_primary && (
                    <Badge className="absolute top-2 left-2">Primary</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Product Information */}
      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>Details about the product listing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-muted-foreground">Product Name</Label>
              <p className="text-lg font-medium">{product.product_name}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Category</Label>
              <p className="text-lg font-medium">{product.category}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Origin Country</Label>
              <p className="text-lg font-medium">{product.origin_country}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Price</Label>
              <p className="text-lg font-medium">
                ${product.price_per_unit} per {product.unit}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">Available Quantity</Label>
              <p className="text-lg font-medium">
                {product.available_quantity} {product.unit}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">Min Order Quantity</Label>
              <p className="text-lg font-medium">
                {product.min_order_quantity} {product.unit}
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-muted-foreground">Incoterm</Label>
              <p className="font-medium">{product.incoterm}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Customs Status</Label>
              <p className="font-medium">{product.customs_status}</p>
            </div>
            {product.crop_year && (
              <div>
                <Label className="text-muted-foreground">Crop Year</Label>
                <p className="font-medium">{product.crop_year}</p>
              </div>
            )}
            {product.packaging && (
              <div>
                <Label className="text-muted-foreground">Packaging</Label>
                <p className="font-medium">{product.packaging}</p>
              </div>
            )}
          </div>

          {product.certifications && product.certifications.length > 0 && (
            <>
              <Separator />
              <div>
                <Label className="text-muted-foreground">Certifications</Label>
                <div className="flex gap-2 flex-wrap mt-2">
                  {product.certifications.map((cert: string) => (
                    <Badge key={cert} variant="outline">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          <div>
            <Label className="text-muted-foreground">Created At</Label>
            <p className="text-sm">
              {new Date(product.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {product.reviewed_at && (
            <div>
              <Label className="text-muted-foreground">Reviewed At</Label>
              <p className="text-sm">
                {new Date(product.reviewed_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Supplier Information */}
      <Card>
        <CardHeader>
          <CardTitle>Supplier Information</CardTitle>
          <CardDescription>Company that listed this product</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-muted-foreground">Company Name</Label>
              <p className="font-medium">{product.companies?.company_name}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Country</Label>
              <p className="font-medium">{product.companies?.country}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Email</Label>
              <p className="font-medium">{product.companies?.business_email}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/companies/${product.company_id}`}>
              View Company Profile
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Admin Notes if exists */}
      {product.admin_notes && (
        <Card>
          <CardHeader>
            <CardTitle>Admin Notes</CardTitle>
            <CardDescription>Previous moderation notes</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{product.admin_notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Moderation Actions */}
      <ProductModerationActions
        productId={product.id}
        isReviewed={!!product.reviewed_by}
        currentStatus={product.status}
      />
    </div>
  )
}
