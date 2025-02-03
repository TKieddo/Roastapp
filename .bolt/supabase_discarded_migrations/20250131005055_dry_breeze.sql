/*
  # Sample Data Migration

  1. Sample Data
    - Posts with code roasts
    - Comments and replies
    - Likes and awards
    - User interactions

  2. Functions
    - Helper function for random user selection
*/

-- Function to get random user ID
CREATE OR REPLACE FUNCTION get_random_user_id()
RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id FROM users ORDER BY RANDOM() LIMIT 1;
  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql;

-- Insert sample posts
DO $$ 
DECLARE
  v_post_id UUID;
  v_comment_id UUID;
BEGIN
  -- First post
  INSERT INTO posts (id, user_id, content, created_at)
  VALUES (
    gen_random_uuid(),
    get_random_user_id(),
    'Your code is so nested, it needs its own ZIP code! 📦 Check out this callback hell:
```js
function callback() {
  setTimeout(() => {
    fetch("/api").then(res => {
      if (res.ok) {
        try {
          // More nesting...
        } catch (e) {
          console.error(e);
        }
      }
    });
  }, 1000);
}
```',
    NOW() - INTERVAL '2 hours'
  )
  RETURNING id INTO v_post_id;

  -- Comments for first post
  INSERT INTO comments (id, post_id, user_id, content, created_at)
  VALUES (
    gen_random_uuid(),
    v_post_id,
    get_random_user_id(),
    'This code is so nested, even birds are getting lost trying to find their way out! 😂',
    NOW() - INTERVAL '1 hour'
  )
  RETURNING id INTO v_comment_id;

  -- Reply to first comment
  INSERT INTO comments (post_id, user_id, reply_to_id, content, created_at)
  VALUES (
    v_post_id,
    get_random_user_id(),
    v_comment_id,
    'At least the cat would use proper indentation! 😹',
    NOW() - INTERVAL '30 minutes'
  );

  -- Second post
  INSERT INTO posts (id, user_id, content, created_at)
  VALUES (
    gen_random_uuid(),
    get_random_user_id(),
    'Your variable naming is so bad, even JavaScript is questioning its existence. Who names a variable "x" in production? 🤦‍♂️',
    NOW() - INTERVAL '1 hour'
  )
  RETURNING id INTO v_post_id;

  -- Comments for second post
  INSERT INTO comments (id, post_id, user_id, content, created_at)
  VALUES (
    gen_random_uuid(),
    v_post_id,
    get_random_user_id(),
    'var x = "this is fine" // Narrator: It was not fine',
    NOW() - INTERVAL '45 minutes'
  )
  RETURNING id INTO v_comment_id;

  -- Third post
  INSERT INTO posts (id, user_id, content, created_at)
  VALUES (
    gen_random_uuid(),
    get_random_user_id(),
    'This CSS specificity is higher than my coffee intake. Time to refactor! ☕️
```css
#app .container div.wrapper > div.content div.box#special-box.active {
  /* Just... why? */
}
```',
    NOW() - INTERVAL '30 minutes'
  )
  RETURNING id INTO v_post_id;

  -- Comments for third post
  INSERT INTO comments (id, post_id, user_id, content, created_at)
  VALUES (
    gen_random_uuid(),
    v_post_id,
    get_random_user_id(),
    'That selector is longer than my last relationship 💔',
    NOW() - INTERVAL '15 minutes'
  )
  RETURNING id INTO v_comment_id;

  -- Add some likes to posts
  INSERT INTO likes (user_id, post_id)
  SELECT 
    get_random_user_id(),
    p.id
  FROM posts p
  CROSS JOIN generate_series(1, 5);

  -- Add some likes to comments
  INSERT INTO comment_likes (user_id, comment_id)
  SELECT 
    get_random_user_id(),
    c.id
  FROM comments c
  CROSS JOIN generate_series(1, 3);

  -- Refresh materialized views
  REFRESH MATERIALIZED VIEW post_stats;
  REFRESH MATERIALIZED VIEW comment_stats;
END $$;