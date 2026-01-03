import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Activity, Heart, Utensils, Calendar, TrendingUp, Plus, Apple, Bookmark, Eye, Home } from "lucide-react";
import DietModals from "./diet/DietModals";
import EnhancedMealCategories from "./enhanced/EnhancedMealCategories";
import ViewCategories from "./ViewCategories";
import NutritionGoalsPage from "./NutritionGoalsPage";
import TrendsPage from "./TrendsPage";
import { useDietData } from "./diet/hooks/useDietData";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from 'react-i18next';

interface DashboardProps {
  onGoHome?: () => void;
}

const Dashboard = ({ onGoHome }: DashboardProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { getTodayStats, entries, refreshData, fetchDietEntries } = useDietData();
  const [showDietEntry, setShowDietEntry] = useState(false);
  const [showMealCategories, setShowMealCategories] = useState(false);
  const [showViewCategories, setShowViewCategories] = useState(false);
  const [showNutritionGoals, setShowNutritionGoals] = useState(false);
  const [showTrends, setShowTrends] = useState(false);
  const [todayStats, setTodayStats] = useState({ meals: 0, calories: 0, protein: 0, fiber: 0 });
  const [totalMealCount, setTotalMealCount] = useState(0);

  // Update stats whenever entries change
  useEffect(() => {
    if (user && entries.length >= 0) {
      const stats = getTodayStats();
      setTodayStats(stats);
    }
  }, [user, entries]);

  useEffect(() => {
    const fetchTotalMealCount = async () => {
      if (!user) return;
      
      const { count, error } = await supabase
        .from('diet_entries')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      
      if (!error && count !== null) {
        setTotalMealCount(count);
      }
    };
    
    fetchTotalMealCount();
  }, [user, entries]);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-meal':
        setShowDietEntry(true);
        break;
      case 'view-trends':
        setShowTrends(true);
        break;
      case 'nutrition-goals':
        setShowNutritionGoals(true);
        break;
      case 'meal-categories':
        setShowMealCategories(true);
        break;
      case 'view-meal-categories':
        setShowViewCategories(true);
        break;
      default:
        break;
    }
  };

  const handleSuccess = () => {
    setShowDietEntry(false);
    // Refresh data to get updated stats
    refreshData();
    toast({
      title: t('common.success', 'Success'),
      description: t('dashboard.mealAdded', 'Meal added successfully!'),
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full">
      <div className="px-1 flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold mb-1 sm:mb-2 truncate">{t('dashboard.welcomeBack')}</h1>
          <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">{t('dashboard.healthOverview')}</p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {t('dashboard.totalMeals')}: <span className="font-semibold text-primary">{totalMealCount}</span>
          </p>
        </div>
        {onGoHome && (
          <Button 
            variant="outline" 
            onClick={onGoHome}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            {t('dashboard.home')}
          </Button>
        )}
      </div>

      {/* Today's Progress */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 px-1">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.mealsToday')}</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{todayStats.meals}</div>
            <p className="text-xs text-muted-foreground">{t('dashboard.mealsLogged')}</p>
            <Progress value={todayStats.meals > 0 ? Math.min((todayStats.meals / 3) * 100, 100) : 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.calories')}</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{todayStats.calories}</div>
            <p className="text-xs text-muted-foreground">{t('dashboard.caloriesGoal')}</p>
            <Progress value={todayStats.calories > 0 ? Math.min((todayStats.calories / 2000) * 100, 100) : 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.protein')}</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{todayStats.protein}g</div>
            <p className="text-xs text-muted-foreground">{t('dashboard.dailyIntake')}</p>
            <Progress value={todayStats.protein > 0 ? Math.min((todayStats.protein / 50) * 100, 100) : 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.fiber')}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{todayStats.fiber}g</div>
            <p className="text-xs text-muted-foreground">{t('dashboard.dailyIntake')}</p>
            <Progress value={todayStats.fiber > 0 ? Math.min((todayStats.fiber / 25) * 100, 100) : 0} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mx-1">
        <CardHeader>
          <CardTitle>{t('dashboard.quickActions')}</CardTitle>
          <CardDescription>{t('dashboard.quickActionsDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            <Button 
              variant="outline" 
              className="h-16 sm:h-20 flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm"
              onClick={() => handleQuickAction('add-meal')}
            >
              <Plus className="h-4 w-4 sm:h-6 sm:w-6" />
              <span>{t('dashboard.addMeal')}</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 sm:h-20 flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm"
              onClick={() => handleQuickAction('view-trends')}
            >
              <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6" />
              <span>{t('dashboard.viewTrends')}</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 sm:h-20 flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm"
              onClick={() => handleQuickAction('nutrition-goals')}
            >
              <Apple className="h-4 w-4 sm:h-6 sm:w-6" />
              <span>{t('dashboard.nutritionGoals')}</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 sm:h-20 flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm"
              onClick={() => handleQuickAction('meal-categories')}
            >
              <Bookmark className="h-4 w-4 sm:h-6 sm:w-6" />
              <span>{t('dashboard.mealCategories')}</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 sm:h-20 flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm"
              onClick={() => handleQuickAction('view-meal-categories')}
            >
              <Eye className="h-4 w-4 sm:h-6 sm:w-6" />
              <span>{t('dashboard.viewCategories')}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="mx-1">
        <CardHeader>
          <CardTitle>{t('dashboard.recentActivity')}</CardTitle>
          <CardDescription>{t('dashboard.recentActivityDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          {todayStats.meals === 0 ? (
            <div className="text-center py-8">
              <Utensils className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{t('dashboard.noActivityToday')}</p>
              <p className="text-sm text-muted-foreground mt-1">{t('dashboard.startLogging')}</p>
              <Button 
                className="mt-4"
                onClick={() => setShowDietEntry(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('dashboard.addMeal')}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-2 rounded-full">
                  <Utensils className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{todayStats.meals} {t('dashboard.mealsLoggedToday')}</p>
                  <p className="text-sm text-muted-foreground">{todayStats.calories} {t('dashboard.caloriesTracked')}</p>
                </div>
              </div>
              {todayStats.protein > 0 && (
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Heart className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{t('dashboard.proteinIntake')}: {todayStats.protein}g</p>
                    <p className="text-sm text-muted-foreground">{t('dashboard.keepUpGoodWork')}</p>
                  </div>
                </div>
              )}
              {todayStats.fiber > 0 && (
                <div className="flex items-center space-x-4">
                  <div className="bg-red-100 p-2 rounded-full">
                    <Activity className="h-4 w-4 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{t('dashboard.fiberIntake')}: {todayStats.fiber}g</p>
                    <p className="text-sm text-muted-foreground">{t('dashboard.greatForDigestion')}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <DietModals
        showDietEntry={showDietEntry}
        editingEntry={null}
        onCloseDietEntry={() => setShowDietEntry(false)}
        onSuccess={handleSuccess}
      />

      {/* Meal Categories Modal */}
      {showMealCategories && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
            <EnhancedMealCategories onClose={() => setShowMealCategories(false)} />
          </div>
        </div>
      )}

      {/* View Categories Modal */}
      {showViewCategories && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
            <ViewCategories onClose={() => setShowViewCategories(false)} />
          </div>
        </div>
      )}

      {/* Nutrition Goals Modal */}
      {showNutritionGoals && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg w-full max-w-2xl h-[90vh] flex flex-col">
            <NutritionGoalsPage onClose={() => setShowNutritionGoals(false)} />
          </div>
        </div>
      )}

      {/* Trends Modal */}
      {showTrends && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
            <TrendsPage onClose={() => setShowTrends(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;