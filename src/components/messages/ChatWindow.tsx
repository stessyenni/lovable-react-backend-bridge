
import { useState, useEffect } from "react";
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
  markMessagesAsRead?: (recipientId: string) => void;
}

const ChatWindow = ({ recipientId, messages, onSendMessage, markMessagesAsRead }: ChatWindowProps) => {
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (recipientId && markMessagesAsRead) {
      // Mark messages as read when chat window is opened
      markMessagesAsRead(recipientId);
    }
  }, [recipientId, markMessagesAsRead]);

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
    
    // Handle the case where user data comes from messages with different structure
    const userData = user as any;
    if (userData.user_metadata?.first_name && userData.user_metadata?.last_name) {
      return `${userData.user_metadata.first_name} ${userData.user_metadata.last_name}`;
    }
    if (userData.first_name && userData.last_name) {
      return `${userData.first_name} ${userData.last_name}`;
    }
    if (userData.username) return userData.username;
    return userData.email || 'Unknown User';
  };

  const getInitials = (user: User | undefined) => {
    const name = getDisplayName(user);
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Get recipient info from messages  
  const recipientInfo = sortedMessages.find(m => {
    if (m.sender_id === recipientId) return m.sender;
    if (m.recipient_id === recipientId) return m.recipient;
    return null;
  })?.sender_id === recipientId 
    ? sortedMessages.find(m => m.sender_id === recipientId)?.sender
    : sortedMessages.find(m => m.recipient_id === recipientId)?.recipient;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2 sm:pb-3">
        <CardTitle className="flex items-center space-x-3 text-sm sm:text-base">
          <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
            <AvatarImage src={UserAvatarPlaceholder} alt="Recipient Avatar" />
            <AvatarFallback className="text-xs sm:text-sm">{getInitials(recipientInfo)}</AvatarFallback>
          </Avatar>
          <div>
            <span className="font-medium">
              {getDisplayName(recipientInfo)}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-2 sm:p-6">
        <div className="flex-1 overflow-y-auto space-y-2 sm:space-y-4 mb-4">
          {sortedMessages.length === 0 && (
            <div className="flex justify-center items-center h-32">
              <p className="text-sm text-muted-foreground">Start your conversation</p>
            </div>
          )}
          {sortedMessages.map((message) => {
            const isOwnMessage = message.sender_id !== recipientId;
            
            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg text-sm ${
                    isOwnMessage
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    isOwnMessage 
                      ? 'text-primary-foreground/70' 
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
            placeholder="Type your message..."
            className="flex-1 text-sm"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Add speech-to-text functionality
              if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
                const recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.lang = 'en-US';
                
                recognition.onresult = (event: any) => {
                  const transcript = event.results[0][0].transcript;
                  setNewMessage(prev => prev + transcript);
                };
                
                recognition.start();
              }
            }}
          >
            <span className="sr-only">Voice input</span>
            🎤
          </Button>
          <Button onClick={handleSendMessage} size="sm">
            <Send className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatWindow;
