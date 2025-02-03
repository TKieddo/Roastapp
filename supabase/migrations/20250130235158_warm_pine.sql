/*
  # Add Post Awards Schema

  1. New Tables
    - `post_awards` - Tracks awards given to posts
      - `id` (uuid, primary key)
      - `post_id` (uuid, references posts)
      - `user_id` (uuid, references users)
      - `reward_id` (uuid, references rewards)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `post_awards` table
    - Add policies for authenticated users

  3. Functions
    - Add `award_post` function to handle awarding posts
*/

-- Create post_awards table
CREATE TABLE IF NOT EXISTS post_awards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  reward_id UUID REFERENCES rewards(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE post_awards ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view post awards"
  ON post_awards FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create awards"
  ON post_awards FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create function to award a post
CREATE OR REPLACE FUNCTION award_post(
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

  RETURN v_award_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;