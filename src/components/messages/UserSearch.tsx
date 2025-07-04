
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Search, UserPlus } from "lucide-react";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  email: string | null;
}

const UserSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: searchResults = [], isLoading } = useQuery({
    queryKey: ["user-search", searchTerm],
    queryFn: async () => {
      if (!searchTerm.trim() || searchTerm.length < 2) return [];
      
      const { data, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, username, email")
        .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
        .neq('id', user?.id)
        .limit(10);

      if (error) {
        console.error("Error searching users:", error);
        throw error;
      }
      
      return data as Profile[];
    },
    enabled: !!searchTerm && searchTerm.length >= 2,
  });

  const sendConnectionRequest = async (targetUserId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("user_connections")
        .upsert([
          {
            follower_id: user.id,
            following_id: targetUserId,
            status: "pending"
          }
        ]);

      if (error) throw error;

      toast({
        title: "Connection Request Sent",
        description: "Your connection request has been sent successfully.",
      });
    } catch (error) {
      console.error("Error sending connection request:", error);
      toast({
        title: "Error",
        description: "Failed to send connection request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getDisplayName = (profile: Profile) => {
    if (profile.first_name && profile.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    if (profile.username) {
      return profile.username;
    }
    if (profile.first_name) {
      return profile.first_name;
    }
    return profile.email || "Unknown User";
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search users by name, username, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading && searchTerm.length >= 2 && (
        <div className="text-center py-4">
          <p className="text-muted-foreground">Searching users...</p>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium text-sm">Search Results:</h3>
          {searchResults.map((profile) => (
            <Card key={profile.id}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{getDisplayName(profile)}</p>
                    {profile.username && (
                      <p className="text-xs text-muted-foreground">@{profile.username}</p>
                    )}
                    <p className="text-xs text-muted-foreground">{profile.email}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => sendConnectionRequest(profile.id)}
                    className="text-xs"
                  >
                    <UserPlus className="h-3 w-3 mr-1" />
                    Connect
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {searchTerm.length >= 2 && !isLoading && searchResults.length === 0 && (
        <div className="text-center py-4">
          <p className="text-muted-foreground">No users found matching your search.</p>
        </div>
      )}

      {searchTerm.length > 0 && searchTerm.length < 2 && (
        <div className="text-center py-4">
          <p className="text-muted-foreground text-xs">Type at least 2 characters to search</p>
        </div>
      )}
    </div>
  );
};

export default UserSearch;
