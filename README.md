# FoodXtrade - B2B Food & Agricultural Commodities Platform

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/big-kei-interactive/v0-food-xtrade-project-setup)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/LG4GND1cxyO)

## Overview

FoodXtrade is a market-intelligent B2B marketplace connecting verified suppliers with global buyers in the food and agricultural commodities sector. Built with Next.js 16, Supabase, and Resend.

## Tech Stack

- **Framework**: Next.js 16 (App Router, React 19)
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Auth**: Supabase Auth
- **Email**: Resend
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI + shadcn/ui
- **Code Quality**: Biome (linting + formatting)
- **Security**: GitHub CodeQL, Dependabot

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Supabase account
- Resend account

### Installation

1. Clone the repository:
\`\`\`bash
git clone <your-repo-url>
cd foodxtrade
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
Create a `.env.local` file with:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=FoodXtrade <no-reply@foodxtrade.com>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
\`\`\`

4. Run database migrations:
\`\`\`bash
# Execute SQL scripts in /scripts folder via Supabase dashboard or CLI
\`\`\`

5. Start development server:
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Code Quality & Linting

This project uses [Biome](https://biomejs.dev) for fast linting and formatting.

### Commands

\`\`\`bash
# Run linter and auto-fix issues
npm run lint

# Format all files
npm run format

# Check formatting without making changes
npx biome check .
\`\`\`

### Pre-commit Recommendations

Consider adding a pre-commit hook to run Biome automatically:
\`\`\`bash
npm install --save-dev husky lint-staged
npx husky init
\`\`\`

Add to `.husky/pre-commit`:
\`\`\`bash
npx lint-staged
\`\`\`

Add to `package.json`:
\`\`\`json
"lint-staged": {
  "*.{js,jsx,ts,tsx,json}": ["biome check --apply"]
}
\`\`\`

## Security

### GitHub Security Features

**Important**: Enable the following in your GitHub repository settings under **Settings → Code security and analysis**:

1. **Dependabot alerts** - Get notified of vulnerable dependencies
2. **Dependabot security updates** - Automatically create PRs to update vulnerable dependencies
3. **CodeQL analysis** - Advanced security scanning (configured via `.github/workflows/security.yml`)
4. **Secret scanning** - Detect accidentally committed secrets

### Security Best Practices

- ✅ **No service role keys in client code** - All browser clients use NEXT_PUBLIC_SUPABASE_ANON_KEY
- ✅ **Row Level Security (RLS)** - All Supabase tables have RLS policies enabled
- ✅ **Server-side validation** - All mutations validated server-side via Server Actions
- ✅ **Environment variables** - Sensitive keys stored in Vercel environment variables
- ✅ **Email notification preferences** - Users control what emails they receive

### CI/CD Security Checks

The project includes automated security checks via GitHub Actions:

- **Biome CI** - Linting and formatting validation on every push/PR
- **CodeQL** - Static analysis security scanning for JavaScript/TypeScript
- **Dependency scanning** - Automated vulnerability detection

See `.github/workflows/security.yml` for configuration details.

## Project Structure

\`\`\`
foodxtrade/
├── app/                      # Next.js App Router pages
│   ├── (admin)/             # Admin dashboard routes
│   ├── (dashboard)/         # Supplier/buyer dashboard routes
│   ├── products/            # Product marketplace
│   ├── insights/            # Market intelligence
│   └── api/                 # API routes
├── components/              # React components
│   ├── ui/                  # Base UI components (shadcn)
│   ├── admin/               # Admin-specific components
│   ├── dashboard/           # Dashboard components
│   └── products/            # Product components
├── lib/                     # Utilities and helpers
│   ├── supabase/           # Supabase clients (client, server, middleware)
│   ├── email.ts            # Email utilities (Resend)
│   ├── emailTemplates.tsx  # Email HTML templates
│   └── notifications.ts    # Notification preferences
├── scripts/                 # SQL migration scripts
├── config/                  # App configuration
└── public/                  # Static assets
\`\`\`

## Environment Variables

Required environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJ...` |
| `RESEND_API_KEY` | Resend API key for emails | `re_...` |
| `EMAIL_FROM` | Default email sender | `FoodXtrade <no-reply@foodxtrade.com>` |
| `NEXT_PUBLIC_SITE_URL` | Production site URL | `https://foodxtrade.com` |

## Features

- **Supplier Dashboard** - Product management, RFQ responses, analytics
- **Buyer Dashboard** - Product search, RFQ creation, supplier discovery
- **Admin Console** - User management, verification workflows, analytics
- **Market Intelligence** - Price trends, demand signals, customs data
- **Email Notifications** - Transactional emails with user preferences
- **Verification System** - Company and customs verification with badges
- **Multi-role Auth** - Admin, supplier, and buyer roles with RLS

## Deployment

Your project is live at:

**[https://vercel.com/big-kei-interactive/v0-food-xtrade-project-setup](https://vercel.com/big-kei-interactive/v0-food-xtrade-project-setup)**

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel dashboard
3. Configure environment variables
4. Deploy

Vercel will automatically:
- Build the Next.js app
- Run Biome checks (configured in build command)
- Deploy to production

## Build your app

Continue building your app on:

**[https://v0.app/chat/LG4GND1cxyO](https://v0.app/chat/LG4GND1cxyO)**

## Contributing

1. Create a feature branch
2. Make your changes
3. Run `npm run lint` and `npm run format`
4. Commit your changes
5. Open a pull request

All PRs will automatically run security checks via GitHub Actions.

## License

Proprietary - All rights reserved
\`\`\`

```markdown file="" isHidden
