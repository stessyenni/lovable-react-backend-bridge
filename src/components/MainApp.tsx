
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { BarChart3, Stethoscope, Apple, Target, MapPin, User, Settings, LogOut, Heart, Mic, MicOff, Phone, Video } from "lucide-react";
import Dashboard from "./Dashboard";
import AIConsultation from "./AIConsultation";
import DietMonitoring from "./DietMonitoring";
import HealthGoals from "./HealthGoals";
import HealthFacilities from "./HealthFacilities";
import UserAccount from "./UserAccount";
import AppSettings from "./AppSettings";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface MenuItem {
  id: 'dashboard' | 'consultation' | 'diet' | 'goals' | 'facilities' | 'account' | 'settings';
  label: string;
  icon: React.FC<any>;
}

const MainApp = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<MenuItem['id']>('dashboard');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [brailleMode, setBrailleMode] = useState(false);

  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    // Check for braille preference in localStorage
    const savedBrailleMode = localStorage.getItem('brailleMode') === 'true';
    setBrailleMode(savedBrailleMode);

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

  const handleOnlineToggle = () => {
    const newOnlineStatus = !isOnline;
    setIsOnline(newOnlineStatus);
    toast({
      title: newOnlineStatus ? "Going online" : "Going offline",
      description: newOnlineStatus ? "Reconnecting to online services" : "App will work in offline mode",
    });
  };

  const handleBrailleToggle = () => {
    const newBrailleMode = !brailleMode;
    setBrailleMode(newBrailleMode);
    localStorage.setItem('brailleMode', newBrailleMode.toString());
    toast({
      title: newBrailleMode ? "Braille mode enabled" : "Braille mode disabled",
      description: newBrailleMode ? "Screen reader optimizations active" : "Standard display mode active",
    });
  };

  const handleDoctorConsult = () => {
    toast({
      title: "Doctor Consultation",
      description: "Connecting you with available doctors...",
    });
    // In a real app, this would open video call or booking interface
  };

  const menuItems: MenuItem[] = [
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
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className={brailleMode ? "border-2 border-yellow-400" : ""}>
          <SidebarHeader className="p-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Hemapp</span>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton 
                          isActive={activeSection === item.id}
                          onClick={() => setActiveSection(item.id)}
                          className={brailleMode ? "text-lg font-bold" : ""}
                        >
                          <IconComponent className="mr-2 h-4 w-4" />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4">
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDoctorConsult}
                className="w-full flex items-center space-x-2"
              >
                <Video className="h-4 w-4" />
                <span>Consult Doctor</span>
              </Button>
              
              <div className="flex items-center justify-between text-sm">
                <span>Braille Mode</span>
                <Switch 
                  checked={brailleMode}
                  onCheckedChange={handleBrailleToggle}
                />
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          {/* Top Navigation Bar */}
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
                    onCheckedChange={handleOnlineToggle}
                  />
                </div>

                {/* Speech Toggle */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSpeechEnabled(!speechEnabled)}
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
                  onClick={handleSignOut}
                  className={`flex items-center space-x-1 ${brailleMode ? "border-2 border-yellow-400" : ""}`}
                >
                  <LogOut className="h-4 w-4" />
                  <span className={`text-sm ${brailleMode ? "font-bold" : ""}`}>Sign Out</span>
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            <div className={`p-6 ${brailleMode ? "text-lg" : ""}`}>
              {renderContent()}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default MainApp;
