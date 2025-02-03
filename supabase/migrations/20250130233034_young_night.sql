/*
  # Update notifications schema

  1. Changes
    - Drop existing notifications table
    - Create new notifications table with updated schema
    - Add RLS policies
    - Add helper functions

  2. Security
    - Enable RLS
    - Add policies for authenticated users
    - Add security definer functions
*/

-- Drop existing notifications table and related objects
DROP TABLE IF EXISTS notifications CASCADE;

-- Create notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  user_from_id UUID REFERENCES users(id),
  type TEXT NOT NULL CHECK (type IN ('mention', 'like', 'comment', 'award', 'friend_request', 'gift', 'system')),
  content TEXT NOT NULL,
  reference_id UUID,
  reference_type TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own notifications"
  ON notifications FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_notification_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_notification_updated_at();

-- Create function to create a notification
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_user_from_id UUID,
  p_type TEXT,
  p_content TEXT,
  p_reference_id UUID DEFAULT NULL,
  p_reference_type TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  INSERT INTO notifications (
    user_id,
    user_from_id,
    type,
    content,
    reference_id,
    reference_type
  )
  VALUES (
    p_user_id,
    p_user_from_id,
    p_type,
    p_content,
    p_reference_id,
    p_reference_type
  )
  RETURNING id INTO v_notification_id;

  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;