import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Camera, X, Save } from "lucide-react";

interface MealCategory {
  id: string;
  name: string;
  color: string;
  meals: string[];
}

interface DietEntryProps {
  onSuccess?: () => void;
  editMode?: boolean;
  existingEntry?: any;
  onClose?: () => void;
}

const DietEntry = ({ onSuccess, editMode = false, existingEntry, onClose }: DietEntryProps) => {
  const [mealName, setMealName] = useState(existingEntry?.meal_name || "");
  const [mealType, setMealType] = useState(existingEntry?.meal_type || "");
  const [calories, setCalories] = useState(existingEntry?.calories?.toString() || "");
  const [protein, setProtein] = useState(existingEntry?.protein || "");
  const [fiber, setFiber] = useState(existingEntry?.fiber || "");
  const [mealContent, setMealContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(existingEntry?.category || "");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categories, setCategories] = useState<MealCategory[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Load categories from localStorage
    const savedCategories = localStorage.getItem('mealCategories');
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
  }, []);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const addNewCategory = () => {
    if (!newCategoryName.trim()) return;

    const newCategory: MealCategory = {
      id: Date.now().toString(),
      name: newCategoryName,
      color: 'bg-purple-100 text-purple-800',
      meals: []
    };

    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    localStorage.setItem('mealCategories', JSON.stringify(updatedCategories));
    setSelectedCategory(newCategory.id);
    setNewCategoryName("");
    
    toast({
      title: "Category Added",
      description: `"${newCategoryName}" category has been created.`,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      let imageUrl = null;

      // Upload image if selected
      if (selectedImage) {
        const fileExt = selectedImage.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('meal-images')
          .upload(fileName, selectedImage);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('meal-images')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrl;
      }

      // Get selected category name
      const categoryName = categories.find(cat => cat.id === selectedCategory)?.name || null;

      const mealData = {
        user_id: user.id,
        meal_name: mealName,
        meal_type: mealType,
        calories: calories ? parseInt(calories) : null,
        protein: protein || null,
        fiber: fiber || null,
        meal_content: mealContent || null,
        image_url: imageUrl,
        category: categoryName,
        logged_at: editMode ? existingEntry.logged_at : new Date().toISOString(),
      };

      let error;
      if (editMode && existingEntry) {
        const { error: updateError } = await supabase
          .from('diet_entries')
          .update(mealData)
          .eq('id', existingEntry.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('diet_entries')
          .insert(mealData);
        error = insertError;
      }

      if (error) {
        console.error('Error saving meal:', error);
        toast({
          title: "Error",
          description: "Failed to save meal entry",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: editMode ? "Meal updated successfully!" : "Meal added successfully!",
      });

      // Reset form if not in edit mode
      if (!editMode) {
        setMealName("");
        setMealType("");
        setCalories("");
        setProtein("");
        setFiber("");
        setMealContent("");
        setSelectedCategory("");
        setSelectedImage(null);
        setImagePreview(null);
      }

      if (onSuccess) {
        onSuccess();
      }
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

  return (
    <div className="w-full max-w-full h-full flex flex-col">
      {/* Header with Save and Close buttons */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b bg-background shrink-0">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold truncate">
            {editMode ? "Edit Meal Entry" : "Add Meal Entry"}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {editMode ? "Update your meal information" : "Log your meals to track your nutrition"}
          </p>
        </div>
        <div className="flex gap-2 ml-2">
          <Button 
            onClick={handleSubmit} 
            disabled={loading}
            size="sm" 
            className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm"
          >
            <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            {loading ? (editMode ? "Updating..." : "Saving...") : (editMode ? "Update" : "Save")}
          </Button>
          {onClose && (
            <Button onClick={onClose} variant="outline" size="sm" className="text-xs sm:text-sm">
              <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Close
            </Button>
          )}
        </div>
      </div>
      
      {/* Scrollable form content */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mealName" className="text-xs sm:text-sm">Meal Name *</Label>
            <Input
              id="mealName"
              placeholder="e.g., Grilled Chicken Salad"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              required
              className="text-xs sm:text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mealType" className="text-xs sm:text-sm">Meal Type</Label>
            <Select value={mealType} onValueChange={setMealType}>
              <SelectTrigger className="text-xs sm:text-sm">
                <SelectValue placeholder="Select meal type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="snack">Snack</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mealCategory" className="text-xs sm:text-sm">Meal Category</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="text-xs sm:text-sm">
                <SelectValue placeholder="Select or add category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex space-x-2 mt-2">
              <Input
                placeholder="New category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addNewCategory()}
                className="text-xs sm:text-sm"
              />
              <Button type="button" onClick={addNewCategory} size="sm" variant="outline" className="shrink-0">
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mealContent" className="text-xs sm:text-sm">Meal Content</Label>
            <Textarea
              id="mealContent"
              placeholder="List the ingredients or components of your meal..."
              value={mealContent}
              onChange={(e) => setMealContent(e.target.value)}
              rows={3}
              className="text-xs sm:text-sm resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs sm:text-sm">Meal Image</Label>
            <div className="flex gap-2">
              <Input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageSelect}
                className="flex-1 text-xs sm:text-sm"
              />
              <Button type="button" variant="outline" size="sm" className="shrink-0">
                <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
            
            {imagePreview && (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Meal preview" 
                  className="w-full h-32 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1 h-6 w-6 p-0"
                  onClick={removeImage}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="calories" className="text-xs sm:text-sm">Calories</Label>
              <Input
                id="calories"
                type="number"
                placeholder="250"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                min="0"
                className="text-xs sm:text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="protein" className="text-xs sm:text-sm">Protein (g)</Label>
              <Input
                id="protein"
                placeholder="20"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                className="text-xs sm:text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fiber" className="text-xs sm:text-sm">Fiber (g)</Label>
              <Input
                id="fiber"
                placeholder="5"
                value={fiber}
                onChange={(e) => setFiber(e.target.value)}
                className="text-xs sm:text-sm"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DietEntry;
