-- Fix RLS policies for profiles table to allow user discovery

-- Drop the restrictive policy that only allows viewing own profile
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create a policy that allows authenticated users to view all profiles (for user discovery)
CREATE POLICY "Authenticated users can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (auth.role() = 'authenticated');