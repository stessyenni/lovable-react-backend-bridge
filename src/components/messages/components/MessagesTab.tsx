
import { MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import MessagesList from "../MessagesList";
import ChatWindow from "../ChatWindow";
import { Message } from "../types";

interface MessagesTabProps {
  messages: Message[];
  currentUserId: string;
  selectedChat: string | null;
  onSelectChat: (userId: string) => void;
  onSendMessage: (recipientId: string, content: string) => void;
}

const MessagesTab = ({ 
  messages, 
  currentUserId, 
  selectedChat, 
  onSelectChat, 
  onSendMessage 
}: MessagesTabProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-1">
        <MessagesList 
          messages={messages}
          currentUserId={currentUserId}
          onSelectChat={onSelectChat}
          selectedChat={selectedChat}
        />
      </div>
      <div className="md:col-span-2">
        {selectedChat ? (
          <ChatWindow
            recipientId={selectedChat}
            messages={messages.filter(
              m => (m.sender_id === selectedChat && m.recipient_id === currentUserId) ||
                   (m.sender_id === currentUserId && m.recipient_id === selectedChat)
            )}
            onSendMessage={onSendMessage}
          />
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center h-96">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Select a conversation to start messaging</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MessagesTab;
