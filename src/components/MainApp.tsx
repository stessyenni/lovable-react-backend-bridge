import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { BarChart3, Stethoscope, Apple, Target, MapPin, User, Settings, LogOut, Heart, Mic, MicOff } from "lucide-react";
import Dashboard from "./Dashboard";
import AIConsultation from "./AIConsultation";
import DietMonitoring from "./DietMonitoring";
import HealthGoals from "./HealthGoals";
import HealthFacilities from "./HealthFacilities";
import UserAccount from "./UserAccount";
import AppSettings from "./AppSettings";
import { Button } from "@/components/ui/button";

interface MenuItem {
  id: 'dashboard' | 'consultation' | 'diet' | 'goals' | 'facilities' | 'account' | 'settings';
  label: string;
  icon: React.FC;
}

const MainApp = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<MenuItem['id']>('dashboard');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [speechEnabled, setSpeechEnabled] = useState(false);

  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'consultation', label: 'AI Consultation', icon: Stethoscope },
    { id: 'diet', label: 'Diet Monitoring', icon: Apple },
    { id: 'goals', label: 'Health Goals', icon: Target },
    { id: 'facilities', label: 'Health Facilities', icon: MapPin },
    { id: 'account', label: 'User Account', icon: User },
    { id: 'settings', label: 'App Settings', icon: Settings },
  ];

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
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <header className="border-b bg-card px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Hemapp</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Connection Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-muted-foreground">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>

            {/* Speech Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSpeechEnabled(!speechEnabled)}
              className="flex items-center space-x-1"
            >
              {speechEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              <span className="text-sm">{speechEnabled ? 'Speech On' : 'Speech Off'}</span>
            </Button>

            {/* Sign Out */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="flex items-center space-x-1"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className="w-64 border-r bg-card h-[calc(100vh-73px)] overflow-y-auto">
          <div className="p-4">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeSection === item.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveSection(item.id as any)}
                  >
                    <IconComponent className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainApp;
