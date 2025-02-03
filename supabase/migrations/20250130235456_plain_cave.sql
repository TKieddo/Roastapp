/*
  # Add Awards Count to Posts

  1. Changes
    - Add awards_count column to posts table
    - Add trigger to maintain awards count
*/

-- Add awards_count column to posts
ALTER TABLE posts ADD COLUMN IF NOT EXISTS awards_count INTEGER DEFAULT 0;

-- Create function to update post awards count
CREATE OR REPLACE FUNCTION update_post_awards_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts
    SET awards_count = awards_count + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts
    SET awards_count = awards_count - 1
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for awards count
DROP TRIGGER IF EXISTS update_post_awards_count ON post_awards;
CREATE TRIGGER update_post_awards_count
  AFTER INSERT OR DELETE ON post_awards
  FOR EACH ROW
  EXECUTE FUNCTION update_post_awards_count();