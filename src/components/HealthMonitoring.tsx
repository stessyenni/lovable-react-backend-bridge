import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Apple, Target, TrendingUp, ChefHat } from "lucide-react";
import DietMonitoring from "@/components/DietMonitoring";
import HealthGoals from "@/components/HealthGoals";
import TrendsPage from "@/components/TrendsPage";
import DietRecommendations from "@/components/DietRecommendations";

const HealthMonitoring = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("diet");

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4">
      <div className="px-1">
        <h2 className="text-xl sm:text-2xl font-bold">{t('healthMonitoring.title')}</h2>
        <p className="text-sm sm:text-base text-muted-foreground">{t('healthMonitoring.subtitle')}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1">
          <TabsTrigger value="diet" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <Apple className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">{t('healthMonitoring.tabs.diet')}</span>
            <span className="sm:hidden">{t('healthMonitoring.tabs.diet')}</span>
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <ChefHat className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">{t('healthMonitoring.tabs.recommendations')}</span>
            <span className="sm:hidden">{t('healthMonitoring.tabs.recommendationsShort')}</span>
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <Target className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">{t('healthMonitoring.tabs.goals')}</span>
            <span className="sm:hidden">{t('healthMonitoring.tabs.goals')}</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">{t('healthMonitoring.tabs.analytics')}</span>
            <span className="sm:hidden">{t('healthMonitoring.tabs.analyticsShort')}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="diet" className="space-y-4">
          <DietMonitoring />
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <DietRecommendations />
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