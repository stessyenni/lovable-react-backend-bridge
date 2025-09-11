-- Add read_at column to messages table for tracking read status
ALTER TABLE public.messages 
ADD COLUMN read_at TIMESTAMP WITH TIME ZONE;