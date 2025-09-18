
import { useState } from "react";
import Dashboard from "@/components/Dashboard";
import Messages from "@/components/Messages";
import HealthMonitoring from "@/components/HealthMonitoring";
import Facilities from "@/components/Facilities";
import Connections from "@/components/Connections";
import UserAccount from "@/components/UserAccount";
import SmartWatchSync from "@/components/SmartWatchSync";
import FAQPage from "@/components/enhanced/FAQPage";

interface MainContentProps {
  activeSection: string;
  brailleMode: boolean;
  onSectionChange?: (section: 'dashboard' | 'messages' | 'health-monitoring' | 'facilities' | 'connections' | 'account' | 'faq' | 'smartwatch') => void;
}

const MainContent = ({ activeSection, brailleMode, onSectionChange }: MainContentProps) => {
  const [selectedMessageUser, setSelectedMessageUser] = useState<string | null>(null);

  const handleMessageUser = (userId: string) => {
    setSelectedMessageUser(userId);
    onSectionChange?.('messages');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'messages':
        return <Messages selectedUserId={selectedMessageUser} />;
      case 'health-monitoring':
        return <HealthMonitoring />;
      case 'facilities':
        return <Facilities />;
      case 'connections':
        return <Connections onSectionChange={onSectionChange} onMessageUser={handleMessageUser} />;
      case 'account':
        return <UserAccount />;
      case 'smartwatch':
        return <SmartWatchSync />;
      case 'faq':
        return <FAQPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <main 
      className={`flex-1 p-3 sm:p-4 lg:p-6 xl:p-8 overflow-y-auto ${
        brailleMode ? 'font-mono text-base sm:text-lg' : ''
      } w-full min-w-0`}
      style={{ maxHeight: 'calc(100vh - 60px)' }}
    >
      <div className="max-w-7xl mx-auto w-full min-w-0">
        {renderContent()}
      </div>
    </main>
  );
};

export default MainContent;
