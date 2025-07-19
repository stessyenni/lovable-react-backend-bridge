import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
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
  const [categories, setCategories] = useState<MealCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCategories();
    }
  }, [user]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      
      // Fetch categories with their meal items
      const { data: categoriesData, error: categoriesError } = await (supabase as any)
        .from('meal_categories')
        .select(`
          *,
          meal_items (*)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError);
        toast({
          title: "Error",
          description: "Failed to load meal categories",
          variant: "destructive",
        });
        return;
      }

      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

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
                {categories.map((category) => {
                  const IconComponent = getCategoryIcon(category.name);
                  const items = category.meal_items || [];
                  const totals = calculateCategoryTotals(items);

                  return (
                    <Card key={category.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${category.color_class.split(' ')[0]} bg-opacity-20`}>
                              <IconComponent className="h-6 w-6" />
                            </div>
                            <div>
                              <Badge className={category.color_class}>
                                {category.name}
                              </Badge>
                              <p className="text-xs text-muted-foreground mt-1">
                                {items.length} items
                              </p>
                            </div>
                          </div>
                        </div>
                        {category.description && (
                          <CardDescription className="mt-2">{category.description}</CardDescription>
                        )}
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        {/* Category Nutritional Summary */}
                        {items.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="font-medium text-sm text-muted-foreground">Nutritional Summary</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="flex items-center">
                                <span className="text-red-600 mr-1">🔥</span>
                                <span className="font-medium">{Math.round(totals.totalCalories)}</span>
                                <span className="text-muted-foreground ml-1">cal</span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-blue-600 mr-1">💪</span>
                                <span className="font-medium">{Math.round(totals.totalProtein * 10) / 10}g</span>
                                <span className="text-muted-foreground ml-1">protein</span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-orange-600 mr-1">🌾</span>
                                <span className="font-medium">{Math.round(totals.totalCarbs * 10) / 10}g</span>
                                <span className="text-muted-foreground ml-1">carbs</span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-green-600 mr-1">🥑</span>
                                <span className="font-medium">{Math.round(totals.totalFat * 10) / 10}g</span>
                                <span className="text-muted-foreground ml-1">fat</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Sample Items in Category */}
                        {items.length > 0 ? (
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm text-muted-foreground">Sample Items</h4>
                            <div className="space-y-2">
                              {items.slice(0, 3).map((item) => (
                                <div 
                                  key={item.id} 
                                  className="p-2 bg-muted/50 rounded text-sm border"
                                >
                                  <div className="font-medium">{item.name}</div>
                                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                    {item.calories_per_serving && (
                                      <span>{item.calories_per_serving} cal</span>
                                    )}
                                    <span>per {item.serving_size}</span>
                                  </div>
                                </div>
                              ))}
                              {items.length > 3 && (
                                <div className="text-xs text-muted-foreground text-center py-1">
                                  +{items.length - 3} more items
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-4 text-muted-foreground border-2 border-dashed border-muted rounded-lg">
                            <p className="text-sm">No items in this category yet</p>
                          </div>
                        )}

                        <div className="text-xs text-muted-foreground">
                          Created: {new Date(category.created_at).toLocaleDateString()}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ViewCategories;