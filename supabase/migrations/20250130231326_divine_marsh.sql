/*
  # Coin and Rewards System

  1. New Tables
    - `coin_packages`
      - Standard coin packages with tiered pricing
      - Special/limited time offers
    - `coin_transactions`
      - Track all coin purchases and usage
    - `rewards`
      - Available rewards/items that can be purchased
    - `user_rewards`
      - Track rewards owned by users
    - `reward_categories`
      - Organize rewards into categories

  2. Security
    - Enable RLS on all tables
    - Users can view available packages and rewards
    - Users can only view their own transactions
    - Users can only view their own rewards

  3. Changes
    - Add coins column to users table
    - Add functions for purchasing and using coins
*/

-- Create reward categories table
CREATE TABLE IF NOT EXISTS reward_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE reward_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reward categories"
  ON reward_categories FOR SELECT
  TO authenticated
  USING (true);

-- Create coin packages table
CREATE TABLE IF NOT EXISTS coin_packages (
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
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE coin_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view coin packages"
  ON coin_packages FOR SELECT
  TO authenticated
  USING (true);

-- Create rewards table
CREATE TABLE IF NOT EXISTS rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES reward_categories(id),
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
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view rewards"
  ON rewards FOR SELECT
  TO authenticated
  USING (true);

-- Create coin transactions table
CREATE TABLE IF NOT EXISTS coin_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  package_id UUID REFERENCES coin_packages(id),
  amount INTEGER NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('purchase', 'reward_purchase', 'gift', 'refund')),
  payment_provider TEXT,
  payment_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE coin_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions"
  ON coin_transactions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create user rewards table
CREATE TABLE IF NOT EXISTS user_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  reward_id UUID REFERENCES rewards(id) NOT NULL,
  transaction_id UUID REFERENCES coin_transactions(id),
  gifted_to_user_id UUID REFERENCES users(id),
  gifted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE user_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own rewards"
  ON user_rewards FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR gifted_to_user_id = auth.uid());

-- Add coins column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS coins INTEGER DEFAULT 0;

-- Function to purchase coins
CREATE OR REPLACE FUNCTION purchase_coins(
  p_user_id UUID,
  p_package_id UUID,
  p_payment_provider TEXT,
  p_payment_id TEXT
)
RETURNS UUID AS $$
DECLARE
  v_transaction_id UUID;
  v_coin_amount INTEGER;
  v_bonus_amount INTEGER;
BEGIN
  -- Get package details
  SELECT coin_amount, bonus_amount INTO v_coin_amount, v_bonus_amount
  FROM coin_packages
  WHERE id = p_package_id;

  -- Create transaction
  INSERT INTO coin_transactions (
    user_id,
    package_id,
    amount,
    transaction_type,
    payment_provider,
    payment_id,
    status
  )
  VALUES (
    p_user_id,
    p_package_id,
    v_coin_amount + v_bonus_amount,
    'purchase',
    p_payment_provider,
    p_payment_id,
    'completed'
  )
  RETURNING id INTO v_transaction_id;

  -- Update user's coin balance
  UPDATE users
  SET coins = coins + v_coin_amount + v_bonus_amount
  WHERE id = p_user_id;

  RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to purchase a reward
CREATE OR REPLACE FUNCTION purchase_reward(
  p_user_id UUID,
  p_reward_id UUID,
  p_gift_to_user_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_transaction_id UUID;
  v_coin_price INTEGER;
BEGIN
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

  -- Create transaction
  INSERT INTO coin_transactions (
    user_id,
    amount,
    transaction_type,
    status
  )
  VALUES (
    p_user_id,
    -v_coin_price,
    'reward_purchase',
    'completed'
  )
  RETURNING id INTO v_transaction_id;

  -- Create user reward
  INSERT INTO user_rewards (
    user_id,
    reward_id,
    transaction_id,
    gifted_to_user_id,
    gifted_at
  )
  VALUES (
    p_user_id,
    p_reward_id,
    v_transaction_id,
    p_gift_to_user_id,
    CASE WHEN p_gift_to_user_id IS NOT NULL THEN now() END
  );

  -- Update user's coin balance
  UPDATE users
  SET coins = coins - v_coin_price
  WHERE id = p_user_id;

  RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;