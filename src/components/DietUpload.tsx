
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Upload, Camera, X, Save, Loader2 } from "lucide-react";

interface DietUploadProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

const DietUpload = ({ onSuccess, onClose }: DietUploadProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [additionalNotes, setAdditionalNotes] = useState("");
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
    setAnalysisResult(null);
  };

  const handleAnalyze = async () => {
    if (!selectedImage || !user) return;

    setLoading(true);
    try {
      // Upload image to storage
      const fileExt = selectedImage.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('user-uploads')
        .upload(fileName, selectedImage);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('user-uploads')
        .getPublicUrl(fileName);

      // Mock AI analysis result - in a real app, this would call an AI service
      const mockAnalysis = {
        detectedItems: [
          "Grilled chicken breast (150g)",
          "Mixed green salad (100g)",
          "Cherry tomatoes (50g)",
          "Olive oil dressing (15ml)"
        ],
        estimatedNutrition: {
          calories: 320,
          protein: "28g",
          carbs: "8g",
          fat: "18g",
          fiber: "4g"
        },
        suggestions: [
          "Great lean protein choice!",
          "Consider adding some complex carbs like quinoa",
          "Good portion of vegetables"
        ]
      };

      // Save to database
      const { error: saveError } = await supabase
        .from('diet_uploads')
        .insert({
          user_id: user.id,
          image_url: publicUrl,
          analysis_result: mockAnalysis,
          ai_suggestions: mockAnalysis.suggestions
        });

      if (saveError) throw saveError;

      setAnalysisResult(mockAnalysis);
      
      toast({
        title: "Analysis Complete",
        description: "Your meal has been analyzed successfully!",
      });
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast({
        title: "Error",
        description: "Failed to analyze the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!analysisResult || !user) return;

    setLoading(true);
    try {
      // Create a diet entry from the analysis
      const { error } = await supabase
        .from('diet_entries')
        .insert({
          user_id: user.id,
          meal_name: `AI Analyzed Meal - ${new Date().toLocaleDateString()}`,
          meal_type: 'analyzed',
          calories: analysisResult.estimatedNutrition.calories,
          protein: analysisResult.estimatedNutrition.protein,
          fiber: analysisResult.estimatedNutrition.fiber,
          meal_content: analysisResult.detectedItems.join(', ') + (additionalNotes ? ` - ${additionalNotes}` : ''),
          logged_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Meal analysis saved to your diet log!",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving analysis:', error);
      toast({
        title: "Error",
        description: "Failed to save the analysis",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header with Save and Close buttons */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b bg-background shrink-0">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold truncate">AI Photo Analysis</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Upload a photo of your meal for AI-powered nutrition analysis
          </p>
        </div>
        <div className="flex gap-2 ml-2">
          {analysisResult && (
            <Button 
              onClick={handleSave} 
              disabled={loading}
              size="sm" 
              className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm"
            >
              <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              {loading ? "Saving..." : "Save"}
            </Button>
          )}
          {onClose && (
            <Button onClick={onClose} variant="outline" size="sm" className="text-xs sm:text-sm">
              <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm sm:text-base">Upload Meal Photo</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Take or select a photo of your meal for AI analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm">Select Image</Label>
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageSelect}
                  className="flex-1 text-xs sm:text-sm"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="shrink-0"
                  onClick={() => document.querySelector('input[type="file"]')?.click()}
                >
                  <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>

            {imagePreview && (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Meal preview" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 h-6 w-6 p-0"
                  onClick={removeImage}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}

            {selectedImage && !analysisResult && (
              <Button 
                onClick={handleAnalyze} 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Analyze Photo
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        {analysisResult && (
          <>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm sm:text-base">Analysis Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-xs sm:text-sm mb-2">Detected Items:</h4>
                  <ul className="list-disc list-inside text-xs sm:text-sm space-y-1">
                    {analysisResult.detectedItems.map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-xs sm:text-sm mb-2">Estimated Nutrition:</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                    <div>Calories: {analysisResult.estimatedNutrition.calories}</div>
                    <div>Protein: {analysisResult.estimatedNutrition.protein}</div>
                    <div>Carbs: {analysisResult.estimatedNutrition.carbs}</div>
                    <div>Fat: {analysisResult.estimatedNutrition.fat}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-xs sm:text-sm mb-2">AI Suggestions:</h4>
                  <ul className="list-disc list-inside text-xs sm:text-sm space-y-1">
                    {analysisResult.suggestions.map((suggestion: string, index: number) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm sm:text-base">Additional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Add any additional notes about this meal..."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  rows={3}
                  className="text-xs sm:text-sm resize-none"
                />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default DietUpload;
