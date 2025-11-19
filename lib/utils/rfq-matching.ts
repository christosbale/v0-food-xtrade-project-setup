import { createClient } from '@/lib/supabase/client'

interface Product {
  id: string
  product_name: string
  category: string
  product_type: string
  warehouse_country: string
  customs_status: string
  min_order_quantity: number
  min_order_unit: string
  company_id: string
  companies: {
    company_name: string
    verification_status: string
    verification_level: string
  }
}

interface MatchedSupplier {
  supplierId: string
  supplierName: string
  productId: string
  productName: string
  verified: boolean
  verificationLevel: string
  customsStatus: string
  moq: number
  moqUnit: string
  matchScore: number
}

export async function findMatchingSuppliers(
  targetCategory: string,
  targetSubcategory: string,
  targetCountry?: string,
  targetCustomsStatus?: string,
  targetMoq?: number,
  targetMoqUnit?: string
): Promise<MatchedSupplier[]> {
  const supabase = createClient()

  // Build query
  let query = supabase
    .from('products')
    .select(`
      id,
      product_name,
      category,
      product_type,
      warehouse_country,
      customs_status,
      min_order_quantity,
      min_order_unit,
      company_id,
      companies!inner (
        company_name,
        verification_status,
        verification_level
      )
    `)
    .eq('status', 'published')
    .eq('category', targetCategory)

  // Add subcategory filter if provided
  if (targetSubcategory) {
    query = query.eq('product_type', targetSubcategory)
  }

  const { data: products, error } = await query

  if (error) {
    console.error('[v0] Error fetching matching products:', error)
    return []
  }

  if (!products || products.length === 0) {
    return []
  }

  // Score and filter matches
  const matches: MatchedSupplier[] = products
    .map((product: any) => {
      let matchScore = 100 // Start with perfect score

      // Exact category + subcategory = baseline match
      if (product.category === targetCategory) matchScore += 50
      if (product.product_type === targetSubcategory) matchScore += 30

      // Customs status match (optional but boosts score)
      if (targetCustomsStatus && product.customs_status === targetCustomsStatus) {
        matchScore += 15
      } else if (targetCustomsStatus) {
        matchScore -= 10 // Slight penalty if requested but doesn't match
      }

      // Country proximity (optional but boosts score)
      if (targetCountry && product.warehouse_country === targetCountry) {
        matchScore += 20
      }

      // MOQ compatibility check
      if (targetMoq && targetMoqUnit && product.min_order_quantity && product.min_order_unit) {
        // Check if supplier's MOQ is less than or equal to buyer's target
        // (Simplified - assumes same units)
        if (product.min_order_unit === targetMoqUnit) {
          if (product.min_order_quantity <= targetMoq) {
            matchScore += 10
          } else {
            matchScore -= 20 // Penalty if MOQ is too high
          }
        }
      }

      // Verified suppliers get bonus
      if (product.companies?.verification_status === 'verified') {
        matchScore += 25
      }

      return {
        supplierId: product.company_id,
        supplierName: product.companies?.company_name || 'Unknown',
        productId: product.id,
        productName: product.product_name,
        verified: product.companies?.verification_status === 'verified',
        verificationLevel: product.companies?.verification_level || 'basic',
        customsStatus: product.customs_status || 'Not specified',
        moq: product.min_order_quantity,
        moqUnit: product.min_order_unit,
        matchScore
      }
    })
    .filter(match => match.matchScore >= 70) // Only show good matches
    .sort((a, b) => b.matchScore - a.matchScore) // Sort by score

  return matches
}
