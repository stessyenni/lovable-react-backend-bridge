
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { 
  Heart, 
  Apple, 
  Target, 
  Building2, 
  User, 
  Settings, 
  Languages,
  Mic,
  Volume2,
  Wifi,
  MessageCircle,
  LogOut,
  Camera,
  Brain,
  MapPin
} from "lucide-react";
import Dashboard from "@/components/Dashboard";
import DietMonitoring from "@/components/DietMonitoring";
import Goals from "@/components/Goals";
import Facilities from "@/components/Facilities";
import UserAccount from "@/components/UserAccount";
import AppSettings from "@/components/AppSettings";
import LanguageSettings from "@/components/LanguageSettings";
import AIChatbot from "@/components/AIChatbot";
import DietUpload from "@/components/DietUpload";
import AIConsultation from "@/components/AIConsultation";
import Maps from "@/components/Maps";

const MainApp = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50 to-purple-50">
      {/* Dynamic Header with Gradient */}
      <header className="gradient-hemapp shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Logo Placeholder - You can replace this with your actual logo */}
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                <Heart className="h-8 w-8 text-royal-blue" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Hemapp</h1>
                <p className="text-white/80 text-sm">Your Health Companion</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 glass-effect">
                <Wifi className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Offline</span>
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 glass-effect">
                <Mic className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Voice</span>
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 glass-effect">
                <Volume2 className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Audio</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={signOut} className="text-white hover:bg-white/20 glass-effect">
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-10 gap-1 bg-white/50 backdrop-blur-sm border-royal-blue/20">
            <TabsTrigger value="dashboard" className="flex items-center space-x-1 data-[state=active]:bg-royal-blue data-[state=active]:text-white">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="diet" className="flex items-center space-x-1 data-[state=active]:bg-hemapp-green data-[state=active]:text-white">
              <Apple className="h-4 w-4" />
              <span className="hidden sm:inline">Diet</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center space-x-1 data-[state=active]:bg-dark-purple data-[state=active]:text-white">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Goals</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center space-x-1 data-[state=active]:bg-royal-blue data-[state=active]:text-white">
              <Camera className="h-4 w-4" />
              <span className="hidden sm:inline">Upload</span>
            </TabsTrigger>
            <TabsTrigger value="consultation" className="flex items-center space-x-1 data-[state=active]:bg-hemapp-green data-[state=active]:text-white">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">AI Care</span>
            </TabsTrigger>
            <TabsTrigger value="maps" className="flex items-center space-x-1 data-[state=active]:bg-dark-purple data-[state=active]:text-white">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Maps</span>
            </TabsTrigger>
            <TabsTrigger value="facilities" className="flex items-center space-x-1 data-[state=active]:bg-royal-blue data-[state=active]:text-white">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Facilities</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center space-x-1 data-[state=active]:bg-hemapp-green data-[state=active]:text-white">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-1 data-[state=active]:bg-dark-purple data-[state=active]:text-white">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
            <TabsTrigger value="chatbot" className="flex items-center space-x-1 data-[state=active]:bg-royal-blue data-[state=active]:text-white">
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">AI Chat</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <Dashboard />
          </TabsContent>

          <TabsContent value="diet" className="mt-6">
            <DietMonitoring />
          </TabsContent>

          <TabsContent value="goals" className="mt-6">
            <Goals />
          </TabsContent>

          <TabsContent value="upload" className="mt-6">
            <DietUpload />
          </TabsContent>

          <TabsContent value="consultation" className="mt-6">
            <AIConsultation />
          </TabsContent>

          <TabsContent value="maps" className="mt-6">
            <Maps />
          </TabsContent>

          <TabsContent value="facilities" className="mt-6">
            <Facilities />
          </TabsContent>

          <TabsContent value="account" className="mt-6">
            <UserAccount />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <AppSettings />
          </TabsContent>

          <TabsContent value="chatbot" className="mt-6">
            <AIChatbot />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MainApp;
