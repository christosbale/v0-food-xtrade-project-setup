-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Suppliers can insert their own products" ON products;

-- Create new INSERT policy that allows:
-- 1. Suppliers to insert their own products (if verified)
-- 2. Admins to insert products for any company
CREATE POLICY "Suppliers and admins can insert products"
ON products
FOR INSERT
TO public
WITH CHECK (
  -- Allow admins to insert for any company
  (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  )
  OR
  -- Allow suppliers to insert their own products if verified
  (
    company_id IN (
      SELECT companies.id
      FROM companies
      WHERE companies.user_id = auth.uid()
      AND companies.company_type = 'supplier'
      AND companies.verification_status = 'verified'
    )
  )
);

-- Also update the UPDATE policy to allow admins
DROP POLICY IF EXISTS "Suppliers can update their own products" ON products;

CREATE POLICY "Suppliers and admins can update products"
ON products
FOR UPDATE
TO public
USING (
  -- Allow admins to update any product
  (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  )
  OR
  -- Allow suppliers to update their own products
  (
    company_id IN (
      SELECT companies.id
      FROM companies
      WHERE companies.user_id = auth.uid()
    )
  )
)
WITH CHECK (
  -- Same conditions for the new data
  (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  )
  OR
  (
    company_id IN (
      SELECT companies.id
      FROM companies
      WHERE companies.user_id = auth.uid()
    )
  )
);

-- Also update DELETE policy to allow admins
DROP POLICY IF EXISTS "Suppliers can delete their own products" ON products;

CREATE POLICY "Suppliers and admins can delete products"
ON products
FOR DELETE
TO public
USING (
  -- Allow admins to delete any product
  (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  )
  OR
  -- Allow suppliers to delete their own products
  (
    company_id IN (
      SELECT companies.id
      FROM companies
      WHERE companies.user_id = auth.uid()
    )
  )
);
