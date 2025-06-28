
-- First, let's drop the existing foreign key constraints that reference auth.users
ALTER TABLE public.user_connections 
DROP CONSTRAINT IF EXISTS user_connections_follower_id_fkey;

ALTER TABLE public.user_connections 
DROP CONSTRAINT IF EXISTS user_connections_following_id_fkey;

ALTER TABLE public.messages 
DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;

ALTER TABLE public.messages 
DROP CONSTRAINT IF EXISTS messages_recipient_id_fkey;

-- Now add foreign key constraints that reference the profiles table
ALTER TABLE public.user_connections 
ADD CONSTRAINT user_connections_follower_id_fkey 
FOREIGN KEY (follower_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.user_connections 
ADD CONSTRAINT user_connections_following_id_fkey 
FOREIGN KEY (following_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.messages 
ADD CONSTRAINT messages_sender_id_fkey 
FOREIGN KEY (sender_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.messages 
ADD CONSTRAINT messages_recipient_id_fkey 
FOREIGN KEY (recipient_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Also update the conversations table to reference profiles
ALTER TABLE public.conversations 
DROP CONSTRAINT IF EXISTS conversations_created_by_fkey;

ALTER TABLE public.conversations 
ADD CONSTRAINT conversations_created_by_fkey 
FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.conversation_participants 
DROP CONSTRAINT IF EXISTS conversation_participants_user_id_fkey;

ALTER TABLE public.conversation_participants 
ADD CONSTRAINT conversation_participants_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
