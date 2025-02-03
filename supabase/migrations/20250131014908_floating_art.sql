-- Function to create a post
CREATE OR REPLACE FUNCTION create_post(
  title TEXT,
  content TEXT,
  community_id UUID DEFAULT NULL,
  image_url TEXT DEFAULT NULL,
  code_snippet TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_post_id UUID;
BEGIN
  -- Insert the post
  INSERT INTO posts (
    user_id,
    community_id,
    title,
    content,
    image_url,
    code_snippet
  )
  VALUES (
    auth.uid(),
    community_id,
    title,
    content,
    image_url,
    code_snippet
  )
  RETURNING id INTO v_post_id;

  -- If posted in a community, create notification for community moderators
  IF community_id IS NOT NULL THEN
    INSERT INTO notifications (
      user_id,
      user_from_id,
      type,
      content,
      reference_id,
      reference_type
    )
    SELECT
      cm.user_id,
      auth.uid(),
      'post',
      'posted in your community',
      v_post_id,
      'post'
    FROM community_members cm
    WHERE cm.community_id = community_id
    AND cm.role = 'moderator'
    AND cm.user_id != auth.uid();
  END IF;

  -- Refresh post stats
  REFRESH MATERIALIZED VIEW post_stats;

  RETURN v_post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update a post
CREATE OR REPLACE FUNCTION update_post(
  post_id UUID,
  new_title TEXT DEFAULT NULL,
  new_content TEXT DEFAULT NULL,
  new_image_url TEXT DEFAULT NULL,
  new_code_snippet TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if user owns the post
  IF NOT EXISTS (
    SELECT 1 FROM posts
    WHERE id = post_id
    AND user_id = auth.uid()
  ) THEN
    RETURN false;
  END IF;

  -- Update the post
  UPDATE posts
  SET
    title = COALESCE(new_title, title),
    content = COALESCE(new_content, content),
    image_url = COALESCE(new_image_url, image_url),
    code_snippet = COALESCE(new_code_snippet, code_snippet),
    updated_at = now()
  WHERE id = post_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete a post
CREATE OR REPLACE FUNCTION delete_post(post_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if user owns the post
  IF NOT EXISTS (
    SELECT 1 FROM posts
    WHERE id = post_id
    AND user_id = auth.uid()
  ) THEN
    RETURN false;
  END IF;

  -- Delete the post (this will cascade to likes, comments, etc.)
  DELETE FROM posts WHERE id = post_id;

  -- Refresh materialized views
  REFRESH MATERIALIZED VIEW post_stats;
  REFRESH MATERIALIZED VIEW comment_stats;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add policies for post management
CREATE POLICY "Users can update their own posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to get post with stats
CREATE OR REPLACE FUNCTION get_post_with_stats(target_post_id UUID)
RETURNS JSON AS $$
DECLARE
  v_post JSON;
BEGIN
  SELECT 
    json_build_object(
      'post', row_to_json(p),
      'stats', json_build_object(
        'likes_count', COALESCE(ps.likes_count, 0),
        'comments_count', COALESCE(ps.comments_count, 0),
        'awards_count', COALESCE(ps.awards_count, 0)
      ),
      'author', json_build_object(
        'id', u.id,
        'username', u.username,
        'display_name', u.display_name,
        'avatar_url', u.avatar_url
      ),
      'community', CASE 
        WHEN c.id IS NOT NULL THEN
          json_build_object(
            'id', c.id,
            'name', c.name,
            'slug', c.slug
          )
        ELSE NULL
      END,
      'is_liked', EXISTS(
        SELECT 1 FROM likes l
        WHERE l.post_id = p.id
        AND l.user_id = auth.uid()
      )
    ) INTO v_post
  FROM posts p
  LEFT JOIN post_stats ps ON p.id = ps.post_id
  LEFT JOIN users u ON p.user_id = u.id
  LEFT JOIN communities c ON p.community_id = c.id
  WHERE p.id = target_post_id;

  RETURN v_post;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;