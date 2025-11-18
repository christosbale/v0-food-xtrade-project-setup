-- Ensure all approval-related columns exist in companies table

-- Add missing columns if they don't exist
ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS vat_validated BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS vat_validation_date TIMESTAMPTZ;

-- Ensure verification_status column has correct check constraint
ALTER TABLE public.companies 
DROP CONSTRAINT IF EXISTS companies_verification_status_check;

ALTER TABLE public.companies
ADD CONSTRAINT companies_verification_status_check 
CHECK (verification_status IN ('pending', 'verified', 'rejected'));

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_companies_verification_status 
ON public.companies(verification_status);

CREATE INDEX IF NOT EXISTS idx_companies_approved_by 
ON public.companies(approved_by);

CREATE INDEX IF NOT EXISTS idx_companies_vat_validated 
ON public.companies(vat_validated);

-- Show current companies with pending status
SELECT 
  id,
  company_name,
  verification_status,
  vat_validated,
  created_at
FROM public.companies
WHERE verification_status = 'pending'
ORDER BY created_at DESC;
