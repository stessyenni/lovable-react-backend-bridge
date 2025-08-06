
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LogOut, Mic, MicOff, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MenuItem {
  id: 'dashboard' | 'consultation' | 'diet' | 'goals' | 'facilities' | 'messages' | 'account' | 'faq' | 'settings' | 'smartwatch' | 'emergency' | 'analytics';
  label: string;
  icon: React.FC<any>;
}

interface AppHeaderProps {
  activeSection: MenuItem['id'];
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
  menuItems,
  isOnline,
  speechEnabled,
  brailleMode,
  onSignOut,
  onOnlineToggle,
  onSpeechToggle,
}: AppHeaderProps) => {
  return (
    <header className="border-b bg-card px-4 py-3 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger className={brailleMode ? "border-2 border-yellow-400" : ""} />
          <h1 className={`text-lg font-semibold ${brailleMode ? "text-xl font-bold" : ""}`}>
            {menuItems.find(item => item.id === activeSection)?.label || "Hemapp"}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Connection Status */}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`text-sm text-muted-foreground ${brailleMode ? "font-bold" : ""}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
            <Switch 
              checked={isOnline}
              onCheckedChange={onOnlineToggle}
            />
          </div>

          {/* Speech Toggle */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onSpeechToggle}
              className={`flex items-center space-x-1 ${brailleMode ? "border border-yellow-400" : ""}`}
            >
              {speechEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              <span className={`text-sm ${brailleMode ? "font-bold" : ""}`}>
                {speechEnabled ? 'Speech On' : 'Speech Off'}
              </span>
            </Button>
          </div>

          {/* Emergency Contact */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('tel:911', '_self')}
            className="flex items-center space-x-1 text-red-600 border-red-600"
          >
            <Phone className="h-4 w-4" />
            <span className="text-sm">Emergency</span>
          </Button>

          {/* Sign Out */}
          <Button
            variant="outline"
            size="sm"
            onClick={onSignOut}
            className={`flex items-center space-x-1 ${brailleMode ? "border-2 border-yellow-400" : ""}`}
          >
            <LogOut className="h-4 w-4" />
            <span className={`text-sm ${brailleMode ? "font-bold" : ""}`}>Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
