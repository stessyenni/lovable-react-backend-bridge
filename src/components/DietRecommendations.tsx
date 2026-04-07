import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { 
  Apple, Utensils, TrendingUp, TrendingDown, Target,
  ChefHat, Leaf, Star
} from "lucide-react";
import { cameroonRecommendations, quantitySuggestions, type DietRecommendation } from "@/components/diet/recommendationsData";

const DietRecommendations = () => {
  const [activeGoal, setActiveGoal] = useState<'weight-loss' | 'weight-gain' | 'maintain' | 'health'>('maintain');
  const { user } = useAuth();

  const filteredRecommendations = cameroonRecommendations.filter(
    rec => rec.category === activeGoal
  );

  const getGoalIcon = (goal: string) => {
    switch (goal) {
      case 'weight-loss': return <TrendingDown className="h-4 w-4" />;
      case 'weight-gain': return <TrendingUp className="h-4 w-4" />;
      case 'maintain': return <Target className="h-4 w-4" />;
      case 'health': return <Leaf className="h-4 w-4" />;
      default: return <Apple className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'delicacy': return <ChefHat className="h-3 w-3" />;
      case 'fruit': return <Apple className="h-3 w-3" />;
      case 'vegetable': return <Leaf className="h-3 w-3" />;
      default: return <Utensils className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="px-1">
        <h2 className="text-xl sm:text-2xl font-bold">Diet Recommendations</h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Personalized food recommendations featuring Cameroonian delicacies and
          local ingredients
        </p>
      </div>

      <Tabs
        value={activeGoal}
        onValueChange={(value) => setActiveGoal(value as any)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1">
          <TabsTrigger
            value="weight-loss"
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
          >
            <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Lose Weight</span>
            <span className="sm:hidden">Lose</span>
          </TabsTrigger>
          <TabsTrigger
            value="weight-gain"
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
          >
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Gain Weight</span>
            <span className="sm:hidden">Gain</span>
          </TabsTrigger>
          <TabsTrigger
            value="maintain"
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
          >
            <Target className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Maintain</span>
            <span className="sm:hidden">Keep</span>
          </TabsTrigger>
          <TabsTrigger
            value="health"
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
          >
            <Leaf className="h-3 w-3 sm:h-4 sm:w-4" />
            Health
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeGoal} className="space-y-3 sm:space-y-4">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                {getGoalIcon(activeGoal)}
                {activeGoal === "weight-loss" && "Weight Loss Recommendations"}
                {activeGoal === "weight-gain" && "Weight Gain Recommendations"}
                {activeGoal === "maintain" &&
                  "Weight Maintenance Recommendations"}
                {activeGoal === "health" && "Health Management Recommendations"}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Local Cameroonian foods and delicacies to help you achieve your
                goals
              </CardDescription>
            </CardHeader>
          </Card>

          <ScrollArea className="h-[400px] sm:h-[500px] md:h-[600px]">
            <div className="grid gap-3 sm:gap-4 p-1">
              {filteredRecommendations.map((rec) => (
                <Card
                  key={rec.id}
                  className="hover:shadow-md transition-shadow overflow-hidden"
                >
                  {/* Image + Header */}
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-48 md:w-56 shrink-0">
                      <AspectRatio ratio={4 / 3} className="sm:h-full">
                        <img
                          src={rec.image}
                          alt={rec.name}
                          loading="lazy"
                          className="object-cover w-full h-full display-flex align-items-center rounded-t-lg sm:rounded-t-none sm:rounded-l-lg"
                        />
                      </AspectRatio>
                    </div>

                    <div className="flex-1 min-w-0">
                      <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-4">
                        <div className="flex items-center gap-1 sm:gap-2 mb-1 flex-wrap">
                          <CardTitle className="text-sm sm:text-base md:text-lg">
                            {rec.name}
                          </CardTitle>
                          {rec.isLocal && (
                            <Badge variant="secondary" className="text-xs">
                              <Star className="h-3 w-3 mr-1" /> Local
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {getTypeIcon(rec.type)}
                            <span className="ml-1 capitalize">{rec.type}</span>
                          </Badge>
                        </div>
                        <CardDescription className="text-xs sm:text-sm">
                          {rec.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-3 p-3 sm:p-4 pt-0">
                        {/* Benefits */}
                        <div>
                          <h4 className="font-medium text-xs sm:text-sm mb-1">
                            Benefits:
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {rec.benefits.map((b, i) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className="text-xs"
                              >
                                {b}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Nutritional Info */}
                        <div>
                          <h4 className="font-medium text-xs sm:text-sm mb-1">
                            Nutritional Info (per 100g):
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-xs sm:text-sm">
                            <div className="flex items-center">
                              <span className="mr-1">🔥</span>
                              <span className="font-medium">
                                {rec.nutritionalInfo.calories}
                              </span>
                              <span className="text-muted-foreground ml-1">
                                cal
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="mr-1">💪</span>
                              <span className="font-medium">
                                {rec.nutritionalInfo.protein}
                              </span>
                              <span className="text-muted-foreground ml-1">
                                protein
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="mr-1">⚡</span>
                              <span className="font-medium">
                                {rec.nutritionalInfo.carbs}
                              </span>
                              <span className="text-muted-foreground ml-1">
                                carbs
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="mr-1">🥑</span>
                              <span className="font-medium">
                                {rec.nutritionalInfo.fat}
                              </span>
                              <span className="text-muted-foreground ml-1">
                                fat
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="mr-1">🌾</span>
                              <span className="font-medium">
                                {rec.nutritionalInfo.fiber}
                              </span>
                              <span className="text-muted-foreground ml-1">
                                fiber
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Quantity */}
                        <div>
                          <h4 className="font-medium text-xs sm:text-sm mb-1">
                            Suggested Quantity (per meal):
                          </h4>
                          <p className="text-xs sm:text-sm">
                            {quantitySuggestions[rec.name] ??
                              "Adjust portion to your goals; combine with vegetables or lean protein as needed."}
                          </p>
                        </div>

                        {/* Serving Sizes */}
                        <div>
                          <h4 className="font-medium text-xs sm:text-sm mb-1">
                            Suggested Serving Sizes:
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                            <div className="p-2 bg-muted/50 rounded">
                              <p className="font-medium">
                                Regular Meal Portion:
                              </p>
                              <p className="text-muted-foreground">
                                150-200g per serving
                              </p>
                            </div>
                            <div className="p-2 bg-muted/50 rounded">
                              <p className="font-medium">Snack Portion:</p>
                              <p className="text-muted-foreground">
                                50-100g per serving
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            💡 Tip: Adjust portions based on your daily caloric
                            needs and health goals
                          </p>
                        </div>

                        {/* Preparation */}
                        {rec.preparation && (
                          <div>
                            <h4 className="font-medium text-xs sm:text-sm mb-1">
                              Preparation Tips:
                            </h4>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              {rec.preparation}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DietRecommendations;
