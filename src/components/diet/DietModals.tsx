
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import DietEntry from "@/components/DietEntry";
import DietUpload from "@/components/DietUpload";
import MealCategories from "@/components/MealCategories";
import { DietEntryType } from "./hooks/useDietData";
import { X } from "lucide-react";

interface DietModalsProps {
  showDietEntry: boolean;
  showDietUpload: boolean;
  showMealCategories: boolean;
  editingEntry: DietEntryType | null;
  onCloseDietEntry: () => void;
  onCloseDietUpload: () => void;
  onCloseMealCategories: () => void;
  onSuccess: () => void;
}

const DietModals = ({
  showDietEntry,
  showDietUpload,
  showMealCategories,
  editingEntry,
  onCloseDietEntry,
  onCloseDietUpload,
  onCloseMealCategories,
  onSuccess
}: DietModalsProps) => {
  return (
    <>
      {showDietEntry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-background rounded-lg w-full max-w-md sm:max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-3 sm:p-4 border-b shrink-0">
              <h3 className="text-base sm:text-lg font-semibold">
                {editingEntry ? "Edit Meal" : "Add New Meal"}
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onCloseDietEntry}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="flex-1 p-3 sm:p-4">
              <DietEntry 
                editMode={!!editingEntry}
                existingEntry={editingEntry}
                onSuccess={onSuccess} 
              />
            </ScrollArea>
          </div>
        </div>
      )}

      {showDietUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-background rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-3 sm:p-4 border-b shrink-0">
              <h3 className="text-base sm:text-lg font-semibold">AI Photo Analysis</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onCloseDietUpload}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="flex-1 p-3 sm:p-4">
              <DietUpload onSuccess={onSuccess} />
            </ScrollArea>
          </div>
        </div>
      )}

      {showMealCategories && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-background rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
            <MealCategories onClose={onCloseMealCategories} />
          </div>
        </div>
      )}
    </>
  );
};

export default DietModals;
