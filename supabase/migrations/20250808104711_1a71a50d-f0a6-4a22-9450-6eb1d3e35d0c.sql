-- Create demo users and Hembot AI assistant
-- Insert demo profiles
INSERT INTO public.profiles (id, first_name, last_name, username, email, profile_image_url) VALUES
('11111111-1111-1111-1111-111111111111', 'Demo', 'User1', 'demouser1', 'demo1@example.com', NULL),
('22222222-2222-2222-2222-222222222222', 'Demo', 'User2', 'demouser2', 'demo2@example.com', NULL),
('33333333-3333-3333-3333-333333333333', 'Dr. Sarah', 'Johnson', 'healthexpert', 'expert@hemapp.com', NULL),
('44444444-4444-4444-4444-444444444444', 'Support', 'Team', 'hemsupport', 'hemapp@gmail.com', NULL),
('99999999-9999-9999-9999-999999999999', 'HemBot', 'AI', 'hembot', 'hembot@hemapp.ai', NULL);

-- Create function to auto-connect new users to Hembot and support
CREATE OR REPLACE FUNCTION public.auto_connect_to_hembot()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Auto-connect to HemBot AI
  INSERT INTO public.user_connections (follower_id, following_id, status)
  VALUES (NEW.id, '99999999-9999-9999-9999-999999999999', 'accepted');
  
  -- Auto-connect to Support Team
  INSERT INTO public.user_connections (follower_id, following_id, status)
  VALUES (NEW.id, '44444444-4444-4444-4444-444444444444', 'accepted');
  
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Don't block profile creation if connection fails
    RETURN NEW;
END;
$$;

-- Create trigger to auto-connect new users
CREATE TRIGGER on_profile_created_auto_connect
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_connect_to_hembot();