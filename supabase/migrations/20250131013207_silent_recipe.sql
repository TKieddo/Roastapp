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
DROP POLICY IF EXISTS "Rewards are readable by everyone" ON rewards;
DROP POLICY IF EXISTS "Post awards are readable by everyone" ON post_awards;
DROP POLICY IF EXISTS "Coin packages are readable by everyone" ON coin_packages;
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;

-- Drop existing triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_message_insert ON messages;

-- Drop existing functions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS award_post(UUID, UUID, UUID) CASCADE;
DROP FUNCTION IF EXISTS create_conversation(UUID[]) CASCADE;
DROP FUNCTION IF EXISTS mark_messages_as_read(UUID, UUID) CASCADE;
DROP FUNCTION IF EXISTS update_conversation_last_message() CASCADE;

-- Drop existing materialized views
DROP MATERIALIZED VIEW IF EXISTS post_stats;
DROP MATERIALIZED VIEW IF EXISTS comment_stats;

-- Drop existing tables
DROP TABLE IF EXISTS coin_packages CASCADE;
DROP TABLE IF EXISTS post_awards CASCADE;
DROP TABLE IF EXISTS rewards CASCADE;
DROP TABLE IF EXISTS likes CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversation_participants CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS community_members CASCADE;
DROP TABLE IF EXISTS communities CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Now create everything fresh
-- Users table extending auth.users
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

-- Rewards table
CREATE TABLE rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  coin_price INTEGER NOT NULL,
  image_url TEXT,
  animation_url TEXT,
  is_animated BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  is_seasonal BOOLEAN DEFAULT false,
  season_start TIMESTAMPTZ,
  season_end TIMESTAMPTZ,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Rewards are readable by everyone"
  ON rewards FOR SELECT
  TO authenticated
  USING (true);

-- Post awards table
CREATE TABLE post_awards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  reward_id UUID REFERENCES rewards(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE post_awards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Post awards are readable by everyone"
  ON post_awards FOR SELECT
  TO authenticated
  USING (true);

-- Coin packages table
CREATE TABLE coin_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  coin_amount INTEGER NOT NULL,
  price_usd DECIMAL(10,2) NOT NULL,
  bonus_amount INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_limited_time BOOLEAN DEFAULT false,
  limited_time_end TIMESTAMPTZ,
  discount_percentage INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE coin_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coin packages are readable by everyone"
  ON coin_packages FOR SELECT
  TO authenticated
  USING (true);

-- Conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_message TEXT,
  last_message_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Conversation participants table
CREATE TABLE conversation_participants (
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  unread_count INTEGER DEFAULT 0,
  last_read_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (conversation_id, user_id)
);

ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

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
  COUNT(DISTINCT pa.id) AS awards_count
FROM posts p
LEFT JOIN likes l ON p.id = l.post_id
LEFT JOIN comments c ON p.id = c.post_id
LEFT JOIN post_awards pa ON p.id = pa.post_id
GROUP BY p.id;

-- Create index for faster lookups
CREATE UNIQUE INDEX post_stats_post_id_idx ON post_stats (post_id);

-- Create materialized view for comment statistics
CREATE MATERIALIZED VIEW comment_stats AS
SELECT 
  c.id AS comment_id,
  COUNT(DISTINCT l.id) AS likes_count,
  COUNT(DISTINCT r.id) AS replies_count,
  COUNT(DISTINCT pa.id) AS awards_count
FROM comments c
LEFT JOIN likes l ON c.id = l.comment_id
LEFT JOIN comments r ON r.parent_id = c.id
LEFT JOIN post_awards pa ON c.id = pa.post_id
GROUP BY c.id;

-- Create index for faster lookups
CREATE UNIQUE INDEX comment_stats_comment_id_idx ON comment_stats (comment_id);

-- Function to handle new user signup
CREATE FUNCTION public.handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.users (
    id,
    username,
    display_name,
    coins,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    LOWER(SPLIT_PART(NEW.email, '@', 1)),
    SPLIT_PART(NEW.email, '@', 1),
    1000,
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to award a post
CREATE FUNCTION award_post(
  p_user_id UUID,
  p_post_id UUID,
  p_reward_id UUID
)
RETURNS UUID AS $$
DECLARE
  v_coin_price INTEGER;
  v_post_author_id UUID;
  v_award_id UUID;
BEGIN
  -- Get post author
  SELECT user_id INTO v_post_author_id
  FROM posts
  WHERE id = p_post_id;

  -- Prevent self-awarding
  IF v_post_author_id = p_user_id THEN
    RAISE EXCEPTION 'Cannot award your own post';
  END IF;

  -- Get reward price
  SELECT coin_price INTO v_coin_price
  FROM rewards
  WHERE id = p_reward_id;

  -- Check if user has enough coins
  IF NOT EXISTS (
    SELECT 1 FROM users
    WHERE id = p_user_id
    AND coins >= v_coin_price
  ) THEN
    RAISE EXCEPTION 'Insufficient coins';
  END IF;

  -- Create award
  INSERT INTO post_awards (
    post_id,
    user_id,
    reward_id
  )
  VALUES (
    p_post_id,
    p_user_id,
    p_reward_id
  )
  RETURNING id INTO v_award_id;

  -- Deduct coins from user
  UPDATE users
  SET coins = coins - v_coin_price
  WHERE id = p_user_id;

  -- Add coins to post author (50% of award value)
  UPDATE users
  SET coins = coins + (v_coin_price / 2)
  WHERE id = v_post_author_id;

  -- Update post awards count
  UPDATE posts
  SET awards_count = awards_count + 1
  WHERE id = p_post_id;

  -- Refresh materialized views
  REFRESH MATERIALIZED VIEW post_stats;
  REFRESH MATERIALIZED VIEW comment_stats;

  RETURN v_award_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create a conversation
CREATE FUNCTION create_conversation(participant_ids UUID[])
RETURNS UUID AS $$
DECLARE
  conversation_id UUID;
BEGIN
  -- Create conversation
  INSERT INTO conversations DEFAULT VALUES
  RETURNING id INTO conversation_id;

  -- Add participants
  INSERT INTO conversation_participants (conversation_id, user_id)
  SELECT conversation_id, unnest(participant_ids);

  RETURN conversation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark messages as read
CREATE FUNCTION mark_messages_as_read(
  p_conversation_id UUID,
  p_user_id UUID
)
RETURNS void AS $$
BEGIN
  -- Update messages
  UPDATE messages
  SET is_read = true
  WHERE conversation_id = p_conversation_id
  AND sender_id != p_user_id
  AND is_read = false;

  -- Update participant unread count
  UPDATE conversation_participants
  SET unread_count = 0,
      last_read_at = now()
  WHERE conversation_id = p_conversation_id
  AND user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update conversation last message
CREATE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET last_message = NEW.content,
      last_message_at = NEW.created_at,
      updated_at = now()
  WHERE id = NEW.conversation_id;

  -- Update unread count for other participants
  UPDATE conversation_participants
  SET unread_count = unread_count + 1
  WHERE conversation_id = NEW.conversation_id
  AND user_id != NEW.sender_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for message updates
CREATE TRIGGER on_message_insert
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_last_message();

-- Insert default rewards
INSERT INTO rewards (name, description, coin_price, is_premium, display_order) VALUES
('Savage Roast', 'For the most brutal roasts that leave no survivors', 100, false, 1),
('Code Master', 'Acknowledge exceptional code roasting skills', 250, true, 2),
('Legendary Burn', 'For roasts that will be remembered for generations', 500, true, 3),
('Wholesome Roast', 'When the roast is savage but somehow still wholesome', 150, false, 4),
('Bug Hunter', 'For spotting those sneaky bugs in the code', 200, false, 5),
('Premium Roast', 'The finest, most sophisticated roast in town', 1000, true, 6);

-- Insert default coin packages
INSERT INTO coin_packages (name, description, coin_amount, price_usd, bonus_amount, is_featured, display_order) VALUES
('Starter Pack', 'Perfect for beginners', 500, 4.99, 0, false, 1),
('Popular Pack', 'Most popular choice', 1200, 9.99, 100, true, 2),
('Pro Pack', 'For serious roasters', 2500, 19.99, 300, false, 3),
('Elite Pack', 'Maximum value', 5000, 39.99, 1000, false, 4);