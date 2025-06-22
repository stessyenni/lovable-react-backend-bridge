
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Heart, Apple, Target, TrendingUp, Activity, Droplets, Moon, Footprints } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="gradient-hemapp rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back to Hemapp! 👋</h2>
        <p className="text-white/90">Your personalized health dashboard with AI-powered insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-effect hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Score</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-royal-blue">85%</div>
            <p className="text-xs text-muted-foreground">+5% from last week</p>
            <Progress value={85} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="glass-effect hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Calories</CardTitle>
            <Apple className="h-4 w-4 text-hemapp-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-hemapp-green">1,420</div>
            <p className="text-xs text-muted-foreground">580 remaining</p>
            <Progress value={71} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="glass-effect hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goals Met</CardTitle>
            <Target className="h-4 w-4 text-dark-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-dark-purple">3/5</div>
            <p className="text-xs text-muted-foreground">This week</p>
            <Progress value={60} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="glass-effect hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Improvement</CardTitle>
            <TrendingUp className="h-4 w-4 text-royal-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-royal-blue">+12%</div>
            <p className="text-xs text-muted-foreground">From last month</p>
            <Progress value={75} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Daily Progress & Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="text-royal-blue">Today's Progress</CardTitle>
            <CardDescription>Track your daily health metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <span>Water Intake</span>
                </div>
                <span className="font-medium">6/8 glasses</span>
              </div>
              <Progress value={75} className="h-3" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-hemapp-green" />
                  <span>Exercise</span>
                </div>
                <span className="font-medium">30/45 minutes</span>
              </div>
              <Progress value={67} className="h-3" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-2">
                  <Moon className="h-4 w-4 text-dark-purple" />
                  <span>Sleep Quality</span>
                </div>
                <span className="font-medium">Good</span>
              </div>
              <Progress value={80} className="h-3" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-2">
                  <Footprints className="h-4 w-4 text-orange-500" />
                  <span>Steps</span>
                </div>
                <span className="font-medium">8,230/10,000</span>
              </div>
              <Progress value={82} className="h-3" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="text-dark-purple">Quick Actions</CardTitle>
            <CardDescription>Common tasks and features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Badge variant="secondary" className="justify-center py-2 hover:bg-royal-blue hover:text-white cursor-pointer transition-colors">
                Log Meal
              </Badge>
              <Badge variant="secondary" className="justify-center py-2 hover:bg-hemapp-green hover:text-white cursor-pointer transition-colors">
                Record Exercise
              </Badge>
              <Badge variant="secondary" className="justify-center py-2 hover:bg-dark-purple hover:text-white cursor-pointer transition-colors">
                Check Symptoms
              </Badge>
              <Badge variant="secondary" className="justify-center py-2 hover:bg-royal-blue hover:text-white cursor-pointer transition-colors">
                Find Recipe
              </Badge>
              <Badge variant="secondary" className="justify-center py-2 hover:bg-hemapp-green hover:text-white cursor-pointer transition-colors">
                Set Reminder
              </Badge>
              <Badge variant="secondary" className="justify-center py-2 hover:bg-dark-purple hover:text-white cursor-pointer transition-colors">
                Contact Doctor
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health Insights */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="text-hemapp-green">AI Health Insights</CardTitle>
          <CardDescription>Personalized recommendations based on your data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Droplets className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium text-blue-900">Hydration</h4>
              </div>
              <p className="text-sm text-blue-800">You're doing great! Try to drink 2 more glasses before bedtime.</p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="h-5 w-5 text-green-600" />
                <h4 className="font-medium text-green-900">Activity</h4>
              </div>
              <p className="text-sm text-green-800">Consider a 15-minute walk to reach your daily exercise goal.</p>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Moon className="h-5 w-5 text-purple-600" />
                <h4 className="font-medium text-purple-900">Sleep</h4>
              </div>
              <p className="text-sm text-purple-800">Your sleep pattern is consistent. Keep up the good routine!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
