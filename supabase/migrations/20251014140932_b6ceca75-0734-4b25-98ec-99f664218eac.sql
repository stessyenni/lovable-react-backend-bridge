-- Allow HemBot to send messages (edge function can insert messages from HemBot)
CREATE POLICY "Allow HemBot messages"
ON messages
FOR INSERT
TO authenticated
WITH CHECK (sender_id = '99999999-9999-9999-9999-999999999999'::uuid);