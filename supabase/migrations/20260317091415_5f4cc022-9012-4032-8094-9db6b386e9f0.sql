-- Tighten access to sensitive profile data and expose a safe public directory view.

-- Remove overly broad profile read policies.
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "System profiles are visible to authenticated users" ON public.profiles;

-- Restrict full profile reads to the profile owner only.
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Create a safe public directory view with non-sensitive profile fields only.
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT
  id,
  first_name,
  last_name,
  username,
  profile_image_url,
  created_at
FROM public.profiles;

-- Expose only the safe directory view to authenticated users.
GRANT SELECT ON public.public_profiles TO authenticated;