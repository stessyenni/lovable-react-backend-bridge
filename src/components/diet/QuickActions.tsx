
import { Button } from "@/components/ui/button";
import { Camera, Plus, TrendingUp, Apple, Bookmark } from "lucide-react";

interface QuickActionsProps {
  onQuickAction: (action: string) => void;
}

const QuickActions = ({ onQuickAction }: QuickActionsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-5">
      <Button 
        variant="outline" 
        className="h-20 flex flex-col gap-2"
        onClick={() => onQuickAction('add-meal')}
      >
        <Plus className="h-6 w-6" />
        <span className="text-sm">Add Meal</span>
      </Button>
      <Button 
        variant="outline" 
        className="h-20 flex flex-col gap-2"
        onClick={() => onQuickAction('photo-analysis')}
      >
        <Camera className="h-6 w-6" />
        <span className="text-sm">AI Photo Analysis</span>
      </Button>
      <Button 
        variant="outline" 
        className="h-20 flex flex-col gap-2"
        onClick={() => onQuickAction('view-trends')}
      >
        <TrendingUp className="h-6 w-6" />
        <span className="text-sm">View Trends</span>
      </Button>
      <Button 
        variant="outline" 
        className="h-20 flex flex-col gap-2"
        onClick={() => onQuickAction('nutrition-goals')}
      >
        <Apple className="h-6 w-6" />
        <span className="text-sm">Nutrition Goals</span>
      </Button>
      <Button 
        variant="outline" 
        className="h-20 flex flex-col gap-2"
        onClick={() => onQuickAction('meal-categories')}
      >
        <Bookmark className="h-6 w-6" />
        <span className="text-sm">Meal Categories</span>
      </Button>
    </div>
  );
};

export default QuickActions;
