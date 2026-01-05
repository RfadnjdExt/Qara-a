-- Enable RLS (Already done in 01, but ensuring)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;

-- 1. Users Policy: Allow users to view their own profile
CREATE POLICY "Users can view own profile" 
ON users FOR SELECT 
USING (auth.uid() = id);

-- 2. Institutions Policy: Allow authenticated users to view institutions
-- (Needed for dashboard to show institution name)
CREATE POLICY "Authenticated users can view institutions" 
ON institutions FOR SELECT 
TO authenticated 
USING (true);

-- 3. Classes/Semesters Policy: Allow users to view data linked to their institution
-- This is a simplified policy. For stricter security, you might match institution_id.

-- Allow viewing semesters in their institution
CREATE POLICY "Users can view semesters" 
ON semesters FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.institution_id = semesters.institution_id
  )
);

-- Allow viewing classes in their institution
CREATE POLICY "Users can view classes" 
ON classes FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.institution_id = classes.institution_id
  )
);
