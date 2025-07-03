
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Tag, Save, X } from "lucide-react";

interface MealCategory {
  id: string;
  name: string;
  color: string;
  meals: string[];
}

interface MealCategoriesProps {
  onClose?: () => void;
}

const MealCategories = ({ onClose }: MealCategoriesProps) => {
  const [categories, setCategories] = useState<MealCategory[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newMealName, setNewMealName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Load categories from localStorage
    const savedCategories = localStorage.getItem('mealCategories');
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      // Default categories
      const defaultCategories: MealCategory[] = [
        {
          id: '1',
          name: 'Protein Rich',
          color: 'bg-red-100 text-red-800',
          meals: ['Grilled Chicken', 'Fish', 'Eggs', 'Protein Shake']
        },
        {
          id: '2',
          name: 'Vegetables',
          color: 'bg-green-100 text-green-800',
          meals: ['Salad', 'Broccoli', 'Spinach', 'Carrots']
        },
        {
          id: '3',
          name: 'Fruits',
          color: 'bg-yellow-100 text-yellow-800',
          meals: ['Apple', 'Banana', 'Orange', 'Berries']
        },
        {
          id: '4',
          name: 'Carbs',
          color: 'bg-blue-100 text-blue-800',
          meals: ['Rice', 'Pasta', 'Bread', 'Potatoes']
        }
      ];
      setCategories(defaultCategories);
      localStorage.setItem('mealCategories', JSON.stringify(defaultCategories));
    }
  }, []);

  const saveCategories = (updatedCategories: MealCategory[]) => {
    setCategories(updatedCategories);
    localStorage.setItem('mealCategories', JSON.stringify(updatedCategories));
  };

  const handleSave = () => {
    localStorage.setItem('mealCategories', JSON.stringify(categories));
    toast({
      title: "Categories Saved",
      description: "Your meal categories have been saved successfully.",
    });
  };

  const addCategory = () => {
    if (!newCategoryName.trim()) return;

    const newCategory: MealCategory = {
      id: Date.now().toString(),
      name: newCategoryName,
      color: 'bg-purple-100 text-purple-800',
      meals: []
    };

    const updatedCategories = [...categories, newCategory];
    saveCategories(updatedCategories);
    setNewCategoryName("");
    
    toast({
      title: "Category Added",
      description: `"${newCategoryName}" category has been created.`,
    });
  };

  const deleteCategory = (categoryId: string) => {
    const updatedCategories = categories.filter(cat => cat.id !== categoryId);
    saveCategories(updatedCategories);
    
    toast({
      title: "Category Deleted",
      description: "Category has been removed.",
    });
  };

  const addMealToCategory = () => {
    if (!newMealName.trim() || !selectedCategoryId) return;

    const updatedCategories = categories.map(category => {
      if (category.id === selectedCategoryId) {
        return {
          ...category,
          meals: [...category.meals, newMealName]
        };
      }
      return category;
    });

    saveCategories(updatedCategories);
    setNewMealName("");
    setSelectedCategoryId("");
    
    toast({
      title: "Meal Added",
      description: `"${newMealName}" has been added to the category.`,
    });
  };

  const removeMealFromCategory = (categoryId: string, mealIndex: number) => {
    const updatedCategories = categories.map(category => {
      if (category.id === categoryId) {
        const updatedMeals = category.meals.filter((_, index) => index !== mealIndex);
        return {
          ...category,
          meals: updatedMeals
        };
      }
      return category;
    });

    saveCategories(updatedCategories);
    
    toast({
      title: "Meal Removed",
      description: "Meal has been removed from the category.",
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with Save and Close buttons */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h3 className="text-lg font-semibold">Meal Categories</h3>
          <p className="text-sm text-muted-foreground">
            Organize your meals into categories for easy tracking and repetition.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          {onClose && (
            <Button onClick={onClose} variant="outline" size="sm">
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Scrollable content */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {/* Add New Category */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Add New Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input
                  placeholder="Category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                />
                <Button onClick={addCategory} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Add Meal to Category */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Add Meal to Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="meal-name">Meal Name</Label>
                <Input
                  id="meal-name"
                  placeholder="Enter meal name"
                  value={newMealName}
                  onChange={(e) => setNewMealName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="category-select">Select Category</Label>
                <select
                  id="category-select"
                  className="w-full p-2 border rounded-md"
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                >
                  <option value="">Choose a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <Button onClick={addMealToCategory} className="w-full" size="sm">
                <Tag className="h-4 w-4 mr-2" />
                Add Meal
              </Button>
            </CardContent>
          </Card>

          {/* Categories Display */}
          <div className="space-y-4">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center space-x-2">
                      <Badge className={category.color}>{category.name}</Badge>
                      <span className="text-xs text-muted-foreground">
                        ({category.meals.length} meals)
                      </span>
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteCategory(category.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {category.meals.map((meal, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="cursor-pointer group"
                        onClick={() => removeMealFromCategory(category.id, index)}
                      >
                        {meal}
                        <span className="ml-1 opacity-0 group-hover:opacity-100 text-red-500">×</span>
                      </Badge>
                    ))}
                    {category.meals.length === 0 && (
                      <span className="text-sm text-muted-foreground">No meals added yet</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default MealCategories;
