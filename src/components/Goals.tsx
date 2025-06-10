
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, Plus, CheckCircle, Circle } from "lucide-react";

const Goals = () => {
  const [goals] = useState([
    {
      id: 1,
      title: "Lose 10 pounds",
      description: "Target weight loss over 3 months",
      progress: 40,
      current: "4 lbs lost",
      target: "10 lbs",
      deadline: "2024-09-10",
      status: "active"
    },
    {
      id: 2,
      title: "Exercise 5 times per week",
      description: "Regular cardio and strength training",
      progress: 60,
      current: "3 days this week",
      target: "5 days/week",
      deadline: "Ongoing",
      status: "active"
    },
    {
      id: 3,
      title: "Drink 8 glasses of water daily",
      description: "Stay hydrated throughout the day",
      progress: 100,
      current: "8 glasses",
      target: "8 glasses",
      deadline: "Daily",
      status: "completed"
    },
    {
      id: 4,
      title: "Reduce sugar intake",
      description: "Limit added sugars to 25g per day",
      progress: 75,
      current: "30g average",
      target: "25g/day",
      deadline: "2024-07-01",
      status: "active"
    }
  ]);

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
                  <p className="font-medium">{goal.current}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Target</p>
                  <p className="font-medium">{goal.target}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm text-muted-foreground">
                  Deadline: {goal.deadline}
                </span>
                <div className="space-x-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  {goal.status === "active" && (
                    <Button size="sm">Update Progress</Button>
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
              <div className="text-2xl font-bold text-blue-500">4</div>
              <p className="text-sm text-muted-foreground">Total Goals</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">1</div>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">3</div>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">69%</div>
              <p className="text-sm text-muted-foreground">Avg Progress</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Goals;
