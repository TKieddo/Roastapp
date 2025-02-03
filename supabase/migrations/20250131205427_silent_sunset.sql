-- Add missing indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_awards_receiver_id ON user_awards(receiver_id);

-- Add function to get user feed
CREATE OR REPLACE FUNCTION get_user_feed(
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  image_url TEXT,
  code_snippet TEXT,
  created_at TIMESTAMPTZ,
  user_id UUID,
  community_id UUID,
  author_name TEXT,
  author_avatar TEXT,
  likes_count BIGINT,
  comments_count BIGINT,
  awards_count BIGINT,
  is_liked BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.content,
    p.image_url,
    p.code_snippet,
    p.created_at,
    p.user_id,
    p.community_id,
    u.display_name AS author_name,
    u.avatar_url AS author_avatar,
    COALESCE(ps.likes_count, 0::bigint) AS likes_count,
    COALESCE(ps.comments_count, 0::bigint) AS comments_count,
    COALESCE(ps.awards_count, 0::bigint) AS awards_count,
    EXISTS(
      SELECT 1 FROM likes l
      WHERE l.post_id = p.id
      AND l.user_id = auth.uid()
    ) AS is_liked
  FROM posts p
  JOIN users u ON p.user_id = u.id
  LEFT JOIN post_stats ps ON p.id = ps.post_id
  ORDER BY p.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add function to get post comments
CREATE OR REPLACE FUNCTION get_post_comments(
  p_post_id UUID,
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  created_at TIMESTAMPTZ,
  user_id UUID,
  parent_id UUID,
  author_name TEXT,
  author_avatar TEXT,
  likes_count BIGINT,
  is_liked BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.content,
    c.created_at,
    c.user_id,
    c.parent_id,
    u.display_name AS author_name,
    u.avatar_url AS author_avatar,
    COUNT(DISTINCT l.id)::bigint AS likes_count,
    EXISTS(
      SELECT 1 FROM likes l2
      WHERE l2.comment_id = c.id
      AND l2.user_id = auth.uid()
    ) AS is_liked
  FROM comments c
  JOIN users u ON c.user_id = u.id
  LEFT JOIN likes l ON c.id = l.comment_id
  WHERE c.post_id = p_post_id
  GROUP BY c.id, u.display_name, u.avatar_url
  ORDER BY c.created_at ASC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add function to toggle comment like
CREATE OR REPLACE FUNCTION toggle_comment_like(target_comment_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_user_id UUID;
  v_liked BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  
  IF EXISTS (
    SELECT 1 FROM likes 
    WHERE user_id = v_user_id AND comment_id = target_comment_id
  ) THEN
    -- Unlike
    DELETE FROM likes 
    WHERE user_id = v_user_id AND comment_id = target_comment_id;
    v_liked := false;
  ELSE
    -- Like
    INSERT INTO likes (user_id, comment_id)
    VALUES (v_user_id, target_comment_id);
    v_liked := true;
  END IF;
  
  RETURN v_liked;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add function to get user notifications
CREATE OR REPLACE FUNCTION get_user_notifications(
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  type TEXT,
  content TEXT,
  created_at TIMESTAMPTZ,
  read BOOLEAN,
  from_user_name TEXT,
  from_user_avatar TEXT,
  reference_id UUID,
  reference_type TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    n.id,
    n.type,
    n.content,
    n.created_at,
    n.read,
    u.display_name AS from_user_name,
    u.avatar_url AS from_user_avatar,
    n.reference_id,
    n.reference_type
  FROM notifications n
  LEFT JOIN users u ON n.user_from_id = u.id
  WHERE n.user_id = auth.uid()
  ORDER BY n.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add function to mark notifications as read
CREATE OR REPLACE FUNCTION mark_notifications_read(p_notification_ids UUID[])
RETURNS void AS $$
BEGIN
  UPDATE notifications
  SET read = true
  WHERE id = ANY(p_notification_ids)
  AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;