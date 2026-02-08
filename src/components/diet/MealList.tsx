
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
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
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
              <div key={entry.id} className="border rounded-lg overflow-hidden">
                {/* Show meal image prominently if available */}
                {entry.image_url && (
                  <div className="relative">
                    <img 
                      src={entry.image_url} 
                      alt={entry.meal_name}
                      className="w-full h-32 sm:h-40 object-cover"
                    />
                    {/* Overlay nutrient badges on image */}
                    <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1">
                      {entry.calories && (
                        <Badge variant="destructive" className="border-0 text-xs">
                          🔥 {entry.calories} kcal
                        </Badge>
                      )}
                      {entry.protein && (
                        <Badge className="bg-primary text-primary-foreground border-0 text-xs">
                          💪 {entry.protein}g protein
                        </Badge>
                      )}
                      {entry.fiber && (
                        <Badge className="bg-accent text-accent-foreground border-0 text-xs">
                          🌾 {entry.fiber}g fiber
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    {!entry.image_url && getMealIcon(entry.meal_type)}
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium truncate">{entry.meal_name}</h4>
                      {entry.meal_content && (
                        <p className="text-sm text-muted-foreground truncate">{entry.meal_content}</p>
                      )}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {entry.meal_type && (
                          <Badge variant="secondary" className="capitalize text-xs">
                            {entry.meal_type}
                          </Badge>
                        )}
                        {entry.category && (
                          <Badge variant="outline" className="text-xs">
                            {entry.category}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {new Date(entry.logged_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Show nutrient stats inline if no image */}
                    {!entry.image_url && (
                      <div className="text-right hidden sm:block">
                        <p className="font-medium text-sm">{entry.calories || '--'} kcal</p>
                        {entry.protein && (
                          <p className="text-xs text-muted-foreground">{entry.protein}g protein</p>
                        )}
                        {entry.fiber && (
                          <p className="text-xs text-muted-foreground">{entry.fiber}g fiber</p>
                        )}
                      </div>
                    )}
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
                      className="text-destructive hover:text-destructive/80"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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
