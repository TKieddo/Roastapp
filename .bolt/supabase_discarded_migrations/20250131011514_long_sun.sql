-- Create comments table if it doesn't exist
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES comments(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create comment_likes table
CREATE TABLE IF NOT EXISTS comment_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID REFERENCES comments(id) NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(comment_id, user_id)
);

-- Create materialized view for comment statistics
CREATE MATERIALIZED VIEW comment_stats AS
SELECT 
  c.id AS comment_id,
  COUNT(DISTINCT cl.id) AS likes_count,
  (SELECT COUNT(*) FROM comments WHERE parent_id = c.id) AS replies_count,
  COUNT(DISTINCT pa.id) AS awards_count
FROM comments c
LEFT JOIN comment_likes cl ON c.id = cl.comment_id
LEFT JOIN post_awards pa ON c.id = pa.post_id
GROUP BY c.id;

-- Create index for faster lookups
CREATE UNIQUE INDEX IF NOT EXISTS comment_stats_comment_id_idx ON comment_stats (comment_id);

-- Enable RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all comments"
  ON comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view all comment likes"
  ON comment_likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own comment likes"
  ON comment_likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comment likes"
  ON comment_likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to create a comment
CREATE OR REPLACE FUNCTION create_comment(
  p_post_id UUID,
  p_content TEXT,
  p_parent_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_comment_id UUID;
BEGIN
  INSERT INTO comments (
    post_id,
    user_id,
    parent_id,
    content
  )
  VALUES (
    p_post_id,
    auth.uid(),
    p_parent_id,
    p_content
  )
  RETURNING id INTO v_comment_id;

  -- Refresh stats
  REFRESH MATERIALIZED VIEW comment_stats;

  RETURN v_comment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to toggle comment like
CREATE OR REPLACE FUNCTION toggle_comment_like(comment_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_user_id UUID;
  v_liked BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  
  IF EXISTS (
    SELECT 1 FROM comment_likes 
    WHERE user_id = v_user_id AND comment_id = toggle_comment_like.comment_id
  ) THEN
    -- Unlike
    DELETE FROM comment_likes 
    WHERE user_id = v_user_id AND comment_id = toggle_comment_like.comment_id;
    v_liked := false;
  ELSE
    -- Like
    INSERT INTO comment_likes (user_id, comment_id)
    VALUES (v_user_id, toggle_comment_like.comment_id);
    v_liked := true;
  END IF;

  -- Refresh stats
  REFRESH MATERIALIZED VIEW comment_stats;
  
  RETURN v_liked;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get comment statistics
CREATE OR REPLACE FUNCTION get_comment_stats(comment_id UUID)
RETURNS JSON AS $$
DECLARE
  v_user_id UUID;
  v_stats JSON;
BEGIN
  v_user_id := auth.uid();
  
  SELECT json_build_object(
    'likes_count', COALESCE(cs.likes_count, 0),
    'replies_count', COALESCE(cs.replies_count, 0),
    'awards_count', COALESCE(cs.awards_count, 0),
    'is_liked', EXISTS(
      SELECT 1 FROM comment_likes 
      WHERE user_id = v_user_id AND comment_id = get_comment_stats.comment_id
    )
  ) INTO v_stats
  FROM comment_stats cs
  WHERE cs.comment_id = get_comment_stats.comment_id;

  RETURN v_stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;