-- 1. Attendance Records Policies
-- Drop existing policies if any (to avoid duplicates)
DROP POLICY IF EXISTS "Gurus can manage attendance for their sessions" ON attendance_records;
DROP POLICY IF EXISTS "Users can view attendance_records" ON attendance_records;

-- Unified policy for ALL operations (SELECT, INSERT, UPDATE, DELETE)
-- Only allowed if the session belongs to the Guru
CREATE POLICY "Gurus can manage attendance for their sessions"
ON attendance_records FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM sessions
    WHERE sessions.id = attendance_records.session_id
    AND sessions.guru_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM sessions
    WHERE sessions.id = attendance_records.session_id
    AND sessions.guru_id = auth.uid()
  )
);

-- Also allow students to see their own attendance
CREATE POLICY "Students can view their own attendance"
ON attendance_records FOR SELECT TO authenticated
USING (user_id = auth.uid());


-- 2. Evaluations Policies
-- Drop existing select-only policies to replace with unified management policy
DROP POLICY IF EXISTS "Evaluators can view their own evaluations" ON evaluations;
DROP POLICY IF EXISTS "Evaluators can manage their own evaluations" ON evaluations;

-- Allow Gurus to manage evaluations they created
CREATE POLICY "Gurus can manage their own evaluations"
ON evaluations FOR ALL TO authenticated
USING (evaluator_id = auth.uid())
WITH CHECK (evaluator_id = auth.uid());

-- Keep student view policy if not exists
DROP POLICY IF EXISTS "Students can view their own evaluations" ON evaluations;
CREATE POLICY "Students can view their own evaluations"
ON evaluations FOR SELECT TO authenticated
USING (user_id = auth.uid());
