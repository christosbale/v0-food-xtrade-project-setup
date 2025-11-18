-- Fix Infinite Recursion in user_profiles RLS Policies
-- This replaces the circular admin policy with a direct policy

-- Drop the problematic policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;

-- Users can always view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

-- Service role can manage everything (bypasses RLS in backend)
DROP POLICY IF EXISTS "Service role can manage all profiles" ON public.user_profiles;
CREATE POLICY "Service role can manage all profiles" ON public.user_profiles
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Users can update their own profile (except role)
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND role = (SELECT role FROM public.user_profiles WHERE id = auth.uid())
  );

-- Verify admin exists
SELECT email, role FROM public.user_profiles WHERE email = 'balesdravos@gmail.com';
