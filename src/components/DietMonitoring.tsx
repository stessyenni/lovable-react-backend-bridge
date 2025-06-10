
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Apple, Coffee, Utensils } from "lucide-react";

const DietMonitoring = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const recentMeals = [
    { id: 1, name: "Oatmeal with Berries", calories: 320, time: "8:00 AM", type: "breakfast" },
    { id: 2, name: "Grilled Chicken Salad", calories: 450, time: "12:30 PM", type: "lunch" },
    { id: 3, name: "Greek Yogurt", calories: 150, time: "3:00 PM", type: "snack" },
  ];

  const suggestions = [
    { name: "Quinoa Bowl", calories: 380, protein: "18g", fiber: "8g" },
    { name: "Salmon with Vegetables", calories: 420, protein: "35g", fiber: "6g" },
    { name: "Lentil Soup", calories: 280, protein: "16g", fiber: "12g" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="text-center">
            <Coffee className="h-8 w-8 mx-auto text-orange-500" />
            <CardTitle>Breakfast</CardTitle>
            <CardDescription>320 calories</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Breakfast
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <Utensils className="h-8 w-8 mx-auto text-green-500" />
            <CardTitle>Lunch</CardTitle>
            <CardDescription>450 calories</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Lunch
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <Apple className="h-8 w-8 mx-auto text-red-500" />
            <CardTitle>Dinner</CardTitle>
            <CardDescription>0 calories</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Dinner
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Food Search</CardTitle>
          <CardDescription>Search and log your meals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <div className="flex-1">
              <Label htmlFor="food-search">Search Food</Label>
              <Input
                id="food-search"
                placeholder="Search for food items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="mt-6">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Meals</CardTitle>
          <CardDescription>Your logged meals today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentMeals.map((meal) => (
              <div key={meal.id} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{meal.name}</h4>
                  <p className="text-sm text-muted-foreground">{meal.time}</p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">{meal.calories} cal</Badge>
                  <p className="text-sm text-muted-foreground capitalize">{meal.type}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Healthy Suggestions</CardTitle>
          <CardDescription>Recommended meals based on your goals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">{suggestion.name}</h4>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{suggestion.calories} cal</span>
                  <span>{suggestion.protein} protein</span>
                  <span>{suggestion.fiber} fiber</span>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2">
                  Add to Meal
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DietMonitoring;
