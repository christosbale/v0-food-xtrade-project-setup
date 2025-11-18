// Database type definitions for foodXtrade

export interface Company {
  id: string
  user_id: string
  company_name: string
  company_type: 'supplier' | 'buyer'
  business_email: string
  country: string
  city: string
  address: string
  postal_code: string
  phone: string
  website: string | null
  tax_id: string | null
  business_registration_number: string | null
  verification_status: 'pending' | 'verified' | 'rejected'
  verification_notes: string | null
  subscription_tier: 'basic' | 'pro' | 'premium'
  can_buy: boolean
  can_sell: boolean
  approved_by: string | null
  approved_at: string | null
  vat_validated: boolean
  vat_validation_date: string | null
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  company_id: string
  product_name: string
  category: string
  origin_country: string
  available_quantity: number
  unit: string
  price_per_unit: number
  min_order_quantity: number
  incoterm: string
  customs_status: string
  crop_year: string | null
  packaging: string | null
  certifications: string[]
  status: 'draft' | 'published'
  reviewed_by: string | null
  reviewed_at: string | null
  admin_notes: string | null
  created_at: string
  updated_at: string
}

export interface RFQ {
  id: string
  product_id: string
  supplier_company_id: string
  buyer_company_name: string
  buyer_email: string
  buyer_country: string
  desired_quantity: number
  unit: string
  target_price: number | null
  preferred_incoterm: string
  message: string
  status: 'pending' | 'quoted' | 'accepted' | 'rejected'
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  company_id: string
  document_type: string
  file_name: string
  file_url: string
  uploaded_at: string
}

export interface ProductImage {
  id: string
  product_id: string
  image_url: string
  is_primary: boolean
  uploaded_at: string
}

// Helper type for user session with company data
export interface UserSession {
  user: {
    id: string
    email: string
  }
  company: Company | null
}

export type UserRole = 'admin' | 'buyer' | 'supplier'

export interface UserProfile {
  id: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface AdminAction {
  id: string
  admin_id: string
  action_type: string
  target_type: string
  target_id: string
  details: Record<string, any>
  created_at: string
}

export interface SubscriptionHistory {
  id: string
  company_id: string
  plan_id: string
  started_at: string
  ended_at: string | null
  status: string
  promotional_months: number
  granted_by: string | null
  promotion_reason: string | null
  created_at: string
}
