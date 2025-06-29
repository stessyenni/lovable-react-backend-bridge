
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Camera, Upload, X } from "lucide-react";

interface DietEntryProps {
  onSuccess?: () => void;
  editMode?: boolean;
  existingEntry?: any;
}

const DietEntry = ({ onSuccess, editMode = false, existingEntry }: DietEntryProps) => {
  const [mealName, setMealName] = useState(existingEntry?.meal_name || "");
  const [mealType, setMealType] = useState(existingEntry?.meal_type || "");
  const [calories, setCalories] = useState(existingEntry?.calories?.toString() || "");
  const [protein, setProtein] = useState(existingEntry?.protein || "");
  const [fiber, setFiber] = useState(existingEntry?.fiber || "");
  const [mealContent, setMealContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

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

      const mealData = {
        user_id: user.id,
        meal_name: mealName,
        meal_type: mealType,
        calories: calories ? parseInt(calories) : null,
        protein: protein || null,
        fiber: fiber || null,
        meal_content: mealContent || null,
        image_url: imageUrl,
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
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          {editMode ? "Edit Meal Entry" : "Add Meal Entry"}
        </CardTitle>
        <CardDescription>
          {editMode ? "Update your meal information" : "Log your meals to track your nutrition"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mealName">Meal Name *</Label>
            <Input
              id="mealName"
              placeholder="e.g., Grilled Chicken Salad"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mealType">Meal Type</Label>
            <Select value={mealType} onValueChange={setMealType}>
              <SelectTrigger>
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
            <Label htmlFor="mealContent">Meal Content</Label>
            <Textarea
              id="mealContent"
              placeholder="List the ingredients or components of your meal..."
              value={mealContent}
              onChange={(e) => setMealContent(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Meal Image</Label>
            <div className="flex gap-2">
              <Input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageSelect}
                className="flex-1"
              />
              <Button type="button" variant="outline" size="icon">
                <Camera className="h-4 w-4" />
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
                  className="absolute top-1 right-1"
                  onClick={removeImage}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="calories">Calories</Label>
              <Input
                id="calories"
                type="number"
                placeholder="250"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                id="protein"
                placeholder="20"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fiber">Fiber (g)</Label>
              <Input
                id="fiber"
                placeholder="5"
                value={fiber}
                onChange={(e) => setFiber(e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (editMode ? "Updating..." : "Adding...") : (editMode ? "Update Meal" : "Add Meal")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DietEntry;
