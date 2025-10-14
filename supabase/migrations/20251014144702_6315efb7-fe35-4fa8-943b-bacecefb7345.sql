-- Drop the previous policy that doesn't work for edge functions
DROP POLICY IF EXISTS "Allow HemBot messages" ON messages;

-- Create a new policy that allows the service role to insert HemBot messages
CREATE POLICY "Service role can insert HemBot messages"
ON messages
FOR INSERT
TO service_role
WITH CHECK (sender_id = '99999999-9999-9999-9999-999999999999'::uuid);