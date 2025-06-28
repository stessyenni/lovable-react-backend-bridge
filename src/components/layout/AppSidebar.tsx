
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Heart, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MenuItem {
  id: 'dashboard' | 'consultation' | 'diet' | 'goals' | 'facilities' | 'messages' | 'account' | 'settings';
  label: string;
  icon: React.FC<any>;
}

interface AppSidebarProps {
  menuItems: MenuItem[];
  activeSection: MenuItem['id'];
  brailleMode: boolean;
  onSectionChange: (section: MenuItem['id']) => void;
  onBrailleToggle: () => void;
}

const AppSidebar = ({
  menuItems,
  activeSection,
  brailleMode,
  onSectionChange,
  onBrailleToggle,
}: AppSidebarProps) => {
  const { toast } = useToast();

  const handleDoctorConsult = () => {
    toast({
      title: "Doctor Consultation",
      description: "Connecting you with available doctors...",
    });
    // In a real app, this would open video call or booking interface
  };

  return (
    <Sidebar className={brailleMode ? "border-2 border-yellow-400" : ""}>
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <Heart className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">Hemapp</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                      isActive={activeSection === item.id}
                      onClick={() => onSectionChange(item.id)}
                      className={brailleMode ? "text-lg font-bold" : ""}
                    >
                      <IconComponent className="mr-2 h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDoctorConsult}
            className="w-full flex items-center space-x-2"
          >
            <Video className="h-4 w-4" />
            <span>Consult Doctor</span>
          </Button>
          
          <div className="flex items-center justify-between text-sm">
            <span>Braille Mode</span>
            <Switch 
              checked={brailleMode}
              onCheckedChange={onBrailleToggle}
            />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
