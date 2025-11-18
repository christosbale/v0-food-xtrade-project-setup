-- Simplified admin setup script
-- This combines user_profiles creation and admin grant in one script

-- Create user_profiles table if not exists
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Service role can manage all profiles" ON public.user_profiles;
CREATE POLICY "Service role can manage all profiles" ON public.user_profiles
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Create trigger function to auto-create profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'user')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Grant admin role to balesdravos@gmail.com
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

-- Create profiles for any existing users who don't have one
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

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
