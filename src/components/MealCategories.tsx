
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Tag, Save, X, Edit2, Undo2, Redo2 } from "lucide-react";

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
  const [editingCategoryId, setEditingCategoryId] = useState("");
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [history, setHistory] = useState<MealCategory[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    const savedCategories = localStorage.getItem('mealCategories');
    let initialCategories: MealCategory[];
    
    if (savedCategories) {
      initialCategories = JSON.parse(savedCategories);
    } else {
      initialCategories = [
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
      localStorage.setItem('mealCategories', JSON.stringify(initialCategories));
    }
    
    setCategories(initialCategories);
    setHistory([initialCategories]);
    setHistoryIndex(0);
  };

  const saveToHistory = (newCategories: MealCategory[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newCategories]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const saveCategories = (updatedCategories: MealCategory[]) => {
    saveToHistory(updatedCategories);
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

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const previousState = history[newIndex];
      setCategories([...previousState]);
      setHistoryIndex(newIndex);
      localStorage.setItem('mealCategories', JSON.stringify(previousState));
      toast({
        title: "Undone",
        description: "Last action has been undone.",
      });
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const nextState = history[newIndex];
      setCategories([...nextState]);
      setHistoryIndex(newIndex);
      localStorage.setItem('mealCategories', JSON.stringify(nextState));
      toast({
        title: "Redone",
        description: "Action has been redone.",
      });
    }
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

  const startEditingCategory = (category: MealCategory) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
  };

  const saveEditingCategory = () => {
    if (!editingCategoryName.trim()) return;
    
    const updatedCategories = categories.map(category => {
      if (category.id === editingCategoryId) {
        return { ...category, name: editingCategoryName };
      }
      return category;
    });

    saveCategories(updatedCategories);
    setEditingCategoryId("");
    setEditingCategoryName("");
    
    toast({
      title: "Category Updated",
      description: "Category name has been updated.",
    });
  };

  const cancelEditingCategory = () => {
    setEditingCategoryId("");
    setEditingCategoryName("");
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
    <div className="h-full max-h-[90vh] flex flex-col w-full">
      {/* Header with Save, Undo, Redo and Close buttons */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b bg-background shrink-0">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold truncate">Meal Categories</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Organize your meals into categories for easy tracking.
          </p>
        </div>
        <div className="flex gap-2 ml-2">
          <Button onClick={handleUndo} disabled={historyIndex <= 0} size="sm" variant="outline" className="text-xs sm:text-sm">
            <Undo2 className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button onClick={handleRedo} disabled={historyIndex >= history.length - 1} size="sm" variant="outline" className="text-xs sm:text-sm">
            <Redo2 className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm">
            <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Save
          </Button>
          {onClose && (
            <Button onClick={onClose} variant="outline" size="sm" className="text-xs sm:text-sm">
              <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Scrollable content */}
      <ScrollArea className="flex-1 h-0">
        <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
          {/* Add New Category */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm sm:text-base">Add New Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input
                  placeholder="Category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                  className="text-xs sm:text-sm"
                />
                <Button onClick={addCategory} size="sm" className="shrink-0">
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Add Meal to Category */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm sm:text-base">Add Meal to Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="meal-name" className="text-xs sm:text-sm">Meal Name</Label>
                <Input
                  id="meal-name"
                  placeholder="Enter meal name"
                  value={newMealName}
                  onChange={(e) => setNewMealName(e.target.value)}
                  className="text-xs sm:text-sm"
                />
              </div>
              <div>
                <Label htmlFor="category-select" className="text-xs sm:text-sm">Select Category</Label>
                <select
                  id="category-select"
                  className="w-full p-2 border rounded-md bg-background text-xs sm:text-sm"
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
                <Tag className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Add Meal
              </Button>
            </CardContent>
          </Card>

          {/* Categories Display with Edit functionality */}
          <div className="space-y-3 sm:space-y-4">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 flex-1">
                      {editingCategoryId === category.id ? (
                        <div className="flex items-center space-x-2 flex-1">
                          <Input
                            value={editingCategoryName}
                            onChange={(e) => setEditingCategoryName(e.target.value)}
                            className="text-xs sm:text-sm"
                            onKeyPress={(e) => e.key === 'Enter' && saveEditingCategory()}
                          />
                          <Button size="sm" onClick={saveEditingCategory} className="bg-green-600 hover:bg-green-700">
                            <Save className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelEditingCategory}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Badge className={`${category.color} text-xs`}>{category.name}</Badge>
                          <span className="text-xs text-muted-foreground">
                            ({category.meals.length} meals)
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditingCategory(category)}
                            className="h-6 w-6 p-0 text-blue-500 hover:text-blue-700"
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                    {editingCategoryId !== category.id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteCategory(category.id)}
                        className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {category.meals.map((meal, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="cursor-pointer group text-xs"
                        onClick={() => removeMealFromCategory(category.id, index)}
                      >
                        {meal}
                        <span className="ml-1 opacity-0 group-hover:opacity-100 text-red-500">×</span>
                      </Badge>
                    ))}
                    {category.meals.length === 0 && (
                      <span className="text-xs text-muted-foreground">No meals added yet</span>
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
