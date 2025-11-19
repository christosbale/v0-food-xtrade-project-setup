# Supabase Email Configuration Guide

## Current Setup: Resend for All Emails

foodXtrade uses **Resend** for all transactional emails, including:
- Email verification (signup confirmation)
- Password reset requests  
- Welcome emails
- RFQ notifications
- Subscription confirmations

## Disabling Supabase Auth Emails

Since Supabase's hosted dashboard may not expose SMTP settings, you need to disable automatic auth emails and handle them manually via Resend.

### Option 1: Supabase Dashboard (if available)
1. Go to: **Authentication** → **Email Templates**
2. Under "Confirm signup", uncheck "Enable email confirmations"
3. Under "Reset password", configure custom templates or disable

### Option 2: Via Supabase SQL (Alternative)
If the dashboard doesn't have these settings, they're managed at the project configuration level and may require contacting Supabase support or using their API.

## Current Email Flow

### Registration:
1. User submits registration form
2. `supabase.auth.signUp()` creates user (email confirmation may be required by Supabase)
3. Custom welcome email sent via Resend (`/api/email/welcome`)

### Password Reset:
1. User requests password reset
2. `supabase.auth.resetPasswordForEmail()` generates reset token
3. Supabase sends their default reset email
4. Custom branded reset email also sent via Resend (`/api/email/password-reset`)

## Recommendations

### For Full Branding Control:
Contact Supabase support to:
1. Disable automatic auth emails
2. Or configure custom SMTP using Resend:
   - Host: `smtp.resend.com`
   - Port: `465` (SSL) or `587` (TLS)
   - Username: `resend`
   - Password: Your Resend API key
   - Sender: Your verified email domain

### Current Workaround:
The system currently sends **duplicate** emails for some actions:
- Supabase's default branded emails
- Your custom Resend branded emails

This is acceptable as a temporary solution, but for production you should either:
1. Configure Supabase to use Resend SMTP (best option)
2. Disable Supabase auth emails entirely (requires support ticket)

## Environment Variables Required

\`\`\`env
RESEND_API_KEY=re_xxxxx
EMAIL_FROM=noreply@yourfoodxtradedomain.com
NEXT_PUBLIC_SITE_URL=https://yourfoodxtradedomain.com
\`\`\`

## Testing Emails

Test all email flows in development:
- Registration: Check that welcome email arrives
- Password reset: Verify reset link works
- RFQ notifications: Confirm suppliers receive notifications
