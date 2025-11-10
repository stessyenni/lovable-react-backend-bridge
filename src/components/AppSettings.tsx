import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Bell, Moon, Accessibility, Volume2, Vibrate, Shield, Watch, Mic } from "lucide-react";
import SmartWatchSync from "./SmartWatchSync";
import VoiceCommands from "./VoiceCommands";
import { useTranslation } from 'react-i18next';

interface AppSettingsProps {
  brailleMode?: boolean;
  onNavigate?: (section: string) => void;
  speechEnabled?: boolean;
  onSpeechToggle?: () => void;
}

const AppSettings = ({ 
  brailleMode = false, 
  onNavigate,
  speechEnabled = false,
  onSpeechToggle 
}: AppSettingsProps = {}) => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });
  const [voiceGuidance, setVoiceGuidance] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState([16]);
  const [voiceVolume, setVoiceVolume] = useState([75]);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricSupported, setBiometricSupported] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if biometric authentication is supported
    const checkBiometricSupport = async () => {
      if ('credentials' in navigator && 'create' in (navigator as any).credentials) {
        try {
          const available = await (navigator as any).credentials.get({
            publicKey: {
              challenge: new Uint8Array(32),
              timeout: 60000,
              userVerification: "required"
            }
          });
          setBiometricSupported(true);
        } catch (error) {
          // Biometric not available or supported
          setBiometricSupported(false);
        }
      } else {
        setBiometricSupported(false);
      }
    };

    checkBiometricSupport();
    
    // Load saved biometric setting
    const savedBiometric = localStorage.getItem('biometricEnabled') === 'true';
    setBiometricEnabled(savedBiometric);
  }, []);

  useEffect(() => {
    // Apply dark mode
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  useEffect(() => {
    // Apply font size
    document.documentElement.style.fontSize = `${fontSize[0]}px`;
    localStorage.setItem('fontSize', fontSize[0].toString());
  }, [fontSize]);

  useEffect(() => {
    // Apply high contrast
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
      localStorage.setItem('highContrast', 'true');
    } else {
      document.documentElement.classList.remove('high-contrast');
      localStorage.setItem('highContrast', 'false');
    }
  }, [highContrast]);

  useEffect(() => {
    // Load saved settings on component mount
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedHighContrast = localStorage.getItem('highContrast') === 'true';
    const savedFontSize = localStorage.getItem('fontSize');
    
    setDarkMode(savedDarkMode);
    setHighContrast(savedHighContrast);
    if (savedFontSize) {
      setFontSize([parseInt(savedFontSize)]);
    }
  }, []);

  const handleBiometricAuth = async () => {
    if (!biometricSupported) {
      toast({
        title: "Biometric Not Supported",
        description: "Your device doesn't support biometric authentication or it's not set up.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Try to create a credential
      const credential = await (navigator as any).credentials.create({
        publicKey: {
          challenge: crypto.getRandomValues(new Uint8Array(32)),
          rp: { name: "Hemapp" },
          user: {
            id: crypto.getRandomValues(new Uint8Array(16)),
            name: "user@hemapp.com",
            displayName: "Hemapp User"
          },
          pubKeyCredParams: [{ alg: -7, type: "public-key" }],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required"
          },
          timeout: 60000,
          attestation: "direct"
        }
      });
      
      if (credential) {
        setBiometricEnabled(true);
        localStorage.setItem('biometricEnabled', 'true');
        toast({
          title: "Biometric Authentication Enabled",
          description: "Your device biometric authentication is now active.",
        });
      }
    } catch (error: any) {
      console.error('Biometric setup error:', error);
      
      let errorMessage = "Failed to set up biometric authentication.";
      if (error.name === 'NotSupportedError') {
        errorMessage = "Biometric authentication is not supported on this device.";
      } else if (error.name === 'NotAllowedError') {
        errorMessage = "Biometric authentication was not allowed. Please check your device settings.";
      } else if (error.name === 'InvalidStateError') {
        errorMessage = "Biometric authentication is already set up or device is not ready.";
      }
      
      toast({
        title: "Biometric Setup Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto p-2 sm:p-4 lg:p-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-2">{t('appSettings.title')}</h2>
        <p className="text-muted-foreground text-sm sm:text-base">{t('appSettings.subtitle')}</p>
      </div>

      {/* SmartWatch Integration */}
      <Card>
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
            <Watch className="h-4 w-4 sm:h-5 sm:w-5" />
            {t('appSettings.smartWatch.title')}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">{t('appSettings.smartWatch.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <SmartWatchSync />
        </CardContent>
      </Card>

      {/* Voice Commands */}
      <Card>
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
            <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
            {t('appSettings.voiceCommands.title')}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">{t('appSettings.voiceCommands.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <VoiceCommands 
            onNavigate={onNavigate}
            speechEnabled={speechEnabled}
            onSpeechToggle={onSpeechToggle}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            Notifications
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">Control when and how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifications" className="text-xs sm:text-sm">Push Notifications</Label>
              <p className="text-xs text-muted-foreground">Receive notifications on your device</p>
            </div>
            <Switch
              id="push-notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>

          <div className="space-y-4">
            <Label className="text-xs sm:text-sm">Notification Types</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm">Medication Reminders</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm">Meal Logging</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm">Exercise Reminders</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm">Goal Updates</span>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm">Health Tips</span>
                <Switch />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notification-time" className="text-xs sm:text-sm">Quiet Hours</Label>
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
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <Accessibility className="h-4 w-4 sm:h-5 sm:w-5" />
            Accessibility
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">Make Hemapp easier to use</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="voice-guidance" className="text-xs sm:text-sm">Voice Guidance</Label>
              <p className="text-xs text-muted-foreground">Read aloud app content and instructions</p>
            </div>
            <Switch
              id="voice-guidance"
              checked={voiceGuidance}
              onCheckedChange={setVoiceGuidance}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs sm:text-sm">Voice Volume: {voiceVolume[0]}%</Label>
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
              <Label htmlFor="high-contrast" className="text-xs sm:text-sm">High Contrast Mode</Label>
              <p className="text-xs text-muted-foreground">Increase contrast for better visibility</p>
            </div>
            <Switch
              id="high-contrast"
              checked={highContrast}
              onCheckedChange={setHighContrast}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs sm:text-sm">Font Size: {fontSize[0]}px</Label>
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
              <Label htmlFor="haptic-feedback" className="text-xs sm:text-sm">Haptic Feedback</Label>
              <p className="text-xs text-muted-foreground">Vibrate for touch interactions</p>
            </div>
            <Switch id="haptic-feedback" defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
            Appearance
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">Customize how the app looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode" className="text-xs sm:text-sm">Dark Mode</Label>
              <p className="text-xs text-muted-foreground">Use dark theme for better visibility in low light</p>
            </div>
            <Switch
              id="dark-mode"
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="theme" className="text-xs sm:text-sm">Color Theme</Label>
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
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
            Privacy & Security
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">Control your data and privacy settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="biometric-lock" className="text-xs sm:text-sm">Biometric Lock</Label>
              <p className="text-xs text-muted-foreground">
                {biometricSupported ? "Use fingerprint or face ID to unlock app" : "Not supported on this device"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Switch 
                id="biometric-lock" 
                checked={biometricEnabled}
                disabled={!biometricSupported}
                onCheckedChange={(checked) => {
                  if (checked) {
                    handleBiometricAuth();
                  } else {
                    setBiometricEnabled(false);
                    localStorage.setItem('biometricEnabled', 'false');
                    toast({
                      title: "Biometric Lock Disabled",
                      description: "Biometric authentication has been turned off.",
                    });
                  }
                }}
              />
              {!biometricEnabled && biometricSupported && (
                <Button onClick={handleBiometricAuth} size="sm" variant="outline">
                  Setup
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-lock" className="text-xs sm:text-sm">Auto Lock</Label>
              <p className="text-xs text-muted-foreground">Lock app when not in use</p>
            </div>
            <Switch id="auto-lock" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="analytics" className="text-xs sm:text-sm">Share Usage Analytics</Label>
              <p className="text-xs text-muted-foreground">Help improve the app (anonymous data only)</p>
            </div>
            <Switch id="analytics" defaultChecked />
          </div>

          <div className="pt-4 space-y-3">
            <Button variant="outline" className="w-full text-xs sm:text-sm">
              Export My Data
            </Button>
            <Button variant="outline" className="w-full text-xs sm:text-sm">
              Reset All Settings
            </Button>
            <Button variant="destructive" className="w-full text-xs sm:text-sm">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppSettings;
