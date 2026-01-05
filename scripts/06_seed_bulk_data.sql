-- 1. Get Institution ID (assuming the one from 02_seed exists)
-- We will use a DO block to declare variables
DO $$
DECLARE
  v_inst_id UUID;
  v_sem_1_id UUID;
  v_sem_2_id UUID;
  v_teacher_1_id UUID;
  v_teacher_2_id UUID;
  v_class_b_id UUID;
  v_class_c_id UUID;
BEGIN
  -- Get the main institution
  SELECT id INTO v_inst_id FROM institutions LIMIT 1;

  -- 2. Create New Semesters
  INSERT INTO semesters (institution_id, name, start_date, end_date, is_active)
  VALUES 
    (v_inst_id, 'Semester Genap 2024/2025', '2024-07-01', '2024-12-31', false)
  RETURNING id INTO v_sem_1_id;

  INSERT INTO semesters (institution_id, name, start_date, end_date, is_active)
  VALUES 
    (v_inst_id, 'Semester Ganjil 2025/2026', '2025-01-01', '2025-06-30', false)
  RETURNING id INTO v_sem_2_id;

  -- 3. Create Teachers (Note: These won't have Auth login unless created in Supabase Auth, but visible in UI)
  INSERT INTO users (institution_id, email, full_name, role, phone, address)
  VALUES 
    (v_inst_id, 'guru2@tahfidz.test', 'Ustaz Hamzah', 'guru', '08129999001', 'Jakarta Selatan')
  RETURNING id INTO v_teacher_1_id;

  INSERT INTO users (institution_id, email, full_name, role, phone, address)
  VALUES 
    (v_inst_id, 'guru3@tahfidz.test', 'Ustadzah Aisyah', 'guru', '08129999002', 'Depok')
  RETURNING id INTO v_teacher_2_id;

  -- 4. Create Classes
  INSERT INTO classes (institution_id, semester_id, name, description, guru_id)
  VALUES 
    (v_inst_id, v_sem_1_id, 'Kelas B - Tahfidz Juz 28-29', 'Lanjutan Juz Amma', v_teacher_1_id)
  RETURNING id INTO v_class_b_id;

  INSERT INTO classes (institution_id, semester_id, name, description, guru_id)
  VALUES 
    (v_inst_id, v_sem_1_id, 'Kelas C - Tahfidz Juz 1', 'Program Awal Al-Baqarah', v_teacher_2_id)
  RETURNING id INTO v_class_c_id;

  -- 5. Create Bulk Students (15 Students)
  -- We insert them and just link them to classes randomly or sequentially
  INSERT INTO users (institution_id, email, full_name, role, phone, address)
  VALUES 
    (v_inst_id, 'student1@test.com', 'Abdullah', 'murid', '081200001', 'Jakarta'),
    (v_inst_id, 'student2@test.com', 'Budi Santoso', 'murid', '081200002', 'Jakarta'),
    (v_inst_id, 'student3@test.com', 'Chandra Wijaya', 'murid', '081200003', 'Jakarta'),
    (v_inst_id, 'student4@test.com', 'Dewi Sartika', 'murid', '081200004', 'Jakarta'),
    (v_inst_id, 'student5@test.com', 'Eko Prasetyo', 'murid', '081200005', 'Jakarta'),
    (v_inst_id, 'student6@test.com', 'Fajar Nugraha', 'murid', '081200006', 'Jakarta'),
    (v_inst_id, 'student7@test.com', 'Gita Gutawa', 'murid', '081200007', 'Jakarta'),
    (v_inst_id, 'student8@test.com', 'Hadi Sucipto', 'murid', '081200008', 'Jakarta'),
    (v_inst_id, 'student9@test.com', 'Indah Permata', 'murid', '081200009', 'Jakarta'),
    (v_inst_id, 'student10@test.com', 'Joko Anwar', 'murid', '081200010', 'Jakarta'),
    (v_inst_id, 'student11@test.com', 'Kartika Putri', 'murid', '081200011', 'Jakarta'),
    (v_inst_id, 'student12@test.com', 'Lukman Hakim', 'murid', '081200012', 'Jakarta'),
    (v_inst_id, 'student13@test.com', 'Mawar Melati', 'murid', '081200013', 'Jakarta'),
    (v_inst_id, 'student14@test.com', 'Nanda Putra', 'murid', '081200014', 'Jakarta'),
    (v_inst_id, 'student15@test.com', 'Omar Bakri', 'murid', '081200015', 'Jakarta');

  -- 6. Enroll Students into Class B (First 8)
  INSERT INTO class_enrollments (class_id, user_id)
  SELECT v_class_b_id, id FROM users WHERE email IN (
    'student1@test.com', 'student2@test.com', 'student3@test.com', 'student4@test.com',
    'student5@test.com', 'student6@test.com', 'student7@test.com', 'student8@test.com'
  );

  -- 7. Enroll Students into Class C (Next 7)
  INSERT INTO class_enrollments (class_id, user_id)
  SELECT v_class_c_id, id FROM users WHERE email IN (
    'student9@test.com', 'student10@test.com', 'student11@test.com', 'student12@test.com',
    'student13@test.com', 'student14@test.com', 'student15@test.com'
  );

END $$;
