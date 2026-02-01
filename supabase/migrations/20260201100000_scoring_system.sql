-- Add points column to users
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS total_verses INTEGER DEFAULT 0;

-- Function to calculate points from evaluation level
CREATE OR REPLACE FUNCTION calculate_evaluation_points(lvl evaluation_level)
RETURNS INTEGER AS $$
BEGIN
  RETURN CASE lvl
    WHEN 'hafal_sangat_lancar' THEN 20
    WHEN 'hafal_lancar' THEN 15
    WHEN 'hafal_tidak_lancar' THEN 5
    WHEN 'belum_hafal' THEN 0
    ELSE 0
  END;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to update user points when evaluation is created/updated
CREATE OR REPLACE FUNCTION update_user_points_on_evaluation()
RETURNS TRIGGER AS $$
DECLARE
  old_pts INTEGER := 0;
  new_pts INTEGER := 0;
  old_verses INTEGER := 0;
  new_verses INTEGER := 0;
BEGIN
  IF (TG_OP = 'INSERT') THEN
    new_pts := calculate_evaluation_points(NEW.hafalan_level);
    new_verses := COALESCE(NEW.verses_count, 0);
    
    UPDATE public.users 
    SET points = points + new_pts,
        total_verses = total_verses + new_verses
    WHERE id = NEW.user_id;
    
  ELSIF (TG_OP = 'UPDATE') THEN
    old_pts := calculate_evaluation_points(OLD.hafalan_level);
    new_pts := calculate_evaluation_points(NEW.hafalan_level);
    old_verses := COALESCE(OLD.verses_count, 0);
    new_verses := COALESCE(NEW.verses_count, 0);
    
    UPDATE public.users 
    SET points = points - old_pts + new_pts,
        total_verses = total_verses - old_verses + new_verses
    WHERE id = NEW.user_id;
    
  ELSIF (TG_OP = 'DELETE') THEN
    old_pts := calculate_evaluation_points(OLD.hafalan_level);
    old_verses := COALESCE(OLD.verses_count, 0);
    
    UPDATE public.users 
    SET points = points - old_pts,
        total_verses = total_verses - old_verses
    WHERE id = OLD.user_id;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to evaluations
DROP TRIGGER IF EXISTS tr_update_user_points_on_eval ON public.evaluations;
CREATE TRIGGER tr_update_user_points_on_eval
AFTER INSERT OR UPDATE OR DELETE ON public.evaluations
FOR EACH ROW EXECUTE FUNCTION update_user_points_on_evaluation();

-- Trigger function for attendance points
CREATE OR REPLACE FUNCTION update_user_points_on_attendance()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    IF (NEW.status = 'hadir') THEN
      UPDATE public.users SET points = points + 5 WHERE id = NEW.user_id;
    END IF;
  ELSIF (TG_OP = 'UPDATE') THEN
    -- If status changed to hadir
    IF (OLD.status != 'hadir' AND NEW.status = 'hadir') THEN
      UPDATE public.users SET points = points + 5 WHERE id = NEW.user_id;
    -- If status changed from hadir
    ELSIF (OLD.status = 'hadir' AND NEW.status != 'hadir') THEN
      UPDATE public.users SET points = points - 5 WHERE id = NEW.user_id;
    END IF;
  ELSIF (TG_OP = 'DELETE') THEN
    IF (OLD.status = 'hadir') THEN
      UPDATE public.users SET points = points - 5 WHERE id = OLD.user_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to attendance_records
DROP TRIGGER IF EXISTS tr_update_user_points_on_attendance ON public.attendance_records;
CREATE TRIGGER tr_update_user_points_on_attendance
AFTER INSERT OR UPDATE OR DELETE ON public.attendance_records
FOR EACH ROW EXECUTE FUNCTION update_user_points_on_attendance();
