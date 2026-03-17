-- Fix overly broad profile insert policy that lets authenticated users create arbitrary profile rows.
DROP POLICY IF EXISTS "Users can insert profiles" ON public.profiles;

CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Fix unrestricted notification inserts so anonymous/authenticated callers cannot forge notifications.
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can create their own notifications" ON public.notifications;

CREATE POLICY "System can create notifications"
ON public.notifications
FOR INSERT
TO service_role
WITH CHECK (true);