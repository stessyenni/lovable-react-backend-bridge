
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Connection } from "../types";
import { fetchPublicProfilesByIds } from "@/lib/publicProfiles";

export const useConnections = (userId: string | undefined) => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const { toast } = useToast();

  const fetchConnections = useCallback(async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('user_connections')
        .select('id, follower_id, following_id, status, created_at')
        .or(`follower_id.eq.${userId},following_id.eq.${userId}`)
        .eq('status', 'accepted');

      if (error) {
        console.error('Error fetching connections:', error);
        return;
      }

      const profileIds = [...new Set((data || []).flatMap((connection) => [connection.follower_id, connection.following_id]))];
      const profiles = await fetchPublicProfilesByIds(profileIds);
      const profileMap = new Map(profiles.map((profile) => [profile.id, profile]));

      setConnections((data || []).map((connection) => ({
        ...connection,
        follower: profileMap.get(connection.follower_id),
        following: profileMap.get(connection.following_id),
      })));
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  }, [userId]);

  const removeConnection = async (connectionId: string) => {
    try {
      const { error } = await supabase
        .from('user_connections')
        .delete()
        .eq('id', connectionId);

      if (error) {
        console.error('Error removing connection:', error);
        toast({
          title: "Error",
          description: "Failed to remove connection. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Connection removed",
        description: "The connection has been removed successfully.",
      });
      
      fetchConnections();
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "Failed to remove connection. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { connections, fetchConnections, removeConnection };
};