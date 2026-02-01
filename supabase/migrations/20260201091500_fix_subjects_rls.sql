-- Allow authenticated users to view subjects
-- This is needed so Gurus can select the subject (Juz) during evaluation
DROP POLICY IF EXISTS "Users can view subjects" ON subjects;

CREATE POLICY "Users can view subjects"
ON subjects FOR SELECT
TO authenticated
USING (true);

-- Ensure RLS is active
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
