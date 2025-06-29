
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface DietStatsProps {
  stats: {
    meals: number;
    calories: number;
  };
}

const DietStats = ({ stats }: DietStatsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Today's Meals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.meals}</div>
          <p className="text-xs text-muted-foreground">meals logged</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Calories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.calories}</div>
          <p className="text-xs text-muted-foreground">kcal consumed</p>
          <Progress value={(stats.calories / 2000) * 100} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Goal Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.min(Math.round((stats.calories / 2000) * 100), 100)}%</div>
          <p className="text-xs text-muted-foreground">of daily goal</p>
          <Progress value={Math.min((stats.calories / 2000) * 100, 100)} className="mt-2" />
        </CardContent>
      </Card>
    </div>
  );
};

export default DietStats;
