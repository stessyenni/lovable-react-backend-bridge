
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Message } from "../types";


export const useMessages = (userId: string | undefined, component?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  

  const fetchMessages = useCallback(async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(id, first_name, last_name, username, email),
          recipient:profiles!messages_recipient_id_fkey(id, first_name, last_name, username, email)
        `)
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      setMessages(data || []);
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    let channel: any = null;

    if (userId) {
      fetchMessages();

      // Set up realtime subscription for new messages with unique channel name
      const channelName = component ? `messages-updates-${component}-${userId}` : `messages-updates-${userId}`;
      
      // Create channel with unique name
      channel = supabase.channel(channelName);
      
      // Add event listeners
      channel
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `or(sender_id.eq.${userId},recipient_id.eq.${userId})`
        }, () => {
          fetchMessages();
        })
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `or(sender_id.eq.${userId},recipient_id.eq.${userId})`
        }, () => {
          fetchMessages();
        });
      
      // Subscribe to the channel
      channel.subscribe((status: string) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Messages subscription active for ${channelName}`);
        }
      });
    }

    return () => {
      if (channel) {
        channel.unsubscribe();
        supabase.removeChannel(channel);
      }
    };
  }, [userId, component]); // Include component in dependencies

  const sendMessage = async (recipientId: string, content: string) => {
    if (!userId || !content.trim()) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: userId,
          recipient_id: recipientId,
          content: content.trim(),
        });

      if (error) {
        console.error('Error sending message:', error);
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Regular messaging - no HemBot integration in messages page

      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      });

      fetchMessages();
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { messages, loading, fetchMessages, sendMessage };
};
