
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Camera, Upload, Sparkles, Loader2, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface DietUploadProps {
  onSuccess?: () => void;
}

const DietUpload = ({ onSuccess }: DietUploadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);

  const { data: uploads = [], isLoading, refetch } = useQuery({
    queryKey: ["diet-uploads", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("diet_uploads")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedFile) return;

    setAnalyzing(true);
    try {
      // Mock AI analysis - in a real app, this would call an AI service
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      const mockAnalysis = {
        calories: Math.floor(Math.random() * 300) + 200, // Random calories between 200-500
        items: [
          "Grilled chicken breast",
          "Mixed vegetables",
          "Brown rice"
        ],
        nutrition: {
          protein: Math.floor(Math.random() * 30) + 20,
          carbs: Math.floor(Math.random() * 40) + 30,
          fat: Math.floor(Math.random() * 15) + 10
        },
        confidence: 0.85
      };

      setAnalysis(mockAnalysis);
      
      toast({
        title: "Analysis Complete!",
        description: `Detected ${mockAnalysis.calories} calories with ${Math.round(mockAnalysis.confidence * 100)}% confidence.`,
      });
    } catch (error: any) {
      toast({
        title: "Analysis failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    setUploading(true);
    try {
      // Upload file to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('user-uploads')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('user-uploads')
        .getPublicUrl(fileName);

      // Save to database with analysis
      const { error: dbError } = await supabase
        .from("diet_uploads")
        .insert({
          user_id: user.id,
          image_url: publicUrl,
          analysis_result: analysis || { status: "pending" },
          ai_suggestions: analysis ? [
            `Estimated ${analysis.calories} calories`,
            `High in protein (${analysis.nutrition.protein}g)`,
            "Balanced meal with good nutrition profile"
          ] : ["Upload successful! AI analysis will be available soon."]
        });

      if (dbError) throw dbError;

      // If we have analysis, also add it as a diet entry
      if (analysis) {
        await supabase
          .from('diet_entries')
          .insert({
            user_id: user.id,
            meal_name: analysis.items.join(', '),
            meal_type: 'lunch', // Default to lunch
            calories: analysis.calories,
            protein: analysis.nutrition.protein.toString(),
            logged_at: new Date().toISOString(),
          });
      }

      toast({
        title: "Upload successful!",
        description: analysis ? 
          "Your meal has been analyzed and added to your diary." :
          "Your food image has been uploaded for AI analysis.",
      });

      // Reset form
      setSelectedFile(null);
      setPreview(null);
      setAnalysis(null);
      refetch();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-royal-blue" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="gradient-hemapp rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">AI Diet Photo Analysis</h2>
        <p className="text-white/90">Upload photos of your meals for AI-powered nutritional analysis and automatic calorie detection.</p>
      </div>

      {/* Upload Section */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-royal-blue">
            <Camera className="h-5 w-5" />
            <span>Upload Meal Photo</span>
          </CardTitle>
          <CardDescription>Take a photo or upload an image of your meal for AI analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meal-photo">Choose Photo</Label>
            <Input
              id="meal-photo"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="border-royal-blue/30"
            />
          </div>

          {preview && (
            <div className="space-y-4">
              <div className="relative">
                <img 
                  src={preview} 
                  alt="Meal preview" 
                  className="w-full h-64 object-cover rounded-lg shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
              </div>
              
              {!analysis && (
                <Button 
                  onClick={analyzeImage} 
                  disabled={analyzing}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Analyze with AI
                    </>
                  )}
                </Button>
              )}

              {analysis && (
                <Card className="bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-sm text-green-800">AI Analysis Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Calories:</span> {analysis.calories}
                      </div>
                      <div>
                        <span className="font-medium">Confidence:</span> {Math.round(analysis.confidence * 100)}%
                      </div>
                      <div>
                        <span className="font-medium">Protein:</span> {analysis.nutrition.protein}g
                      </div>
                      <div>
                        <span className="font-medium">Carbs:</span> {analysis.nutrition.carbs}g
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-sm">Detected items:</span>
                      <p className="text-sm text-green-700">{analysis.items.join(', ')}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button 
                onClick={handleUpload} 
                disabled={uploading}
                className="w-full bg-hemapp-green hover:bg-hemapp-green/90"
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    {analysis ? 'Save Analysis & Upload' : 'Upload for Analysis'}
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Previous Uploads */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-dark-purple">Previous Analyses</h3>
        {uploads.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No uploads yet</h3>
              <p className="text-muted-foreground">
                Start by uploading your first meal photo for AI analysis.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {uploads.map((upload) => (
              <Card key={upload.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative">
                  <img 
                    src={upload.image_url} 
                    alt="Uploaded meal" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="bg-hemapp-green text-white px-2 py-1 rounded-full text-xs flex items-center">
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI Analyzed
                    </span>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {new Date(upload.created_at).toLocaleDateString()}
                    </p>
                    {upload.ai_suggestions && upload.ai_suggestions.length > 0 && (
                      <div className="space-y-1">
                        <p className="font-medium text-sm text-dark-purple">AI Suggestions:</p>
                        {upload.ai_suggestions.slice(0, 2).map((suggestion, index) => (
                          <p key={index} className="text-xs text-muted-foreground">
                            • {suggestion}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DietUpload;
