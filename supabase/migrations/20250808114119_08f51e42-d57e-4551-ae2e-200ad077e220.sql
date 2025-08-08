-- Create function to auto-connect new users to Hembot and support (when available)
CREATE OR REPLACE FUNCTION public.auto_connect_to_hembot()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Try to auto-connect to HemBot AI if it exists
  INSERT INTO public.user_connections (follower_id, following_id, status)
  SELECT NEW.id, '99999999-9999-9999-9999-999999999999', 'accepted'
  WHERE EXISTS (SELECT 1 FROM public.profiles WHERE id = '99999999-9999-9999-9999-999999999999');
  
  -- Try to auto-connect to Support Team if it exists
  INSERT INTO public.user_connections (follower_id, following_id, status)
  SELECT NEW.id, '44444444-4444-4444-4444-444444444444', 'accepted'
  WHERE EXISTS (SELECT 1 FROM public.profiles WHERE id = '44444444-4444-4444-4444-444444444444');
  
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Don't block profile creation if connection fails
    RETURN NEW;
END;
$$;

-- Create trigger to auto-connect new users (will be activated when demo profiles exist)
CREATE TRIGGER on_profile_created_auto_connect
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_connect_to_hembot();