import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useUnreadMessages = () => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase.rpc('get_unread_message_count', {
        user_uuid: user.id
      });

      if (error) {
        console.error('Error fetching unread count:', error);
        return;
      }

      setUnreadCount(data || 0);
    } catch (error) {
      console.error('Unexpected error fetching unread count:', error);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;

    fetchUnreadCount();

    // Set up realtime subscription with unique channel name
    const channelName = `unread-messages-${user.id}`;
    
    // Remove any existing channel with this name first (account for 'realtime:' prefix)
    const existingChannels = supabase.getChannels().filter((ch: any) => typeof ch.topic === 'string' && ch.topic.endsWith(channelName));
    existingChannels.forEach((ch: any) => {
      try { ch.unsubscribe?.(); } catch {}
      supabase.removeChannel(ch);
    });
    
    // Create and subscribe to new channel
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `recipient_id=eq.${user.id}`
      }, () => {
        fetchUnreadCount();
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
        filter: `recipient_id=eq.${user.id}`
      }, () => {
        fetchUnreadCount();
      })
      .subscribe((status: string) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Unread messages subscription active for ${channelName}`);
        }
      });

    return () => {
      channel.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const markAsRead = useCallback(async (messageId: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('id', messageId)
        .eq('recipient_id', user.id);

      if (error) {
        console.error('Error marking message as read:', error);
        return;
      }

      fetchUnreadCount();
    } catch (error) {
      console.error('Unexpected error marking message as read:', error);
    }
  }, [user?.id, fetchUnreadCount]);

  return { unreadCount, fetchUnreadCount, markAsRead };
};