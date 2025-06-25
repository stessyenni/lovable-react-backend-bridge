
import { BarChart3, Stethoscope, Apple, Target, MapPin, User, Settings, MessageCircle } from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useMainAppState } from "@/hooks/useMainAppState";
import AppHeader from "./layout/AppHeader";
import AppSidebar from "./layout/AppSidebar";
import MainContent from "./layout/MainContent";

interface MenuItem {
  id: 'dashboard' | 'consultation' | 'diet' | 'goals' | 'facilities' | 'messages' | 'account' | 'settings';
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
    { id: 'consultation', label: 'AI Consultation', icon: Stethoscope },
    { id: 'diet', label: 'Diet Monitoring', icon: Apple },
    { id: 'goals', label: 'Health Goals', icon: Target },
    { id: 'facilities', label: 'Health Facilities', icon: MapPin },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'account', label: 'User Account', icon: User },
    { id: 'settings', label: 'App Settings', icon: Settings },
  ];

  return (
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
    </SidebarProvider>
  );
};

export default MainApp;
