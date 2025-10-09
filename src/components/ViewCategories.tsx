import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useMealCategories } from "@/hooks/useMealCategories";
import EditableCategoryCard from "@/components/enhanced/EditableCategoryCard";
import { 
  X,
  Apple,
  Carrot,
  Beef,
  Wheat,
  ChefHat
} from "lucide-react";

interface MealCategory {
  id: string;
  name: string;
  description?: string;
  color_class: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  meal_items?: MealItem[];
}

interface MealItem {
  id: string;
  name: string;
  calories_per_serving?: number;
  protein_per_serving?: number;
  carbs_per_serving?: number;
  fat_per_serving?: number;
  fiber_per_serving?: number;
  serving_size: string;
  image_url?: string;
}

interface ViewCategoriesProps {
  onClose?: () => void;
}

const ViewCategories = ({ onClose }: ViewCategoriesProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { categories, loading, fetchCategories } = useMealCategories();

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('fruit') || name.includes('apple')) return Apple;
    if (name.includes('vegetable') || name.includes('carrot')) return Carrot;
    if (name.includes('protein') || name.includes('meat')) return Beef;
    if (name.includes('carb') || name.includes('grain')) return Wheat;
    return ChefHat;
  };

  const calculateCategoryTotals = (items: MealItem[]) => {
    return items.reduce((totals, item) => {
      return {
        totalCalories: totals.totalCalories + (item.calories_per_serving || 0),
        totalProtein: totals.totalProtein + (item.protein_per_serving || 0),
        totalCarbs: totals.totalCarbs + (item.carbs_per_serving || 0),
        totalFat: totals.totalFat + (item.fat_per_serving || 0),
        totalFiber: totals.totalFiber + (item.fiber_per_serving || 0)
      };
    }, {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      totalFiber: 0
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading meal categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full max-h-[90vh] flex flex-col w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background shrink-0">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold">View Categories</h3>
          <p className="text-sm text-muted-foreground">
            Browse meal categories like fruits, vegetables, proteins, carbs, etc. with nutritional summaries
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
            {/* Categories Display */}
            {categories.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No meal categories yet</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Create categories like "Fruits", "Vegetables", "Proteins", etc. to organize your meals
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <EditableCategoryCard 
                    key={category.id} 
                    category={category} 
                    onUpdate={fetchCategories}
                  />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ViewCategories;