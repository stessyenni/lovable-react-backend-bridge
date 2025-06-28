
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserMinus, MessageCircle } from "lucide-react";
import { Connection, User } from "./types";

interface ConnectionsListProps {
  connections: Connection[];
  currentUserId: string;
  onRefresh: () => void;
}

const ConnectionsList = ({ connections, currentUserId, onRefresh }: ConnectionsListProps) => {
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
        <CardHeader>
          <CardTitle>Your Connections</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No connections yet. Start by discovering and connecting with other users!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Connections</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {connections.map((connection) => {
            const otherUser = connection.follower_id === currentUserId 
              ? connection.following 
              : connection.follower;
            
            return (
              <div key={connection.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" alt="User Avatar" />
                    <AvatarFallback>{getInitials(otherUser)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{getDisplayName(otherUser)}</p>
                    <p className="text-sm text-muted-foreground">
                      Connected since {new Date(connection.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">Connected</Badge>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button variant="outline" size="sm">
                    <UserMinus className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
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
