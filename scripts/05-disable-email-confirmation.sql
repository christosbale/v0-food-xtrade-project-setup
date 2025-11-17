-- IMPORTANT: This script should be run in your Supabase SQL Editor
-- to disable email confirmation for B2B foodXtrade platform
-- 
-- For B2B platforms, we manually verify companies through admin approval,
-- so automatic email confirmation is not necessary and adds friction.
--
-- To disable email confirmation:
-- 1. Go to your Supabase Dashboard
-- 2. Navigate to: Authentication → Settings → Email Auth
-- 3. Toggle OFF "Enable email confirmations"
--
-- Alternative: Run this via Supabase CLI or API:
-- supabase --project-ref YOUR_PROJECT_REF auth update --enable-signup --disable-email-confirmations
--
-- Once disabled, users will be able to log in immediately after registration
-- and the RLS policies will work correctly since there will be an active session.

-- Note: This is a configuration change, not a SQL command
-- The actual toggle must be done in the Supabase Dashboard or via CLI

SELECT 'Email confirmation should be disabled in Supabase Dashboard > Authentication > Settings' as instruction;
