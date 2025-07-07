
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  profile_image_url: string | null;
}

interface Connection {
  id: string;
  follower_id: string;
  following_id: string;
  status: string;
}

interface UserSearchProps {
  currentUserId: string;
  connections: Connection[];
  onConnectionUpdate: () => Promise<void>;
}

const UserSearch = ({ currentUserId, connections, onConnectionUpdate }: UserSearchProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);

  const searchUsers = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, username, profile_image_url')
        .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`)
        .neq('id', currentUserId)
        .limit(10);

      if (error) throw error;

      console.log('Search results:', data);
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching users:', error);
      toast({
        title: "Error",
        description: "Failed to search users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(searchUsers, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const sendConnectionRequest = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_connections')
        .insert({
          follower_id: currentUserId,
          following_id: userId,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Connection request sent!",
      });

      await onConnectionUpdate();
    } catch (error) {
      console.error('Error sending connection request:', error);
      toast({
        title: "Error",
        description: "Failed to send connection request",
        variant: "destructive",
      });
    }
  };

  const getConnectionStatus = (userId: string) => {
    return connections.find(
      conn => (conn.follower_id === currentUserId && conn.following_id === userId) ||
              (conn.follower_id === userId && conn.following_id === currentUserId)
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Discover Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Search by name or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>

          <div className="space-y-2">
            {loading ? (
              <p className="text-center text-muted-foreground">Searching...</p>
            ) : searchResults.length === 0 && searchTerm ? (
              <p className="text-center text-muted-foreground">No users found</p>
            ) : (
              searchResults.map((user) => {
                const connectionStatus = getConnectionStatus(user.id);
                
                return (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.profile_image_url || undefined} />
                        <AvatarFallback>
                          {(user.first_name?.[0] || user.username?.[0] || 'U').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {user.first_name || user.last_name 
                            ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                            : user.username || 'Anonymous User'}
                        </p>
                        {user.username && (user.first_name || user.last_name) && (
                          <p className="text-sm text-muted-foreground">@{user.username}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {connectionStatus ? (
                        <Badge variant={connectionStatus.status === 'accepted' ? 'default' : 'secondary'}>
                          {connectionStatus.status === 'accepted' ? (
                            <>
                              <Users className="h-3 w-3 mr-1" />
                              Connected
                            </>
                          ) : connectionStatus.status === 'pending' ? (
                            'Pending'
                          ) : (
                            connectionStatus.status
                          )}
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => sendConnectionRequest(user.id)}
                        >
                          <UserPlus className="h-4 w-4 mr-1" />
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSearch;
