import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useNewCommunityPosts = () => {
  const [newPostsCount, setNewPostsCount] = useState(0);
  const { user } = useAuth();

  const fetchNewPostsCount = useCallback(async () => {
    if (!user?.id) {
      setNewPostsCount(0);
      return;
    }

    // Get the last viewed timestamp from localStorage
    const lastViewed = localStorage.getItem(`community_last_viewed_${user.id}`);
    const lastViewedDate = lastViewed ? new Date(lastViewed) : new Date(0);

    const { count, error } = await supabase
      .from('community_posts')
      .select('*', { count: 'exact', head: true })
      .neq('user_id', user.id) // Don't count user's own posts
      .gt('created_at', lastViewedDate.toISOString());

    if (error) {
      console.error('Error fetching new posts count:', error);
      return;
    }

    setNewPostsCount(count || 0);
  }, [user?.id]);

  const markAsViewed = useCallback(() => {
    if (!user?.id) return;
    localStorage.setItem(`community_last_viewed_${user.id}`, new Date().toISOString());
    setNewPostsCount(0);
  }, [user?.id]);

  useEffect(() => {
    fetchNewPostsCount();
  }, [fetchNewPostsCount]);

  // Set up real-time subscription for new posts
  useEffect(() => {
    if (!user?.id) return;

    const channelName = `community_posts_${user.id}`;
    
    // Clean up existing channel first
    const existingChannel = supabase.channel(channelName);
    supabase.removeChannel(existingChannel);

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'community_posts',
        },
        (payload) => {
          // Only increment if it's not the current user's post
          if (payload.new.user_id !== user.id) {
            setNewPostsCount(prev => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return { newPostsCount, fetchNewPostsCount, markAsViewed };
};
