
-- First, let's drop the existing users table that's causing conflicts
DROP TABLE IF EXISTS public.users CASCADE;

-- Make sure the profiles table has proper RLS policies
-- (This should already exist from the migrations, but let's ensure it's properly configured)

-- Add RLS policies for profiles table if they don't exist
DO $$ 
BEGIN
    -- Check if policies exist, if not create them
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can view their own profile') THEN
        CREATE POLICY "Users can view their own profile" ON public.profiles
        FOR SELECT USING (auth.uid() = id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update their own profile') THEN
        CREATE POLICY "Users can update their own profile" ON public.profiles
        FOR UPDATE USING (auth.uid() = id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can insert their own profile') THEN
        CREATE POLICY "Users can insert their own profile" ON public.profiles
        FOR INSERT WITH CHECK (auth.uid() = id);
    END IF;
END $$;

-- Update the handle_new_user function to be more robust
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  EXECUTE 'SET search_path TO public';
  BEGIN
    INSERT INTO public.profiles (id, first_name, last_name, email)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data ->> 'first_name',
      NEW.raw_user_meta_data ->> 'last_name',
      NEW.email
    );
  EXCEPTION
    WHEN unique_violation THEN
      RAISE NOTICE 'Profile for user with ID % already exists.', NEW.id;
    WHEN others THEN
      RAISE EXCEPTION 'An error occurred while inserting profile: %', SQLERRM;
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
