
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserMinus, MessageCircle } from "lucide-react";
import { Connection, User } from "./types";
import { UserAvatarPlaceholder } from "@/assets";

interface ConnectionsListProps {
  connections: Connection[];
  currentUserId: string;
  onRefresh: () => void;
  onMessageUser: (userId: string) => void;
}

const ConnectionsList = ({ connections, currentUserId, onRefresh, onMessageUser }: ConnectionsListProps) => {
  const getDisplayName = (user: User | undefined) => {
    if (!user) return 'Unknown User';
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user.username) return user.username;
    return user.email || 'Unknown User';
  };

  const getInitials = (user: User | undefined) => {
    const name = getDisplayName(user);
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (connections.length === 0) {
    return (
      <Card>
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Your Connections</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
          <p className="text-muted-foreground text-center py-6 sm:py-8 text-sm sm:text-base">
            No connections yet. Start by discovering and connecting with other users!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="p-3 sm:p-6">
        <CardTitle className="text-base sm:text-lg">Your Connections</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
        <div className="space-y-3 sm:space-y-4">
          {connections.map((connection) => {
            const otherUser = connection.follower_id === currentUserId 
              ? connection.following 
              : connection.follower;
            
            return (
              <div key={connection.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border rounded-lg gap-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                    <AvatarImage src={UserAvatarPlaceholder} alt="User Avatar" />
                    <AvatarFallback className="text-xs sm:text-sm">{getInitials(otherUser)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm sm:text-base truncate">{getDisplayName(otherUser)}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Connected since {new Date(connection.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:space-x-2">
                  <Badge variant="secondary" className="w-fit text-xs">Connected</Badge>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs sm:text-sm w-full sm:w-auto"
                      onClick={() => onMessageUser(otherUser?.id || '')}
                    >
                      <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Message
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs sm:text-sm w-full sm:w-auto">
                      <UserMinus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionsList;
