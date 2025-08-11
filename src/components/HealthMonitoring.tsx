import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Apple, Target, TrendingUp } from "lucide-react";
import DietMonitoring from "@/components/DietMonitoring";
import HealthGoals from "@/components/HealthGoals";
import TrendsPage from "@/components/TrendsPage";

const HealthMonitoring = () => {
  const [activeTab, setActiveTab] = useState("diet");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Health Monitoring</h2>
        <p className="text-muted-foreground">Track your diet, goals, and health analytics</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="diet" className="flex items-center gap-2">
            <Apple className="h-4 w-4" />
            Diet
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Goals
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="diet" className="space-y-4">
          <DietMonitoring />
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <HealthGoals />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <TrendsPage />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HealthMonitoring;