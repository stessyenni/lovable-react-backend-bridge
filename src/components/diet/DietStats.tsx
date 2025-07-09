
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Utensils, Target, BarChart3 } from "lucide-react";

interface DietStatsProps {
  stats: {
    meals: number;
    calories: number;
    protein?: number;
    fiber?: number;
    mealBreakdown?: Record<string, { count: number; calories: number }>;
    entries?: any[];
  };
  weeklyStats?: {
    dailyStats: { date: string; calories: number; meals: number }[];
    weeklyAverage: number;
    totalMeals: number;
    totalCalories: number;
  };
}

const DietStats = ({ stats, weeklyStats }: DietStatsProps) => {
  const dailyCalorieGoal = 2000;
  const dailyProteinGoal = 50; // grams
  const dailyFiberGoal = 25; // grams

  const caloriePercentage = Math.min((stats.calories / dailyCalorieGoal) * 100, 100);
  const proteinPercentage = Math.min(((stats.protein || 0) / dailyProteinGoal) * 100, 100);
  const fiberPercentage = Math.min(((stats.fiber || 0) / dailyFiberGoal) * 100, 100);

  const getStatusColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getMealTypeEmoji = (mealType: string) => {
    const emojiMap: { [key: string]: string } = {
      'Breakfast': '🌅',
      'Lunch': '🌞', 
      'Dinner': '🌙',
      'Snack': '🍎',
      'Other': '🍽️'
    };
    return emojiMap[mealType] || '🍽️';
  };

  return (
    <Tabs defaultValue="today" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="today" className="flex items-center gap-2">
          <Target className="h-4 w-4" />
          Today's Progress
        </TabsTrigger>
        <TabsTrigger value="weekly" className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Weekly Overview
        </TabsTrigger>
      </TabsList>

      <TabsContent value="today" className="space-y-4">
        {/* Main Nutrition Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-1">
                <Utensils className="h-4 w-4" />
                Meals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.meals}</div>
              <p className="text-xs text-muted-foreground">logged today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Calories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getStatusColor(caloriePercentage)}`}>
                {stats.calories}
              </div>
              <p className="text-xs text-muted-foreground">of {dailyCalorieGoal} kcal goal</p>
              <Progress value={caloriePercentage} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round(caloriePercentage)}% complete
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Protein</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getStatusColor(proteinPercentage)}`}>
                {stats.protein?.toFixed(1) || '0.0'}g
              </div>
              <p className="text-xs text-muted-foreground">of {dailyProteinGoal}g goal</p>
              <Progress value={proteinPercentage} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round(proteinPercentage)}% complete
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Fiber</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getStatusColor(fiberPercentage)}`}>
                {stats.fiber?.toFixed(1) || '0.0'}g
              </div>
              <p className="text-xs text-muted-foreground">of {dailyFiberGoal}g goal</p>
              <Progress value={fiberPercentage} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round(fiberPercentage)}% complete
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Meal Breakdown */}
        {stats.mealBreakdown && Object.keys(stats.mealBreakdown).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Meal Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                {Object.entries(stats.mealBreakdown).map(([mealType, data]) => (
                  <div key={mealType} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getMealTypeEmoji(mealType)}</span>
                      <div>
                        <p className="font-medium text-sm">{mealType}</p>
                        <p className="text-xs text-muted-foreground">{data.count} meal{data.count !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {data.calories} cal
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="weekly" className="space-y-4">
        {weeklyStats ? (
          <>
            {/* Weekly Summary */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Weekly Average</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{weeklyStats.weeklyAverage}</div>
                  <p className="text-xs text-muted-foreground">calories per day</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Meals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{weeklyStats.totalMeals}</div>
                  <p className="text-xs text-muted-foreground">this week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Weekly Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{weeklyStats.totalCalories.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">calories consumed</p>
                </CardContent>
              </Card>
            </div>

            {/* Daily Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">7-Day Calorie Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weeklyStats.dailyStats.map((day, index) => {
                    const percentage = (day.calories / dailyCalorieGoal) * 100;
                    const isToday = day.date === new Date().toISOString().split('T')[0];
                    
                    return (
                      <div key={day.date} className={`flex items-center gap-4 p-2 rounded ${isToday ? 'bg-primary/10' : ''}`}>
                        <div className="w-16 text-xs font-medium">
                          {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                          {isToday && <Badge variant="secondary" className="ml-1 text-xs">Today</Badge>}
                        </div>
                        <div className="flex-1">
                          <Progress value={Math.min(percentage, 100)} className="h-2" />
                        </div>
                        <div className="w-20 text-xs text-right">
                          <span className="font-medium">{day.calories}</span>
                          <span className="text-muted-foreground"> cal</span>
                        </div>
                        <div className="w-16 text-xs text-muted-foreground text-right">
                          {day.meals} meal{day.meals !== 1 ? 's' : ''}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Weekly stats will appear here</p>
                <p className="text-sm text-muted-foreground mt-1">Log more meals to see trends</p>
              </div>
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default DietStats;
