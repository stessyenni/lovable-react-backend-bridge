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
    <div className="space-y-6 p-2 sm:p-4 lg:p-6">
      <div>
        <h2 className="text-2xl font-bold text-destructive">{t('emergency.title')}</h2>
        <p className="text-muted-foreground">{t('emergency.subtitle')}</p>
      </div>

      {emergencyMode && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-semibold">{t('emergency.emergencyModeActive')}</span>
            </div>
            <p className="text-sm mt-2">{t('emergency.emergencyModeDesc')}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* My Emergency Contacts */}
        <EmergencyContactsManager onContactsChange={setContacts} />

        {/* Emergency Services */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              {t('emergency.emergencyServices')}
            </CardTitle>
            <CardDescription>{t('emergency.quickDial')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {emergencyServices.map((contact, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-muted-foreground">{contact.number}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{contact.type}</Badge>
                  <Button
                    size="sm"
                    variant={contact.type === "Emergency" ? "destructive" : "outline"}
                    onClick={() => handleEmergencyCall(contact.number, contact.name)}
                  >
                    {t('emergency.call')}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Medical Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              {t('emergency.medicalInfo')}
            </CardTitle>
            <CardDescription>{t('emergency.criticalDetails')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">{t('emergency.bloodType')}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{medicalInfo.bloodType}</Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(medicalInfo.bloodType)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">{t('emergency.allergiesLabel')}</p>
                <div className="flex flex-wrap gap-1">
                  {medicalInfo.allergies.map((allergy, index) => (
                    <Badge key={index} variant="destructive" className="text-xs">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">{t('emergency.medicalConditionsLabel')}</p>
              <div className="flex flex-wrap gap-1">
                {medicalInfo.conditions.map((condition, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {condition}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">{t('emergency.currentMedications')}</p>
              <div className="flex flex-wrap gap-1">
                {medicalInfo.medications.map((medication, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {medication}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {t('emergency.emergencyStatus')}
            </CardTitle>
            <CardDescription>{t('emergency.currentStatus')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">{t('emergency.personalContacts')}</span>
              <Badge variant="secondary">{contacts.length} {t('emergency.saved')}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">{t('emergency.locationServices')}</span>
              <Badge variant="secondary">{t('emergency.enabled')}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">{t('emergency.medicalData')}</span>
              <Badge variant="secondary">{t('emergency.complete')}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">{t('emergency.emergencyMode')}</span>
              <Badge variant={emergencyMode ? "destructive" : "outline"}>
                {emergencyMode ? t('emergency.active') : t('emergency.inactive')}
              </Badge>
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
