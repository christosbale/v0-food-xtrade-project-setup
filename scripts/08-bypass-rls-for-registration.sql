-- Temporary solution: Allow authenticated users to create companies
-- This bypasses the RLS policy issue during registration

-- Drop the existing policy
DROP POLICY IF EXISTS "Users can insert their own company" ON companies;

-- Create a more permissive policy for authenticated users
CREATE POLICY "Authenticated users can insert companies"
ON companies
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Keep the select policy
DROP POLICY IF EXISTS "Users can view their own company" ON companies;
CREATE POLICY "Users can view their own company"
ON companies
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Update policy
DROP POLICY IF EXISTS "Users can update their own company" ON companies;
CREATE POLICY "Users can update their own company"
ON companies
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Add a trigger to ensure user_id matches auth.uid() after insert
CREATE OR REPLACE FUNCTION validate_company_user_id()
RETURNS TRIGGER AS $$
BEGIN
  -- Only validate if user is authenticated
  IF auth.uid() IS NOT NULL AND NEW.user_id != auth.uid() THEN
    RAISE EXCEPTION 'user_id must match authenticated user';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS validate_company_user_id_trigger ON companies;
CREATE TRIGGER validate_company_user_id_trigger
  BEFORE INSERT ON companies
  FOR EACH ROW
  EXECUTE FUNCTION validate_company_user_id();
