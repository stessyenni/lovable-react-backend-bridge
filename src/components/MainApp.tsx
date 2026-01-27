
import { BarChart3, MessageCircle, Activity, MapPin, User, Watch, HelpCircle, Users, Globe, AlertTriangle } from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useMainAppState } from "@/hooks/useMainAppState";
import AppHeader from "./layout/AppHeader";
import AppSidebar from "./layout/AppSidebar";
import MainContent from "./layout/MainContent";
import WelcomePage from "./WelcomePage";
import DemoDataCreator from "./DemoDataCreator";
import FloatingHemBot from "./FloatingHemBot";
import { useTranslation } from 'react-i18next';

interface MenuItem {
  id: 'home' | 'dashboard' | 'messages' | 'health-monitoring' | 'facilities' | 'connections' | 'account' | 'faq' | 'smartwatch' | 'community' | 'emergency';
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
    handleGetStarted,
  } = useMainAppState();
  const { t } = useTranslation();

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: t('menu.dashboard'), icon: BarChart3 },
    { id: 'messages', label: t('menu.messages'), icon: MessageCircle },
    { id: 'health-monitoring', label: t('menu.healthMonitoring'), icon: Activity },
    { id: 'facilities', label: t('menu.facilities'), icon: MapPin },
    { id: 'connections', label: t('menu.connections'), icon: Users },
    { id: 'community', label: t('menu.community'), icon: Globe },
    { id: 'emergency', label: t('menu.emergency'), icon: AlertTriangle },
    { id: 'smartwatch', label: t('menu.smartwatch'), icon: Watch },
    { id: 'account', label: t('menu.account'), icon: User },
    { id: 'faq', label: t('menu.faq'), icon: HelpCircle },
  ];

  // Show welcome page first for new users
  if (showWelcome) {
    return (
      <WelcomePage 
        onGetStarted={handleGetStarted}
        speechEnabled={speechEnabled}
        brailleMode={brailleMode}
        onSpeechToggle={handleSpeechToggle}
        onBrailleToggle={handleBrailleToggle}
      />
    );
  }

  return (
    <>
      <DemoDataCreator />
      <FloatingHemBot />
      <SidebarProvider defaultOpen={true}>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar
            menuItems={menuItems}
            activeSection={activeSection}
            brailleMode={brailleMode}
            onSectionChange={setActiveSection}
            onBrailleToggle={handleBrailleToggle}
          />

          <SidebarInset className="flex-1 w-full">
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
                  'facilities': 'facilities',
                  'community': 'community'
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
              speechEnabled={speechEnabled}
              onSpeechToggle={handleSpeechToggle}
              onBrailleToggle={handleBrailleToggle}
              onSectionChange={setActiveSection}
            />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </>
  );
};

export default MainApp;
