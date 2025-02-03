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

  -- Refresh post stats
  REFRESH MATERIALIZED VIEW post_stats;

  RETURN v_post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update post policies to allow creation through the function
DROP POLICY IF EXISTS "Users can create posts" ON posts;
CREATE POLICY "Users can create posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1
      FROM community_members
      WHERE community_id = posts.community_id
      AND user_id = auth.uid()
    )
  );