
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TrendsPageProps {
  onClose?: () => void;
}

const TrendsPage = ({ onClose }: TrendsPageProps) => {
  const { user } = useAuth();
  const [trendsData, setTrendsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTrendsData();
    }
  }, [user]);

  const fetchTrendsData = async () => {
    try {
      // Get diet entries for trends
      const { data: dietEntries, error } = await supabase
        .from('diet_entries')
        .select('*')
        .eq('user_id', user?.id)
        .order('logged_at', { ascending: true })
        .limit(30);

      if (error) throw error;

      // Process data for charts
      const processedData = processTrendsData(dietEntries || []);
      setTrendsData(processedData);
    } catch (error) {
      console.error('Error fetching trends:', error);
    } finally {
      setLoading(false);
    }
  };

  const processTrendsData = (entries: any[]) => {
    const dailyData: { [key: string]: { date: string; calories: number; protein: number; meals: number } } = {};

    entries.forEach(entry => {
      const date = new Date(entry.logged_at).toLocaleDateString();
      if (!dailyData[date]) {
        dailyData[date] = { date, calories: 0, protein: 0, meals: 0 };
      }
      dailyData[date].calories += entry.calories || 0;
      dailyData[date].protein += parseInt(entry.protein || '0');
      dailyData[date].meals += 1;
    });

    return Object.values(dailyData).slice(-14); // Last 14 days
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading trends...</div>;
  }

  return (
    <div className="h-full max-h-[90vh] flex flex-col w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b bg-background shrink-0">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold truncate">Health Trends</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            View your nutrition and health trends over time
          </p>
        </div>
        {onClose && (
          <Button onClick={onClose} variant="outline" size="sm" className="text-xs sm:text-sm ml-2">
            <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Close
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base">Daily Calories</CardTitle>
              <CardDescription>Calories consumed over the last 14 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={trendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="calories" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base">Daily Protein</CardTitle>
              <CardDescription>Protein intake over the last 14 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={trendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="protein" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm sm:text-base">Meals Per Day</CardTitle>
            <CardDescription>Number of meals logged daily</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={trendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="meals" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {trendsData.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">No trend data available</h3>
              <p className="text-muted-foreground">
                Start logging your meals to see your health trends over time
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TrendsPage;
