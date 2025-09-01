-- Create a proper hembot system user profile if it doesn't exist
INSERT INTO profiles (id, first_name, last_name, username, email) 
VALUES (
  '99999999-9999-9999-9999-999999999999'::uuid,
  'Hem',
  'Bot',
  'hembot',
  'hembot@hemapp.ai'
) 
ON CONFLICT (id) DO UPDATE SET
  first_name = 'Hem',
  last_name = 'Bot',
  username = 'hembot',
  email = 'hembot@hemapp.ai';

-- Update messages table to add a trigger for automatic read receipts
CREATE OR REPLACE FUNCTION handle_message_notifications()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert notification for the recipient
  INSERT INTO notifications (user_id, type, title, message, data)
  VALUES (
    NEW.recipient_id,
    'message',
    'New Message',
    'You have a new message from ' || 
    COALESCE(
      (SELECT CONCAT(first_name, ' ', last_name) FROM profiles WHERE id = NEW.sender_id),
      (SELECT email FROM auth.users WHERE id = NEW.sender_id),
      'Unknown User'
    ),
    jsonb_build_object(
      'sender_id', NEW.sender_id,
      'message_id', NEW.id,
      'content_preview', LEFT(NEW.content, 50)
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for message notifications
DROP TRIGGER IF EXISTS message_notification_trigger ON messages;
CREATE TRIGGER message_notification_trigger
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION handle_message_notifications();

-- Add a function to get unread message count for a user
CREATE OR REPLACE FUNCTION get_unread_message_count(user_uuid uuid)
RETURNS integer AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::integer
    FROM messages 
    WHERE recipient_id = user_uuid 
    AND read_at IS NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable realtime for better message syncing (skip if already exists)
ALTER TABLE messages REPLICA IDENTITY FULL;
ALTER TABLE notifications REPLICA IDENTITY FULL;
ALTER TABLE profiles REPLICA IDENTITY FULL;