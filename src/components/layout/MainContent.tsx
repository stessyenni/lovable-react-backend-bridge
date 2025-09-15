
import { ReactNode } from "react";
import SpeechInterface from "@/components/enhanced/SpeechInterface";
import VoiceCommandsSidebar from "@/components/VoiceCommandsSidebar";
import { Button } from "@/components/ui/button";
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
  speechEnabled: boolean;
  onSpeechToggle: () => void;
  onBrailleToggle: () => void;
  onSectionChange?: (section: 'home' | 'dashboard' | 'messages' | 'health-monitoring' | 'facilities' | 'connections' | 'account' | 'faq' | 'smartwatch') => void;
}

const MainContent = ({ activeSection, brailleMode, speechEnabled, onSpeechToggle, onBrailleToggle, onSectionChange }: MainContentProps) => {
  const [selectedMessageUser, setSelectedMessageUser] = useState<string | null>(null);

  const handleMessageUser = (userId: string) => {
    setSelectedMessageUser(userId);
    onSectionChange?.('messages');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard onGoHome={() => onSectionChange?.('home')} />;
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
    <div className="flex flex-col min-h-screen">
      {/* Top Assistive Features */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 py-2">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <SpeechInterface 
                enableTextToSpeech={speechEnabled}
                onNavigate={onSectionChange}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={brailleMode ? "default" : "outline"}
                size="sm"
                onClick={onBrailleToggle}
                className="text-xs"
              >
                ⠃⠗⠇ {brailleMode ? "ON" : "OFF"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Commands Sidebar */}
      <VoiceCommandsSidebar 
        onNavigate={onSectionChange}
        speechEnabled={speechEnabled}
        onSpeechToggle={onSpeechToggle}
      />

      <main 
        className={`flex-1 p-3 sm:p-4 lg:p-6 xl:p-8 overflow-y-auto ${
          brailleMode ? 'font-mono text-base sm:text-lg' : ''
        } w-full min-w-0`}
        style={{ maxHeight: 'calc(100vh - 120px)' }}
      >
        <div className="max-w-7xl mx-auto w-full min-w-0">
          {renderContent()}
        </div>
      </main>

      {/* Bottom Assistive Features - Minimal Footer */}
      <div className="bg-background border-t mt-auto">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-center">
            <p className="text-xs text-muted-foreground">
              Voice assistance available - Use the Voice button in the top right
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
