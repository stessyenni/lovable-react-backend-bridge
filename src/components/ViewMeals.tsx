import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { 
  Trash2, 
  Edit2,
  X,
  Utensils,
  Calendar,
  ChefHat
} from "lucide-react";

interface DietEntry {
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

interface ViewMealsProps {
  onClose?: () => void;
  onEditMeal?: (meal: DietEntry) => void;
}

const ViewMeals = ({ onClose, onEditMeal }: ViewMealsProps) => {
  const [meals, setMeals] = useState<DietEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMeals();
    }
  }, [user]);

  const fetchMeals = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('diet_entries')
        .select('*')
        .eq('user_id', user?.id)
        .order('logged_at', { ascending: false });

      if (error) {
        console.error('Error fetching meals:', error);
        toast({
          title: "Error",
          description: "Failed to load meal entries",
          variant: "destructive",
        });
        return;
      }

      setMeals(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMeal = async (mealId: string) => {
    if (!confirm('Are you sure you want to delete this meal entry?')) return;

    try {
      const { error } = await supabase
        .from('diet_entries')
        .delete()
        .eq('id', mealId);

      if (error) throw error;

      toast({
        title: "Meal Deleted",
        description: "Meal entry has been removed successfully.",
      });

      fetchMeals();
    } catch (error) {
      console.error('Error deleting meal:', error);
      toast({
        title: "Error",
        description: "Failed to delete meal entry",
        variant: "destructive",
      });
    }
  };

  const groupMealsByDate = (meals: DietEntry[]) => {
    const grouped = meals.reduce((acc, meal) => {
      const date = new Date(meal.logged_at).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(meal);
      return acc;
    }, {} as Record<string, DietEntry[]>);

    return Object.entries(grouped).sort((a, b) => 
      new Date(b[0]).getTime() - new Date(a[0]).getTime()
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (dateStr === today) return "Today";
    if (dateStr === yesterday) return "Yesterday";
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getMealTypeColor = (mealType: string | null) => {
    switch (mealType?.toLowerCase()) {
      case 'breakfast': return 'bg-yellow-100 text-yellow-800';
      case 'lunch': return 'bg-green-100 text-green-800';
      case 'dinner': return 'bg-blue-100 text-blue-800';
      case 'snack': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading meal entries...</p>
        </div>
      </div>
    );
  }

  const groupedMeals = groupMealsByDate(meals);

  return (
    <div className="h-full max-h-[90vh] flex flex-col w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background shrink-0">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold">View Meals</h3>
          <p className="text-sm text-muted-foreground">
            All your logged meal entries with categories and nutritional information
          </p>
        </div>
        <div className="flex gap-2 ml-2">
          {onClose && (
            <Button onClick={onClose} variant="outline" size="sm">
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 h-0">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-6">
            {/* Meals Display */}
            {meals.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Utensils className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No meal entries yet</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Start logging your meals to see them here
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              groupedMeals.map(([date, dateMeals]) => (
                <Card key={date} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{formatDate(date)}</CardTitle>
                      <Badge variant="secondary">{dateMeals.length} meals</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {dateMeals.map((meal) => (
                      <div 
                        key={meal.id} 
                        className="flex items-start justify-between p-4 bg-muted/50 rounded-lg border hover:bg-muted/70 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-base">{meal.meal_name}</h4>
                            {meal.meal_type && (
                              <Badge className={getMealTypeColor(meal.meal_type)}>
                                {meal.meal_type}
                              </Badge>
                            )}
                            {meal.category && (
                              <Badge variant="outline">
                                <ChefHat className="h-3 w-3 mr-1" />
                                {meal.category}
                              </Badge>
                            )}
                          </div>

                          {meal.meal_content && (
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {meal.meal_content}
                            </p>
                          )}

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {meal.calories && (
                              <div className="flex items-center text-sm">
                                <span className="text-red-600 mr-1">🔥</span>
                                <span className="font-medium">{meal.calories}</span>
                                <span className="text-muted-foreground ml-1">cal</span>
                              </div>
                            )}
                            {meal.protein && (
                              <div className="flex items-center text-sm">
                                <span className="text-blue-600 mr-1">💪</span>
                                <span className="font-medium">{meal.protein}g</span>
                                <span className="text-muted-foreground ml-1">protein</span>
                              </div>
                            )}
                            {meal.fiber && (
                              <div className="flex items-center text-sm">
                                <span className="text-green-600 mr-1">🌾</span>
                                <span className="font-medium">{meal.fiber}g</span>
                                <span className="text-muted-foreground ml-1">fiber</span>
                              </div>
                            )}
                            <div className="flex items-center text-xs text-muted-foreground">
                              <span>Logged: {new Date(meal.logged_at).toLocaleTimeString('en-US', { 
                                hour: 'numeric', 
                                minute: '2-digit' 
                              })}</span>
                            </div>
                          </div>

                          {meal.image_url && (
                            <div className="mt-3">
                              <img 
                                src={meal.image_url} 
                                alt={meal.meal_name}
                                className="w-20 h-20 object-cover rounded-md border"
                              />
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2 ml-4">
                          {onEditMeal && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEditMeal(meal)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteMeal(meal.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ViewMeals;