# Mutabaah Online - Setup Guide

## Prerequisites

- Supabase project created and connected
- Next.js app running locally or on Vercel
- Node.js installed (v16+)

## 1. Initialize Supabase Database

First, create the database schema and tables:

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Create a new query and paste the contents of `scripts/01_initial_schema.sql`
4. Execute the query to create all tables with RLS policies

## 2. Create Test Accounts in Supabase Auth

You have two options:

### Option A: Manual Setup (via Supabase Dashboard)

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Users**
3. Click **Invite** and add these accounts:

| Email | Password | Full Name |
|-------|----------|-----------|
| admin@tahfidz.test | Admin123456! | Admin Tahfidz |
| guru@tahfidz.test | Guru123456! | Ustaz Muhammad Ali |
| murid1@tahfidz.test | Murid123456! | Ahmad Rizki |
| murid2@tahfidz.test | Murid123456! | Fatimah Nur |

### Option B: Automated Setup (via Script)

Run this script to create accounts programmatically:

```bash
bun run setup:accounts
```

This will create all test accounts automatically using your Supabase credentials.

## 3. Seed Test Data (Optional)

To populate the database with test institutions, classes, and evaluations:

1. Go to Supabase **SQL Editor**
2. Paste the contents of `scripts/02_seed_test_data.sql`
3. Execute to create test data

## 4. Environment Variables

Ensure your `.env.local` has these variables set:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 5. Run the Application

```bash
bun install
bun run dev
```

Visit `http://localhost:3000` and use the demo credentials to login.

## Testing Each Role

### Admin Account
- **Email:** admin@tahfidz.test
- **Password:** Admin123456!
- **Access:** Admin dashboard for managing institution, users, and academic structure

### Guru Account  
- **Email:** guru@tahfidz.test
- **Password:** Guru123456!
- **Access:** Teacher dashboard for managing classes, sessions, and student evaluations

### Student Accounts
- **Email:** murid1@tahfidz.test (or murid2, murid3, etc.)
- **Password:** Murid123456!
- **Access:** Student dashboard to view evaluations and download reports

## Troubleshooting

### "Invalid login credentials" error

This means the accounts don't exist in Supabase Auth yet. Follow Option A or Option B above to create them.

### "Could not fetch user details" error

This means the accounts exist in Auth but not in the `users` table. Run `scripts/02_seed_test_data.sql` to populate the users table.

### CORS or connection errors

Check that:
1. Your Supabase URL and keys are correct in `.env.local`
2. Your Supabase project is active and running
3. RLS policies are enabled on all tables

## Next Steps

Once logged in successfully:
1. Test the Admin panel by creating new classes and evaluating templates
2. Test the Guru panel by creating sessions and entering student evaluations
3. Test the Murid panel by viewing evaluations and generating PDF reports

For production deployment, refer to `DEPLOYMENT.md`.
