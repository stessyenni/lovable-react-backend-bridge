
import Dashboard from "@/components/Dashboard";
import HemBot from "@/components/HemBot";
import DietMonitoring from "@/components/DietMonitoring";
import HealthGoals from "@/components/HealthGoals";
import HealthFacilities from "@/components/HealthFacilities";
import Messages from "@/components/Messages";
import UserAccount from "@/components/UserAccount";
import AppSettings from "@/components/AppSettings";
import SmartWatchSync from "@/components/SmartWatchSync";
import TrendsPage from "@/components/TrendsPage";
import EmergencyPage from "@/components/EmergencyPage";
import FAQPage from "@/components/enhanced/FAQPage";

interface MainContentProps {
  activeSection: string;
  brailleMode: boolean;
}

const MainContent = ({ activeSection, brailleMode }: MainContentProps) => {
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'consultation':
        return <HemBot />;
      case 'diet':
        return <DietMonitoring />;
      case 'goals':
        return <HealthGoals />;
      case 'facilities':
        return <HealthFacilities />;
      case 'messages':
        return <Messages />;
      case 'account':
        return <UserAccount />;
      case 'settings':
        return <AppSettings />;
      case 'smartwatch':
        return <SmartWatchSync />;
      case 'analytics':
        return <TrendsPage />;
      case 'emergency':
        return <EmergencyPage />;
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
