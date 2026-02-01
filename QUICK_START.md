# Quick Start Guide - Setting Up Test Accounts

## Step 1: Create Auth Accounts in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Authentication > Users**
3. Click **"Add user"** and create accounts with these credentials:

**Admin Account:**
- Email: `admin@tahfidz.test`
- Password: `Admin123456!`

**Teacher Account:**
- Email: `guru@tahfidz.test`
- Password: `Guru123456!`

**Student Accounts (create all 5):**
- `murid1@tahfidz.test` / `Murid123456!`
- `murid2@tahfidz.test` / `Murid123456!`
- `murid3@tahfidz.test` / `Murid123456!`
- `murid4@tahfidz.test` / `Murid123456!`
- `murid5@tahfidz.test` / `Murid123456!`

**Note:** After creating each account, copy the User ID (UUID) - you'll need these in Step 2.

## Step 2: Create User Profiles

After creating the auth accounts, you need to create their profiles in your database:

### Option A: Using SQL (Recommended)

1. Open **Supabase Dashboard > SQL Editor**
2. Run the database initialization scripts in this order:
   - First, run `scripts/01_initial_schema.sql` (if not already done)
   - Then, run `scripts/02_seed_test_data.sql` (this creates the institution and basic structure)
   - Finally, run `scripts/03_create_test_accounts.sql`

3. In step 3 of the SQL script, replace the UUID placeholders with the actual user IDs from Supabase Auth

### Option B: Manual via Supabase UI

1. Go to **Supabase Dashboard > SQL Editor**
2. Create users manually using the template in `scripts/03_create_test_accounts.sql`
3. Replace `REPLACE_WITH_*_UUID` with actual user IDs from step 1

## Step 3: Test the Login

1. Go to your app at `http://localhost:3000` (or your Vercel deployment)
2. Click the "Demo Credentials for Testing" section
3. Click any demo account to auto-fill the email and password
4. Click **Login**
5. (Optional) Run locally with: `bun run dev`

You should be redirected to the appropriate dashboard based on your role.

## Troubleshooting

### "Could not fetch user details" error
- This means the auth account exists but the user profile in the database is missing
- Make sure you ran `scripts/03_create_test_accounts.sql` with the correct UUIDs

### "Invalid login credentials"
- Check that the email and password match exactly what you created in Supabase Auth
- Make sure you created the auth accounts (not just the database records)

### "No institution found"
- Run `scripts/02_seed_test_data.sql` first to create the institution

## Next Steps

Once you've tested all three roles successfully:
1. Explore the Admin Dashboard to manage users and academic structure
2. Use the Guru account to create sessions and evaluations
3. Use any Murid account to view evaluations and reports
