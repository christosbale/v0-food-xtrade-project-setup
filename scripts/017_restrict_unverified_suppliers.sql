-- Restrict Unverified Suppliers
-- This script ensures suppliers cannot add products or receive RFQs until verified

-- Update products RLS policy to require verified supplier
DROP POLICY IF EXISTS "Suppliers can insert their own products" ON public.products;
CREATE POLICY "Suppliers can insert their own products" ON public.products
  FOR INSERT 
  WITH CHECK (
    company_id IN (
      SELECT id FROM public.companies 
      WHERE user_id = auth.uid() 
      AND company_type = 'supplier'
      AND verification_status = 'verified'
    )
  );

-- Update products RLS policy to restrict updates to verified suppliers
DROP POLICY IF EXISTS "Suppliers can update their own products" ON public.products;
CREATE POLICY "Suppliers can update their own products" ON public.products
  FOR UPDATE
  USING (
    company_id IN (
      SELECT id FROM public.companies 
      WHERE user_id = auth.uid() 
      AND company_type = 'supplier'
      AND verification_status = 'verified'
    )
  );

-- Only show verified supplier products publicly
DROP POLICY IF EXISTS "Published products are viewable by everyone" ON public.products;
CREATE POLICY "Published products are viewable by everyone" ON public.products
  FOR SELECT 
  USING (
    status = 'published' 
    AND company_id IN (
      SELECT id FROM public.companies 
      WHERE verification_status = 'verified'
    )
  );

-- Add index for faster verification status checks
CREATE INDEX IF NOT EXISTS idx_companies_verification_status ON public.companies(verification_status);
CREATE INDEX IF NOT EXISTS idx_companies_type_verification ON public.companies(company_type, verification_status);

-- Add helpful comment
COMMENT ON COLUMN public.companies.verification_status IS 'Status of company verification: pending (awaiting admin review), verified (approved by admin), rejected (declined by admin). Suppliers must be verified before they can list products.';
