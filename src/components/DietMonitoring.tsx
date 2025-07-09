
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useDietData, DietEntryType } from "./diet/hooks/useDietData";
import QuickActions from "./diet/QuickActions";
import DietStats from "./diet/DietStats";
import MealList from "./diet/MealList";
import DietModals from "./diet/DietModals";
import TrendsPage from "./TrendsPage";
import NutritionGoalsPage from "./NutritionGoalsPage";
import EnhancedMealCategories from "./enhanced/EnhancedMealCategories";
import { useOfflineSync } from "@/hooks/useOfflineSync";

const DietMonitoring = () => {
  const { toast } = useToast();
  const { entries, loading, fetchDietEntries, handleDeleteEntry, getTodayStats, getWeeklyStats } = useDietData();
  const { isOnline, pendingSync } = useOfflineSync();
  const [showDietEntry, setShowDietEntry] = useState(false);
  const [showDietUpload, setShowDietUpload] = useState(false);
  const [showMealCategories, setShowMealCategories] = useState(false);
  const [showTrends, setShowTrends] = useState(false);
  const [showNutritionGoals, setShowNutritionGoals] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DietEntryType | null>(null);

  const handleEditEntry = (entry: DietEntryType) => {
    setEditingEntry(entry);
    setShowDietEntry(true);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-meal':
        setEditingEntry(null);
        setShowDietEntry(true);
        break;
      case 'photo-analysis':
        setShowDietUpload(true);
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
        setShowMealCategories(true);
        break;
      default:
        break;
    }
  };

  const handleSuccess = () => {
    setShowDietEntry(false);
    setShowDietUpload(false);
    setEditingEntry(null);
    fetchDietEntries();
  };

  const handleCloseDietEntry = () => {
    setShowDietEntry(false);
    setEditingEntry(null);
  };

  const stats = getTodayStats();
  const weeklyStats = getWeeklyStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Diet Monitoring</h2>
          <p className="text-muted-foreground">Track your meals and nutrition intake with AI-powered analysis</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
            isOnline 
              ? 'bg-green-100 text-green-800' 
              : 'bg-orange-100 text-orange-800'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isOnline ? 'bg-green-600' : 'bg-orange-600'
            }`} />
            {isOnline ? 'Online' : 'Offline'}
          </div>
          {pendingSync.length > 0 && (
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {pendingSync.length} pending sync
            </div>
          )}
        </div>
      </div>

      <QuickActions onQuickAction={handleQuickAction} />

      <DietStats stats={stats} weeklyStats={weeklyStats} />

      <MealList
        entries={entries}
        loading={loading}
        onDeleteEntry={handleDeleteEntry}
        onEditEntry={handleEditEntry}
        onAddFirstMeal={() => setShowDietEntry(true)}
      />

      <DietModals
        showDietEntry={showDietEntry}
        showDietUpload={showDietUpload}
        showMealCategories={showMealCategories}
        editingEntry={editingEntry}
        onCloseDietEntry={handleCloseDietEntry}
        onCloseDietUpload={() => setShowDietUpload(false)}
        onCloseMealCategories={() => setShowMealCategories(false)}
        onSuccess={handleSuccess}
      />

      {/* Trends Modal */}
      {showTrends && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-background rounded-lg w-full max-w-6xl max-h-[90vh] flex flex-col">
            <TrendsPage onClose={() => setShowTrends(false)} />
          </div>
        </div>
      )}

      {/* Nutrition Goals Modal */}
      {showNutritionGoals && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-background rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
            <NutritionGoalsPage onClose={() => setShowNutritionGoals(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DietMonitoring;
