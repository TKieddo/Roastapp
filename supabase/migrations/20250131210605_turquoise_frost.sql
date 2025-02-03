-- Drop existing policies first
DROP POLICY IF EXISTS "Users can read all profiles" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Communities are readable by everyone" ON communities;
DROP POLICY IF EXISTS "Community members are readable by everyone" ON community_members;
DROP POLICY IF EXISTS "Posts are readable by everyone" ON posts;
DROP POLICY IF EXISTS "Users can create posts" ON posts;
DROP POLICY IF EXISTS "Comments are readable by everyone" ON comments;
DROP POLICY IF EXISTS "Users can create comments" ON comments;
DROP POLICY IF EXISTS "Users can view all likes" ON likes;
DROP POLICY IF EXISTS "Users can create their own likes" ON likes;
DROP POLICY IF EXISTS "Awards are readable by everyone" ON awards;
DROP POLICY IF EXISTS "Post awards are readable by everyone" ON post_awards;
DROP POLICY IF EXISTS "Coin packages are readable by everyone" ON coin_packages;
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS user_awards CASCADE;
DROP TABLE IF EXISTS awards CASCADE;
DROP TABLE IF EXISTS likes CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS community_members CASCADE;
DROP TABLE IF EXISTS communities CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create fresh tables
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  coins INTEGER DEFAULT 1000,
  reputation INTEGER DEFAULT 0,
  theme TEXT DEFAULT 'dark',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all profiles"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Communities table
CREATE TABLE communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  cover_image TEXT,
  created_by UUID REFERENCES users(id) NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE communities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Communities are readable by everyone"
  ON communities FOR SELECT
  TO authenticated
  USING (true);

-- Community members table
CREATE TABLE community_members (
  community_id UUID REFERENCES communities(id) NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (community_id, user_id)
);

ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Community members are readable by everyone"
  ON community_members FOR SELECT
  TO authenticated
  USING (true);

-- Posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  community_id UUID REFERENCES communities(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  code_snippet TEXT,
  upvotes INTEGER DEFAULT 0,
  awards_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts are readable by everyone"
  ON posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES comments(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are readable by everyone"
  ON comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create comments"
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

-- Likes table
CREATE TABLE likes (
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

-- Awards table
CREATE TABLE awards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  icon_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE awards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Awards are readable by everyone"
  ON awards FOR SELECT
  TO authenticated
  USING (true);

-- User awards table
CREATE TABLE user_awards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  award_id UUID REFERENCES awards(id) NOT NULL,
  giver_id UUID REFERENCES users(id) NOT NULL,
  receiver_id UUID REFERENCES users(id) NOT NULL,
  comment_id UUID REFERENCES comments(id),
  post_id UUID REFERENCES posts(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE user_awards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User awards are readable by everyone"
  ON user_awards FOR SELECT
  TO authenticated
  USING (true);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  user_from_id UUID REFERENCES users(id),
  type TEXT NOT NULL CHECK (type IN ('mention', 'like', 'comment', 'award', 'friend_request', 'gift', 'system')),
  content TEXT NOT NULL,
  reference_id UUID,
  reference_type TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create materialized view for post statistics
CREATE MATERIALIZED VIEW post_stats AS
SELECT 
  p.id AS post_id,
  COUNT(DISTINCT l.id) AS likes_count,
  COUNT(DISTINCT c.id) AS comments_count,
  COUNT(DISTINCT ua.id) AS awards_count
FROM posts p
LEFT JOIN likes l ON p.id = l.post_id
LEFT JOIN comments c ON p.id = c.post_id
LEFT JOIN user_awards ua ON p.id = ua.post_id
GROUP BY p.id;

-- Create index for faster lookups
CREATE UNIQUE INDEX post_stats_post_id_idx ON post_stats (post_id);

-- Insert default awards
INSERT INTO awards (name, description, price, icon_url) VALUES
('Savage Roast', 'For the most brutal roasts that leave no survivors', 100, 'https://example.com/savage-roast.png'),
('Code Master', 'Acknowledge exceptional code roasting skills', 250, 'https://example.com/code-master.png'),
('Legendary Burn', 'For roasts that will be remembered for generations', 500, 'https://example.com/legendary-burn.png'),
('Wholesome Roast', 'When the roast is savage but somehow still wholesome', 150, 'https://example.com/wholesome-roast.png'),
('Bug Hunter', 'For spotting those sneaky bugs in the code', 200, 'https://example.com/bug-hunter.png'),
('Premium Roast', 'The finest, most sophisticated roast in town', 1000, 'https://example.com/premium-roast.png');