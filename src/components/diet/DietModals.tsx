
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import DietEntry from "@/components/DietEntry";
import DietUpload from "@/components/DietUpload";
import EnhancedMealCategories from "@/components/enhanced/EnhancedMealCategories";
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
            <DietEntry 
              editMode={!!editingEntry}
              existingEntry={editingEntry}
              onSuccess={onSuccess}
              onClose={onCloseDietEntry}
            />
          </div>
        </div>
      )}

      {showDietUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-background rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
            <DietUpload 
              onSuccess={onSuccess}
              onClose={onCloseDietUpload}
            />
          </div>
        </div>
      )}

      {showMealCategories && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-background rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
            <EnhancedMealCategories onClose={onCloseMealCategories} />
          </div>
        </div>
      )}
    </>
  );
};

export default DietModals;
