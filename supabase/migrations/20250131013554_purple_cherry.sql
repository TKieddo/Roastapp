-- Drop existing functions first
DROP FUNCTION IF EXISTS toggle_post_like(UUID);
DROP FUNCTION IF EXISTS toggle_comment_like(UUID);
DROP FUNCTION IF EXISTS create_comment(UUID, TEXT, UUID);

-- Add delete policy for likes
CREATE POLICY "Users can delete their own likes"
  ON likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add update and delete policies for comments
CREATE POLICY "Users can update their own comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to toggle post like
CREATE FUNCTION toggle_post_like(
  target_post_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_user_id UUID;
  v_liked BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  
  IF EXISTS (
    SELECT 1 FROM likes 
    WHERE user_id = v_user_id AND post_id = target_post_id
  ) THEN
    -- Unlike
    DELETE FROM likes 
    WHERE user_id = v_user_id AND post_id = target_post_id;
    v_liked := false;
  ELSE
    -- Like
    INSERT INTO likes (user_id, post_id)
    VALUES (v_user_id, target_post_id);
    v_liked := true;
  END IF;

  -- Refresh stats
  REFRESH MATERIALIZED VIEW post_stats;
  
  RETURN v_liked;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to toggle comment like
CREATE FUNCTION toggle_comment_like(
  target_comment_id UUID
)
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

  -- Refresh stats
  REFRESH MATERIALIZED VIEW comment_stats;
  
  RETURN v_liked;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create a comment
CREATE FUNCTION create_comment(
  target_post_id UUID,
  comment_content TEXT,
  target_parent_id UUID DEFAULT NULL
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
    target_post_id,
    auth.uid(),
    target_parent_id,
    comment_content
  )
  RETURNING id INTO v_comment_id;

  -- Create notification for post author
  INSERT INTO notifications (
    user_id,
    user_from_id,
    type,
    content,
    reference_id,
    reference_type
  )
  SELECT
    p.user_id,
    auth.uid(),
    'comment',
    'commented on your post',
    target_post_id,
    'post'
  FROM posts p
  WHERE p.id = target_post_id
  AND p.user_id != auth.uid();

  -- If this is a reply, notify parent comment author
  IF target_parent_id IS NOT NULL THEN
    INSERT INTO notifications (
      user_id,
      user_from_id,
      type,
      content,
      reference_id,
      reference_type
    )
    SELECT
      c.user_id,
      auth.uid(),
      'comment',
      'replied to your comment',
      target_parent_id,
      'comment'
    FROM comments c
    WHERE c.id = target_parent_id
    AND c.user_id != auth.uid();
  END IF;

  -- Refresh stats
  REFRESH MATERIALIZED VIEW comment_stats;

  RETURN v_comment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;