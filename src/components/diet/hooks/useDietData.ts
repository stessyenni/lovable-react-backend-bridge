
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DietEntryType {
  id: string;
  meal_name: string;
  meal_type: string | null;
  calories: number | null;
  protein: string | null;
  fiber: string | null;
  logged_at: string;
  meal_content?: string | null;
  image_url?: string | null;
  category?: string;
}

export const useDietData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<DietEntryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchDietEntries = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('diet_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('logged_at', { ascending: false })
        .limit(100); // Increased limit for better stats

      if (error) {
        console.error('Error fetching diet entries:', error);
        return;
      }

      setEntries(data || []);
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger a refresh of data
  const refreshData = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!confirm('Are you sure you want to delete this meal entry?')) return;

    try {
      const { error } = await supabase
        .from('diet_entries')
        .delete()
        .eq('id', entryId);

      if (error) {
        console.error('Error deleting entry:', error);
        toast({
          title: "Error",
          description: "Failed to delete meal entry",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Meal entry deleted successfully",
      });

      fetchDietEntries();
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const getTodayStats = () => {
    const today = new Date().toDateString();
    const todayEntries = entries.filter(entry => 
      new Date(entry.logged_at).toDateString() === today
    );

    const totalCalories = todayEntries.reduce((sum, entry) => 
      sum + (entry.calories || 0), 0
    );

    const totalProtein = todayEntries.reduce((sum, entry) => 
      sum + (parseFloat(entry.protein || '0') || 0), 0
    );

    const totalFiber = todayEntries.reduce((sum, entry) => 
      sum + (parseFloat(entry.fiber || '0') || 0), 0
    );

    // Group by meal type for breakdown
    const mealBreakdown = todayEntries.reduce((acc, entry) => {
      const mealType = entry.meal_type || 'Other';
      if (!acc[mealType]) {
        acc[mealType] = { count: 0, calories: 0 };
      }
      acc[mealType].count += 1;
      acc[mealType].calories += entry.calories || 0;
      return acc;
    }, {} as Record<string, { count: number; calories: number }>);

    return {
      meals: todayEntries.length,
      calories: totalCalories,
      protein: Math.round(totalProtein * 10) / 10,
      fiber: Math.round(totalFiber * 10) / 10,
      mealBreakdown,
      entries: todayEntries
    };
  };

  const getWeeklyStats = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklyEntries = entries.filter(entry => 
      new Date(entry.logged_at) >= oneWeekAgo
    );

    const dailyStats = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayEntries = weeklyEntries.filter(entry => 
        new Date(entry.logged_at).toDateString() === date.toDateString()
      );
      
      return {
        date: date.toISOString().split('T')[0],
        calories: dayEntries.reduce((sum, entry) => sum + (entry.calories || 0), 0),
        meals: dayEntries.length
      };
    }).reverse();

    const weeklyAverage = Math.round(
      dailyStats.reduce((sum, day) => sum + day.calories, 0) / 7
    );

    return {
      dailyStats,
      weeklyAverage,
      totalMeals: weeklyEntries.length,
      totalCalories: weeklyEntries.reduce((sum, entry) => sum + (entry.calories || 0), 0)
    };
  };

  useEffect(() => {
    if (user) {
      fetchDietEntries();
    }
  }, [user, refreshKey]);

  return {
    entries,
    loading,
    fetchDietEntries,
    handleDeleteEntry,
    getTodayStats,
    getWeeklyStats,
    refreshData
  };
};

export type { DietEntryType };
