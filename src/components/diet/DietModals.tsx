
import { Button } from "@/components/ui/button";
import DietEntry from "@/components/DietEntry";
import DietUpload from "@/components/DietUpload";
import MealCategories from "@/components/MealCategories";
import { DietEntryType } from "./hooks/useDietData";

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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">
                {editingEntry ? "Edit Meal" : "Add New Meal"}
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onCloseDietEntry}
              >
                ✕
              </Button>
            </div>
            <div className="p-4">
              <DietEntry 
                editMode={!!editingEntry}
                existingEntry={editingEntry}
                onSuccess={onSuccess} 
              />
            </div>
          </div>
        </div>
      )}

      {showDietUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-2xl w-full">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">AI Photo Analysis</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onCloseDietUpload}
              >
                ✕
              </Button>
            </div>
            <div className="p-4">
              <DietUpload onSuccess={onSuccess} />
            </div>
          </div>
        </div>
      )}

      {showMealCategories && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
            <MealCategories onClose={onCloseMealCategories} />
          </div>
        </div>
      )}
    </>
  );
};

export default DietModals;
