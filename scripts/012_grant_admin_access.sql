-- Grant admin role to specific user
-- This script adds admin role to balesdravos@gmail.com

-- Update the user profile to admin role for the specified email
UPDATE public.user_profiles
SET 
  role = 'admin',
  updated_at = NOW()
WHERE id = (
  SELECT id 
  FROM auth.users 
  WHERE email = 'balesdravos@gmail.com'
);

-- If the user profile doesn't exist yet, create it
INSERT INTO public.user_profiles (id, role, created_at, updated_at)
SELECT 
  id,
  'admin',
  NOW(),
  NOW()
FROM auth.users
WHERE email = 'balesdravos@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.user_profiles WHERE id = auth.users.id
  );

-- Log this action
INSERT INTO public.admin_actions (
  admin_id,
  action_type,
  target_type,
  target_id,
  details,
  created_at
)
SELECT 
  id,
  'grant_admin_role',
  'user',
  id,
  jsonb_build_object('email', 'balesdravos@gmail.com', 'granted_by', 'system'),
  NOW()
FROM auth.users
WHERE email = 'balesdravos@gmail.com';
