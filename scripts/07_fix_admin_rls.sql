-- POLICY: Allow Admins to manage ALL operations on 'users' table
-- (Insert, Update, Delete, Select)
CREATE POLICY "Admins can manage all users"
ON users
FOR ALL
TO authenticated
USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
);

-- POLICY: Allow Admins to manage 'classes'
CREATE POLICY "Admins can manage classes"
ON classes
FOR ALL
TO authenticated
USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
);

-- POLICY: Allow Admins to manage 'semesters'
CREATE POLICY "Admins can manage semesters"
ON semesters
FOR ALL
TO authenticated
USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
);

-- POLICY: Allow Admins to manage 'subjects'
CREATE POLICY "Admins can manage subjects"
ON subjects
FOR ALL
TO authenticated
USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
);

-- POLICY: Allow Admins to manage 'class_enrollments'
CREATE POLICY "Admins can manage enrollments"
ON class_enrollments
FOR ALL
TO authenticated
USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
);
