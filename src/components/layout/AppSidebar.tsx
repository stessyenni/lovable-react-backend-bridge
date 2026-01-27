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
import { Video, Settings, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { useNewCommunityPosts } from "@/hooks/useNewCommunityPosts";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { AppLogo } from "@/assets";
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from "react";
import EmergencyContactSelector from "@/components/emergency/EmergencyContactSelector";
import { EmergencyContact } from "@/components/emergency/EmergencyContactsManager";

interface MenuItem {
  id: 'home' | 'dashboard' | 'messages' | 'health-monitoring' | 'facilities' | 'connections' | 'account' | 'faq' | 'smartwatch' | 'community';
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
  const { t } = useTranslation();
  const { toast } = useToast();
  const { setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();
  const { unreadCount } = useUnreadMessages();
  const { newPostsCount, markAsViewed } = useNewCommunityPosts();
  const { user } = useAuth();
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [showContactSelector, setShowContactSelector] = useState(false);

  // Fetch emergency contacts
  useEffect(() => {
    const fetchEmergencyContacts = async () => {
      if (!user?.id) return;
      
      const { data } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('is_primary', { ascending: false });
      
      if (data) {
        setEmergencyContacts(data);
      }
    };
    
    fetchEmergencyContacts();
  }, [user?.id]);

  const handleEmergencyButtonClick = () => {
    if (emergencyContacts.length === 0) {
      toast({
        title: t('emergency.noContact', 'No Emergency Contact'),
        description: t('emergency.setContactFirst', 'Please set your emergency contact in the Emergency page first.'),
        variant: "destructive"
      });
      return;
    }

    if (emergencyContacts.length === 1) {
      // If only one contact, call directly and send SMS
      callContactAndSendSms(emergencyContacts[0]);
    } else {
      // If multiple contacts, show selector
      setShowContactSelector(true);
    }
  };

  const callContactAndSendSms = (contact: EmergencyContact) => {
    // Send SMS to all contacts
    navigator.geolocation?.getCurrentPosition(
      (position) => {
        const locationUrl = `https://maps.google.com/?q=${position.coords.latitude},${position.coords.longitude}`;
        const message = `${t('emergency.smsMessage', 'EMERGENCY! I need help! My location:')} ${locationUrl}`;
        const phones = emergencyContacts.map(c => c.phone).join(',');
        window.open(`sms:${phones}?body=${encodeURIComponent(message)}`, '_blank');
      },
      () => {
        const message = t('emergency.smsMessageNoLocation', 'EMERGENCY! I need help! Please contact me immediately.');
        const phones = emergencyContacts.map(c => c.phone).join(',');
        window.open(`sms:${phones}?body=${encodeURIComponent(message)}`, '_blank');
      }
    );

    // Call the selected contact
    setTimeout(() => {
      window.open(`tel:${contact.phone}`, '_self');
    }, 500);

    toast({
      title: t('emergency.calling', 'Calling') + " " + contact.name,
      description: t('emergency.smsToAllContacts', 'SMS sent to all emergency contacts'),
      variant: "destructive"
    });
  };

  const handleSelectContact = (contact: EmergencyContact) => {
    setShowContactSelector(false);
    callContactAndSendSms(contact);
  };

  const handleSendSmsToAll = () => {
    setShowContactSelector(false);
    navigator.geolocation?.getCurrentPosition(
      (position) => {
        const locationUrl = `https://maps.google.com/?q=${position.coords.latitude},${position.coords.longitude}`;
        const message = `${t('emergency.smsMessage', 'EMERGENCY! I need help! My location:')} ${locationUrl}`;
        const phones = emergencyContacts.map(c => c.phone).join(',');
        window.open(`sms:${phones}?body=${encodeURIComponent(message)}`, '_self');
      },
      () => {
        const message = t('emergency.smsMessageNoLocation', 'EMERGENCY! I need help! Please contact me immediately.');
        const phones = emergencyContacts.map(c => c.phone).join(',');
        window.open(`sms:${phones}?body=${encodeURIComponent(message)}`, '_self');
      }
    );
    toast({
      title: t('emergency.smsSending', 'Sending SMS'),
      description: t('emergency.smsToAllContacts', 'SMS sent to all emergency contacts'),
      variant: "destructive"
    });
  };

  const handleDoctorConsult = () => {
    toast({
      title: "Doctor Consultation",
      description: "Connecting you with available doctors...",
    });
    // In a real app, this would open video call or booking interface
  };

  const { state } = useSidebar();

  return (
    <Sidebar className={brailleMode ? "border-2 border-yellow-400" : ""} collapsible="icon">
      <SidebarHeader className={state === 'collapsed' ? 'p-2' : 'p-3 sm:p-4'}>
        <div className={`flex items-center min-w-[3.5rem] ${state === 'collapsed' ? 'justify-center gap-0' : 'gap-2'}`}>
          <img src={logoImage} alt="Hemapp logo" className="h-10 w-10 flex-shrink-0 object-contain" />
          {state !== 'collapsed' && (
            <span className="text-xl font-bold">Hemapp</span>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs sm:text-sm">{t('sidebar.navigation')}</SidebarGroupLabel>
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
                        // Mark community posts as viewed when opening community
                        if (item.id === 'community') {
                          markAsViewed();
                        }
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
                      {item.id === 'community' && newPostsCount > 0 && (
                        <Badge 
                          variant="secondary" 
                          className="ml-auto h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground"
                        >
                          {newPostsCount > 99 ? '99+' : newPostsCount}
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
            onClick={handleEmergencyButtonClick}
            className="w-full flex items-center justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            tooltip={t('emergency.callEmergency', 'Call Emergency Contact')}
          >
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{t('emergency.callEmergency', 'Emergency')}</span>
          </SidebarMenuButton>

          <SidebarMenuButton
            onClick={handleDoctorConsult}
            className="w-full flex items-center justify-start gap-2"
            tooltip={t('sidebar.consultDoctor')}
          >
            <Video className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{t('sidebar.consultDoctor')}</span>
          </SidebarMenuButton>
          
          <SidebarMenuButton
            onClick={onBrailleToggle}
            className="w-full flex items-center justify-between"
            tooltip={t('sidebar.brailleMode')}
          >
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{t('sidebar.brailleMode')}</span>
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

      {/* Emergency Contact Selector */}
      <EmergencyContactSelector
        open={showContactSelector}
        onClose={() => setShowContactSelector(false)}
        contacts={emergencyContacts}
        onSelectContact={handleSelectContact}
        onSendSmsToAll={handleSendSmsToAll}
      />
    </Sidebar>
  );
};

export default AppSidebar;
