
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

  const fetchDietEntries = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('diet_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('logged_at', { ascending: false })
        .limit(10);

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

    return {
      meals: todayEntries.length,
      calories: totalCalories
    };
  };

  useEffect(() => {
    if (user) {
      fetchDietEntries();
    }
  }, [user]);

  return {
    entries,
    loading,
    fetchDietEntries,
    handleDeleteEntry,
    getTodayStats
  };
};

export type { DietEntryType };
