import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { 
  Plus, 
  Target, 
  TrendingUp, 
  Calendar,
  Lightbulb,
  Star,
  Clock,
  Zap,
  X,
  CheckCircle2
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SampleGoal {
  id: string;
  title: string;
  description: string;
  category: string;
  target_type: string;
  default_target_value: string;
  default_current_value: string;
  icon_name: string;
  difficulty_level: string;
  estimated_timeframe: string;
  tips: string[];
  is_popular: boolean;
}

interface UserGoal {
  id: string;
  title: string;
  description: string;
  target_value: string;
  current_value: string;
  progress: number;
  status: string;
  deadline: string;
  created_at: string;
}

interface HealthGoalRecommendationsProps {
  onClose?: () => void;
}

const HealthGoalRecommendations = ({ onClose }: HealthGoalRecommendationsProps) => {
  const [sampleGoals, setSampleGoals] = useState<SampleGoal[]>([]);
  const [userGoals, setUserGoals] = useState<UserGoal[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [selectedGoal, setSelectedGoal] = useState<SampleGoal | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const categories = [
    { id: "all", name: "All Goals", icon: Target },
    { id: "fitness", name: "Fitness", icon: Zap },
    { id: "nutrition", name: "Nutrition", icon: "apple" },
    { id: "mental_health", name: "Mental Health", icon: "brain" },
    { id: "sleep", name: "Sleep", icon: "moon" },
    { id: "weight", name: "Weight", icon: "scale" }
  ];

  const difficultyColors = {
    beginner: "bg-green-100 text-green-800",
    intermediate: "bg-yellow-100 text-yellow-800",
    advanced: "bg-red-100 text-red-800"
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch sample goals
      const { data: samplesData, error: samplesError } = await (supabase as any)
        .from('sample_health_goals')
        .select('*')
        .order('is_popular', { ascending: false })
        .order('created_at', { ascending: false });

      if (samplesError) throw samplesError;

      // Fetch user's existing goals
      const { data: userGoalsData, error: userGoalsError } = await supabase
        .from('health_goals')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (userGoalsError) throw userGoalsError;

      setSampleGoals(samplesData || []);
      setUserGoals(userGoalsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load health goals",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addGoalFromSample = async (sampleGoal: SampleGoal) => {
    if (!user) return;

    try {
      const deadline = new Date();
      deadline.setMonth(deadline.getMonth() + 1); // Default to 1 month from now

      const { error } = await supabase
        .from('health_goals')
        .insert({
          user_id: user.id,
          title: sampleGoal.title,
          description: sampleGoal.description,
          target_value: sampleGoal.default_target_value,
          current_value: sampleGoal.default_current_value,
          progress: 0,
          status: 'active',
          deadline: deadline.toISOString().split('T')[0]
        });

      if (error) throw error;

      toast({
        title: "Goal Added!",
        description: `"${sampleGoal.title}" has been added to your goals.`,
      });

      setSelectedGoal(null);
      fetchData(); // Refresh the data
    } catch (error) {
      console.error('Error adding goal:', error);
      toast({
        title: "Error",
        description: "Failed to add goal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getIconComponent = (iconName: string) => {
    // Simple icon mapping - in a real app you'd want a more comprehensive mapping
    const iconMap: { [key: string]: any } = {
      footprints: "🚶",
      droplets: "💧",
      dumbbell: "🏋️",
      moon: "🌙",
      apple: "🍎",
      brain: "🧠",
      scale: "⚖️",
      book: "📚",
      zap: "⚡",
      "chef-hat": "👨‍🍳",
      smartphone: "📱",
      sun: "☀️"
    };
    
    return iconMap[iconName] || "🎯";
  };

  const filteredGoals = selectedCategory === "all" 
    ? sampleGoals 
    : sampleGoals.filter(goal => goal.category === selectedCategory);

  const popularGoals = sampleGoals.filter(goal => goal.is_popular);

  // Check if user already has this goal
  const hasGoal = (goalTitle: string) => {
    return userGoals.some(userGoal => userGoal.title.toLowerCase().includes(goalTitle.toLowerCase()));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full max-h-[90vh] flex flex-col w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background shrink-0">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Target className="h-5 w-5" />
            Health Goal Recommendations
          </h3>
          <p className="text-sm text-muted-foreground">
            Discover personalized health goals to help you achieve your wellness objectives
          </p>
        </div>
        {onClose && (
          <Button onClick={onClose} variant="outline" size="sm" className="ml-2">
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        )}
      </div>

      <Tabs defaultValue="popular" className="flex-1 flex flex-col h-0">
        <TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
          <TabsTrigger value="popular">Popular Goals</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="my-goals">My Goals ({userGoals.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="popular" className="flex-1 h-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>Most popular goals chosen by other users</span>
              </div>
              
              <div className="grid gap-4">
                {popularGoals.map((goal) => (
                  <Card key={goal.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{getIconComponent(goal.icon_name)}</div>
                          <div>
                            <CardTitle className="text-base">{goal.title}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={difficultyColors[goal.difficulty_level as keyof typeof difficultyColors]}>
                                {goal.difficulty_level}
                              </Badge>
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {goal.estimated_timeframe}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          {hasGoal(goal.title) ? (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Added
                            </Badge>
                          ) : (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" onClick={() => setSelectedGoal(goal)}>
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add Goal
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <span className="text-2xl">{getIconComponent(goal.icon_name)}</span>
                                    {goal.title}
                                  </DialogTitle>
                                  <DialogDescription>
                                    {goal.description}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm font-medium">Difficulty</p>
                                      <Badge className={difficultyColors[goal.difficulty_level as keyof typeof difficultyColors]}>
                                        {goal.difficulty_level}
                                      </Badge>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">Timeframe</p>
                                      <p className="text-sm text-muted-foreground">{goal.estimated_timeframe}</p>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <p className="text-sm font-medium mb-2 flex items-center gap-1">
                                      <Lightbulb className="h-4 w-4" />
                                      Tips for Success
                                    </p>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                      {goal.tips.map((tip, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                          <span className="text-primary">•</span>
                                          {tip}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  <div className="flex gap-2 pt-4">
                                    <Button 
                                      onClick={() => addGoalFromSample(goal)} 
                                      className="flex-1"
                                    >
                                      Add to My Goals
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{goal.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="categories" className="flex-1 h-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center gap-2"
                  >
                    {typeof category.icon === 'string' ? (
                      <span>{getIconComponent(category.icon)}</span>
                    ) : (
                      <category.icon className="h-4 w-4" />
                    )}
                    {category.name}
                  </Button>
                ))}
              </div>

              <div className="grid gap-3">
                {filteredGoals.map((goal) => (
                  <Card key={goal.id} className="hover:shadow-sm transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{getIconComponent(goal.icon_name)}</span>
                          <div>
                            <p className="font-medium">{goal.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge 
                                variant="secondary" 
                                className={difficultyColors[goal.difficulty_level as keyof typeof difficultyColors]}
                              >
                                {goal.difficulty_level}
                              </Badge>
                              {goal.is_popular && (
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              )}
                            </div>
                          </div>
                        </div>
                        {hasGoal(goal.title) ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Added
                          </Badge>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => addGoalFromSample(goal)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="my-goals" className="flex-1 h-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              {userGoals.length === 0 ? (
                <Card>
                  <CardContent className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No goals added yet</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Browse recommendations and add goals to get started!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                userGoals.map((goal) => (
                  <Card key={goal.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{goal.title}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant={goal.status === 'active' ? 'default' : 'secondary'}>
                            {goal.status}
                          </Badge>
                          <div className="text-sm text-muted-foreground">
                            {goal.progress}%
                          </div>
                        </div>
                      </div>
                      <CardDescription>{goal.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm">
                        <span>Target: {goal.target_value}</span>
                        <span>Current: {goal.current_value}</span>
                        {goal.deadline && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(goal.deadline).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <div className="mt-3">
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${Math.min(goal.progress || 0, 100)}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HealthGoalRecommendations;