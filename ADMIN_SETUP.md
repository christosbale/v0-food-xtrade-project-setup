# Admin Dashboard Setup

## What I've Fixed

1. **Created User Profiles System** - Added script `013_setup_admin_simplified.sql` that creates the `user_profiles` table for role management

2. **Granted Admin Access** - The script automatically grants admin role to `balesdravos@gmail.com`

3. **Added Admin Link to Sidebar** - The dashboard sidebar now shows an "Admin Panel" link (with shield icon) for admin users

4. **Admin Dashboard Ready** - The admin panel at `/admin` is fully functional with all pages connected

## How to Access Admin Dashboard

### Step 1: Run the Setup Script
You need to run the SQL script to create the user_profiles table and grant admin access:

1. The script is located at: `scripts/013_setup_admin_simplified.sql`
2. This script will:
   - Create the `user_profiles` table
   - Set up automatic profile creation for new users
   - Grant admin role to `balesdravos@gmail.com`
   - Create profiles for all existing users

### Step 2: Refresh Your Browser
After running the script:
1. Refresh your browser page
2. You should now see an "Admin Panel" link at the top of your dashboard sidebar
3. Click it to access the admin dashboard at `/admin`

## Admin Features Available

Once you access the admin panel, you'll have:

- **Dashboard Overview** - Statistics on companies, users, products, and revenue
- **Company Management** - Approve/reject companies, validate VAT numbers
- **Pending Approvals** - Review companies waiting for verification
- **User Management** - View and manage all platform users
- **Product Moderation** - Review and manage all product listings
- **Billing Management** - View subscriptions, grant free months, change plans

## Troubleshooting

If you don't see the "Admin Panel" link after running the script:

1. Make sure the script executed successfully without errors
2. Clear your browser cache and refresh
3. Log out and log back in
4. Check that your email in the database matches `balesdravos@gmail.com` exactly

## Security Notes

- Admin access is protected by Row Level Security (RLS)
- Only users with `role = 'admin'` in `user_profiles` can access admin routes
- All admin actions are logged in the `admin_actions` table for audit trails
