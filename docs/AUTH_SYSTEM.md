# foodXtrade Authentication System Documentation

## Overview

The foodXtrade platform uses Supabase Auth with Row Level Security (RLS) for secure user authentication and data protection.

## Registration Flow

### For Suppliers (4-Step Process)

1. **Account Information** - Email and password
2. **Company Details** - Business registration, address, contact info
3. **Business Information** - Business type, years in operation, product categories
4. **Document Upload** - Business license, tax certificates, quality certificates

### For Buyers (Single Form)

- Email, password, and company details
- Business type and purchase interests

## How It Works

### Registration Process

1. User submits registration form
2. `supabase.auth.signUp()` creates auth user in `auth.users` table
3. Email confirmation sent to user (if enabled)
4. User clicks confirmation link
5. **Database trigger automatically creates company record** in `companies` table
6. Admin reviews and approves company (changes `verification_status` to 'verified')
7. User can now log in and access full features

### Database Trigger

The `handle_new_user()` trigger function automatically creates a company record when:
- A new user is created in `auth.users`
- The user's email is confirmed (`email_confirmed_at IS NOT NULL`)

This solves the RLS problem where we can't insert into `companies` during signup because there's no authenticated session until email confirmation.

## Row Level Security (RLS)

All tables have RLS enabled to protect data:

### Companies Table

- **SELECT**: Users can only view their own company (`auth.uid() = user_id`)
- **UPDATE**: Users can only update their own company
- **INSERT**: Users can insert their own company (backup for trigger)

### Products Table

- **SELECT**: Everyone can view published products
- **INSERT/UPDATE/DELETE**: Suppliers can only manage their own products

### Documents Table

- **SELECT**: Users can view documents for their company
- **INSERT**: Users can upload documents for their company

### RFQs Table

- **SELECT**: Suppliers can view RFQs for their products
- **UPDATE**: Suppliers can update status of their RFQs
- **INSERT**: Anyone can submit RFQs (buyers don't need accounts)

## Configuration Requirements

### Supabase Settings

**Option 1: Keep Email Confirmation Enabled (Recommended for Production)**
- Run the database trigger scripts: `06-create-company-trigger.sql` and `07-fix-rls-policies.sql`
- Users must confirm email before company record is created
- More secure, prevents spam registrations

**Option 2: Disable Email Confirmation (Easier for Development)**
- Go to Supabase Dashboard → Authentication → Settings
- Toggle OFF "Enable email confirmations"
- Users can log in immediately after registration
- Company record created during signup

## Environment Variables

Required environment variables (already configured):

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/dashboard
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

## Files Structure

\`\`\`
lib/
  supabase/
    client.ts          # Browser client (client components)
    server.ts          # Server client (server components)
    middleware.ts      # Auth middleware helper

components/
  auth/
    login-form.tsx                    # Login form
    supplier-registration-form.tsx    # Supplier signup (4 steps)
    buyer-registration-form.tsx       # Buyer signup

app/
  login/
    page.tsx           # Login page
  register/
    page.tsx           # Registration type selection
    supplier/
      page.tsx         # Supplier registration
    buyer/
      page.tsx         # Buyer registration
    success/
      page.tsx         # Success message after signup

middleware.ts          # Auth middleware (protects routes)
\`\`\`

## Protected Routes

Routes protected by middleware authentication:
- `/dashboard/*` - Supplier dashboard
- `/admin/*` - Admin panel

Public routes:
- `/` - Homepage
- `/products` - Product marketplace
- `/login` - Login page
- `/register/*` - Registration pages

## Testing

### Create Test Users

**Supplier Account:**
\`\`\`javascript
Email: supplier@test.com
Password: Test123456!
Company: Test Supplier Inc.
\`\`\`

**Buyer Account:**
\`\`\`javascript
Email: buyer@test.com
Password: Test123456!
Company: Test Buyer Corp.
\`\`\`

### Manual Testing Checklist

- [ ] Supplier can register with all 4 steps
- [ ] Buyer can register with single form
- [ ] Email confirmation works (if enabled)
- [ ] Users can log in after confirmation
- [ ] Supplier can access dashboard after verification
- [ ] Supplier can create/edit products
- [ ] Buyer can browse products and submit RFQs
- [ ] RLS prevents unauthorized access
- [ ] Admin can verify companies
- [ ] Logout works correctly

## Troubleshooting

### "Row-level security policy" Error

**Cause**: User is trying to insert into a table before email confirmation
**Solution**: 
1. Check if email confirmation is enabled in Supabase
2. Make sure database trigger is installed
3. Or disable email confirmation for development

### "Invalid login credentials"

**Cause**: User doesn't exist or password is wrong
**Solution**: Make sure user completed registration and confirmed email

### Can't Create Products

**Cause**: User's company is not verified or doesn't exist
**Solution**: 
1. Check `companies` table for user's company record
2. Verify `verification_status` is 'verified' or 'pending'
3. Check RLS policies are correctly set up

### Session Not Persisting

**Cause**: Middleware not configured correctly
**Solution**: Make sure `middleware.ts` is in root directory and uses correct Supabase client

## Security Best Practices

1. **Always use RLS** - Never disable RLS in production
2. **Validate on server** - Don't trust client-side validation alone
3. **Use SECURITY DEFINER carefully** - Only for trusted trigger functions
4. **Audit logs** - Consider adding audit trails for sensitive operations
5. **Rate limiting** - Supabase has built-in rate limiting for auth endpoints
6. **Strong passwords** - Enforce password requirements (length, complexity)
7. **Email verification** - Always require email confirmation in production

## Future Enhancements

- [ ] Password reset flow
- [ ] Email change with re-verification
- [ ] Two-factor authentication (2FA)
- [ ] Social OAuth (Google, LinkedIn)
- [ ] User profile management
- [ ] Document upload with virus scanning
- [ ] Automated company verification checks
- [ ] Session management and device tracking
