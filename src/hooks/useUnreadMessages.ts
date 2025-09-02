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
    let channel: any = null;

    if (user?.id) {
      fetchUnreadCount();

      // Set up realtime subscription for new messages with unique channel name
      channel = supabase
        .channel(`unread-messages-${user.id}`)
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
        .subscribe();
    }

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user?.id]); // Remove fetchUnreadCount from dependencies

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