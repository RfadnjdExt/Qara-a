-- This script creates test user accounts in the users table
-- Run this AFTER you've manually created the Supabase Auth accounts

-- First, get the IDs of the auth users you created
-- You'll need to replace the UUIDs below with the actual user IDs from your Supabase auth_users table

-- Insert test admin user
INSERT INTO users (id, institution_id, email, full_name, role, created_at, updated_at)
VALUES (
  'REPLACE_WITH_ADMIN_UUID',  -- Get this from Supabase Auth > Users > Copy user ID
  (SELECT id FROM institutions LIMIT 1),
  'admin@tahfidz.test',
  'Admin Tahfidz',
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Insert test guru user
INSERT INTO users (id, institution_id, email, full_name, role, created_at, updated_at)
VALUES (
  'REPLACE_WITH_GURU_UUID',
  (SELECT id FROM institutions LIMIT 1),
  'guru@tahfidz.test',
  'Ustaz Muhammad Ali',
  'guru',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Insert test murid users
INSERT INTO users (id, institution_id, email, full_name, role, created_at, updated_at)
VALUES 
  ('REPLACE_WITH_MURID1_UUID', (SELECT id FROM institutions LIMIT 1), 'murid1@tahfidz.test', 'Ahmad Rizki', 'murid', NOW(), NOW()),
  ('REPLACE_WITH_MURID2_UUID', (SELECT id FROM institutions LIMIT 1), 'murid2@tahfidz.test', 'Fatimah Nur', 'murid', NOW(), NOW()),
  ('REPLACE_WITH_MURID3_UUID', (SELECT id FROM institutions LIMIT 1), 'murid3@tahfidz.test', 'Bilal Hakim', 'murid', NOW(), NOW()),
  ('REPLACE_WITH_MURID4_UUID', (SELECT id FROM institutions LIMIT 1), 'murid4@tahfidz.test', 'Aisha Rahman', 'murid', NOW(), NOW()),
  ('REPLACE_WITH_MURID5_UUID', (SELECT id FROM institutions LIMIT 1), 'murid5@tahfidz.test', 'Salman Bahri', 'murid', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
