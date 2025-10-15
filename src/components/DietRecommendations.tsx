import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { 
  Apple, 
  Utensils, 
  TrendingUp, 
  TrendingDown, 
  Target,
  ChefHat,
  Leaf,
  Star
} from "lucide-react";

interface DietRecommendation {
  id: string;
  name: string;
  description: string;
  category: 'weight-loss' | 'weight-gain' | 'maintain' | 'health';
  type: 'food' | 'fruit' | 'vegetable' | 'delicacy';
  benefits: string[];
  preparation?: string;
  nutritionalInfo: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
  };
  isLocal: boolean;
}

const cameroonRecommendations: DietRecommendation[] = [
  // Weight Loss
  {
    id: '1',
    name: 'Ndolé with Lean Fish',
    description: 'Traditional Cameroonian dish with bitter leaves, lean fish, and minimal palm oil',
    category: 'weight-loss',
    type: 'delicacy',
    benefits: ['High protein', 'Low calories', 'Rich in vitamins', 'Satisfying'],
    preparation: 'Steam fish, sauté bitter leaves with minimal oil, combine with vegetables',
    nutritionalInfo: { calories: 280, protein: '25g', carbs: '15g', fat: '12g', fiber: '8g' },
    isLocal: true
  },
  {
    id: '2', 
    name: 'African Plum (Safou)',
    description: 'Local fruit rich in healthy fats and fiber',
    category: 'weight-loss',
    type: 'fruit',
    benefits: ['Healthy fats', 'High fiber', 'Natural appetite suppressant'],
    nutritionalInfo: { calories: 120, protein: '3g', carbs: '8g', fat: '9g', fiber: '5g' },
    isLocal: true
  },
  {
    id: '3',
    name: 'Okra Soup (Gombo)',
    description: 'Light okra soup with minimal palm oil and lean protein',
    category: 'weight-loss',
    type: 'delicacy',
    benefits: ['Low calorie', 'High fiber', 'Aids digestion'],
    preparation: 'Boil okra with lean meat/fish, season with local spices',
    nutritionalInfo: { calories: 180, protein: '15g', carbs: '12g', fat: '8g', fiber: '6g' },
    isLocal: true
  },

  // Weight Gain
  {
    id: '4',
    name: 'Koki with Palm Oil',
    description: 'High-calorie cowpea pudding with palm oil and spices',
    category: 'weight-gain',
    type: 'delicacy',
    benefits: ['High calories', 'Plant protein', 'Healthy fats', 'Energy dense'],
    preparation: 'Blend cowpeas, add palm oil, wrap in leaves and steam',
    nutritionalInfo: { calories: 450, protein: '18g', carbs: '35g', fat: '28g', fiber: '12g' },
    isLocal: true
  },
  {
    id: '5',
    name: 'Plantain with Groundnut Sauce',
    description: 'Fried plantain with rich groundnut (peanut) sauce',
    category: 'weight-gain',
    type: 'delicacy',
    benefits: ['High calories', 'Healthy fats', 'Complex carbs', 'Protein'],
    preparation: 'Fry ripe plantain, prepare groundnut sauce with palm oil',
    nutritionalInfo: { calories: 520, protein: '15g', carbs: '45g', fat: '32g', fiber: '8g' },
    isLocal: true
  },
  {
    id: '6',
    name: 'Avocado (Local Variety)',
    description: 'Cameroonian avocados - larger and creamier than regular varieties',
    category: 'weight-gain',
    type: 'fruit',
    benefits: ['Healthy fats', 'High calories', 'Vitamins', 'Minerals'],
    nutritionalInfo: { calories: 380, protein: '4g', carbs: '20g', fat: '35g', fiber: '15g' },
    isLocal: true
  },

  // Health Management
  {
    id: '7',
    name: 'Bitter Kola',
    description: 'Traditional medicinal nut with health benefits',
    category: 'health',
    type: 'food',
    benefits: ['Antioxidants', 'Immune support', 'Digestive health'],
    nutritionalInfo: { calories: 45, protein: '2g', carbs: '8g', fat: '1g', fiber: '3g' },
    isLocal: true
  },
  {
    id: '8',
    name: 'Eru with Stockfish',
    description: 'Wild vegetable dish with stockfish - rich in nutrients',
    category: 'health',
    type: 'delicacy',
    benefits: ['Iron rich', 'Protein', 'Vitamins', 'Minerals'],
    preparation: 'Steam eru leaves with stockfish, season with crayfish',
    nutritionalInfo: { calories: 220, protein: '20g', carbs: '10g', fat: '12g', fiber: '6g' },
    isLocal: true
  },

  // Maintain Weight
  {
    id: '9',
    name: 'Fufu with Light Vegetable Soup',
    description: 'Moderate portions of cassava fufu with vegetable soup',
    category: 'maintain',
    type: 'delicacy',
    benefits: ['Balanced nutrition', 'Satisfying', 'Cultural significance'],
    preparation: 'Pound cassava/plantain, serve with light vegetable soup',
    nutritionalInfo: { calories: 350, protein: '12g', carbs: '55g', fat: '10g', fiber: '8g' },
    isLocal: true
  },
  {
    id: '10',
    name: 'Garden Egg with Groundnut Paste',
    description: 'Local eggplant variety with protein-rich groundnut paste',
    category: 'maintain',
    type: 'vegetable',
    benefits: ['Fiber', 'Antioxidants', 'Balanced nutrition'],
    nutritionalInfo: { calories: 180, protein: '8g', carbs: '15g', fat: '10g', fiber: '7g' },
    isLocal: true
  }
];

// Suggested quantity per item for diet management
const quantitySuggestions: Record<string, string> = {
  'Ndolé with Lean Fish': '1 cup ndolé (~200g) + 1 small fufu ball (about 100g)',
  'African Plum (Safou)': '3–4 plums (medium size)',
  'Okra Soup (Gombo)': '1.5 cups soup (~300g) + 1 small fufu ball',
  'Koki with Palm Oil': '1 slice (~150g)',
  'Plantain with Groundnut Sauce': '1 medium plantain + 2 tbsp groundnut sauce',
  'Avocado (Local Variety)': '1/2 large avocado',
  'Bitter Kola': '1–2 nuts',
  'Eru with Stockfish': '1 cup eru (~200g) + small portion garri or fufu',
  'Fufu with Light Vegetable Soup': '1 small fufu ball + 1 cup soup',
  'Garden Egg with Groundnut Paste': '3 small garden eggs + 2 tbsp paste'
};

const DietRecommendations = () => {
  const [activeGoal, setActiveGoal] = useState<'weight-loss' | 'weight-gain' | 'maintain' | 'health'>('maintain');
  const [userProfile, setUserProfile] = useState<any>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

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
          Personalized food recommendations featuring Cameroonian delicacies and local ingredients
        </p>
      </div>

      <Tabs value={activeGoal} onValueChange={(value) => setActiveGoal(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1">
          <TabsTrigger value="weight-loss" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Lose Weight</span>
            <span className="sm:hidden">Lose</span>
          </TabsTrigger>
          <TabsTrigger value="weight-gain" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Gain Weight</span>
            <span className="sm:hidden">Gain</span>
          </TabsTrigger>
          <TabsTrigger value="maintain" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <Target className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Maintain</span>
            <span className="sm:hidden">Keep</span>
          </TabsTrigger>
          <TabsTrigger value="health" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <Leaf className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Health</span>
            <span className="sm:hidden">Health</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeGoal} className="space-y-3 sm:space-y-4">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                {getGoalIcon(activeGoal)}
                {activeGoal === 'weight-loss' && 'Weight Loss Recommendations'}
                {activeGoal === 'weight-gain' && 'Weight Gain Recommendations'}
                {activeGoal === 'maintain' && 'Weight Maintenance Recommendations'}
                {activeGoal === 'health' && 'Health Management Recommendations'}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Local Cameroonian foods and delicacies to help you achieve your goals
              </CardDescription>
            </CardHeader>
          </Card>

          <ScrollArea className="h-[400px] sm:h-[500px] md:h-[600px]">
            <div className="grid gap-3 sm:gap-4 p-1">
              {filteredRecommendations.map((recommendation) => (
                <Card key={recommendation.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 sm:gap-2 mb-2 flex-wrap">
                          <CardTitle className="text-sm sm:text-base md:text-lg">{recommendation.name}</CardTitle>
                          {recommendation.isLocal && (
                            <Badge variant="secondary" className="text-xs">
                              <Star className="h-3 w-3 mr-1" />
                              Local
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {getTypeIcon(recommendation.type)}
                            <span className="ml-1 capitalize">{recommendation.type}</span>
                          </Badge>
                        </div>
                        <CardDescription className="text-xs sm:text-sm">{recommendation.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
                    {/* Benefits */}
                    <div>
                      <h4 className="font-medium text-xs sm:text-sm mb-1 sm:mb-2">Benefits:</h4>
                      <div className="flex flex-wrap gap-1">
                        {recommendation.benefits.map((benefit, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Nutritional Info */}
                    <div>
                      <h4 className="font-medium text-xs sm:text-sm mb-1 sm:mb-2">Nutritional Information (per 100g):</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-xs sm:text-sm">
                        <div className="flex items-center">
                          <span className="text-red-600 mr-1">🔥</span>
                          <span className="font-medium">{recommendation.nutritionalInfo.calories}</span>
                          <span className="text-muted-foreground ml-1">cal</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-blue-600 mr-1">💪</span>
                          <span className="font-medium">{recommendation.nutritionalInfo.protein}</span>
                          <span className="text-muted-foreground ml-1">protein</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-yellow-600 mr-1">⚡</span>
                          <span className="font-medium">{recommendation.nutritionalInfo.carbs}</span>
                          <span className="text-muted-foreground ml-1">carbs</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-orange-600 mr-1">🥑</span>
                          <span className="font-medium">{recommendation.nutritionalInfo.fat}</span>
                          <span className="text-muted-foreground ml-1">fat</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-green-600 mr-1">🌾</span>
                          <span className="font-medium">{recommendation.nutritionalInfo.fiber}</span>
                          <span className="text-muted-foreground ml-1">fiber</span>
                        </div>
                      </div>
                    </div>

                    {/* Suggested Quantity per Item */}
                    <div>
                      <h4 className="font-medium text-xs sm:text-sm mb-1 sm:mb-2">Suggested Quantity (per meal):</h4>
                      <p className="text-xs sm:text-sm">
                        {quantitySuggestions[recommendation.name] ?? 'Adjust portion to your goals; combine with vegetables or lean protein as needed.'}
                      </p>
                    </div>

                    {/* Suggested Serving Sizes for Diet Management */}
                    <div>
                      <h4 className="font-medium text-xs sm:text-sm mb-1 sm:mb-2">Suggested Serving Sizes:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                        <div className="p-2 bg-muted/50 rounded">
                          <p className="font-medium">Regular Meal Portion:</p>
                          <p className="text-muted-foreground">150-200g per serving</p>
                        </div>
                        <div className="p-2 bg-muted/50 rounded">
                          <p className="font-medium">Snack Portion:</p>
                          <p className="text-muted-foreground">50-100g per serving</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        💡 Tip: Adjust portions based on your daily caloric needs and health goals
                      </p>
                    </div>

                    {/* Preparation */}
                    {recommendation.preparation && (
                      <div>
                        <h4 className="font-medium text-xs sm:text-sm mb-1 sm:mb-2">Preparation Tips:</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {recommendation.preparation}
                        </p>
                      </div>
                    )}
                  </CardContent>
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