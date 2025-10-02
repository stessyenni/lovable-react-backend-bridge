import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Calendar,
  Clock,
  ChefHat,
  Edit2,
  Trash2,
  Utensils,
  Target,
  Activity
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

interface MealDetailsModalProps {
  meal: DietEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (meal: DietEntry) => void;
  onDelete?: (mealId: string) => void;
}

const MealDetailsModal = ({ 
  meal, 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete 
}: MealDetailsModalProps) => {
  if (!meal) return null;

  const getMealTypeColor = (mealType: string | null) => {
    switch (mealType?.toLowerCase()) {
      case 'breakfast': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'lunch': return 'bg-green-100 text-green-800 border-green-200';
      case 'dinner': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'snack': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <Utensils className="h-6 w-6 text-primary" />
            {meal.meal_name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 px-1">
          {/* Meal Image */}
          {meal.image_url && (
            <div className="w-full">
              <img 
                src={meal.image_url} 
                alt={meal.meal_name}
                className="w-full h-48 sm:h-64 object-cover rounded-lg border shadow-sm"
              />
            </div>
          )}

          {/* Meal Type and Category */}
          <div className="flex flex-wrap gap-2">
            {meal.meal_type && (
              <Badge className={`${getMealTypeColor(meal.meal_type)} px-3 py-1`}>
                <Utensils className="h-3 w-3 mr-1" />
                {meal.meal_type}
              </Badge>
            )}
            {meal.category && (
              <Badge variant="outline" className="px-3 py-1">
                <ChefHat className="h-3 w-3 mr-1" />
                {meal.category}
              </Badge>
            )}
          </div>

          {/* Meal Content/Description */}
          {meal.meal_content && (
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  Description
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  {meal.meal_content}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Nutritional Information */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-4 flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                Nutritional Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {meal.calories && (
                  <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-red-600 text-lg">🔥</span>
                      <span className="text-sm font-medium text-red-800">Calories</span>
                    </div>
                    <p className="text-lg font-bold text-red-700">{meal.calories}</p>
                  </div>
                )}
                
                {meal.protein && (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-blue-600 text-lg">💪</span>
                      <span className="text-sm font-medium text-blue-800">Protein</span>
                    </div>
                    <p className="text-lg font-bold text-blue-700">{meal.protein}g</p>
                  </div>
                )}
                
                {meal.fiber && (
                  <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-green-600 text-lg">🌾</span>
                      <span className="text-sm font-medium text-green-800">Fiber</span>
                    </div>
                    <p className="text-lg font-bold text-green-700">{meal.fiber}g</p>
                  </div>
                )}
              </div>
              
              {!meal.calories && !meal.protein && !meal.fiber && (
                <p className="text-muted-foreground text-center py-4">
                  No nutritional information recorded
                </p>
              )}
            </CardContent>
          </Card>

          {/* Date and Time */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Meal Details
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Date:</span>
                  <span>{formatDate(meal.logged_at)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Time:</span>
                  <span>{formatTime(meal.logged_at)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="flex justify-between gap-3 pt-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          
          <div className="flex gap-2">
            {onEdit && (
              <Button
                variant="outline"
                onClick={() => {
                  onEdit(meal);
                  onClose();
                }}
                className="flex items-center gap-2"
              >
                <Edit2 className="h-4 w-4" />
                Edit
              </Button>
            )}
            
            {onDelete && (
              <Button
                variant="destructive"
                onClick={() => {
                  onDelete(meal.id);
                  onClose();
                }}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MealDetailsModal;