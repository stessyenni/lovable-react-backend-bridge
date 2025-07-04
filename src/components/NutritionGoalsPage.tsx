
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { X, Save, Target } from "lucide-react";

interface NutritionGoalsPageProps {
  onClose?: () => void;
}

const NutritionGoalsPage = ({ onClose }: NutritionGoalsPageProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [goals, setGoals] = useState({
    daily_calories: '',
    daily_protein: '',
    daily_fiber: '',
    daily_water: ''
  });
  const [todayStats, setTodayStats] = useState({
    calories: 0,
    protein: 0,
    fiber: 0
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchGoals();
      fetchTodayStats();
    }
  }, [user]);

  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('nutrition_goals')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setGoals({
          daily_calories: data.daily_calories?.toString() || '',
          daily_protein: data.daily_protein?.toString() || '',
          daily_fiber: data.daily_fiber?.toString() || '',
          daily_water: data.daily_water?.toString() || ''
        });
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const fetchTodayStats = async () => {
    try {
      const today = new Date().toDateString();
      const { data, error } = await supabase
        .from('diet_entries')
        .select('calories, protein, fiber')
        .eq('user_id', user?.id);

      if (error) throw error;

      const todayEntries = data?.filter(entry => 
        new Date(entry.logged_at).toDateString() === today
      ) || [];

      const stats = todayEntries.reduce((acc, entry) => ({
        calories: acc.calories + (entry.calories || 0),
        protein: acc.protein + parseInt(entry.protein || '0'),
        fiber: acc.fiber + parseInt(entry.fiber || '0')
      }), { calories: 0, protein: 0, fiber: 0 });

      setTodayStats(stats);
    } catch (error) {
      console.error('Error fetching today stats:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const goalData = {
        user_id: user.id,
        daily_calories: parseInt(goals.daily_calories) || null,
        daily_protein: parseInt(goals.daily_protein) || null,
        daily_fiber: parseInt(goals.daily_fiber) || null,
        daily_water: parseInt(goals.daily_water) || null,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('nutrition_goals')
        .upsert(goalData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your nutrition goals have been saved!",
      });
    } catch (error) {
      console.error('Error saving goals:', error);
      toast({
        title: "Error",
        description: "Failed to save nutrition goals",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const calculateProgress = (current: number, target: string) => {
    const targetNum = parseInt(target);
    if (!targetNum) return 0;
    return Math.min((current / targetNum) * 100, 100);
  };

  return (
    <div className="h-full max-h-[90vh] flex flex-col w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b bg-background shrink-0">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold truncate">Nutrition Goals</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Set and track your daily nutrition targets
          </p>
        </div>
        <div className="flex gap-2 ml-2">
          <Button onClick={handleSave} disabled={saving} size="sm" className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm">
            <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            {saving ? "Saving..." : "Save"}
          </Button>
          {onClose && (
            <Button onClick={onClose} variant="outline" size="sm" className="text-xs sm:text-sm">
              <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
        {/* Goal Setting */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <Target className="h-4 w-4" />
              Daily Nutrition Goals
            </CardTitle>
            <CardDescription>Set your daily nutrition targets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs sm:text-sm">Daily Calories</Label>
                <Input
                  type="number"
                  placeholder="2000"
                  value={goals.daily_calories}
                  onChange={(e) => setGoals(prev => ({ ...prev, daily_calories: e.target.value }))}
                  className="text-xs sm:text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs sm:text-sm">Daily Protein (g)</Label>
                <Input
                  type="number"
                  placeholder="150"
                  value={goals.daily_protein}
                  onChange={(e) => setGoals(prev => ({ ...prev, daily_protein: e.target.value }))}
                  className="text-xs sm:text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs sm:text-sm">Daily Fiber (g)</Label>
                <Input
                  type="number"
                  placeholder="25"
                  value={goals.daily_fiber}
                  onChange={(e) => setGoals(prev => ({ ...prev, daily_fiber: e.target.value }))}
                  className="text-xs sm:text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs sm:text-sm">Daily Water (ml)</Label>
                <Input
                  type="number"
                  placeholder="2000"
                  value={goals.daily_water}
                  onChange={(e) => setGoals(prev => ({ ...prev, daily_water: e.target.value }))}
                  className="text-xs sm:text-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm sm:text-base">Today's Progress</CardTitle>
            <CardDescription>Your progress towards today's goals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Calories</span>
                  <span>{todayStats.calories} / {goals.daily_calories || '0'}</span>
                </div>
                <Progress value={calculateProgress(todayStats.calories, goals.daily_calories)} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Protein (g)</span>
                  <span>{todayStats.protein} / {goals.daily_protein || '0'}</span>
                </div>
                <Progress value={calculateProgress(todayStats.protein, goals.daily_protein)} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Fiber (g)</span>
                  <span>{todayStats.fiber} / {goals.daily_fiber || '0'}</span>
                </div>
                <Progress value={calculateProgress(todayStats.fiber, goals.daily_fiber)} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NutritionGoalsPage;
