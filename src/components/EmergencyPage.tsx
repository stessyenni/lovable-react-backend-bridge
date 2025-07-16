import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Heart, 
  Clock,
  User,
  Copy,
  Shield
} from "lucide-react";

const EmergencyPage = () => {
  const [emergencyMode, setEmergencyMode] = useState(false);
  const { toast } = useToast();

  const emergencyContacts = [
    { name: "Emergency Services", number: "911", type: "Emergency" },
    { name: "Poison Control", number: "1-800-222-1222", type: "Poison" },
    { name: "National Suicide Prevention", number: "1-800-273-8255", type: "Mental Health" },
    { name: "Emergency Contact", number: "Loading...", type: "Personal" }
  ];

  const medicalInfo = {
    bloodType: "O+",
    allergies: ["Penicillin", "Peanuts"],
    conditions: ["Diabetes", "Hypertension"],
    medications: ["Metformin", "Lisinopril"]
  };

  const handleEmergencyCall = (number: string, name: string) => {
    if (number === "Loading...") {
      toast({
        title: "No Emergency Contact",
        description: "Please add an emergency contact in your profile settings.",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would make the actual call
    toast({
      title: "Calling " + name,
      description: "Initiating emergency call to " + number,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Information copied to clipboard"
    });
  };

  const shareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const coords = `${position.coords.latitude}, ${position.coords.longitude}`;
        copyToClipboard(coords);
        toast({
          title: "Location Shared",
          description: "Your coordinates have been copied to clipboard"
        });
      });
    }
  };

  const activateEmergencyMode = () => {
    setEmergencyMode(true);
    toast({
      title: "Emergency Mode Activated",
      description: "Your emergency contacts will be notified",
      variant: "destructive"
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-destructive">Emergency Center</h2>
        <p className="text-muted-foreground">Quick access to emergency contacts and medical information</p>
      </div>

      {emergencyMode && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-semibold">EMERGENCY MODE ACTIVE</span>
            </div>
            <p className="text-sm mt-2">Emergency contacts have been notified of your situation.</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Emergency Contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Emergency Contacts
            </CardTitle>
            <CardDescription>Quick dial for emergency situations</CardDescription>
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
                    Call
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
              Medical Information
            </CardTitle>
            <CardDescription>Critical medical details for first responders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Blood Type</p>
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
                <p className="text-sm font-medium">Allergies</p>
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
              <p className="text-sm font-medium mb-2">Medical Conditions</p>
              <div className="flex flex-wrap gap-1">
                {medicalInfo.conditions.map((condition, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {condition}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Current Medications</p>
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
              Emergency Actions
            </CardTitle>
            <CardDescription>Immediate emergency response options</CardDescription>
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
              Activate Emergency Mode
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={shareLocation}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Share Current Location
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => copyToClipboard(JSON.stringify(medicalInfo, null, 2))}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Medical Info
            </Button>
          </CardContent>
        </Card>

        {/* Emergency Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Emergency Status
            </CardTitle>
            <CardDescription>Current emergency system status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Emergency Contacts</span>
              <Badge variant="secondary">3 Active</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Location Services</span>
              <Badge variant="secondary">Enabled</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Medical Data</span>
              <Badge variant="secondary">Complete</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Emergency Mode</span>
              <Badge variant={emergencyMode ? "destructive" : "outline"}>
                {emergencyMode ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmergencyPage;