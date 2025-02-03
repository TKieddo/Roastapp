-- Update handle_new_user function to include default coins
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    username,
    display_name,
    coins,
    created_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    LOWER(SPLIT_PART(NEW.email, '@', 1)),
    SPLIT_PART(NEW.email, '@', 1),
    1000, -- Give new users 1000 coins to start
    NOW()
  );
  RETURN NEW;
END;
$$;