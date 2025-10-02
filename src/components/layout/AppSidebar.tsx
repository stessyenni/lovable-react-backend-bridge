// Hemapp logo import
import logoImage from "@/assets/Hemapp-Logo.png";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { Video, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { AppLogo } from "@/assets";

interface MenuItem {
  id: 'home' | 'dashboard' | 'messages' | 'health-monitoring' | 'facilities' | 'connections' | 'account' | 'faq' | 'smartwatch';
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
  const { setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();
  const { unreadCount } = useUnreadMessages();

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
          <img src={logoImage} alt="Hemapp-Logo" className="h-8 w-8" />
          <span className="text-xl font-bold">Hemapp</span>
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
                      onClick={() => {
                        onSectionChange(item.id);
                        // Auto-close sidebar on mobile when menu item is selected
                        if (isMobile) {
                          setOpenMobile(false);
                        }
                      }}
                      className={`${brailleMode ? "text-base sm:text-lg font-bold" : ""} w-full justify-start relative`}
                      tooltip={item.label}
                      data-nav="true"
                    >
                      <IconComponent className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                      {item.id === 'messages' && unreadCount > 0 && (
                        <Badge 
                          variant="destructive" 
                          className="ml-auto h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                        >
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                      )}
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
          <SidebarMenuButton
            onClick={handleDoctorConsult}
            className="w-full flex items-center justify-start gap-2"
            tooltip="Consult Doctor"
          >
            <Video className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">Consult Doctor</span>
          </SidebarMenuButton>
          
          <SidebarMenuButton
            onClick={onBrailleToggle}
            className="w-full flex items-center justify-between"
            tooltip="Braille Mode"
          >
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Braille Mode</span>
            </div>
            <Switch 
              checked={brailleMode}
              onCheckedChange={onBrailleToggle}
              className="ml-auto"
              onClick={(e) => e.stopPropagation()}
            />
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
