-- Ensure the safe public profile directory view runs with the caller's permissions.
ALTER VIEW public.public_profiles SET (security_invoker = true);