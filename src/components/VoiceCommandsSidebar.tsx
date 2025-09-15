import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import VoiceCommands from "@/components/VoiceCommands";
import VoiceSettings from "@/components/VoiceSettings";
import { 
  Mic, 
  Settings,
  ChevronRight
} from "lucide-react";

interface VoiceCommandsSidebarProps {
  onNavigate?: (section: string) => void;
  speechEnabled?: boolean;
  onSpeechToggle?: () => void;
}

const VoiceCommandsSidebar = ({ 
  onNavigate, 
  speechEnabled = false, 
  onSpeechToggle 
}: VoiceCommandsSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="fixed top-4 right-4 z-50 md:top-4 md:right-20 shadow-lg bg-background hover:bg-muted border-border"
        >
          <Mic className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Voice</span>
          <ChevronRight className="h-3 w-3 ml-1" />
        </Button>
      </SheetTrigger>
      
      <SheetContent 
        side="right" 
        className="w-full sm:w-[400px] md:w-[500px] p-0 overflow-hidden"
      >
        <div className="flex flex-col h-full">
          <SheetHeader className="p-6 pb-4 bg-muted/30">
            <SheetTitle className="flex items-center gap-2 text-left">
              <Mic className="h-5 w-5 text-primary" />
              Voice Control Center
            </SheetTitle>
          </SheetHeader>
          
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {/* Voice Settings */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium">Voice Settings</h3>
                </div>
                <VoiceSettings 
                  speechEnabled={speechEnabled}
                  onSpeechToggle={onSpeechToggle}
                />
              </div>

              <Separator />

              {/* Voice Commands */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Mic className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium">Voice Commands</h3>
                </div>
                <VoiceCommands 
                  onNavigate={onNavigate}
                  speechEnabled={speechEnabled}
                  onSpeechToggle={onSpeechToggle}
                />
              </div>
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default VoiceCommandsSidebar;