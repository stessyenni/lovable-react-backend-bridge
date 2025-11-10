
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SidebarTrigger } from "@/components/ui/sidebar";
import SpeechInterface from "@/components/enhanced/SpeechInterface";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { LogOut, Mic, MicOff, Phone, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AppSettings from "@/components/AppSettings";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useTranslation } from 'react-i18next';

interface MenuItem {
  id: 'home' | 'dashboard' | 'messages' | 'health-monitoring' | 'facilities' | 'connections' | 'account' | 'faq' | 'smartwatch';
  label: string;
  icon: React.FC<any>;
}

interface AppHeaderProps {
  activeSection: MenuItem['id'];
  setActiveComponent?: (component: string) => void;
  menuItems: MenuItem[];
  isOnline: boolean;
  speechEnabled: boolean;
  brailleMode: boolean;
  onSignOut: () => void;
  onOnlineToggle: () => void;
  onSpeechToggle: () => void;
}

const AppHeader = ({
  activeSection,
  setActiveComponent,
  menuItems,
  isOnline,
  speechEnabled,
  brailleMode,
  onSignOut,
  onOnlineToggle,
  onSpeechToggle,
}: AppHeaderProps) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { t } = useTranslation();
  return (
    <header className="border-b bg-card px-3 sm:px-4 py-3 sticky top-0 z-40">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
          <SidebarTrigger className={brailleMode ? "border-2 border-yellow-400" : ""} />
          <h1 className={`text-base sm:text-lg font-semibold ${brailleMode ? "text-xl font-bold" : ""} truncate`}>
            {menuItems.find(item => item.id === activeSection)?.label || "Hemapp"}
          </h1>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Voice and Language side by side */}
          <div className="flex items-center gap-1">
            <LanguageSwitcher />
            
            {/* Speech Toggle with integrated SpeechInterface */}
            <SpeechInterface 
              enableTextToSpeech={speechEnabled}
              autoReadText={speechEnabled}
              onNavigate={(page) => {
                if (setActiveComponent) {
                  if (page === 'dashboard') setActiveComponent('dashboard');
                  else if (page === 'diet') setActiveComponent('diet-monitoring');
                  else if (page === 'health') setActiveComponent('health-monitoring');
                  else if (page === 'goals') setActiveComponent('goals');
                  else if (page === 'emergency') setActiveComponent('emergency');
                  else if (page === 'messages') setActiveComponent('messages');
                  else if (page === 'profile') setActiveComponent('account');
                  else if (page === 'facilities') setActiveComponent('facilities');
                }
              }}
              onTextRecognized={(text) => {
                console.log('Speech recognized:', text);
              }}
            />
          </div>

          {/* Connection Status - Hidden on mobile */}
          <div className="hidden lg:flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`text-sm text-muted-foreground ${brailleMode ? "font-bold" : ""}`}>
              {isOnline ? t('header.online') : t('header.offline')}
            </span>
            <Switch 
              checked={isOnline}
              onCheckedChange={onOnlineToggle}
            />
          </div>

          {/* Emergency Contact - Icon only on mobile */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('tel:911', '_self')}
            className="flex items-center space-x-1 text-red-600 border-red-600 px-2 sm:px-3"
          >
            <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm hidden sm:inline">{t('header.emergency')}</span>
          </Button>

          {/* App Settings */}
          <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`flex items-center space-x-1 ${brailleMode ? "border-2 border-yellow-400" : ""} px-2 sm:px-3`}
              >
                <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className={`text-xs sm:text-sm ${brailleMode ? "font-bold" : ""} hidden sm:inline`}>{t('header.settings')}</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <AppSettings />
            </DialogContent>
          </Dialog>

          {/* Sign Out - Icon only on mobile */}
          <Button
            variant="outline"
            size="sm"
            onClick={onSignOut}
            className={`flex items-center space-x-1 ${brailleMode ? "border-2 border-yellow-400" : ""} px-2 sm:px-3`}
          >
            <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className={`text-xs sm:text-sm ${brailleMode ? "font-bold" : ""} hidden sm:inline`}>{t('header.signOut')}</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
