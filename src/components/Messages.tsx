
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserPlus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useConnections } from "./messages/hooks/useConnections";
import { useMessages } from "./messages/hooks/useMessages";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import ConnectionsList from "./messages/ConnectionsList";
import UserSearch from "./messages/UserSearch";
import MessagesList from "./messages/MessagesList";
import ChatWindow from "./messages/ChatWindow";
import LoadingState from "./messages/components/LoadingState";

interface MessagesProps {
  selectedUserId?: string | null;
}

const Messages = ({ selectedUserId }: MessagesProps = {}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState<string | null>(selectedUserId || null);
  const [showConnections, setShowConnections] = useState(false);
  
  const { connections, fetchConnections } = useConnections(user?.id);
  const { messages, loading, fetchMessages, sendMessage, markMessagesAsRead } = useMessages(user?.id, 'messages');
  const { fetchUnreadCount } = useUnreadMessages();

  useEffect(() => {
    if (user) {
      fetchConnections();
      fetchMessages();
    }
  }, [user, fetchConnections, fetchMessages]);

  useEffect(() => {
    if (selectedUserId) {
      setSelectedChat(selectedUserId);
    }
  }, [selectedUserId]);

  const handleMessageUser = (userId: string) => {
    setSelectedChat(userId);
    setShowConnections(false);
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] sm:h-[calc(100vh-4rem)] flex-col sm:flex-row overflow-hidden">
      {/* Messages Sidebar - Mobile responsive */}
      <div className={`${selectedChat ? 'hidden sm:block' : 'block'} w-full sm:w-80 lg:w-96 border-r bg-card flex-shrink-0 flex flex-col overflow-hidden`}>
        <div className="p-3 sm:p-4 lg:p-6 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold">{t('messages.title')}</h3>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto min-h-0">
          <MessagesList 
            messages={messages}
            currentUserId={user?.id || ''}
            onSelectChat={setSelectedChat}
            selectedChat={selectedChat}
          />
        </div>
      </div>

      {/* Main Chat Area - Mobile responsive */}
      <div className={`${selectedChat ? 'block' : 'hidden sm:block'} flex-1 flex flex-col overflow-hidden min-h-0`}>
        {selectedChat ? (
          <div className="h-full flex flex-col">
            {/* Mobile back button */}
            <div className="sm:hidden p-3 border-b">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedChat(null)}
                className="text-xs"
              >
                ← {t('messages.backToMessages')}
              </Button>
            </div>
            <div className="flex-1">
              <ChatWindow
                recipientId={selectedChat}
                messages={messages.filter(
                  m => (m.sender_id === selectedChat && m.recipient_id === user?.id) ||
                       (m.sender_id === user?.id && m.recipient_id === selectedChat)
                )}
                onSendMessage={sendMessage}
                markMessagesAsRead={markMessagesAsRead}
                onMessagesRead={fetchUnreadCount}
              />
            </div>
          </div>
        ) : (
          <Card className="h-full">
            <CardContent className="flex items-center justify-center h-full p-4">
              <div className="text-center space-y-4">
                <div className="text-muted-foreground text-sm sm:text-base">
                  {t('messages.selectConversation')}
                </div>
                <p className="text-xs text-muted-foreground max-w-md">
                  {t('messages.selectConversationDesc')}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Messages;
