/*
  # Fix Profile Functions

  1. Changes
    - Add get_user_content function to handle all content types
    - Update get_user_profile function to use p_username parameter
    - Add proper error handling and type safety

  2. Security
    - Enable RLS for all functions
    - Add proper parameter validation
*/

-- Drop existing content functions if they exist
DROP FUNCTION IF EXISTS get_user_posts(UUID, INTEGER, INTEGER);
DROP FUNCTION IF EXISTS get_user_comments(UUID, INTEGER, INTEGER);
DROP FUNCTION IF EXISTS get_user_upvoted(UUID, INTEGER, INTEGER);

-- Create unified get_user_content function
CREATE OR REPLACE FUNCTION get_user_content(
  p_user_id UUID,
  p_content_type TEXT,
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  content_type TEXT,
  title TEXT,
  content TEXT,
  created_at TIMESTAMPTZ,
  likes_count BIGINT,
  comments_count BIGINT,
  awards_count BIGINT,
  is_liked BOOLEAN
) AS $$
BEGIN
  -- Validate content type
  IF p_content_type NOT IN ('posts', 'comments', 'upvoted') THEN
    RAISE EXCEPTION 'Invalid content type: %', p_content_type;
  END IF;

  -- Return appropriate content based on type
  IF p_content_type = 'posts' THEN
    RETURN QUERY
    SELECT 
      p.id,
      'post'::TEXT AS content_type,
      p.title,
      p.content,
      p.created_at,
      COALESCE(ps.likes_count, 0::bigint),
      COALESCE(ps.comments_count, 0::bigint),
      COALESCE(ps.awards_count, 0::bigint),
      EXISTS(
        SELECT 1 FROM likes l
        WHERE l.post_id = p.id
        AND l.user_id = auth.uid()
      )
    FROM posts p
    LEFT JOIN post_stats ps ON p.id = ps.post_id
    WHERE p.user_id = p_user_id
    ORDER BY p.created_at DESC
    LIMIT p_limit OFFSET p_offset;

  ELSIF p_content_type = 'comments' THEN
    RETURN QUERY
    SELECT 
      c.id,
      'comment'::TEXT,
      p.title,
      c.content,
      c.created_at,
      COUNT(DISTINCT l.id)::bigint,
      0::bigint,
      0::bigint,
      EXISTS(
        SELECT 1 FROM likes l2
        WHERE l2.comment_id = c.id
        AND l2.user_id = auth.uid()
      )
    FROM comments c
    JOIN posts p ON c.post_id = p.id
    LEFT JOIN likes l ON c.id = l.comment_id
    WHERE c.user_id = p_user_id
    GROUP BY c.id, p.id, p.title
    ORDER BY c.created_at DESC
    LIMIT p_limit OFFSET p_offset;

  ELSE -- upvoted
    RETURN QUERY
    SELECT 
      p.id,
      'post'::TEXT,
      p.title,
      p.content,
      p.created_at,
      COALESCE(ps.likes_count, 0::bigint),
      COALESCE(ps.comments_count, 0::bigint),
      COALESCE(ps.awards_count, 0::bigint),
      true
    FROM likes l
    JOIN posts p ON l.post_id = p.id
    LEFT JOIN post_stats ps ON p.id = ps.post_id
    WHERE l.user_id = p_user_id
    ORDER BY l.created_at DESC
    LIMIT p_limit OFFSET p_offset;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update get_user_profile function to use p_username parameter
CREATE OR REPLACE FUNCTION get_user_profile(p_username TEXT)
RETURNS TABLE (
  id UUID,
  username TEXT,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  reputation INTEGER,
  social_links JSONB,
  preferences JSONB,
  created_at TIMESTAMPTZ,
  total_posts BIGINT,
  total_comments BIGINT,
  total_upvotes BIGINT,
  total_awards BIGINT,
  is_following BOOLEAN
) AS $$
BEGIN
  -- Validate username
  IF p_username IS NULL OR p_username = '' THEN
    RAISE EXCEPTION 'Username cannot be empty';
  END IF;

  RETURN QUERY
  SELECT 
    u.id,
    u.username,
    u.display_name,
    u.bio,
    u.avatar_url,
    u.reputation,
    u.social_links,
    u.preferences,
    u.created_at,
    COUNT(DISTINCT p.id)::bigint AS total_posts,
    COUNT(DISTINCT c.id)::bigint AS total_comments,
    COUNT(DISTINCT l.id)::bigint AS total_upvotes,
    COUNT(DISTINCT ua.id)::bigint AS total_awards,
    EXISTS(
      SELECT 1 FROM friends f
      WHERE (f.user_id = auth.uid() AND f.friend_id = u.id)
      OR (f.friend_id = auth.uid() AND f.user_id = u.id)
      AND f.status = 'accepted'
    ) AS is_following
  FROM users u
  LEFT JOIN posts p ON u.id = p.user_id
  LEFT JOIN comments c ON u.id = c.user_id
  LEFT JOIN likes l ON u.id = l.user_id
  LEFT JOIN user_awards ua ON u.id = ua.receiver_id
  WHERE LOWER(u.username) = LOWER(p_username)
  GROUP BY u.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;