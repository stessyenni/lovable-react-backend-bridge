
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Plus, TrendingUp, Apple, Coffee, Utensils, Cookie, Edit, Trash2 } from "lucide-react";
import { DietEntryType } from "./hooks/useDietData";

interface MealListProps {
  entries: DietEntryType[];
  loading: boolean;
  onDeleteEntry: (entryId: string) => void;
  onEditEntry: (entry: DietEntryType) => void;
  onAddFirstMeal: () => void;
}

const MealList = ({ entries, loading, onDeleteEntry, onEditEntry, onAddFirstMeal }: MealListProps) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Meals</CardTitle>
        <CardDescription>Your latest food entries with AI analysis</CardDescription>
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
            <Button onClick={onAddFirstMeal}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Meal
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {entry.image_url && (
                    <img 
                      src={entry.image_url} 
                      alt="Meal" 
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  )}
                  {getMealIcon(entry.meal_type)}
                  <div>
                    <h4 className="font-medium">{entry.meal_name}</h4>
                    {entry.meal_content && (
                      <p className="text-sm text-muted-foreground">{entry.meal_content}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {entry.meal_type && (
                        <Badge variant="secondary" className="mr-2 capitalize">
                          {entry.meal_type}
                        </Badge>
                      )}
                      {entry.category && (
                        <Badge variant="outline" className="mr-2">
                          {entry.category}
                        </Badge>
                      )}
                      {new Date(entry.logged_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="font-medium">{entry.calories || '--'} kcal</p>
                    {entry.protein && (
                      <p className="text-sm text-muted-foreground">{entry.protein}g protein</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditEntry(entry)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteEntry(entry.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MealList;
