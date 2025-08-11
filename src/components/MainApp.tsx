
import { BarChart3, MessageCircle, Activity, MapPin, User, Watch, HelpCircle, Users } from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useMainAppState } from "@/hooks/useMainAppState";
import AppHeader from "./layout/AppHeader";
import AppSidebar from "./layout/AppSidebar";
import MainContent from "./layout/MainContent";
import FloatingHemBot from "./FloatingHemBot";
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
    handleSignOut,
    handleOnlineToggle,
    handleBrailleToggle,
    handleSpeechToggle,
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
            />
          </SidebarInset>
        </div>
        
        {/* Floating HemBot */}
        <FloatingHemBot />
      </SidebarProvider>
    </>
  );
};

export default MainApp;
