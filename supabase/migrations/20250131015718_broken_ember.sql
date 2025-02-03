-- Drop and recreate handle_new_user function with better error handling
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

  -- Create new user with default values
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
    COALESCE(LOWER(SPLIT_PART(NEW.email, '@', 1)), 'user_' || SUBSTRING(NEW.id::text, 1, 8)),
    COALESCE(SPLIT_PART(NEW.email, '@', 1), 'User ' || SUBSTRING(NEW.id::text, 1, 8)),
    1000,
    NOW(),
    NOW()
  );

  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- Handle username collision by appending random string
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
      LOWER(SPLIT_PART(NEW.email, '@', 1)) || '_' || SUBSTRING(MD5(random()::text), 1, 6),
      SPLIT_PART(NEW.email, '@', 1),
      1000,
      NOW(),
      NOW()
    );
    RETURN NEW;
  WHEN others THEN
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Create function to ensure user exists
CREATE OR REPLACE FUNCTION ensure_user_exists(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if user exists in auth.users but not in public.users
  IF EXISTS (
    SELECT 1 FROM auth.users au
    LEFT JOIN public.users pu ON au.id = pu.id
    WHERE au.id = user_id AND pu.id IS NULL
  ) THEN
    -- Get user data from auth.users
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
      COALESCE(LOWER(SPLIT_PART(au.email, '@', 1)), 'user_' || SUBSTRING(au.id::text, 1, 8)),
      COALESCE(SPLIT_PART(au.email, '@', 1), 'User ' || SUBSTRING(au.id::text, 1, 8)),
      1000,
      NOW(),
      NOW()
    FROM auth.users au
    WHERE au.id = user_id;
  END IF;

  RETURN EXISTS (SELECT 1 FROM public.users WHERE id = user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Modify create_post function to ensure user exists
CREATE OR REPLACE FUNCTION create_post(
  title TEXT,
  content TEXT,
  community_id UUID DEFAULT NULL,
  image_url TEXT DEFAULT NULL,
  code_snippet TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
  v_post_id UUID;
BEGIN
  -- Get current user ID
  v_user_id := auth.uid();
  
  -- Ensure user exists in public.users
  IF NOT ensure_user_exists(v_user_id) THEN
    RAISE EXCEPTION 'User does not exist';
  END IF;

  -- Insert the post
  INSERT INTO posts (
    user_id,
    community_id,
    title,
    content,
    image_url,
    code_snippet
  )
  VALUES (
    v_user_id,
    community_id,
    title,
    content,
    image_url,
    code_snippet
  )
  RETURNING id INTO v_post_id;

  -- Refresh post stats
  REFRESH MATERIALIZED VIEW post_stats;

  RETURN v_post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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
  COALESCE(LOWER(SPLIT_PART(au.email, '@', 1)), 'user_' || SUBSTRING(au.id::text, 1, 8)),
  COALESCE(SPLIT_PART(au.email, '@', 1), 'User ' || SUBSTRING(au.id::text, 1, 8)),
  1000,
  COALESCE(au.created_at, NOW()),
  NOW()
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;