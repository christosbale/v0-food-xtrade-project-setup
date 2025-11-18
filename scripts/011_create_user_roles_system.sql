-- Create user roles and permissions system

-- Add role column to auth.users metadata (via profiles table)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'buyer' CHECK (role IN ('admin', 'buyer', 'supplier')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.user_profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Service role can manage all profiles"
  ON public.user_profiles
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- Add indexes
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);

-- Update companies table to support dual roles (buyer can also be supplier)
ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS can_buy BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS can_sell BOOLEAN DEFAULT FALSE;

-- Update existing companies based on company_type
UPDATE public.companies
SET can_sell = (company_type = 'supplier'),
    can_buy = (company_type = 'buyer');

-- Add admin approval fields
ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS vat_validated BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS vat_validation_date TIMESTAMPTZ;

-- Create admin_actions table for audit trail
CREATE TABLE IF NOT EXISTS public.admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES auth.users(id),
  action_type TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all actions"
  ON public.admin_actions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert actions"
  ON public.admin_actions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Add admin product moderation fields
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Update RLS policies for admin access to products
CREATE POLICY "Admins can view all products"
  ON public.products
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all products"
  ON public.products
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Add promotional billing features
ALTER TABLE public.subscription_history
ADD COLUMN IF NOT EXISTS promotional_months INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS granted_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS promotion_reason TEXT;

-- Update companies RLS to allow admin access
CREATE POLICY "Admins can view all companies"
  ON public.companies
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all companies"
  ON public.companies
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, role)
  VALUES (NEW.id, 'buyer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signups
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for performance
CREATE INDEX idx_companies_verification_status ON public.companies(verification_status);
CREATE INDEX idx_companies_can_sell ON public.companies(can_sell);
CREATE INDEX idx_companies_vat_validated ON public.companies(vat_validated);
CREATE INDEX idx_admin_actions_admin_id ON public.admin_actions(admin_id);
CREATE INDEX idx_admin_actions_target ON public.admin_actions(target_type, target_id);
