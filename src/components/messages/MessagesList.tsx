
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface User {
  id: string;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  email: string | null;
}

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  read_at: string | null;
  created_at: string;
  sender?: User;
}

interface MessagesListProps {
  messages: Message[];
  currentUserId: string;
  onSelectChat: (userId: string) => void;
  selectedChat: string | null;
}

const MessagesList = ({ messages, currentUserId, onSelectChat, selectedChat }: MessagesListProps) => {
  // Group messages by conversation (sender/recipient pairs)
  const conversations = messages.reduce((acc, message) => {
    const otherUserId = message.sender_id === currentUserId ? message.recipient_id : message.sender_id;
    
    if (!acc[otherUserId] || new Date(message.created_at) > new Date(acc[otherUserId].created_at)) {
      acc[otherUserId] = message;
    }
    
    return acc;
  }, {} as Record<string, Message>);

  const conversationList = Object.values(conversations).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const getDisplayName = (message: Message) => {
    const otherUser = message.sender_id === currentUserId ? null : message.sender;
    if (!otherUser) return 'Unknown User';
    
    if (otherUser.first_name && otherUser.last_name) {
      return `${otherUser.first_name} ${otherUser.last_name}`;
    }
    if (otherUser.username) return otherUser.username;
    return otherUser.email || 'Unknown User';
  };

  const getInitials = (message: Message) => {
    const name = getDisplayName(message);
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (conversationList.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Conversations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No conversations yet. Start by connecting with other users!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Conversations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {conversationList.map((message) => {
          const otherUserId = message.sender_id === currentUserId ? message.recipient_id : message.sender_id;
          const isSelected = selectedChat === otherUserId;
          const isUnread = !message.read_at && message.sender_id !== currentUserId;
          
          return (
            <div
              key={otherUserId}
              onClick={() => onSelectChat(otherUserId)}
              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                isSelected ? 'bg-primary/10' : 'hover:bg-muted'
              }`}
            >
              <Avatar>
                <AvatarImage src="/placeholder.svg" alt="User Avatar" />
                <AvatarFallback>{getInitials(message)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium truncate">
                    {getDisplayName(message)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground truncate">
                    {message.sender_id === currentUserId ? 'You: ' : ''}{message.content}
                  </p>
                  {isUnread && <Badge variant="default" className="h-2 w-2 p-0 rounded-full" />}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default MessagesList;
