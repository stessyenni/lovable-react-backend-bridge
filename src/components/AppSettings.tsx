
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Bell, Moon, Accessibility, Volume2, Vibrate, Shield, Watch } from "lucide-react";
import SmartWatchSync from "./SmartWatchSync";

const AppSettings = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [voiceGuidance, setVoiceGuidance] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState([16]);
  const [voiceVolume, setVoiceVolume] = useState([75]);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Apply dark mode
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    // Apply font size
    document.documentElement.style.fontSize = `${fontSize[0]}px`;
  }, [fontSize]);

  useEffect(() => {
    // Apply high contrast
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  const handleBiometricAuth = async () => {
    try {
      if ('credentials' in navigator) {
        const credential = await (navigator as any).credentials.create({
          publicKey: {
            challenge: new Uint8Array(32),
            rp: { name: "Hemapp" },
            user: {
              id: new Uint8Array(16),
              name: "user@example.com",
              displayName: "User"
            },
            pubKeyCredParams: [{ alg: -7, type: "public-key" }],
            authenticatorSelection: {
              authenticatorAttachment: "platform",
              userVerification: "required"
            }
          }
        });
        
        if (credential) {
          setBiometricEnabled(true);
          toast({
            title: "Biometric Authentication Enabled",
            description: "Your device biometric authentication is now active.",
          });
        }
      } else {
        toast({
          title: "Biometric Not Supported",
          description: "Your device doesn't support biometric authentication.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Biometric Setup Failed",
        description: "Failed to set up biometric authentication. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">App Settings</h2>
        <p className="text-muted-foreground">Customize your Hemapp experience</p>
      </div>

      {/* SmartWatch Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Watch className="h-5 w-5" />
            SmartWatch Integration
          </CardTitle>
          <CardDescription>Connect and sync with your smartwatch</CardDescription>
        </CardHeader>
        <CardContent>
          <SmartWatchSync />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>Control when and how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
            </div>
            <Switch
              id="push-notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>

          <div className="space-y-4">
            <Label>Notification Types</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Medication Reminders</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Meal Logging</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Exercise Reminders</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Goal Updates</span>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Health Tips</span>
                <Switch />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notification-time">Quiet Hours</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select quiet hours" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No quiet hours</SelectItem>
                <SelectItem value="night">10 PM - 8 AM</SelectItem>
                <SelectItem value="work">9 AM - 5 PM</SelectItem>
                <SelectItem value="custom">Custom hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Accessibility className="h-5 w-5" />
            Accessibility
          </CardTitle>
          <CardDescription>Make Hemapp easier to use</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="voice-guidance">Voice Guidance</Label>
              <p className="text-sm text-muted-foreground">Read aloud app content and instructions</p>
            </div>
            <Switch
              id="voice-guidance"
              checked={voiceGuidance}
              onCheckedChange={setVoiceGuidance}
            />
          </div>

          <div className="space-y-2">
            <Label>Voice Volume: {voiceVolume[0]}%</Label>
            <Slider
              value={voiceVolume}
              onValueChange={setVoiceVolume}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="high-contrast">High Contrast Mode</Label>
              <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
            </div>
            <Switch
              id="high-contrast"
              checked={highContrast}
              onCheckedChange={setHighContrast}
            />
          </div>

          <div className="space-y-2">
            <Label>Font Size: {fontSize[0]}px</Label>
            <Slider
              value={fontSize}
              onValueChange={setFontSize}
              min={12}
              max={24}
              step={1}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="haptic-feedback">Haptic Feedback</Label>
              <p className="text-sm text-muted-foreground">Vibrate for touch interactions</p>
            </div>
            <Switch id="haptic-feedback" defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>Customize how the app looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">Use dark theme for better visibility in low light</p>
            </div>
            <Switch
              id="dark-mode"
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="theme">Color Theme</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default Blue</SelectItem>
                <SelectItem value="green">Health Green</SelectItem>
                <SelectItem value="purple">Calm Purple</SelectItem>
                <SelectItem value="orange">Energetic Orange</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Security
          </CardTitle>
          <CardDescription>Control your data and privacy settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="biometric-lock">Biometric Lock</Label>
              <p className="text-sm text-muted-foreground">Use fingerprint or face ID to unlock app</p>
            </div>
            <div className="flex items-center gap-2">
              <Switch 
                id="biometric-lock" 
                checked={biometricEnabled}
                onCheckedChange={(checked) => {
                  if (checked) {
                    handleBiometricAuth();
                  } else {
                    setBiometricEnabled(false);
                  }
                }}
              />
              {!biometricEnabled && (
                <Button onClick={handleBiometricAuth} size="sm" variant="outline">
                  Setup
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-lock">Auto Lock</Label>
              <p className="text-sm text-muted-foreground">Lock app when not in use</p>
            </div>
            <Switch id="auto-lock" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="analytics">Share Usage Analytics</Label>
              <p className="text-sm text-muted-foreground">Help improve the app (anonymous data only)</p>
            </div>
            <Switch id="analytics" defaultChecked />
          </div>

          <div className="pt-4 space-y-3">
            <Button variant="outline" className="w-full">
              Export My Data
            </Button>
            <Button variant="outline" className="w-full">
              Reset All Settings
            </Button>
            <Button variant="destructive" className="w-full">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppSettings;
