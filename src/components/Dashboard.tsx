import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Activity, Heart, Utensils, Calendar, TrendingUp, Plus, Apple, Bookmark, Eye, Home } from "lucide-react";
import DietModals from "./diet/DietModals";
import EnhancedMealCategories from "./enhanced/EnhancedMealCategories";
import ViewCategories from "./ViewCategories";
import NutritionGoalsPage from "./NutritionGoalsPage";
import TrendsPage from "./TrendsPage";

interface DashboardProps {
  onGoHome?: () => void;
}

const Dashboard = ({ onGoHome }: DashboardProps) => {
  const { toast } = useToast();
  const [showDietEntry, setShowDietEntry] = useState(false);
  const [showMealCategories, setShowMealCategories] = useState(false);
  const [showViewCategories, setShowViewCategories] = useState(false);
  const [showNutritionGoals, setShowNutritionGoals] = useState(false);
  const [showTrends, setShowTrends] = useState(false);

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
    toast({
      title: "Success",
      description: "Action completed successfully!",
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full">
      <div className="px-1 flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">Welcome back!</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Here's your health overview for today</p>
        </div>
        {onGoHome && (
          <Button 
            variant="outline" 
            onClick={onGoHome}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
        )}
      </div>

      {/* Today's Progress */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 px-1">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Steps Today</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">8,542</div>
            <p className="text-xs text-muted-foreground">+2.5% from yesterday</p>
            <Progress value={85} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">72 bpm</div>
            <p className="text-xs text-muted-foreground">Resting rate</p>
            <Progress value={60} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calories</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">Goal: 2,000</p>
            <Progress value={62} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sleep</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">7.5h</div>
            <p className="text-xs text-muted-foreground">Last night</p>
            <Progress value={94} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mx-1">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Fast access to common health tracking features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            <Button 
              variant="outline" 
              className="h-16 sm:h-20 flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm"
              onClick={() => handleQuickAction('add-meal')}
            >
              <Plus className="h-4 w-4 sm:h-6 sm:w-6" />
              <span>Add Meal</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 sm:h-20 flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm"
              onClick={() => handleQuickAction('view-trends')}
            >
              <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6" />
              <span>View Trends</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 sm:h-20 flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm"
              onClick={() => handleQuickAction('nutrition-goals')}
            >
              <Apple className="h-4 w-4 sm:h-6 sm:w-6" />
              <span>Nutrition Goals</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 sm:h-20 flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm"
              onClick={() => handleQuickAction('meal-categories')}
            >
              <Bookmark className="h-4 w-4 sm:h-6 sm:w-6" />
              <span>Meal Categories</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 sm:h-20 flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm"
              onClick={() => handleQuickAction('view-meal-categories')}
            >
              <Eye className="h-4 w-4 sm:h-6 sm:w-6" />
              <span>View Categories</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="mx-1">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest health and fitness activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <Activity className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Morning workout completed</p>
                <p className="text-sm text-muted-foreground">45 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-2 rounded-full">
                <Utensils className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Breakfast logged</p>
                <p className="text-sm text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-red-100 p-2 rounded-full">
                <Heart className="h-4 w-4 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Heart rate checked</p>
                <p className="text-sm text-muted-foreground">3 hours ago</p>
              </div>
            </div>
          </div>
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