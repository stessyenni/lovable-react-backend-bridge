
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Users, UserPlus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useConnections } from "./messages/hooks/useConnections";
import { useMessages } from "./messages/hooks/useMessages";
import ConnectionsList from "./messages/ConnectionsList";
import UserSearch from "./messages/UserSearch";
import MessagesTab from "./messages/components/MessagesTab";
import LoadingState from "./messages/components/LoadingState";

const Messages = () => {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  
  const { connections, fetchConnections } = useConnections(user?.id);
  const { messages, loading, fetchMessages, sendMessage } = useMessages(user?.id);

  useEffect(() => {
    if (user) {
      fetchConnections();
      fetchMessages();
    }
  }, [user, fetchConnections, fetchMessages]);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Messages</h2>
        <p className="text-muted-foreground">Connect with other users and stay in touch</p>
      </div>

      <Tabs defaultValue="messages" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="connections" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Connections
          </TabsTrigger>
          <TabsTrigger value="discover" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Discover
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-4">
          <MessagesTab
            messages={messages}
            currentUserId={user?.id || ''}
            selectedChat={selectedChat}
            onSelectChat={setSelectedChat}
            onSendMessage={sendMessage}
          />
        </TabsContent>

        <TabsContent value="connections" className="space-y-4">
          <ConnectionsList 
            connections={connections}
            currentUserId={user?.id || ''}
            onRefresh={fetchConnections}
          />
        </TabsContent>

        <TabsContent value="discover" className="space-y-4">
          <UserSearch 
            currentUserId={user?.id || ''}
            connections={connections}
            onConnectionUpdate={fetchConnections}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Messages;
