
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Brain, Stethoscope, AlertTriangle, CheckCircle, Clock, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const AIConsultation = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [symptoms, setSymptoms] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { data: consultations = [], isLoading, refetch } = useQuery({
    queryKey: ["ai-consultations", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("ai_consultations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleAnalysis = async () => {
    if (!symptoms.trim() || !user) return;

    setIsAnalyzing(true);
    try {
      const symptomsArray = symptoms.split('\n').filter(s => s.trim());
      
      // Mock AI analysis - In production, this would call an AI service
      const mockAnalysis = {
        severity_level: symptomsArray.length > 3 ? 'medium' : 'low',
        ai_recommendation: `Based on your symptoms, here are some general recommendations: 
        1. Monitor your symptoms closely
        2. Stay hydrated and get adequate rest
        3. Consider consulting with a healthcare provider
        4. Maintain a healthy diet and lifestyle`,
        recommended_action: symptomsArray.length > 3 
          ? "Consider scheduling an appointment with your healthcare provider"
          : "Continue monitoring symptoms and practice self-care"
      };

      const { error } = await supabase
        .from("ai_consultations")
        .insert({
          user_id: user.id,
          symptoms: symptomsArray,
          ai_recommendation: mockAnalysis.ai_recommendation,
          severity_level: mockAnalysis.severity_level,
          recommended_action: mockAnalysis.recommended_action
        });

      if (error) throw error;

      toast({
        title: "Analysis complete!",
        description: "Your symptoms have been analyzed. Check the results below.",
      });

      setSymptoms("");
      refetch();
    } catch (error: any) {
      toast({
        title: "Analysis failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low':
        return <CheckCircle className="h-4 w-4 text-hemapp-green" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'high':
      case 'urgent':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-hemapp-green" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-hemapp-green/10 text-hemapp-green border-hemapp-green';
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'high':
      case 'urgent':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-hemapp-green/10 text-hemapp-green border-hemapp-green';
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
        <h2 className="text-2xl font-bold mb-2">AI Health Consultation</h2>
        <p className="text-white/90">Get AI-powered health insights and recommendations based on your symptoms.</p>
      </div>

      {/* Symptom Input */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-royal-blue">
            <Stethoscope className="h-5 w-5" />
            <span>Describe Your Symptoms</span>
          </CardTitle>
          <CardDescription>
            Please describe your symptoms in detail. List each symptom on a separate line.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter your symptoms here... (e.g., headache, fatigue, nausea)"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows={6}
            className="border-royal-blue/30"
          />
          <Button 
            onClick={handleAnalysis}
            disabled={!symptoms.trim() || isAnalyzing}
            className="w-full bg-royal-blue hover:bg-royal-blue/90"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Get AI Analysis
              </>
            )}
          </Button>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Important Disclaimer</p>
                <p>This AI consultation is for informational purposes only and should not replace professional medical advice. Always consult with qualified healthcare providers for medical concerns.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Previous Consultations */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-dark-purple">Previous Consultations</h3>
        {consultations.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No consultations yet</h3>
              <p className="text-muted-foreground">
                Start by describing your symptoms for an AI health analysis.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {consultations.map((consultation) => (
              <Card key={consultation.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {new Date(consultation.created_at).toLocaleDateString()}
                    </CardTitle>
                    <Badge className={getSeverityColor(consultation.severity_level)}>
                      {getSeverityIcon(consultation.severity_level)}
                      <span className="ml-1 capitalize">{consultation.severity_level}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-dark-purple mb-2">Symptoms</h4>
                    <div className="flex flex-wrap gap-2">
                      {consultation.symptoms?.map((symptom, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-dark-purple mb-2">AI Recommendation</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {consultation.ai_recommendation}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-dark-purple mb-2">Recommended Action</h4>
                    <p className="text-sm text-muted-foreground">
                      {consultation.recommended_action}
                    </p>
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

export default AIConsultation;
