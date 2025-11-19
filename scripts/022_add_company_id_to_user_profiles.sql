-- Add company_id column to user_profiles for bidirectional relationship
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES companies(id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_company_id ON user_profiles(company_id);

-- Update existing user_profiles to link to their companies
UPDATE user_profiles up
SET company_id = c.id
FROM companies c
WHERE c.user_id = up.id
  AND up.company_id IS NULL;

-- Add RLS policy to allow users to see company_id in their own profile
-- (existing policies already cover this, but being explicit)
