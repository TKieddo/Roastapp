/*
  # Initial Schema Setup for RoastApp

  1. Tables Created
    - users (extends auth.users)
    - communities
    - community_members
    - posts
    - comments
    - awards
    - user_awards
    - messages
    - notifications

  2. Security
    - RLS enabled on all tables
    - Policies for authenticated users
    - Specific policies for user-owned data

  3. Features
    - User profiles with coins and themes
    - Community system with membership
    - Posts and comments with voting
    - Award system
    - Messaging system
    - Notification system
*/

-- Users table extending auth.users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  coins INTEGER DEFAULT 0,
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

-- Communities table (moved before posts table since it's referenced by it)
CREATE TABLE IF NOT EXISTS communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_by UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE communities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Communities are readable by everyone"
  ON communities FOR SELECT
  TO authenticated
  USING (true);

-- Community members table
CREATE TABLE IF NOT EXISTS community_members (
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

-- Posts table (now communities table exists for foreign key)
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  community_id UUID REFERENCES communities(id),
  content TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
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
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  content TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
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

-- Awards table
CREATE TABLE IF NOT EXISTS awards (
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
CREATE TABLE IF NOT EXISTS user_awards (
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

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES users(id) NOT NULL,
  receiver_id UUID REFERENCES users(id) NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own messages"
  ON messages FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  reference_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);