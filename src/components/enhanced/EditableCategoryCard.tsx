import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { 
  Edit, 
  Plus, 
  Save, 
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

interface EditableCategoryCardProps {
  category: MealCategory;
  onUpdate: () => void;
}

const EditableCategoryCard = ({ category, onUpdate }: EditableCategoryCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(category.name);
  const [editedDescription, setEditedDescription] = useState(category.description || "");
  const [newItemName, setNewItemName] = useState("");
  const [newItemCalories, setNewItemCalories] = useState("");
  const [newItemProtein, setNewItemProtein] = useState("");
  const [newItemServing, setNewItemServing] = useState("100g");
  const [loading, setLoading] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('fruit') || name.includes('apple')) return Apple;
    if (name.includes('vegetable') || name.includes('carrot')) return Carrot;
    if (name.includes('protein') || name.includes('meat')) return Beef;
    if (name.includes('carb') || name.includes('grain')) return Wheat;
    return ChefHat;
  };

  const handleSaveCategory = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('meal_categories')
        .update({
          name: editedName,
          description: editedDescription,
          updated_at: new Date().toISOString()
        })
        .eq('id', category.id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating category:', error);
        toast({
          title: "Error",
          description: "Failed to update category",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Category updated successfully!",
      });
      
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!user || !newItemName.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('meal_items')
        .insert({
          category_id: category.id,
          name: newItemName,
          calories_per_serving: newItemCalories ? parseInt(newItemCalories) : null,
          protein_per_serving: newItemProtein ? parseFloat(newItemProtein) : null,
          serving_size: newItemServing,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error adding item:', error);
        toast({
          title: "Error",
          description: "Failed to add item to category",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Item added to category successfully!",
      });

      // Reset form
      setNewItemName("");
      setNewItemCalories("");
      setNewItemProtein("");
      setNewItemServing("100g");
      setShowAddItem(false);
      onUpdate();
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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

  const IconComponent = getCategoryIcon(category.name);
  const items = category.meal_items || [];
  const totals = calculateCategoryTotals(items);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${category.color_class.split(' ')[0]} bg-opacity-20`}>
              <IconComponent className="h-6 w-6" />
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="text-sm"
                    placeholder="Category name"
                  />
                  <Input
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    className="text-sm"
                    placeholder="Description (optional)"
                  />
                </div>
              ) : (
                <>
                  <Badge className={category.color_class}>
                    {category.name}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {items.length} items
                  </p>
                  {category.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {category.description}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            {isEditing ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSaveCategory}
                  disabled={loading}
                >
                  <Save className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedName(category.name);
                    setEditedDescription(category.description || "");
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
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
            </div>
          </div>
        )}

        {/* Category Items */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm text-muted-foreground">Items</h4>
            <Dialog open={showAddItem} onOpenChange={setShowAddItem}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Plus className="h-3 w-3 mr-1" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Item to {category.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Item Name</label>
                    <Input
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      placeholder="e.g., Apple, Banana, Rice"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Calories</label>
                      <Input
                        type="number"
                        value={newItemCalories}
                        onChange={(e) => setNewItemCalories(e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Protein (g)</label>
                      <Input
                        type="number"
                        step="0.1"
                        value={newItemProtein}
                        onChange={(e) => setNewItemProtein(e.target.value)}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Serving Size</label>
                    <Input
                      value={newItemServing}
                      onChange={(e) => setNewItemServing(e.target.value)}
                      placeholder="100g"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddItem} disabled={loading || !newItemName.trim()}>
                      {loading ? "Adding..." : "Add Item"}
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddItem(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {items.length > 0 ? (
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
          ) : (
            <div className="text-center py-4 text-muted-foreground border-2 border-dashed border-muted rounded-lg">
              <p className="text-sm">No items in this category yet</p>
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          Created: {new Date(category.created_at).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default EditableCategoryCard;