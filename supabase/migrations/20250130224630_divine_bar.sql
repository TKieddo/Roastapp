/*
  # Add Dynamic Data Schema

  1. New Tables
    - `likes` - Store post/comment likes
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `post_id` (uuid, references posts, nullable)
      - `comment_id` (uuid, references comments, nullable)
      - `created_at` (timestamptz)

    - `bookmarks` - Store user bookmarks
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `post_id` (uuid, references posts)
      - `created_at` (timestamptz)

    - `friends` - Store user connections
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `friend_id` (uuid, references users)
      - `status` (text) - pending/accepted
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Likes table
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

ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all likes"
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

-- Bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  post_id UUID REFERENCES posts(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, post_id)
);

ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own bookmarks"
  ON bookmarks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookmarks"
  ON bookmarks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
  ON bookmarks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Friends table
CREATE TABLE IF NOT EXISTS friends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  friend_id UUID REFERENCES users(id) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, friend_id)
);

ALTER TABLE friends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own friend connections"
  ON friends FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can create friend requests"
  ON friends FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their friend status"
  ON friends FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can delete their friend connections"
  ON friends FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_friends_updated_at
  BEFORE UPDATE ON friends
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add functions for friend operations
CREATE OR REPLACE FUNCTION get_friend_status(user_a UUID, user_b UUID)
RETURNS TEXT AS $$
DECLARE
  status TEXT;
BEGIN
  SELECT f.status INTO status
  FROM friends f
  WHERE (f.user_id = user_a AND f.friend_id = user_b)
     OR (f.user_id = user_b AND f.friend_id = user_a);
  RETURN status;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get mutual friends count
CREATE OR REPLACE FUNCTION get_mutual_friends_count(user_a UUID, user_b UUID)
RETURNS INTEGER AS $$
DECLARE
  count INTEGER;
BEGIN
  WITH user_a_friends AS (
    SELECT friend_id FROM friends
    WHERE user_id = user_a AND status = 'accepted'
    UNION
    SELECT user_id FROM friends
    WHERE friend_id = user_a AND status = 'accepted'
  ),
  user_b_friends AS (
    SELECT friend_id FROM friends
    WHERE user_id = user_b AND status = 'accepted'
    UNION
    SELECT user_id FROM friends
    WHERE friend_id = user_b AND status = 'accepted'
  )
  SELECT COUNT(*) INTO count
  FROM user_a_friends a
  INNER JOIN user_b_friends b ON a.friend_id = b.friend_id;
  
  RETURN count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;