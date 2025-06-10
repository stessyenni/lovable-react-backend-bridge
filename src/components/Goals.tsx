
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Target, Plus, CheckCircle } from "lucide-react";

const Goals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ["health-goals", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("health_goals")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const updateGoalMutation = useMutation({
    mutationFn: async ({ id, progress }: { id: string; progress: number }) => {
      const status = progress >= 100 ? "completed" : "active";
      const { error } = await supabase
        .from("health_goals")
        .update({ progress, status })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["health-goals"] });
      toast({
        title: "Goal updated",
        description: "Your progress has been saved successfully.",
      });
    },
  });

  const handleUpdateProgress = (goalId: string, currentProgress: number) => {
    const newProgress = Math.min(currentProgress + 10, 100);
    updateGoalMutation.mutate({ id: goalId, progress: newProgress });
  };

  if (isLoading) {
    return <div>Loading goals...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Health Goals</h2>
          <p className="text-muted-foreground">Track your progress towards better health</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Goal
        </Button>
      </div>

      {goals.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No goals yet</h3>
            <p className="text-muted-foreground mb-4">
              Start your health journey by setting your first goal
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Goal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {goals.map((goal) => (
              <Card key={goal.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {goal.status === "completed" ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Target className="h-5 w-5 text-blue-500" />
                      )}
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                    </div>
                    <Badge variant={goal.status === "completed" ? "default" : "secondary"}>
                      {goal.status}
                    </Badge>
                  </div>
                  <CardDescription>{goal.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Current</p>
                      <p className="font-medium">{goal.current_value || "Not set"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Target</p>
                      <p className="font-medium">{goal.target_value || "Not set"}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm text-muted-foreground">
                      Deadline: {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : "No deadline"}
                    </span>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      {goal.status === "active" && (
                        <Button 
                          size="sm" 
                          onClick={() => handleUpdateProgress(goal.id, goal.progress)}
                          disabled={updateGoalMutation.isPending}
                        >
                          Update Progress
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Goal Statistics</CardTitle>
              <CardDescription>Your overall progress summary</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">{goals.length}</div>
                  <p className="text-sm text-muted-foreground">Total Goals</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {goals.filter(g => g.status === "completed").length}
                  </div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">
                    {goals.filter(g => g.status === "active").length}
                  </div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">
                    {goals.length > 0 ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length) : 0}%
                  </div>
                  <p className="text-sm text-muted-foreground">Avg Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Goals;
