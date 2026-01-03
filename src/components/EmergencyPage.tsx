import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Heart, 
  Clock,
  Copy,
  Shield,
  Edit2,
  Save,
  X
} from "lucide-react";

const EmergencyPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [personalContact, setPersonalContact] = useState({ name: "", number: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editNumber, setEditNumber] = useState("");
  const { toast } = useToast();

  // Fetch user's emergency contact from profile
  useEffect(() => {
    const fetchEmergencyContact = async () => {
      if (!user?.id) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('emergency_contact')
        .eq('id', user.id)
        .single();
      
      if (data?.emergency_contact) {
        // Parse stored contact (format: "Name: Number")
        const parts = data.emergency_contact.split(': ');
        if (parts.length === 2) {
          setPersonalContact({ name: parts[0], number: parts[1] });
        } else {
          setPersonalContact({ name: t('emergency.personalContact'), number: data.emergency_contact });
        }
      }
    };
    
    fetchEmergencyContact();
  }, [user?.id, t]);

  const saveEmergencyContact = async () => {
    if (!user?.id || !editName.trim() || !editNumber.trim()) {
      toast({
        title: t('emergency.error'),
        description: t('emergency.fillBothFields'),
        variant: "destructive"
      });
      return;
    }

    const contactString = `${editName.trim()}: ${editNumber.trim()}`;
    
    const { error } = await supabase
      .from('profiles')
      .update({ emergency_contact: contactString })
      .eq('id', user.id);

    if (error) {
      toast({
        title: t('emergency.error'),
        description: t('emergency.saveFailed'),
        variant: "destructive"
      });
      return;
    }

    setPersonalContact({ name: editName.trim(), number: editNumber.trim() });
    setIsEditing(false);
    toast({
      title: t('emergency.saved'),
      description: t('emergency.contactSaved')
    });
  };

  const startEditing = () => {
    setEditName(personalContact.name);
    setEditNumber(personalContact.number);
    setIsEditing(true);
  };

  const emergencyContacts = [
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
    toast({
      title: t('emergency.emergencyModeActivated'),
      description: t('emergency.contactsNotified'),
      variant: "destructive"
    });
  };

  return (
    <div className="space-y-6">
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
        {/* Emergency Contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              {t('emergency.emergencyContacts')}
            </CardTitle>
            <CardDescription>{t('emergency.quickDial')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {emergencyContacts.map((contact, index) => (
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

            {/* Personal Emergency Contact - Editable */}
            <div className="p-3 border-2 border-primary/50 rounded-lg bg-primary/5">
              {isEditing ? (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="contactName">{t('emergency.contactName')}</Label>
                    <Input
                      id="contactName"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder={t('emergency.enterContactName')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactNumber">{t('emergency.contactNumber')}</Label>
                    <Input
                      id="contactNumber"
                      value={editNumber}
                      onChange={(e) => setEditNumber(e.target.value)}
                      placeholder={t('emergency.enterContactNumber')}
                      type="tel"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={saveEmergencyContact}>
                      <Save className="h-3 w-3 mr-1" />
                      {t('emergency.save')}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                      <X className="h-3 w-3 mr-1" />
                      {t('emergency.cancel')}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {personalContact.name || t('emergency.noContactSet')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {personalContact.number || t('emergency.tapToAdd')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{t('emergency.personal')}</Badge>
                    {personalContact.number && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEmergencyCall(personalContact.number, personalContact.name)}
                      >
                        {t('emergency.call')}
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={startEditing}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
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
              <span className="text-sm">{t('emergency.emergencyContacts')}</span>
              <Badge variant="secondary">{personalContact.number ? 4 : 3} {t('emergency.active')}</Badge>
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
    </div>
  );
};

export default EmergencyPage;
