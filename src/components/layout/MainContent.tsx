
import Dashboard from "../Dashboard";
import AIConsultation from "../AIConsultation";
import DietMonitoring from "../DietMonitoring";
import HealthGoals from "../HealthGoals";
import HealthFacilities from "../HealthFacilities";
import UserAccount from "../UserAccount";
import AppSettings from "../AppSettings";

interface MenuItem {
  id: 'dashboard' | 'consultation' | 'diet' | 'goals' | 'facilities' | 'account' | 'settings';
  label: string;
  icon: React.FC<any>;
}

interface MainContentProps {
  activeSection: MenuItem['id'];
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
      case 'account':
        return <UserAccount />;
      case 'settings':
        return <AppSettings />;
      default:
        return <div>Section not implemented yet.</div>;
    }
  };

  return (
    <main className="flex-1 overflow-y-auto">
      <div className={`p-6 ${brailleMode ? "text-lg" : ""}`}>
        {renderContent()}
      </div>
    </main>
  );
};

export default MainContent;
