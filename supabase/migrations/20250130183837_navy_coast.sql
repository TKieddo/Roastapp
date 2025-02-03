/*
  # Create auth triggers and functions

  1. New Functions
    - handle_new_user(): Creates a user profile when a new user signs up
    - handle_user_delete(): Cleans up user data when a user is deleted

  2. Triggers
    - on_auth_user_created: Automatically creates user profile after signup
    - on_auth_user_deleted: Automatically cleans up user data after deletion

  3. Security
    - Functions are set to security definer to run with elevated privileges
*/

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.users (id, email, username)
  VALUES (
    NEW.id,
    NEW.email,
    LOWER(SPLIT_PART(NEW.email, '@', 1)) -- Default username from email
  );
  RETURN NEW;
END;
$$;

-- Create function to handle user deletion
CREATE OR REPLACE FUNCTION public.handle_user_delete()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM public.users WHERE id = OLD.id;
  RETURN OLD;
END;
$$;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create trigger for user deletion
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
CREATE TRIGGER on_auth_user_deleted
  BEFORE DELETE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_delete();