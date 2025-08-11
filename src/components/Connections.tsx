import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserPlus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useConnections } from "./messages/hooks/useConnections";
import ConnectionsList from "./messages/ConnectionsList";
import UserSearch from "./messages/UserSearch";
import LoadingState from "./messages/components/LoadingState";

interface ConnectionsProps {
  onMessageUser?: (userId: string) => void;
}

const Connections = ({ onMessageUser }: ConnectionsProps) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("connections");
  
  const { connections, fetchConnections } = useConnections(user?.id);

  useEffect(() => {
    if (user) {
      fetchConnections();
    }
  }, [user, fetchConnections]);

  const handleMessageUser = (userId: string) => {
    onMessageUser?.(userId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Connections</h2>
        <p className="text-muted-foreground">Manage your connections and discover new people</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="connections" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            My Connections
          </TabsTrigger>
          <TabsTrigger value="discover" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Discover People
          </TabsTrigger>
        </TabsList>

        <TabsContent value="connections" className="space-y-4">
          <ConnectionsList 
            connections={connections}
            currentUserId={user?.id || ''}
            onRefresh={fetchConnections}
            onMessageUser={handleMessageUser}
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

export default Connections;