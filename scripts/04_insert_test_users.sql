-- Insert test users into the users table
-- These must match Supabase Auth user IDs
-- Replace the UUIDs below with your actual Supabase Auth user IDs

INSERT INTO users (id, email, full_name, role, institution_id, phone, address, created_at, updated_at) VALUES
  -- Get these UUIDs from Supabase Auth after creating accounts
  -- Admin user
  ('3d79b2a3-2d2b-4db9-9c4a-ca732f3ef374', 'admin@tahfidz.test', 'Admin Tahfidz', 'admin', NULL, NULL, NULL, NOW(), NOW());

-- After inserting this user, get the institution_id and update other users' institution_id

-- Example with institution:
-- INSERT INTO users (id, email, full_name, role, institution_id, phone, address, created_at, updated_at) VALUES
--   ('uuid-from-supabase-auth', 'guru@tahfidz.test', 'Ustaz Ali', 'guru', 'institution-uuid', NULL, NULL, NOW(), NOW()),
--   ('uuid-from-supabase-auth', 'murid@tahfidz.test', 'Ahmad Rizki', 'murid', 'institution-uuid', NULL, NULL, NOW(), NOW());
