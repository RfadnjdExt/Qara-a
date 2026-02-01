-- Add subject_id and surah_name to evaluations
ALTER TABLE evaluations 
ADD COLUMN IF NOT EXISTS subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS surah_name TEXT;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_evaluations_subject_id ON evaluations(subject_id);
