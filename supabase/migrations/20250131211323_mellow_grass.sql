-- Add friend-related functions if they don't exist
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

-- Create friends table if it doesn't exist
CREATE TABLE IF NOT EXISTS friends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  friend_id UUID REFERENCES users(id) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, friend_id)
);

-- Enable RLS on friends table
ALTER TABLE friends ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own friend connections" ON friends;
DROP POLICY IF EXISTS "Users can create friend requests" ON friends;
DROP POLICY IF EXISTS "Users can update their friend status" ON friends;
DROP POLICY IF EXISTS "Users can delete their friend connections" ON friends;

-- Create policies for friends table
CREATE POLICY "Users can view their own friend connections"
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
  USING (auth.uid() = friend_id);

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
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_friends_updated_at ON friends;

-- Create trigger
CREATE TRIGGER update_friends_updated_at
  BEFORE UPDATE ON friends
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();