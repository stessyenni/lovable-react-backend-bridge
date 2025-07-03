
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Clock, Check, Users } from "lucide-react";
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
  const [showAllUsers, setShowAllUsers] = useState(false);
  const { toast } = useToast();

  const searchUsers = async () => {
    if (!searchQuery.trim() && !showAllUsers) return;

    setSearching(true);
    try {
      let query = supabase
        .from('profiles')
        .select('id, first_name, last_name, username, email')
        .neq('id', currentUserId);

      if (searchQuery.trim()) {
        query = query.or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,username.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query.limit(20);

      if (error) {
        console.error('Error searching users:', error);
        toast({
          title: "Search Error",
          description: "Failed to search users. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setSearchResults(data || []);
      
      if (data && data.length === 0) {
        toast({
          title: "No Users Found",
          description: searchQuery ? "No users match your search criteria." : "No other users found in the system.",
        });
      }
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

  const loadAllUsers = () => {
    setShowAllUsers(true);
    setSearchQuery('');
    searchUsers();
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
          title: "Connection Error",
          description: "Failed to send connection request. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Connection Request Sent",
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
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Discover Users
        </CardTitle>
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

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={loadAllUsers}
            disabled={searching}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Show All Users
          </Button>
        </div>

        {searching && (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Searching for users...</p>
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="space-y-3 max-h-96 overflow-y-auto">
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

        {!searching && searchResults.length === 0 && (searchQuery || showAllUsers) && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {searchQuery 
                ? "No users found matching your search. Try a different search term."
                : "No other users found in the system yet."
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserSearch;
