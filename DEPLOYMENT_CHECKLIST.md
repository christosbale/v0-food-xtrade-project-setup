# Production Deployment Checklist

## Environment Variables Required
Ensure all of these are set in your production environment:

### Supabase (REQUIRED)
- `SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### PostgreSQL (Auto-configured by Supabase)
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`
- `POSTGRES_HOST`

### Email (REQUIRED for auth flows)
- `RESEND_API_KEY`
- `EMAIL_FROM` (e.g., noreply@yourdomain.com)

### Application URLs (REQUIRED)
- `NEXT_PUBLIC_SITE_URL` (Your production URL, e.g., https://foodxtrade.com)
- `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` (Only for development/preview)

### JWT (Auto-configured by Supabase)
- `SUPABASE_JWT_SECRET`

## Pre-Deployment Checks

### 1. Database Migrations
- [ ] All migrations applied to production database
- [ ] RLS policies are active and tested
- [ ] All required tables exist
- [ ] Indexes are in place for performance

### 2. Authentication Flow
- [ ] Test signup flow
- [ ] Test login flow
- [ ] Test password reset
- [ ] Test email verification
- [ ] Test session persistence across pages
- [ ] Test logout functionality

### 3. Critical Pages
- [ ] Homepage loads correctly
- [ ] Dashboard loads for authenticated users
- [ ] Admin panel accessible for admin users
- [ ] Company profile page works
- [ ] Product listings display
- [ ] RFQ creation works
- [ ] Settings page functional

### 4. Forms and Actions
- [ ] All forms submit successfully
- [ ] Server actions execute without errors
- [ ] File uploads work (if implemented)
- [ ] Form validation displays correctly

### 5. Error Handling
- [ ] 404 pages display for invalid routes
- [ ] Error boundaries catch runtime errors
- [ ] API errors return proper status codes
- [ ] User-friendly error messages shown

### 6. Performance
- [ ] Images optimized
- [ ] No console errors in browser
- [ ] Page load times acceptable
- [ ] Database queries optimized

## Known Differences Between Preview and Production

### Authentication
- Cookie handling may differ
- Session persistence requires proper SITE_URL configuration
- Redirects must use production URLs

### Environment Variables
- Preview uses dev Supabase redirect URL
- Production must use actual domain URL
- No localhost fallbacks in production

### Rendering
- Static pages may cache differently
- Force-dynamic routes always fetch fresh data
- Middleware runs on every request

## Post-Deployment Verification

### Immediate Checks (First 5 minutes)
- [ ] Site loads without errors
- [ ] Can create new account
- [ ] Can log in with existing account
- [ ] Dashboard displays correctly
- [ ] No 500 errors in logs

### Within 1 Hour
- [ ] Test complete user flow (signup → verify → login → use features)
- [ ] Check email delivery
- [ ] Verify database writes
- [ ] Test admin functionality
- [ ] Check mobile responsiveness

### Within 24 Hours
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify email deliverability
- [ ] Test all major features
- [ ] Gather user feedback

## Rollback Plan

If critical issues occur:
1. Check Vercel deployment logs
2. Check Supabase logs
3. Verify environment variables are set
4. Roll back to previous deployment if needed
5. Fix issues in development
6. Redeploy

## Support Contacts
- Vercel Support: vercel.com/help
- Supabase Support: supabase.com/support
