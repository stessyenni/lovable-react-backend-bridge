
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bot } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Message, User } from "./types";
import { UserAvatarPlaceholder } from "@/assets";

interface MessagesListProps {
  messages: Message[];
  currentUserId: string;
  onSelectChat: (userId: string) => void;
  selectedChat: string | null;
}

const MessagesList = ({ messages, currentUserId, onSelectChat, selectedChat }: MessagesListProps) => {
  const HEMBOT_ID = '99999999-9999-9999-9999-999999999999';
  
  // Group messages by conversation (sender/recipient pairs)
  const conversations = messages.reduce((acc, message) => {
    const otherUserId = message.sender_id === currentUserId ? message.recipient_id : message.sender_id;
    
    if (!acc[otherUserId] || new Date(message.created_at) > new Date(acc[otherUserId].created_at)) {
      acc[otherUserId] = message;
    }
    
    return acc;
  }, {} as Record<string, Message>);

  // Always show HemBot, but at the bottom of the list
  const hemBotExists = conversations[HEMBOT_ID];
  if (!hemBotExists) {
    conversations[HEMBOT_ID] = {
      id: 'hembot-placeholder',
      sender_id: HEMBOT_ID,
      recipient_id: currentUserId,
      content: 'Start a conversation with HemBot',
      created_at: new Date('2020-01-01').toISOString(), // Old date to keep it at bottom
      read_at: null,
      sender: {
        id: HEMBOT_ID,
        first_name: 'Hem',
        last_name: 'Bot',
        username: 'hembot',
        email: null
      }
    } as Message;
  }

  const conversationList = Object.values(conversations).sort((a, b) => {
    // Put HemBot at the bottom
    const aIsBot = a.sender_id === HEMBOT_ID || a.recipient_id === HEMBOT_ID;
    const bIsBot = b.sender_id === HEMBOT_ID || b.recipient_id === HEMBOT_ID;
    
    if (aIsBot && !bIsBot) return 1;
    if (!aIsBot && bIsBot) return -1;
    if (aIsBot && bIsBot) return 0; // Both are bot messages, keep order
    
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const getDisplayName = (message: Message) => {
    const otherUserId = message.sender_id === currentUserId ? message.recipient_id : message.sender_id;
    
    if (otherUserId === HEMBOT_ID) {
      return 'HemBot';
    }
    
    const otherUser = message.sender_id === currentUserId ? null : message.sender;
    if (!otherUser) return 'Unknown User';
    
    if (otherUser.first_name && otherUser.last_name) {
      return `${otherUser.first_name} ${otherUser.last_name}`;
    }
    if (otherUser.username) return otherUser.username;
    return otherUser.email || 'Unknown User';
  };

  const getInitials = (message: Message) => {
    const otherUserId = message.sender_id === currentUserId ? message.recipient_id : message.sender_id;
    
    if (otherUserId === HEMBOT_ID) {
      return 'HB';
    }
    
    const name = getDisplayName(message);
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const isHemBot = (message: Message) => {
    const otherUserId = message.sender_id === currentUserId ? message.recipient_id : message.sender_id;
    return otherUserId === HEMBOT_ID;
  };

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
          const isBot = isHemBot(message);
          
          return (
            <div
              key={otherUserId}
              onClick={() => onSelectChat(otherUserId)}
              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                isSelected ? 'bg-primary/10' : 'hover:bg-muted'
              }`}
            >
              <Avatar>
                {isBot ? (
                  <div className="w-full h-full bg-blue-100 flex items-center justify-center rounded-full">
                    <Bot className="w-6 h-6 text-blue-600" />
                  </div>
                ) : (
                  <>
                    <AvatarImage src={UserAvatarPlaceholder} alt="User Avatar" />
                    <AvatarFallback>{getInitials(message)}</AvatarFallback>
                  </>
                )}
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-medium truncate ${isBot ? 'text-blue-600' : ''}`}>
                    {getDisplayName(message)}
                    {isBot && <span className="ml-1 text-xs text-blue-500">(AI Assistant)</span>}
                  </p>
                  {message.id !== 'hembot-placeholder' && (
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground truncate">
                    {message.id === 'hembot-placeholder' 
                      ? 'Click to start chatting with HemBot' 
                      : `${message.sender_id === currentUserId ? 'You: ' : ''}${message.content}`
                    }
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
