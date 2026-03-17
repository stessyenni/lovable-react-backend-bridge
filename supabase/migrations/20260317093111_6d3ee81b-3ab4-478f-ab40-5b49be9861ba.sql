-- Harden messaging integrity so recipients can only mark messages as read.
DROP POLICY IF EXISTS "Users can update their own messages" ON public.messages;

CREATE POLICY "Recipients can update read status on their messages"
ON public.messages
FOR UPDATE
TO authenticated
USING (auth.uid() = recipient_id)
WITH CHECK (auth.uid() = recipient_id);

CREATE OR REPLACE FUNCTION public.restrict_message_read_updates()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS DISTINCT FROM OLD.recipient_id THEN
    RAISE EXCEPTION 'Only the recipient can update a message';
  END IF;

  IF NEW.id IS DISTINCT FROM OLD.id
     OR NEW.sender_id IS DISTINCT FROM OLD.sender_id
     OR NEW.recipient_id IS DISTINCT FROM OLD.recipient_id
     OR NEW.content IS DISTINCT FROM OLD.content
     OR NEW.message_type IS DISTINCT FROM OLD.message_type
     OR NEW.created_at IS DISTINCT FROM OLD.created_at THEN
    RAISE EXCEPTION 'Only read status can be updated';
  END IF;

  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS restrict_message_read_updates ON public.messages;
CREATE TRIGGER restrict_message_read_updates
BEFORE UPDATE ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.restrict_message_read_updates();

-- Restrict connections visibility and mutations to participants only.
DROP POLICY IF EXISTS "Authenticated users can create connections" ON public.user_connections;
DROP POLICY IF EXISTS "Users can update their own connections" ON public.user_connections;
DROP POLICY IF EXISTS "Users can view all connections" ON public.user_connections;

CREATE POLICY "Users can create their own outbound connections"
ON public.user_connections
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = follower_id AND follower_id <> following_id);

CREATE POLICY "Users can view their own connections"
ON public.user_connections
FOR SELECT
TO authenticated
USING (auth.uid() = follower_id OR auth.uid() = following_id);

CREATE POLICY "Users can update their own connections"
ON public.user_connections
FOR UPDATE
TO authenticated
USING (auth.uid() = follower_id OR auth.uid() = following_id)
WITH CHECK (auth.uid() = follower_id OR auth.uid() = following_id);

CREATE POLICY "Users can delete their own connections"
ON public.user_connections
FOR DELETE
TO authenticated
USING (auth.uid() = follower_id OR auth.uid() = following_id);

-- Make community read policies explicitly authenticated-only.
DROP POLICY IF EXISTS "Anyone can view community posts" ON public.community_posts;
CREATE POLICY "Authenticated users can view community posts"
ON public.community_posts
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Anyone can view comments" ON public.post_comments;
CREATE POLICY "Authenticated users can view comments"
ON public.post_comments
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Anyone can view likes" ON public.post_likes;
CREATE POLICY "Authenticated users can view likes"
ON public.post_likes
FOR SELECT
TO authenticated
USING (true);