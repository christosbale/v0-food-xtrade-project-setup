# foodXtrade Quick Start Guide

## For Development/Testing: Disable Email Confirmation

By default, Supabase requires users to confirm their email before they can log in. For development and testing, you should disable this requirement.

### Steps to Disable Email Confirmation:

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Providers** → **Email**
3. Scroll down to **Confirm email**
4. **UNCHECK** "Enable email confirmations"
5. Click **Save**

Now users can log in immediately after registration without needing to confirm their email.

### For Production:

For a production B2B platform like foodXtrade, you have two options:

1. **Keep email confirmation disabled** - Since you manually verify companies anyway through the admin panel, email confirmation may be redundant
2. **Keep email confirmation enabled** - Provides an additional security layer, but users must confirm email before accessing the platform

## Testing the Auth System

After disabling email confirmation:

1. Register a new supplier account at `/register/supplier`
2. Fill out all 4 steps of the registration form
3. You should be redirected to the success page
4. Go to `/login` and log in with your email/password
5. You'll be redirected to `/dashboard`

## Common Issues

**"Email not confirmed" error when logging in:**
- Follow the steps above to disable email confirmation in Supabase
- Or check your email inbox for the confirmation link

**"new row violates row-level security policy" error:**
- Make sure you've run all SQL scripts in the `scripts/` folder
- Check that the RLS policies are properly configured
- Verify that email confirmation is disabled (or the user has confirmed their email)

**User created but no company record:**
- Check if the user confirmed their email (if confirmation is enabled)
- Verify the database trigger `create_company_for_new_user` exists
- Check Supabase logs for any errors

## Next Steps

After successful login:
1. Add products from the dashboard
2. View your products at `/products`
3. Buyers can send RFQs from product pages
4. Check RFQs in the dashboard
</markdown>
