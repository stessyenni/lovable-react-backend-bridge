import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import EmergencyContactsManager, { EmergencyContact } from "./emergency/EmergencyContactsManager";
import EmergencyContactSelector from "./emergency/EmergencyContactSelector";
import { 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Heart, 
  Clock,
  Copy,
  Shield
} from "lucide-react";

const EmergencyPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [showContactSelector, setShowContactSelector] = useState(false);
  const { toast } = useToast();

  const emergencyServices = [
    { name: t('emergency.emergencyServices'), number: "911", type: "Emergency" },
    { name: t('emergency.poisonControl'), number: "1-800-222-1222", type: "Poison" },
    { name: t('emergency.suicidePrevention'), number: "1-800-273-8255", type: "Mental Health" }
  ];

  const medicalInfo = {
    bloodType: "O+",
    allergies: ["Penicillin", "Peanuts"],
    conditions: ["Diabetes", "Hypertension"],
    medications: ["Metformin", "Lisinopril"]
  };

  const handleEmergencyCall = (number: string, name: string) => {
    window.open(`tel:${number}`, '_self');
    toast({
      title: t('emergency.call') + " " + name,
      description: t('emergency.call') + " " + number,
    });
  };

  const handleSelectContact = (contact: EmergencyContact) => {
    setShowContactSelector(false);
    handleEmergencyCall(contact.phone, contact.name);
  };

  const sendSmsToAll = () => {
    if (contacts.length === 0) {
      toast({
        title: t('emergency.noContacts'),
        description: t('emergency.addContactsFirst'),
        variant: "destructive"
      });
      return;
    }

    // Get location if available
    navigator.geolocation?.getCurrentPosition(
      (position) => {
        const locationUrl = `https://maps.google.com/?q=${position.coords.latitude},${position.coords.longitude}`;
        const message = `${t('emergency.smsMessage')} ${locationUrl}`;
        const phones = contacts.map(c => c.phone).join(',');
        window.open(`sms:${phones}?body=${encodeURIComponent(message)}`, '_self');
      },
      () => {
        const message = t('emergency.smsMessageNoLocation');
        const phones = contacts.map(c => c.phone).join(',');
        window.open(`sms:${phones}?body=${encodeURIComponent(message)}`, '_self');
      }
    );

    toast({
      title: t('emergency.smsSending'),
      description: t('emergency.smsToAllContacts'),
      variant: "destructive"
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: t('emergency.copied'),
      description: t('emergency.infoCopied')
    });
  };

  const shareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const coords = `${position.coords.latitude}, ${position.coords.longitude}`;
        copyToClipboard(coords);
        toast({
          title: t('emergency.locationShared'),
          description: t('emergency.coordinatesCopied')
        });
      });
    }
  };

  const activateEmergencyMode = () => {
    setEmergencyMode(true);
    sendSmsToAll();
    toast({
      title: t('emergency.emergencyModeActivated'),
      description: t('emergency.contactsNotified'),
      variant: "destructive"
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-bold text-destructive">{t('emergency.title')}</h2>
        <p className="text-sm sm:text-base text-muted-foreground">{t('emergency.subtitle')}</p>
      </div>

      {/* Emergency Mode Alert */}
      {emergencyMode && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="font-semibold text-sm sm:text-base">{t('emergency.emergencyModeActive')}</span>
            </div>
            <p className="text-xs sm:text-sm mt-2">{t('emergency.emergencyModeDesc')}</p>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions - Always visible at top on mobile */}
      <div className="lg:hidden">
        <Card>
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
              {t('emergency.emergencyActions')}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">{t('emergency.immediateResponse')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3">
            <Button
              variant="destructive"
              size="lg"
              className="w-full text-sm sm:text-base h-10 sm:h-12"
              onClick={activateEmergencyMode}
              disabled={emergencyMode}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              {t('emergency.activateEmergencyMode')}
            </Button>

            <div className="grid grid-cols-2 gap-2">
              {contacts.length > 0 && (
                <Button
                  variant="outline"
                  className="border-destructive text-destructive hover:bg-destructive/10 text-xs sm:text-sm h-9 sm:h-10"
                  onClick={() => setShowContactSelector(true)}
                >
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="truncate">{t('emergency.callMyContact')}</span>
                </Button>
              )}
              
              <Button
                variant="outline"
                className="text-xs sm:text-sm h-9 sm:h-10"
                onClick={shareLocation}
              >
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="truncate">{t('emergency.shareLocation')}</span>
              </Button>

              <Button
                variant="outline"
                className={`text-xs sm:text-sm h-9 sm:h-10 ${contacts.length === 0 ? 'col-span-2' : ''}`}
                onClick={() => copyToClipboard(JSON.stringify(medicalInfo, null, 2))}
              >
                <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="truncate">{t('emergency.copyMedicalInfo')}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* My Emergency Contacts */}
        <div className="md:col-span-1">
          <EmergencyContactsManager onContactsChange={setContacts} />
        </div>

        {/* Emergency Services */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
              {t('emergency.emergencyServices')}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">{t('emergency.quickDial')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3">
            {emergencyServices.map((contact, index) => (
              <div key={index} className="flex items-center justify-between p-2 sm:p-3 border rounded-lg gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm sm:text-base truncate">{contact.name}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{contact.number}</p>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <Badge variant="outline" className="text-xs hidden sm:inline-flex">{contact.type}</Badge>
                  <Button
                    size="sm"
                    variant={contact.type === "Emergency" ? "destructive" : "outline"}
                    onClick={() => handleEmergencyCall(contact.number, contact.name)}
                    className="text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3"
                  >
                    {t('emergency.call')}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Medical Information - Responsive columns */}
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
              {t('emergency.medicalInfo')}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">{t('emergency.criticalDetails')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {/* Blood Type & Allergies Row */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <p className="text-xs sm:text-sm font-medium mb-1">{t('emergency.bloodType')}</p>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Badge variant="secondary" className="text-xs sm:text-sm">{medicalInfo.bloodType}</Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(medicalInfo.bloodType)}
                    className="h-6 w-6 sm:h-7 sm:w-7 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium mb-1">{t('emergency.allergiesLabel')}</p>
                <div className="flex flex-wrap gap-1">
                  {medicalInfo.allergies.map((allergy, index) => (
                    <Badge key={index} variant="destructive" className="text-xs">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Conditions & Medications Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <p className="text-xs sm:text-sm font-medium mb-1 sm:mb-2">{t('emergency.medicalConditionsLabel')}</p>
                <div className="flex flex-wrap gap-1">
                  {medicalInfo.conditions.map((condition, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs sm:text-sm font-medium mb-1 sm:mb-2">{t('emergency.currentMedications')}</p>
                <div className="flex flex-wrap gap-1">
                  {medicalInfo.medications.map((medication, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {medication}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions - Desktop only (hidden on mobile, shown above) */}
        <Card className="hidden lg:block">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {t('emergency.emergencyActions')}
            </CardTitle>
            <CardDescription>{t('emergency.immediateResponse')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="destructive"
              size="lg"
              className="w-full"
              onClick={activateEmergencyMode}
              disabled={emergencyMode}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              {t('emergency.activateEmergencyMode')}
            </Button>

            {contacts.length > 0 && (
              <Button
                variant="outline"
                size="lg"
                className="w-full border-destructive text-destructive hover:bg-destructive/10"
                onClick={() => setShowContactSelector(true)}
              >
                <Phone className="h-4 w-4 mr-2" />
                {t('emergency.callMyContact')}
              </Button>
            )}
            
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={shareLocation}
            >
              <MapPin className="h-4 w-4 mr-2" />
              {t('emergency.shareLocation')}
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => copyToClipboard(JSON.stringify(medicalInfo, null, 2))}
            >
              <Copy className="h-4 w-4 mr-2" />
              {t('emergency.copyMedicalInfo')}
            </Button>
          </CardContent>
        </Card>

        {/* Emergency Status */}
        <Card className="md:col-span-2 lg:col-span-2">
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
              {t('emergency.emergencyStatus')}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">{t('emergency.currentStatus')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 sm:p-3 bg-muted/50 rounded-lg">
                <span className="text-xs sm:text-sm text-muted-foreground">{t('emergency.personalContacts')}</span>
                <Badge variant="secondary" className="mt-1 sm:mt-0 w-fit text-xs">{contacts.length} {t('emergency.saved')}</Badge>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 sm:p-3 bg-muted/50 rounded-lg">
                <span className="text-xs sm:text-sm text-muted-foreground">{t('emergency.locationServices')}</span>
                <Badge variant="secondary" className="mt-1 sm:mt-0 w-fit text-xs">{t('emergency.enabled')}</Badge>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 sm:p-3 bg-muted/50 rounded-lg">
                <span className="text-xs sm:text-sm text-muted-foreground">{t('emergency.medicalData')}</span>
                <Badge variant="secondary" className="mt-1 sm:mt-0 w-fit text-xs">{t('emergency.complete')}</Badge>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 sm:p-3 bg-muted/50 rounded-lg">
                <span className="text-xs sm:text-sm text-muted-foreground">{t('emergency.emergencyMode')}</span>
                <Badge variant={emergencyMode ? "destructive" : "outline"} className="mt-1 sm:mt-0 w-fit text-xs">
                  {emergencyMode ? t('emergency.active') : t('emergency.inactive')}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Selector Dialog */}
      <EmergencyContactSelector
        open={showContactSelector}
        onClose={() => setShowContactSelector(false)}
        contacts={contacts}
        onSelectContact={handleSelectContact}
        onSendSmsToAll={sendSmsToAll}
      />
    </div>
  );
};

export default EmergencyPage;
