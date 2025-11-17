# foodXtrade Setup Instructions

## Critical: Fix Authentication & Registration

The foodXtrade platform uses Supabase for authentication. To get registration working properly, you MUST run the SQL script to fix RLS policies.

### Step 1: Run the RLS Fix Script

Go to your Supabase dashboard → SQL Editor and run:

\`\`\`sql
-- File: scripts/08-bypass-rls-for-registration.sql

-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert their own company" ON companies;
DROP POLICY IF EXISTS "Users can view their own company" ON companies;
DROP POLICY IF EXISTS "Users can update their own company" ON companies;

-- Create permissive policy for authenticated users to insert
CREATE POLICY "Authenticated users can insert companies"
ON companies
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Keep the select policy
CREATE POLICY "Users can view their own company"
ON companies
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Update policy
CREATE POLICY "Users can update their own company"
ON companies
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Add validation trigger
CREATE OR REPLACE FUNCTION validate_company_user_id()
RETURNS TRIGGER AS $$
BEGIN
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
\`\`\`

### Step 2: Disable Email Confirmation (Development Only)

For development and testing, disable email confirmation in Supabase:

1. Go to Supabase Dashboard → Authentication → Settings
2. Under "Email Auth", disable "Enable email confirmations"
3. Save changes

**Note:** For production, keep email confirmation enabled and ensure email delivery is properly configured.

### Step 3: Test Registration Flow

1. Go to `/register/supplier` or `/register/buyer`
2. Fill in all required fields
3. Complete registration
4. You should be redirected to `/register/success`
5. Go to `/login` and log in with your credentials
6. Access `/dashboard/products` to verify company profile exists

### How It Works

The registration flow now:

1. Creates an auth user via `supabase.auth.signUp()`
2. Waits for session to be established (1 second delay)
3. Inserts company record into `companies` table with `user_id = auth.uid()`
4. The new RLS policy allows ANY authenticated user to insert
5. The trigger validates that `user_id` matches `auth.uid()` for security
6. User is redirected to success page

### Troubleshooting

**Error: "Email not confirmed"**
- Disable email confirmation in Supabase settings (see Step 2)
- Or check your email and click the confirmation link

**Error: "Company profile not found"**
- Run the RLS fix script (Step 1)
- Re-register the user (the auth user exists, but company wasn't created)

**Error: "row-level security policy"**
- The RLS fix script wasn't applied correctly
- Check Supabase logs for detailed error messages

**Error: "Too many registration attempts"**
- Supabase rate limiting - wait 60 seconds and try again

### Production Checklist

Before going to production:

- [ ] Enable email confirmation in Supabase
- [ ] Configure email templates and SMTP
- [ ] Set up proper RLS policies for admin access
- [ ] Add email verification reminders
- [ ] Implement password reset flow
- [ ] Add rate limiting on registration endpoints
- [ ] Set up monitoring for failed registrations
- [ ] Create admin tools to manually verify companies
- [ ] Test the complete flow end-to-end

## Environment Variables

Required environment variables (already configured):

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/dashboard
\`\`\`

## Database Schema

The current schema includes:

- `companies` - Supplier and buyer company profiles
- `products` - Product listings from suppliers
- `rfqs` - Request for quote records
- `documents` - Company verification documents
- `product_images` - Product image URLs

All tables have RLS enabled with proper policies.
