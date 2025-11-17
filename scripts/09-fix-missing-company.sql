-- Script to manually create a company record for users who registered but didn't get a company profile
-- This happens when RLS policies block the company creation during registration

-- INSTRUCTIONS:
-- 1. Replace 'USER_EMAIL_HERE' with the actual user email (e.g., 'balesdravos@gmail.com')
-- 2. Replace 'COMPANY_NAME_HERE' with the desired company name
-- 3. Run this in your Supabase SQL Editor

-- Get the user ID from auth.users
DO $$
DECLARE
  v_user_id uuid;
  v_user_email text := 'balesdravos@gmail.com'; -- CHANGE THIS
  v_company_name text := 'Test Company'; -- CHANGE THIS
BEGIN
  -- Find the user
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = v_user_email;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', v_user_email;
  END IF;

  -- Check if company already exists
  IF EXISTS (SELECT 1 FROM companies WHERE user_id = v_user_id) THEN
    RAISE NOTICE 'Company already exists for user %', v_user_email;
  ELSE
    -- Create the company record
    INSERT INTO companies (
      user_id,
      company_name,
      company_type,
      verification_status,
      subscription_tier,
      business_email,
      country,
      city,
      address,
      postal_code,
      phone
    ) VALUES (
      v_user_id,
      v_company_name,
      'supplier',
      'pending',
      'basic',
      v_user_email,
      'United States',
      'New York',
      '123 Main St',
      '10001',
      '+1234567890'
    );

    RAISE NOTICE 'Company created successfully for user %', v_user_email;
  END IF;
END $$;

-- Verify the company was created
SELECT 
  c.id,
  c.company_name,
  c.company_type,
  c.verification_status,
  u.email
FROM companies c
JOIN auth.users u ON c.user_id = u.id
WHERE u.email = 'balesdravos@gmail.com'; -- CHANGE THIS
