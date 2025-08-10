
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, UserPlus, Users, Sparkles, Clock } from "lucide-react";
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
  const [recommendedUsers, setRecommendedUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [recommendationLoading, setRecommendationLoading] = useState(false);

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

  // Load recommended users on mount
  useEffect(() => {
    loadRecommendedUsers();
  }, [currentUserId, connections]);

  const loadRecommendedUsers = async () => {
    setRecommendationLoading(true);
    try {
      // Get users who are not already connected
      const connectedUserIds = connections.map(conn => 
        conn.follower_id === currentUserId ? conn.following_id : conn.follower_id
      );
      
      let query = supabase
        .from('profiles')
        .select('id, first_name, last_name, username, profile_image_url, created_at')
        .neq('id', currentUserId);

      // Only apply the exclusion filter if there are connected users
      if (connectedUserIds.length > 0) {
        query = query.not('id', 'in', `(${connectedUserIds.join(',')})`);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) throw error;

      setRecommendedUsers(data || []);
    } catch (error) {
      console.error('Error loading recommended users:', error);
    } finally {
      setRecommendationLoading(false);
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

  const renderUserCard = (user: Profile, showNew = false) => {
    const connectionStatus = getConnectionStatus(user.id);
    
    return (
      <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user.profile_image_url || undefined} />
            <AvatarFallback>
              {(user.first_name?.[0] || user.username?.[0] || 'U').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">
                {user.first_name || user.last_name 
                  ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                  : user.username || 'Anonymous User'}
              </p>
              {showNew && (
                <Badge variant="secondary" className="text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  New
                </Badge>
              )}
            </div>
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
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Discover Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="recommended" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="recommended" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Recommended
              </TabsTrigger>
              <TabsTrigger value="search" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Search
              </TabsTrigger>
            </TabsList>

            <TabsContent value="recommended" className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Suggested users based on recent activity</span>
              </div>
              
              <div className="space-y-3">
                {recommendationLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : recommendedUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No recommendations available</p>
                    <p className="text-sm text-muted-foreground mt-1">Try searching for users manually</p>
                  </div>
                ) : (
                  recommendedUsers.map((user) => renderUserCard(user, true))
                )}
              </div>
            </TabsContent>

            <TabsContent value="search" className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Search by name or username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
              </div>

              <div className="space-y-3">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : searchResults.length === 0 && searchTerm ? (
                  <div className="text-center py-8">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No users found for "{searchTerm}"</p>
                    <p className="text-sm text-muted-foreground mt-1">Try a different search term</p>
                  </div>
                ) : searchTerm ? (
                  searchResults.map((user) => renderUserCard(user))
                ) : (
                  <div className="text-center py-8">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Start typing to search for users</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSearch;
