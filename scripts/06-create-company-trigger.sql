-- This trigger automatically creates a company record when a user confirms their email
-- This solves the RLS issue where we can't insert into companies during signup
-- because there's no authenticated session until email is confirmed.

-- Create a function that will be called by the trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert a company record for the new user using metadata from auth.users
  INSERT INTO public.companies (
    user_id,
    company_name,
    company_type,
    business_email,
    verification_status,
    subscription_tier,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'company_name', 'Pending Company Name'),
    COALESCE(NEW.raw_user_meta_data->>'company_type', 'supplier'),
    NEW.email,
    'pending',
    CASE 
      WHEN NEW.raw_user_meta_data->>'company_type' = 'buyer' THEN 'free'
      ELSE 'basic'
    END,
    NOW(),
    NOW()
  );
  
  RETURN NEW;
END;
$$;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger that fires after a user is created and email is confirmed
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  WHEN (NEW.email_confirmed_at IS NOT NULL)
  EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- Note: This trigger will only fire when email is confirmed
-- If email confirmation is disabled in Supabase settings, it fires immediately
