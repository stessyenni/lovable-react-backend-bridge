import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserPlus, MessageCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useConnections } from "./messages/hooks/useConnections";
import ConnectionsList from "./messages/ConnectionsList";
import UserSearch from "./messages/UserSearch";
import LoadingState from "./messages/components/LoadingState";
import { useToast } from "@/hooks/use-toast";

interface ConnectionsProps {
  onMessageUser?: (userId: string) => void;
  onSectionChange?: (section: string) => void;
}

const Connections = ({ onMessageUser, onSectionChange }: ConnectionsProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("connections");
  
  const { connections, fetchConnections } = useConnections(user?.id);

  useEffect(() => {
    if (user) {
      fetchConnections();
    }
  }, [user, fetchConnections]);

  const handleMessageUser = (userId: string) => {
    // Switch to messages section and select the user
    onSectionChange?.('messages');
    onMessageUser?.(userId);
    
    toast({
      title: "Opening chat",
      description: "Switching to messages...",
    });
  };

  return (
    <div className="space-y-4 lg:space-y-6 p-2 sm:p-4 lg:p-6">
      <div className="space-y-2">
        <h2 className="text-xl lg:text-2xl font-bold">{t('connections.title')}</h2>
        <p className="text-sm lg:text-base text-muted-foreground">
          {t('connections.subtitle')}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-auto">
          <TabsTrigger value="connections" className="flex items-center gap-2 text-xs lg:text-sm p-2 lg:p-3">
            <Users className="h-3 w-3 lg:h-4 lg:w-4" />
            <span className="hidden sm:inline">My Connections</span>
            <span className="sm:hidden">Connected</span>
          </TabsTrigger>
          <TabsTrigger value="discover" className="flex items-center gap-2 text-xs lg:text-sm p-2 lg:p-3">
            <UserPlus className="h-3 w-3 lg:h-4 lg:w-4" />
            <span className="hidden sm:inline">Discover People</span>
            <span className="sm:hidden">Discover</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="connections" className="space-y-4 mt-4">
          <div className="space-y-2">
            <h3 className="text-sm lg:text-base font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              My Connections ({connections.length})
            </h3>
            <p className="text-xs lg:text-sm text-muted-foreground">
              People you're connected with. Click the message button to start a conversation.
            </p>
          </div>
          <ConnectionsList 
            connections={connections}
            currentUserId={user?.id || ''}
            onRefresh={fetchConnections}
            onMessageUser={handleMessageUser}
          />
        </TabsContent>

        <TabsContent value="discover" className="space-y-4 mt-4">
          <div className="space-y-2">
            <h3 className="text-sm lg:text-base font-medium flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Discover New People
            </h3>
            <p className="text-xs lg:text-sm text-muted-foreground">
              Find and connect with other Hemapp users in your health journey.
            </p>
          </div>
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