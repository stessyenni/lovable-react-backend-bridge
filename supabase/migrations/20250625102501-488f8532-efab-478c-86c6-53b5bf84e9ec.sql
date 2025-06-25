
-- Add username column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN username text UNIQUE;

-- Create index for faster username lookups
CREATE INDEX idx_profiles_username ON public.profiles(username);

-- Add constraint to ensure username is not empty if provided
ALTER TABLE public.profiles 
ADD CONSTRAINT username_not_empty CHECK (username IS NULL OR length(trim(username)) > 0);
