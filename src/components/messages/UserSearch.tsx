
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Clock, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Connection, User } from "./types";

interface UserSearchProps {
  currentUserId: string;
  connections: Connection[];
  onConnectionUpdate: () => void;
}

const UserSearch = ({ currentUserId, connections, onConnectionUpdate }: UserSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);
  const { toast } = useToast();

  const searchUsers = async () => {
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, username, email')
        .or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,username.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
        .neq('id', currentUserId)
        .limit(10);

      if (error) {
        console.error('Error searching users:', error);
        toast({
          title: "Error",
          description: "Failed to search users. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setSearchResults(data || []);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "Failed to search users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSearching(false);
    }
  };

  const sendConnectionRequest = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_connections')
        .insert({
          follower_id: currentUserId,
          following_id: userId,
          status: 'pending'
        });

      if (error) {
        console.error('Error sending connection request:', error);
        toast({
          title: "Error",
          description: "Failed to send connection request. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Connection request sent",
        description: "Your connection request has been sent successfully.",
      });
      
      onConnectionUpdate();
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "Failed to send connection request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getConnectionStatus = (userId: string) => {
    return connections.find(c => 
      (c.follower_id === currentUserId && c.following_id === userId) ||
      (c.following_id === currentUserId && c.follower_id === userId)
    );
  };

  const getDisplayName = (user: User) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user.username) return user.username;
    return user.email || 'Unknown User';
  };

  const getInitials = (user: User) => {
    const name = getDisplayName(user);
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchUsers();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Discover Users</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Search by name, username, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button onClick={searchUsers} disabled={searching}>
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {searchResults.length > 0 && (
          <div className="space-y-3">
            {searchResults.map((user) => {
              const connection = getConnectionStatus(user.id);
              
              return (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" alt="User Avatar" />
                      <AvatarFallback>{getInitials(user)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{getDisplayName(user)}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {connection ? (
                      connection.status === 'accepted' ? (
                        <Badge variant="secondary">
                          <Check className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      )
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => sendConnectionRequest(user.id)}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {searchQuery && searchResults.length === 0 && !searching && (
          <p className="text-muted-foreground text-center py-8">
            No users found matching your search.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default UserSearch;
