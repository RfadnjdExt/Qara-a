-- Seed test data for Mutabaah Online system
-- This script creates test institutions and user accounts for all roles

-- Insert a test institution
INSERT INTO institutions (id, name, code, address, phone, email, description, logo_url)
VALUES (
  '11111111-1111-1111-1111-111111111111'::uuid,
  'Tahfidz Al-Qur''an Center',
  'TAHFIDZ-001',
  'Jl. Pendidikan No. 123, Jakarta',
  '+62-21-1234567',
  'info@tahfidztest.com',
  'Test institutional account for Learning Management System',
  NULL
)
ON CONFLICT (code) DO NOTHING;

-- Create Supabase auth users and corresponding system users
-- These will need to be created via Supabase Auth first

-- TEST ADMIN ACCOUNT
-- Email: admin@tahfidz.test
-- Password: Admin123456!
-- Role: Admin

INSERT INTO users (id, institution_id, email, full_name, role, phone, address)
VALUES (
  '22222222-2222-2222-2222-222222222222'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  'admin@tahfidz.test',
  'Admin Tahfidz',
  'admin',
  '+62-812-3456789',
  'Jl. Admin, Jakarta'
)
ON CONFLICT (institution_id, email) DO NOTHING;

-- TEST GURU ACCOUNT (Teacher)
-- Email: guru@tahfidz.test
-- Password: Guru123456!
-- Role: Guru

INSERT INTO users (id, institution_id, email, full_name, role, phone, address)
VALUES (
  '33333333-3333-3333-3333-333333333333'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  'guru@tahfidz.test',
  'Ustaz Muhammad Ali',
  'guru',
  '+62-812-9876543',
  'Jl. Guru, Jakarta'
)
ON CONFLICT (institution_id, email) DO NOTHING;

-- TEST MURID ACCOUNTS (Students) - Create 5 students for testing
INSERT INTO users (id, institution_id, email, full_name, role, phone, address)
VALUES 
  ('44444444-4444-4444-4444-444444444444'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'murid1@tahfidz.test', 'Ahmad Rizki', 'murid', '+62-812-1111111', 'Jl. Murid 1, Jakarta'),
  ('55555555-5555-5555-5555-555555555555'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'murid2@tahfidz.test', 'Fatimah Nur', 'murid', '+62-812-2222222', 'Jl. Murid 2, Jakarta'),
  ('66666666-6666-6666-6666-666666666666'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'murid3@tahfidz.test', 'Bilal Hakim', 'murid', '+62-812-3333333', 'Jl. Murid 3, Jakarta'),
  ('77777777-7777-7777-7777-777777777777'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'murid4@tahfidz.test', 'Aisha Rahman', 'murid', '+62-812-4444444', 'Jl. Murid 4, Jakarta'),
  ('88888888-8888-8888-8888-888888888888'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'murid5@tahfidz.test', 'Salman Bahri', 'murid', '+62-812-5555555', 'Jl. Murid 5, Jakarta')
ON CONFLICT (institution_id, email) DO NOTHING;

-- Create a test semester
INSERT INTO semesters (id, institution_id, name, start_date, end_date, is_active)
VALUES (
  '99999999-9999-9999-9999-999999999999'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  'Semester 1 - 2024/2025',
  '2024-01-01'::date,
  '2024-06-30'::date,
  true
)
ON CONFLICT DO NOTHING;

-- Create a test class with the guru as teacher
INSERT INTO classes (id, institution_id, semester_id, name, description, guru_id)
VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '99999999-9999-9999-9999-999999999999'::uuid,
  'Kelas A - Tahfidz Juz 29-30',
  'Kelas pemula untuk tahfidz Juz 29 dan 30',
  '33333333-3333-3333-3333-333333333333'::uuid
)
ON CONFLICT DO NOTHING;

-- Enroll students in the class
INSERT INTO class_enrollments (class_id, user_id)
VALUES 
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, '44444444-4444-4444-4444-444444444444'::uuid),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, '55555555-5555-5555-5555-555555555555'::uuid),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, '66666666-6666-6666-6666-666666666666'::uuid),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, '77777777-7777-7777-7777-777777777777'::uuid),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, '88888888-8888-8888-8888-888888888888'::uuid)
ON CONFLICT DO NOTHING;

-- Create test subjects (Juz)
INSERT INTO subjects (id, class_id, name, description, order_index)
VALUES 
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Juz 30', 'Juz Amma', 1),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Juz 29', 'Juz Tabarak', 2)
ON CONFLICT DO NOTHING;

-- Create test evaluation template
INSERT INTO evaluation_templates (id, institution_id, name, description, evaluator_label, evaluation_criteria)
VALUES (
  'dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  'Mutabaah Standard',
  'Template evaluasi standar untuk Mutabaah harian',
  'Guru Tahfidz',
  '{"criteria": [
    {"name": "Tajweed", "levels": ["belum_hafal", "hafal_tidak_lancar", "hafal_lancar", "hafal_sangat_lancar"]},
    {"name": "Hafalan", "levels": ["belum_hafal", "hafal_tidak_lancar", "hafal_lancar", "hafal_sangat_lancar"]},
    {"name": "Tartil", "levels": ["belum_hafal", "hafal_tidak_lancar", "hafal_lancar", "hafal_sangat_lancar"]}
  ]}'::jsonb
)
ON CONFLICT DO NOTHING;
