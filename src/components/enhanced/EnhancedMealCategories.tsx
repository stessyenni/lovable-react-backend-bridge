import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  Image as ImageIcon,
  Info,
  ChefHat,
  Target,
  Utensils
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  ai_analysis_data?: any;
}

interface EnhancedMealCategoriesProps {
  onClose?: () => void;
}

const EnhancedMealCategories = ({ onClose }: EnhancedMealCategoriesProps) => {
  const [categories, setCategories] = useState<MealCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<MealCategory | null>(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    color_class: "bg-purple-100 text-purple-800"
  });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [newMealItem, setNewMealItem] = useState({
    name: "",
    calories_per_serving: "",
    protein_per_serving: "",
    carbs_per_serving: "",
    fat_per_serving: "",
    fiber_per_serving: "",
    serving_size: "100g"
  });

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

  const createCategory = async () => {
    if (!newCategory.name.trim() || !user) return;

    try {
      const { error } = await (supabase as any)
        .from('meal_categories')
        .insert({
          user_id: user.id,
          name: newCategory.name,
          description: newCategory.description,
          color_class: newCategory.color_class
        });

      if (error) throw error;

      toast({
        title: "Category Created",
        description: `"${newCategory.name}" category has been created.`,
      });

      setNewCategory({ name: "", description: "", color_class: "bg-purple-100 text-purple-800" });
      setShowAddCategory(false);
      fetchCategories();
    } catch (error) {
      console.error('Error creating category:', error);
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      });
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      const { error } = await (supabase as any)
        .from('meal_categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;

      toast({
        title: "Category Deleted",
        description: "Category has been removed successfully.",
      });

      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  const addMealItem = async (categoryId: string) => {
    if (!newMealItem.name.trim()) return;

    try {
      const { error } = await (supabase as any)
        .from('meal_items')
        .insert({
          category_id: categoryId,
          name: newMealItem.name,
          calories_per_serving: newMealItem.calories_per_serving ? parseInt(newMealItem.calories_per_serving) : null,
          protein_per_serving: newMealItem.protein_per_serving ? parseFloat(newMealItem.protein_per_serving) : null,
          carbs_per_serving: newMealItem.carbs_per_serving ? parseFloat(newMealItem.carbs_per_serving) : null,
          fat_per_serving: newMealItem.fat_per_serving ? parseFloat(newMealItem.fat_per_serving) : null,
          fiber_per_serving: newMealItem.fiber_per_serving ? parseFloat(newMealItem.fiber_per_serving) : null,
          serving_size: newMealItem.serving_size
        });

      if (error) throw error;

      toast({
        title: "Meal Added",
        description: `"${newMealItem.name}" has been added to the category.`,
      });

      setNewMealItem({
        name: "",
        calories_per_serving: "",
        protein_per_serving: "",
        carbs_per_serving: "",
        fat_per_serving: "",
        fiber_per_serving: "",
        serving_size: "100g"
      });
      setSelectedCategory(null);
      fetchCategories();
    } catch (error) {
      console.error('Error adding meal item:', error);
      toast({
        title: "Error",
        description: "Failed to add meal item",
        variant: "destructive",
      });
    }
  };

  const deleteMealItem = async (itemId: string) => {
    try {
      const { error } = await (supabase as any)
        .from('meal_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      toast({
        title: "Meal Removed",
        description: "Meal item has been removed from the category.",
      });

      fetchCategories();
    } catch (error) {
      console.error('Error deleting meal item:', error);
      toast({
        title: "Error",
        description: "Failed to delete meal item",
        variant: "destructive",
      });
    }
  };

  const colorOptions = [
    "bg-red-100 text-red-800",
    "bg-green-100 text-green-800",
    "bg-blue-100 text-blue-800",
    "bg-yellow-100 text-yellow-800",
    "bg-purple-100 text-purple-800",
    "bg-pink-100 text-pink-800",
    "bg-indigo-100 text-indigo-800",
    "bg-orange-100 text-orange-800"
  ];

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
          <h3 className="text-lg font-semibold">Meal Categories & Management</h3>
          <p className="text-sm text-muted-foreground">
            View and manage your meal categories with nutritional information
          </p>
        </div>
        <div className="flex gap-2 ml-2">
          <Button 
            onClick={() => setShowAddCategory(true)} 
            size="sm" 
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
          {onClose && (
            <Button onClick={onClose} variant="outline" size="sm">
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Main content - unified view and manage */}
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
                    <Button 
                      onClick={() => setShowAddCategory(true)} 
                      className="mt-4"
                      variant="outline"
                    >
                      Create your first category
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              categories.map((category) => (
                <Card key={category.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge className={category.color_class}>
                          {category.name}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {category.meal_items?.length || 0} items
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingCategory(category)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteCategory(category.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {category.description && (
                      <CardDescription>{category.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Meal Items Display */}
                    {category.meal_items && category.meal_items.length > 0 ? (
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm">Meals in this category:</h4>
                        {category.meal_items.map((item) => (
                          <div 
                            key={item.id} 
                            className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border"
                          >
                            <div className="flex-1">
                              <div className="font-medium text-base">{item.name}</div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                                {item.calories_per_serving && (
                                  <div className="flex items-center text-sm">
                                    <span className="text-red-600 mr-1">🔥</span>
                                    <span className="font-medium">{item.calories_per_serving}</span>
                                    <span className="text-muted-foreground ml-1">cal</span>
                                  </div>
                                )}
                                {item.protein_per_serving && (
                                  <div className="flex items-center text-sm">
                                    <span className="text-blue-600 mr-1">💪</span>
                                    <span className="font-medium">{item.protein_per_serving}g</span>
                                    <span className="text-muted-foreground ml-1">protein</span>
                                  </div>
                                )}
                                {item.carbs_per_serving && (
                                  <div className="flex items-center text-sm">
                                    <span className="text-orange-600 mr-1">🌾</span>
                                    <span className="font-medium">{item.carbs_per_serving}g</span>
                                    <span className="text-muted-foreground ml-1">carbs</span>
                                  </div>
                                )}
                                {item.fat_per_serving && (
                                  <div className="flex items-center text-sm">
                                    <span className="text-green-600 mr-1">🥑</span>
                                    <span className="font-medium">{item.fat_per_serving}g</span>
                                    <span className="text-muted-foreground ml-1">fat</span>
                                  </div>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground mt-2">
                                Per {item.serving_size} • Added {new Date(category.created_at).toLocaleDateString()}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteMealItem(item.id)}
                              className="text-red-500 hover:text-red-700 ml-4"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground border-2 border-dashed border-muted rounded-lg">
                        <Utensils className="h-8 w-8 mx-auto mb-2" />
                        <p>No meals in this category yet</p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setSelectedCategory(category.id)}
                          className="mt-2"
                        >
                          Add first meal
                        </Button>
                      </div>
                    )}

                    {/* Quick Add Meal to This Category */}
                    {selectedCategory === category.id && (
                      <Card className="border-primary">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Add Meal to {category.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <Label>Meal Name</Label>
                            <Input
                              placeholder="Enter meal name"
                              value={newMealItem.name}
                              onChange={(e) => setNewMealItem(prev => ({ ...prev, name: e.target.value }))}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label>Calories</Label>
                              <Input
                                type="number"
                                placeholder="250"
                                value={newMealItem.calories_per_serving}
                                onChange={(e) => setNewMealItem(prev => ({ ...prev, calories_per_serving: e.target.value }))}
                              />
                            </div>
                            <div>
                              <Label>Serving Size</Label>
                              <Input
                                placeholder="100g"
                                value={newMealItem.serving_size}
                                onChange={(e) => setNewMealItem(prev => ({ ...prev, serving_size: e.target.value }))}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label>Protein (g)</Label>
                              <Input
                                type="number"
                                step="0.1"
                                placeholder="20.5"
                                value={newMealItem.protein_per_serving}
                                onChange={(e) => setNewMealItem(prev => ({ ...prev, protein_per_serving: e.target.value }))}
                              />
                            </div>
                            <div>
                              <Label>Carbs (g)</Label>
                              <Input
                                type="number"
                                step="0.1"
                                placeholder="30.0"
                                value={newMealItem.carbs_per_serving}
                                onChange={(e) => setNewMealItem(prev => ({ ...prev, carbs_per_serving: e.target.value }))}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label>Fat (g)</Label>
                              <Input
                                type="number"
                                step="0.1"
                                placeholder="10.0"
                                value={newMealItem.fat_per_serving}
                                onChange={(e) => setNewMealItem(prev => ({ ...prev, fat_per_serving: e.target.value }))}
                              />
                            </div>
                            <div>
                              <Label>Fiber (g)</Label>
                              <Input
                                type="number"
                                step="0.1"
                                placeholder="5.0"
                                value={newMealItem.fiber_per_serving}
                                onChange={(e) => setNewMealItem(prev => ({ ...prev, fiber_per_serving: e.target.value }))}
                              />
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button 
                              onClick={() => addMealItem(category.id)}
                              className="flex-1"
                              disabled={!newMealItem.name.trim()}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Meal
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => setSelectedCategory(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Add Category Dialog */}
      <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogDescription>
              Add a new meal category to organize your foods
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Category Name</Label>
              <Input
                placeholder="e.g., Protein Rich"
                value={newCategory.name}
                onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label>Description (Optional)</Label>
              <Textarea
                placeholder="Brief description of this category"
                value={newCategory.description}
                onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div>
              <Label>Color Theme</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewCategory(prev => ({ ...prev, color_class: color }))}
                    className={`px-3 py-1 rounded text-sm border-2 ${
                      newCategory.color_class === color ? 'border-primary' : 'border-transparent'
                    } ${color}`}
                  >
                    Sample
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={createCategory} 
                className="flex-1"
                disabled={!newCategory.name.trim()}
              >
                Create Category
              </Button>
              <Button 
                onClick={() => setShowAddCategory(false)} 
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedMealCategories;