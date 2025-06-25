
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Camera, Plus, TrendingUp, Apple, Coffee, Utensils, Cookie } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DietEntry from "./DietEntry";
import DietUpload from "./DietUpload";

interface DietEntryType {
  id: string;
  meal_name: string;
  meal_type: string | null;
  calories: number | null;
  protein: string | null;
  fiber: string | null;
  logged_at: string;
}

const DietMonitoring = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<DietEntryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDietEntry, setShowDietEntry] = useState(false);
  const [showDietUpload, setShowDietUpload] = useState(false);

  useEffect(() => {
    if (user) {
      fetchDietEntries();
    }
  }, [user]);

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

  const getMealIcon = (mealType: string | null) => {
    switch (mealType) {
      case 'breakfast':
        return <Coffee className="h-4 w-4" />;
      case 'lunch':
        return <Utensils className="h-4 w-4" />;
      case 'dinner':
        return <Apple className="h-4 w-4" />;
      case 'snack':
        return <Cookie className="h-4 w-4" />;
      default:
        return <Utensils className="h-4 w-4" />;
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

  const stats = getTodayStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Diet Monitoring</h2>
          <p className="text-muted-foreground">Track your meals and nutrition intake</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-4">
        <Button 
          variant="outline" 
          className="h-20 flex flex-col gap-2"
          onClick={() => setShowDietEntry(true)}
        >
          <Plus className="h-6 w-6" />
          <span className="text-sm">Add Meal</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-20 flex flex-col gap-2"
          onClick={() => setShowDietUpload(true)}
        >
          <Camera className="h-6 w-6" />
          <span className="text-sm">Photo Analysis</span>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col gap-2">
          <TrendingUp className="h-6 w-6" />
          <span className="text-sm">View Trends</span>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col gap-2">
          <Apple className="h-6 w-6" />
          <span className="text-sm">Nutrition Goals</span>
        </Button>
      </div>

      {/* Diet Entry Modal */}
      {showDietEntry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Add New Meal</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowDietEntry(false)}
              >
                ✕
              </Button>
            </div>
            <div className="p-4">
              <DietEntry />
            </div>
          </div>
        </div>
      )}

      {/* Diet Upload Modal */}
      {showDietUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-2xl w-full">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Photo Analysis</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowDietUpload(false)}
              >
                ✕
              </Button>
            </div>
            <div className="p-4">
              <DietUpload />
            </div>
          </div>
        </div>
      )}

      {/* Today's Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today's Meals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.meals}</div>
            <p className="text-xs text-muted-foreground">meals logged</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Calories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.calories}</div>
            <p className="text-xs text-muted-foreground">kcal consumed</p>
            <Progress value={(stats.calories / 2000) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Goal Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.min(Math.round((stats.calories / 2000) * 100), 100)}%</div>
            <p className="text-xs text-muted-foreground">of daily goal</p>
            <Progress value={Math.min((stats.calories / 2000) * 100, 100)} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Recent Meals */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Meals</CardTitle>
          <CardDescription>Your latest food entries</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-8">
              <Utensils className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No meals logged yet</p>
              <Button onClick={() => setShowDietEntry(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Meal
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getMealIcon(entry.meal_type)}
                    <div>
                      <h4 className="font-medium">{entry.meal_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {entry.meal_type && (
                          <Badge variant="secondary" className="mr-2 capitalize">
                            {entry.meal_type}
                          </Badge>
                        )}
                        {new Date(entry.logged_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{entry.calories || '--'} kcal</p>
                    {entry.protein && (
                      <p className="text-sm text-muted-foreground">{entry.protein}g protein</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DietMonitoring;
