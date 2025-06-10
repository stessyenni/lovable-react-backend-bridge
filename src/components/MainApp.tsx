
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
  LogOut
} from "lucide-react";
import Dashboard from "@/components/Dashboard";
import DietMonitoring from "@/components/DietMonitoring";
import Goals from "@/components/Goals";
import Facilities from "@/components/Facilities";
import UserAccount from "@/components/UserAccount";
import AppSettings from "@/components/AppSettings";
import LanguageSettings from "@/components/LanguageSettings";
import AIChatbot from "@/components/AIChatbot";

const MainApp = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-red-500" />
              <h1 className="text-2xl font-bold text-foreground">Hemapp</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Wifi className="h-4 w-4 mr-2" />
                Offline Mode
              </Button>
              <Button variant="outline" size="sm">
                <Mic className="h-4 w-4 mr-2" />
                Voice
              </Button>
              <Button variant="outline" size="sm">
                <Volume2 className="h-4 w-4 mr-2" />
                Audio
              </Button>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="dashboard" className="flex items-center space-x-1">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="diet" className="flex items-center space-x-1">
              <Apple className="h-4 w-4" />
              <span className="hidden sm:inline">Diet</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center space-x-1">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Goals</span>
            </TabsTrigger>
            <TabsTrigger value="facilities" className="flex items-center space-x-1">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Facilities</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-1">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
            <TabsTrigger value="language" className="flex items-center space-x-1">
              <Languages className="h-4 w-4" />
              <span className="hidden sm:inline">Language</span>
            </TabsTrigger>
            <TabsTrigger value="chatbot" className="flex items-center space-x-1">
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

          <TabsContent value="facilities" className="mt-6">
            <Facilities />
          </TabsContent>

          <TabsContent value="account" className="mt-6">
            <UserAccount />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <AppSettings />
          </TabsContent>

          <TabsContent value="language" className="mt-6">
            <LanguageSettings />
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
