-- Add parent role to enum
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'orang_tua';

-- Table for linking parents to students
CREATE TABLE IF NOT EXISTS public.parent_student_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(parent_id, student_id)
);

-- Enable RLS
ALTER TABLE public.parent_student_links ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Parents can view their own links" ON public.parent_student_links
  FOR SELECT TO authenticated USING (auth.uid() = parent_id);

CREATE POLICY "Admins can manage links" ON public.parent_student_links
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Indexes
CREATE INDEX idx_parent_student_links_parent_id ON public.parent_student_links(parent_id);
CREATE INDEX idx_parent_student_links_student_id ON public.parent_student_links(student_id);

-- Add RLS to evaluations so parents can see their children's data
-- Current evaluations RLS usually allows 'murid' to see their own.
-- We need to add a policy for parents.

DROP POLICY IF EXISTS "Parents can view evaluations of their linked students" ON public.evaluations;
CREATE POLICY "Parents can view evaluations of their linked students" ON public.evaluations
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.parent_student_links
      WHERE parent_student_links.parent_id = auth.uid()
      AND parent_student_links.student_id = evaluations.user_id
    )
  );

-- Same for attendance
DROP POLICY IF EXISTS "Parents can view attendance of their linked students" ON public.attendance_records;
CREATE POLICY "Parents can view attendance of their linked students" ON public.attendance_records
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.parent_student_links
      WHERE parent_student_links.parent_id = auth.uid()
      AND parent_student_links.student_id = attendance_records.user_id
    )
  );
