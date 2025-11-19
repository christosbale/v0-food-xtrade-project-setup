# Security Policy

## Overview

FoodXtrade takes security seriously. This document outlines our security practices and how to report vulnerabilities.

## Security Features

### 1. Supabase Row Level Security (RLS)

All database tables have RLS policies enabled:

- **Products**: Suppliers can only manage their own products; admins can manage all
- **Companies**: Users can only view/edit their own company; admins can manage all
- **User Profiles**: Users can view their own profile; admins can view all
- **RFQs**: Buyers can manage their own; suppliers can view matching RFQs
- **Notification Preferences**: Users can only manage their own preferences

### 2. Authentication & Authorization

- **Supabase Auth** for user authentication
- **Role-based access control**: `admin`, `buyer`, `supplier` roles
- **Admin guards** on all admin routes (`/admin/*`)
- **Dashboard guards** on authenticated routes (`/dashboard/*`)
- **Company verification** required for certain actions (e.g., creating products)

### 3. API Security

- **Server Actions**: All mutations use Next.js Server Actions (server-side only)
- **No service role key in client**: Browser code ONLY uses `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Input validation**: All user inputs validated with Zod schemas
- **Rate limiting**: Planned via Vercel Edge Config

### 4. Email Security

- **Resend integration** for transactional emails
- **User preferences**: Users can opt-out of non-critical emails
- **Global admin toggles**: Admins can disable email types platform-wide
- **No user data in templates**: Email templates sanitize all user-provided content

### 5. Environment Variables

All sensitive keys stored as environment variables:

| Variable | Scope | Security Level |
|----------|-------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | ✅ Safe to expose |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | ✅ Safe to expose (RLS protected) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server | ⚠️ **NEVER expose** - Bypasses RLS |
| `RESEND_API_KEY` | Server | 🔒 Server-only |
| `EMAIL_FROM` | Server | 🔒 Server-only |

## Current Security Status

✅ **No service role key usage in codebase**  
✅ **All Supabase clients use anon key with RLS**  
✅ **Admin API usage is server-side only**  
✅ **GitHub Actions security scanning enabled**  
✅ **Biome linting enforced in CI/CD**  

## Automated Security Checks

### GitHub Actions

Our CI/CD pipeline includes:

1. **Biome CI** (`.github/workflows/security.yml`)
   - Linting and code quality checks
   - Runs on every push and PR

2. **CodeQL Analysis** (`.github/workflows/security.yml`)
   - Static analysis for security vulnerabilities
   - JavaScript/TypeScript specific rules
   - Security-and-quality query suite

3. **Dependabot** (Enable in GitHub Settings)
   - Automated dependency vulnerability scanning
   - Automatic PR creation for security updates

### Local Development

Run security checks locally:

\`\`\`bash
# Lint and format check
npm run lint

# Format all files
npm run format

# Type checking
npx tsc --noEmit
\`\`\`

## Known Limitations

### 1. Admin API Usage

**File**: `app/(admin)/admin/users/page.tsx` (Line 30)

\`\`\`typescript
const { data: authUser } = await supabase.auth.admin.getUserById(user.id)
\`\`\`

**Issue**: This uses `supabase.auth.admin` API which typically requires the service role key. Currently using the anon key.

**Recommendation**: Either:
- Add service role key for admin-only server utilities
- Use alternative approach (e.g., custom database function)
- Rely on RLS policies and user metadata only

### 2. Rate Limiting

**Status**: Not currently implemented

**Recommendation**: Add rate limiting for:
- API routes (`/api/*`)
- Server Actions (RFQ creation, product creation)
- Email sending

**Suggested Tools**: Vercel Edge Config + KV, Upstash Redis

## Security Best Practices

### For Developers

1. **Never commit secrets**
   - Use `.env.local` for local development
   - Add sensitive files to `.gitignore`
   - Use Vercel environment variables for production

2. **Validate all inputs**
   - Use Zod schemas for form validation
   - Sanitize user content before database writes
   - Validate on both client and server

3. **Follow RLS patterns**
   - Always use user context (`auth.uid()`) in RLS policies
   - Test policies thoroughly with different user roles
   - Never bypass RLS unless absolutely necessary

4. **Server Actions security**
   - Always validate user permissions
   - Check company ownership before mutations
   - Return helpful error messages (but don't leak sensitive info)

## Reporting a Vulnerability

If you discover a security vulnerability, please email:

**security@foodxtrade.com**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will respond within **48 hours** and provide updates as we investigate.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| Latest  | ✅ Yes            |
| < Latest| ❌ No (rolling release) |

## Disclosure Policy

- **Private disclosure**: Report vulnerabilities privately first
- **90-day disclosure**: We aim to fix within 90 days
- **Credit**: Security researchers will be credited (unless they prefer anonymity)

## Security Updates

Security updates are released as soon as fixes are validated. Monitor:

- GitHub Security Advisories
- Dependabot alerts (if enabled)
- Production deployment notifications

---

Last updated: 2025-01-19
