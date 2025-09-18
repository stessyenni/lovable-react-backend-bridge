
import { BarChart3, MessageCircle, Activity, MapPin, User, Watch, HelpCircle, Users } from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useMainAppState } from "@/hooks/useMainAppState";
import AppHeader from "./layout/AppHeader";
import AppSidebar from "./layout/AppSidebar";
import MainContent from "./layout/MainContent";
import WelcomePage from "./WelcomePage";
import DemoDataCreator from "./DemoDataCreator";

interface MenuItem {
  id: 'dashboard' | 'messages' | 'health-monitoring' | 'facilities' | 'connections' | 'account' | 'faq' | 'smartwatch';
  label: string;
  icon: React.FC<any>;
}

const MainApp = () => {
  const {
    activeSection,
    setActiveSection,
    isOnline,
    speechEnabled,
    brailleMode,
    showWelcome,
    handleSignOut,
    handleOnlineToggle,
    handleBrailleToggle,
    handleSpeechToggle,
    handleWelcomeComplete,
  } = useMainAppState();

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'health-monitoring', label: 'Health Monitoring', icon: Activity },
    { id: 'facilities', label: 'Facilities', icon: MapPin },
    { id: 'connections', label: 'Connections', icon: Users },
    { id: 'smartwatch', label: 'SmartWatch', icon: Watch },
    { id: 'account', label: 'User Account', icon: User },
    { id: 'faq', label: 'FAQ & Help', icon: HelpCircle },
  ];

  // Show welcome page first for new users
  if (showWelcome) {
    return <WelcomePage onGetStarted={handleWelcomeComplete} />;
  }

  return (
    <>
      <DemoDataCreator />
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar
            menuItems={menuItems}
            activeSection={activeSection}
            brailleMode={brailleMode}
            onSectionChange={setActiveSection}
            onBrailleToggle={handleBrailleToggle}
          />

          <SidebarInset>
            <AppHeader
              activeSection={activeSection}
              setActiveComponent={(component: string) => {
                // Map string to proper section type
                const sectionMap: { [key: string]: MenuItem['id'] } = {
                  'dashboard': 'dashboard',
                  'diet-monitoring': 'health-monitoring',
                  'health-monitoring': 'health-monitoring',
                  'goals': 'health-monitoring',
                  'emergency': 'dashboard',
                  'messages': 'messages',
                  'account': 'account',
                  'facilities': 'facilities'
                };
                const section = sectionMap[component];
                if (section) {
                  setActiveSection(section);
                }
              }}
              menuItems={menuItems}
              isOnline={isOnline}
              speechEnabled={speechEnabled}
              brailleMode={brailleMode}
              onSignOut={handleSignOut}
              onOnlineToggle={handleOnlineToggle}
              onSpeechToggle={handleSpeechToggle}
            />

            <MainContent
              activeSection={activeSection}
              brailleMode={brailleMode}
              onSectionChange={setActiveSection}
            />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </>
  );
};

export default MainApp;
