
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Camera, TrendingUp, Apple, Bookmark, Eye } from "lucide-react";

interface QuickActionsProps {
  onQuickAction: (action: string) => void;
}

const QuickActions = ({ onQuickAction }: QuickActionsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Fast access to diet tracking features</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <Button 
            variant="outline" 
            className="h-16 sm:h-20 flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm"
            onClick={() => onQuickAction('add-meal')}
          >
            <Plus className="h-4 w-4 sm:h-6 sm:w-6" />
            <span>Add Meal</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-16 sm:h-20 flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm"
            onClick={() => onQuickAction('photo-analysis')}
          >
            <Camera className="h-4 w-4 sm:h-6 sm:w-6" />
            <span>AI Photo Analysis</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-16 sm:h-20 flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm"
            onClick={() => onQuickAction('view-trends')}
          >
            <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6" />
            <span>View Trends</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-16 sm:h-20 flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm"
            onClick={() => onQuickAction('nutrition-goals')}
          >
            <Apple className="h-4 w-4 sm:h-6 sm:w-6" />
            <span>Nutrition Goals</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-16 sm:h-20 flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm"
            onClick={() => onQuickAction('view-meals')}
          >
            <Bookmark className="h-4 w-4 sm:h-6 sm:w-6" />
            <span>View Meals</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-16 sm:h-20 flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm"
            onClick={() => onQuickAction('view-categories')}
          >
            <Eye className="h-4 w-4 sm:h-6 sm:w-6" />
            <span>View Categories</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
