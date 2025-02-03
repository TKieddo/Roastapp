-- Drop existing trigger first to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Update handle_new_user function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if user already exists
  IF EXISTS (SELECT 1 FROM public.users WHERE id = NEW.id) THEN
    RETURN NEW;
  END IF;

  -- Insert new user with default values
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
    LOWER(SPLIT_PART(NEW.email, '@', 1)), -- Create username from email
    SPLIT_PART(NEW.email, '@', 1), -- Use email name part as display name
    1000, -- Starting coins
    NOW(),
    NOW()
  );

  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log error (in production you'd want proper error logging)
    RAISE NOTICE 'Error creating user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create missing users for existing auth users
INSERT INTO public.users (
  id,
  username,
  display_name,
  coins,
  created_at,
  updated_at
)
SELECT 
  au.id,
  LOWER(SPLIT_PART(au.email, '@', 1)),
  SPLIT_PART(au.email, '@', 1),
  1000,
  COALESCE(au.created_at, NOW()),
  NOW()
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;