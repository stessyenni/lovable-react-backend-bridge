
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useDietData, DietEntryType } from "./diet/hooks/useDietData";
import QuickActions from "./diet/QuickActions";
import DietStats from "./diet/DietStats";
import MealList from "./diet/MealList";
import DietModals from "./diet/DietModals";

const DietMonitoring = () => {
  const { toast } = useToast();
  const { entries, loading, fetchDietEntries, handleDeleteEntry, getTodayStats } = useDietData();
  const [showDietEntry, setShowDietEntry] = useState(false);
  const [showDietUpload, setShowDietUpload] = useState(false);
  const [showMealCategories, setShowMealCategories] = useState(false);
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
        toast({
          title: "Trends",
          description: "Opening nutrition trends analysis...",
        });
        break;
      case 'nutrition-goals':
        toast({
          title: "Nutrition Goals",
          description: "Opening goal setting interface...",
        });
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Diet Monitoring</h2>
          <p className="text-muted-foreground">Track your meals and nutrition intake with AI-powered analysis</p>
        </div>
      </div>

      <QuickActions onQuickAction={handleQuickAction} />

      <DietStats stats={stats} />

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
    </div>
  );
};

export default DietMonitoring;
