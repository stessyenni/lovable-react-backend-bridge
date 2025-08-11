
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Bot } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Message, User } from "./types";
import { UserAvatarPlaceholder } from "@/assets";

interface ChatWindowProps {
  recipientId: string;
  messages: Message[];
  onSendMessage: (recipientId: string, content: string) => void;
}

const ChatWindow = ({ recipientId, messages, onSendMessage }: ChatWindowProps) => {
  const [newMessage, setNewMessage] = useState('');
  const HEMBOT_ID = '99999999-9999-9999-9999-999999999999';

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(recipientId, newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const sortedMessages = messages.sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

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

  const isHemBot = recipientId === HEMBOT_ID;
  
  // Get recipient info from the first message or create HemBot info
  let recipientInfo;
  if (isHemBot) {
    recipientInfo = {
      id: HEMBOT_ID,
      first_name: 'Hem',
      last_name: 'Bot',
      username: 'hembot',
      email: null
    };
  } else {
    recipientInfo = sortedMessages.find(m => m.sender_id === recipientId)?.sender;
  }

  return (
    <Card className="h-96 flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3">
          <Avatar>
            {isHemBot ? (
              <div className="w-full h-full bg-blue-100 flex items-center justify-center rounded-full">
                <Bot className="w-6 h-6 text-blue-600" />
              </div>
            ) : (
              <>
                <AvatarImage src={UserAvatarPlaceholder} alt="Recipient Avatar" />
                <AvatarFallback>{getInitials(recipientInfo)}</AvatarFallback>
              </>
            )}
          </Avatar>
          <div>
            <span className={isHemBot ? 'text-blue-600' : ''}>
              {isHemBot ? 'HemBot' : getDisplayName(recipientInfo)}
            </span>
            {isHemBot && <span className="text-xs text-blue-500 block">AI Health Assistant</span>}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-64">
          {sortedMessages.length === 0 && isHemBot && (
            <div className="flex justify-start">
              <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-blue-50 border border-blue-200">
                <p className="text-sm text-blue-800">
                  Hello! I'm HemBot, your AI health assistant. How can I help you today?
                </p>
              </div>
            </div>
          )}
          {sortedMessages.map((message) => {
            const isOwnMessage = message.sender_id !== recipientId;
            const isFromBot = message.sender_id === HEMBOT_ID;
            
            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isOwnMessage
                      ? 'bg-primary text-primary-foreground'
                      : isFromBot
                      ? 'bg-blue-50 border border-blue-200 text-blue-800'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    isOwnMessage 
                      ? 'text-primary-foreground/70' 
                      : isFromBot 
                      ? 'text-blue-600/70'
                      : 'text-muted-foreground'
                  }`}>
                    {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isHemBot ? "Ask HemBot about your health..." : "Type your message..."}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="sm">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatWindow;
