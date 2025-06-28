
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Connection } from "../types";

export const useConnections = (userId: string | undefined) => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const { toast } = useToast();

  const fetchConnections = useCallback(async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('user_connections')
        .select(`
          *,
          follower:profiles!user_connections_follower_id_fkey(id, first_name, last_name, username, email),
          following:profiles!user_connections_following_id_fkey(id, first_name, last_name, username, email)
        `)
        .or(`follower_id.eq.${userId},following_id.eq.${userId}`)
        .eq('status', 'accepted');

      if (error) {
        console.error('Error fetching connections:', error);
        return;
      }

      setConnections(data || []);
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
