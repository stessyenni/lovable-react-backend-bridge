// Add this import at the top
import logoImage from "@/assets/Hemapp-Logo.png";

// Replace the Heart icon section (lines 53-56) with:
<div className="flex items-center space-x-2">
  <img src={logoImage} alt="Hemapp Logo" className="h-8 w-8" />
  <span className="text-xl font-bold">Hemapp</span>
</div>

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
import { Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AppLogo } from "@/assets";

interface MenuItem {
  id: 'dashboard' | 'consultation' | 'diet' | 'goals' | 'facilities' | 'messages' | 'account' | 'faq' | 'settings' | 'smartwatch' | 'emergency' | 'analytics';
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
    <Sidebar className={`${brailleMode ? "border-2 border-yellow-400" : ""} min-w-fit`} collapsible="icon">
      <SidebarHeader className="p-3 sm:p-4">
        <div className="flex items-center space-x-2">
          <img src={AppLogo} alt="Hemapp Logo" className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0" />
          <span className="text-lg sm:text-xl font-bold truncate">Hemapp</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs sm:text-sm">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                      isActive={activeSection === item.id}
                      onClick={() => onSectionChange(item.id)}
                      className={`${brailleMode ? "text-base sm:text-lg font-bold" : ""} w-full justify-start`}
                      tooltip={item.label}
                    >
                      <IconComponent className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 sm:p-4">
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDoctorConsult}
            className="w-full flex items-center justify-center space-x-2 text-xs sm:text-sm"
          >
            <Video className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="truncate">Consult Doctor</span>
          </Button>
          
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="truncate">Braille Mode</span>
            <Switch 
              checked={brailleMode}
              onCheckedChange={onBrailleToggle}
              className="ml-2"
            />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
