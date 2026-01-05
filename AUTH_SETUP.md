# Authentication Setup Guide

## Understanding the Issue

Your system uses **Supabase Auth** (managed authentication) linked to a **custom users table** (your application data). When you sign in:

1. Supabase Auth verifies your credentials and returns a user ID
2. Your app queries the `users` table for the matching ID to get the role
3. If no matching record exists, you get "User profile not found"

## Step-by-Step Setup

### 1. Create Institution First (Optional but Recommended)

```sql
INSERT INTO institutions (id, name, code, email, phone, address) VALUES
  (gen_random_uuid(), 'Tahfidz Al-Qur''an Center', 'TAHFIDZ-001', 'info@tahfidz.local', '021-1234567', 'Jakarta, Indonesia')
  RETURNING id;
```

Copy the returned UUID - this is your institution_id.

### 2. Create Supabase Auth Accounts

Go to your Supabase dashboard:
1. Navigate to **Authentication > Users**
2. Click **Add User**
3. Create an account with:
   - Email: `admin@tahfidz.test`
   - Password: `Admin123456!`
4. Click the user to view its UUID (in the URL or user details)
5. Copy this UUID

### 3. Insert Users into Database

Using the UUID from step 2, run this SQL in Supabase:

```sql
INSERT INTO users (id, email, full_name, role, institution_id, created_at, updated_at) VALUES
  ('YOUR_UUID_HERE', 'admin@tahfidz.test', 'Admin Tahfidz', 'admin', NULL, NOW(), NOW());
```

### 4. Test Login

Now you can login with:
- Email: `admin@tahfidz.test`
- Password: `Admin123456!`

## Full Example Setup

```sql
-- 1. Create institution
INSERT INTO institutions (id, name, code, email, phone, address, created_at, updated_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'Tahfidz Al-Qur''an', 'TAHFIDZ-001', 'info@tahfidz.local', '+62-21-1234567', 'Jakarta', NOW(), NOW());

-- 2. After creating users in Supabase Auth with UUIDs, insert them here:
INSERT INTO users (id, email, full_name, role, institution_id, phone, address, created_at, updated_at) VALUES
  -- Replace these UUIDs with your actual Supabase Auth UUIDs
  ('3d79b2a3-2d2b-4db9-9c4a-ca732f3ef374', 'admin@tahfidz.test', 'Admin Tahfidz', 'admin', '550e8400-e29b-41d4-a716-446655440000', '+62-21-1111111', 'Jakarta', NOW(), NOW()),
  ('a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6', 'guru@tahfidz.test', 'Ustaz Ali', 'guru', '550e8400-e29b-41d4-a716-446655440000', '+62-21-2222222', 'Jakarta', NOW(), NOW()),
  ('b2c3d4e5-f6g7-48h9-i0j1-k2l3m4n5o6p7', 'murid@tahfidz.test', 'Ahmad Rizki', 'murid', '550e8400-e29b-41d4-a716-446655440000', '+62-21-3333333', 'Jakarta', NOW(), NOW());
```

## Key Points

- **Institution ID**: Optional for admin, required for guru/murid
- **UUIDs**: Must match exactly between Supabase Auth and the users table
- **Role**: Must be exactly 'admin', 'guru', or 'murid' (lowercase)
- **Email**: Should match what you created in Supabase Auth

## Troubleshooting

**"User profile not found" error**
- The user ID doesn't exist in the `users` table
- Check that you copied the UUID correctly from Supabase Auth
- Verify the email matches

**"Cannot coerce the result to a single JSON object"**
- The query returned 0 rows
- Same as above - user not in users table

**"Authentication failed"**
- Wrong email or password
- Account doesn't exist in Supabase Auth
- Check capitalization (emails are case-insensitive but helpful to use lowercase)
```

```tsx file="" isHidden
