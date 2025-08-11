
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserPlus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useConnections } from "./messages/hooks/useConnections";
import { useMessages } from "./messages/hooks/useMessages";
import ConnectionsList from "./messages/ConnectionsList";
import UserSearch from "./messages/UserSearch";
import MessagesList from "./messages/MessagesList";
import ChatWindow from "./messages/ChatWindow";
import LoadingState from "./messages/components/LoadingState";

const Messages = () => {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [showConnections, setShowConnections] = useState(false);
  
  const { connections, fetchConnections } = useConnections(user?.id);
  const { messages, loading, fetchMessages, sendMessage } = useMessages(user?.id);

  useEffect(() => {
    if (user) {
      fetchConnections();
      fetchMessages();
    }
  }, [user, fetchConnections, fetchMessages]);

  const handleMessageUser = (userId: string) => {
    setSelectedChat(userId);
    setShowConnections(false);
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="flex h-full">
      {/* Mini Sidebar */}
      <div className="w-80 border-r bg-card">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Messages</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConnections(!showConnections)}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Connections
            </Button>
          </div>
        </div>
        
        {showConnections ? (
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConnections(false)}
                className="w-full justify-start"
              >
                ← Back to Messages
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">My Connections</h4>
                <ConnectionsList 
                  connections={connections}
                  currentUserId={user?.id || ''}
                  onRefresh={fetchConnections}
                  onMessageUser={handleMessageUser}
                />
              </div>
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Discover People
                </h4>
                <UserSearch 
                  currentUserId={user?.id || ''}
                  connections={connections}
                  onConnectionUpdate={fetchConnections}
                />
              </div>
            </div>
          </div>
        ) : (
          <MessagesList 
            messages={messages}
            currentUserId={user?.id || ''}
            onSelectChat={setSelectedChat}
            selectedChat={selectedChat}
          />
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1">
        {selectedChat ? (
          <ChatWindow
            recipientId={selectedChat}
            messages={messages.filter(
              m => (m.sender_id === selectedChat && m.recipient_id === user?.id) ||
                   (m.sender_id === user?.id && m.recipient_id === selectedChat)
            )}
            onSendMessage={sendMessage}
          />
        ) : (
          <Card className="h-full">
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-muted-foreground">Select a conversation to start messaging</div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Messages;
