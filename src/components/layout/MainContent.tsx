
import Dashboard from "@/components/Dashboard";
import AIConsultation from "@/components/AIConsultation";
import DietMonitoring from "@/components/DietMonitoring";
import HealthGoals from "@/components/HealthGoals";
import HealthFacilities from "@/components/HealthFacilities";
import Messages from "@/components/Messages";
import UserAccount from "@/components/UserAccount";
import AppSettings from "@/components/AppSettings";
import SmartWatchSync from "@/components/SmartWatchSync";
import TrendsPage from "@/components/TrendsPage";
import EmergencyPage from "@/components/EmergencyPage";

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
        return <AIConsultation />;
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
      default:
        return <Dashboard />;
    }
  };

  return (
    <main 
      className={`flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto ${
        brailleMode ? 'font-mono text-lg' : ''
      } max-w-full`}
      style={{ maxHeight: 'calc(100vh - 80px)' }}
    >
      <div className="max-w-7xl mx-auto w-full">
        {renderContent()}
      </div>
    </main>
  );
};

export default MainContent;
