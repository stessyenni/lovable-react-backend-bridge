-- Update the get_unread_message_count function to exclude HemBot messages
CREATE OR REPLACE FUNCTION public.get_unread_message_count(user_uuid uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  unread_count integer;
BEGIN
  SELECT COUNT(*)::integer INTO unread_count
  FROM messages
  WHERE recipient_id = user_uuid
    AND read_at IS NULL
    AND sender_id != '99999999-9999-9999-9999-999999999999'::uuid;
  
  RETURN COALESCE(unread_count, 0);
END;
$$;