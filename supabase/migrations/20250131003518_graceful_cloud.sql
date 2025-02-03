/*
  # Add Social Features

  1. New Tables
    - `likes` - Stores user likes on posts and comments
    - `shares` - Tracks post shares
    - `post_stats` - Materialized view for post statistics

  2. Changes
    - Add triggers to update post statistics
    - Add functions for social interactions

  3. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all likes" ON likes;
DROP POLICY IF EXISTS "Users can create their own likes" ON likes;
DROP POLICY IF EXISTS "Users can delete their own likes" ON likes;

-- Create likes table if it doesn't exist
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  post_id UUID REFERENCES posts(id),
  comment_id UUID REFERENCES comments(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT likes_target_check CHECK (
    (post_id IS NOT NULL AND comment_id IS NULL) OR
    (post_id IS NULL AND comment_id IS NOT NULL)
  ),
  UNIQUE(user_id, post_id),
  UNIQUE(user_id, comment_id)
);

-- Create shares table if it doesn't exist
CREATE TABLE IF NOT EXISTS shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  post_id UUID REFERENCES posts(id) NOT NULL,
  share_type TEXT NOT NULL CHECK (share_type IN ('internal', 'external')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Drop existing materialized view if it exists
DROP MATERIALIZED VIEW IF EXISTS post_stats;

-- Create materialized view for post statistics
CREATE MATERIALIZED VIEW post_stats AS
SELECT 
  p.id AS post_id,
  COUNT(DISTINCT l.id) AS likes_count,
  COUNT(DISTINCT c.id) AS comments_count,
  COUNT(DISTINCT s.id) AS shares_count,
  COUNT(DISTINCT pa.id) AS awards_count
FROM posts p
LEFT JOIN likes l ON p.id = l.post_id
LEFT JOIN comments c ON p.id = c.post_id
LEFT JOIN shares s ON p.id = s.post_id
LEFT JOIN post_awards pa ON p.id = pa.post_id
GROUP BY p.id;

-- Create index for faster lookups
CREATE UNIQUE INDEX IF NOT EXISTS post_stats_post_id_idx ON post_stats (post_id);

-- Enable RLS
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE shares ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all likes"
  ON likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own likes"
  ON likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes"
  ON likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view all shares"
  ON shares FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own shares"
  ON shares FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Function to like/unlike a post
CREATE OR REPLACE FUNCTION toggle_post_like(post_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_user_id UUID;
  v_liked BOOLEAN;
BEGIN
  -- Get current user ID
  v_user_id := auth.uid();
  
  -- Check if already liked
  IF EXISTS (
    SELECT 1 FROM likes 
    WHERE user_id = v_user_id AND post_id = toggle_post_like.post_id
  ) THEN
    -- Unlike
    DELETE FROM likes 
    WHERE user_id = v_user_id AND post_id = toggle_post_like.post_id;
    v_liked := false;
  ELSE
    -- Like
    INSERT INTO likes (user_id, post_id)
    VALUES (v_user_id, toggle_post_like.post_id);
    v_liked := true;
  END IF;

  -- Refresh post stats
  REFRESH MATERIALIZED VIEW CONCURRENTLY post_stats;
  
  RETURN v_liked;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to share a post
CREATE OR REPLACE FUNCTION share_post(post_id UUID, share_type TEXT DEFAULT 'internal')
RETURNS UUID AS $$
DECLARE
  v_share_id UUID;
BEGIN
  INSERT INTO shares (user_id, post_id, share_type)
  VALUES (auth.uid(), post_id, share_type)
  RETURNING id INTO v_share_id;

  -- Refresh post stats
  REFRESH MATERIALIZED VIEW CONCURRENTLY post_stats;

  RETURN v_share_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get post statistics with user interaction status
CREATE OR REPLACE FUNCTION get_post_stats(post_id UUID)
RETURNS JSON AS $$
DECLARE
  v_user_id UUID;
  v_stats JSON;
BEGIN
  v_user_id := auth.uid();
  
  SELECT json_build_object(
    'likes_count', COALESCE(ps.likes_count, 0),
    'comments_count', COALESCE(ps.comments_count, 0),
    'shares_count', COALESCE(ps.shares_count, 0),
    'awards_count', COALESCE(ps.awards_count, 0),
    'is_liked', EXISTS(
      SELECT 1 FROM likes 
      WHERE user_id = v_user_id AND post_id = get_post_stats.post_id
    )
  ) INTO v_stats
  FROM post_stats ps
  WHERE ps.post_id = get_post_stats.post_id;

  RETURN v_stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;