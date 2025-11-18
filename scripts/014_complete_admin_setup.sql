-- Complete Admin Setup Script
-- Run this single script to set up user_profiles table and grant admin access
-- This script is safe to run multiple times

-- Step 1: Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Step 2: Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Step 3: Create RLS Policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
CREATE POLICY "Admins can view all profiles" ON public.user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "Service role can manage all profiles" ON public.user_profiles;
CREATE POLICY "Service role can manage all profiles" ON public.user_profiles
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Step 4: Create trigger function for auto-profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'user')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 5: Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 6: Create profiles for existing users
INSERT INTO public.user_profiles (id, email, role)
SELECT 
  u.id,
  u.email,
  'user' as role
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_profiles WHERE id = u.id
)
ON CONFLICT (id) DO NOTHING;

-- Step 7: Grant admin role to balesdravos@gmail.com
INSERT INTO public.user_profiles (id, email, role)
SELECT 
  id,
  email,
  'admin' as role
FROM auth.users
WHERE email = 'balesdravos@gmail.com'
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'admin',
  updated_at = NOW();

-- Step 8: Add performance indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);

-- Verify the admin was created
SELECT 
  email,
  role,
  created_at
FROM public.user_profiles
WHERE email = 'balesdravos@gmail.com';
