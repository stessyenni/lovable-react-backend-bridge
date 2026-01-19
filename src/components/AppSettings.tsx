import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
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
import { useNotificationSettings } from "@/hooks/useNotificationSettings";

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
  const { settings: notificationSettings, updateSetting } = useNotificationSettings();
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });
  const [voiceGuidance, setVoiceGuidance] = useState(() => {
    const saved = localStorage.getItem('voiceGuidance');
    return saved !== null ? saved === 'true' : true;
  });
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState([16]);
  const [voiceVolume, setVoiceVolume] = useState(() => {
    const saved = localStorage.getItem('voiceVolume');
    return saved ? [parseInt(saved)] : [75];
  });
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricSupported, setBiometricSupported] = useState(false);
  const { toast } = useToast();

  // Save voice guidance setting
  useEffect(() => {
    localStorage.setItem('voiceGuidance', voiceGuidance.toString());
  }, [voiceGuidance]);

  // Save voice volume setting
  useEffect(() => {
    localStorage.setItem('voiceVolume', voiceVolume[0].toString());
  }, [voiceVolume]);

  useEffect(() => {
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
          setBiometricSupported(false);
        }
      } else {
        setBiometricSupported(false);
      }
    };

    checkBiometricSupport();
    
    const savedBiometric = localStorage.getItem('biometricEnabled') === 'true';
    setBiometricEnabled(savedBiometric);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize[0]}px`;
    localStorage.setItem('fontSize', fontSize[0].toString());
  }, [fontSize]);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
      localStorage.setItem('highContrast', 'true');
    } else {
      document.documentElement.classList.remove('high-contrast');
      localStorage.setItem('highContrast', 'false');
    }
  }, [highContrast]);

  useEffect(() => {
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
        title: t('appSettings.privacy.biometricLock'),
        description: t('appSettings.privacy.biometricNotSupported'),
        variant: "destructive"
      });
      return;
    }

    try {
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
          title: t('appSettings.privacy.biometricLock'),
          description: t('appSettings.privacy.biometricEnabled'),
        });
      }
    } catch (error: any) {
      console.error('Biometric setup error:', error);
      toast({
        title: t('appSettings.privacy.biometricLock'),
        description: t('appSettings.privacy.biometricNotSupported'),
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-4xl mx-auto p-2 sm:p-4 lg:p-6 min-w-0">
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
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            {t('appSettings.notifications.title')}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">{t('appSettings.notifications.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-6 pt-0 sm:pt-0">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifications" className="text-xs sm:text-sm">{t('appSettings.notifications.pushNotifications')}</Label>
              <p className="text-xs text-muted-foreground">{t('appSettings.notifications.pushDescription')}</p>
            </div>
            <Switch
              id="push-notifications"
              checked={notificationSettings.pushNotifications}
              onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
            />
          </div>

          <div className="space-y-4">
            <Label className="text-xs sm:text-sm">{t('appSettings.notifications.types')}</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm">{t('appSettings.notifications.medication')}</span>
                <Switch 
                  checked={notificationSettings.medication}
                  onCheckedChange={(checked) => updateSetting('medication', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm">{t('appSettings.notifications.meal')}</span>
                <Switch 
                  checked={notificationSettings.meal}
                  onCheckedChange={(checked) => updateSetting('meal', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm">{t('appSettings.notifications.exercise')}</span>
                <Switch 
                  checked={notificationSettings.exercise}
                  onCheckedChange={(checked) => updateSetting('exercise', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm">{t('appSettings.notifications.goals')}</span>
                <Switch 
                  checked={notificationSettings.goals}
                  onCheckedChange={(checked) => updateSetting('goals', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm">{t('appSettings.notifications.healthTips')}</span>
                <Switch 
                  checked={notificationSettings.healthTips}
                  onCheckedChange={(checked) => updateSetting('healthTips', checked)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notification-time" className="text-xs sm:text-sm">{t('appSettings.notifications.quietHours')}</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder={t('appSettings.notifications.quietHours')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t('appSettings.notifications.noQuietHours')}</SelectItem>
                <SelectItem value="night">{t('appSettings.notifications.night')}</SelectItem>
                <SelectItem value="work">{t('appSettings.notifications.work')}</SelectItem>
                <SelectItem value="custom">{t('appSettings.notifications.custom')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <Accessibility className="h-4 w-4 sm:h-5 sm:w-5" />
            {t('appSettings.accessibility.title')}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">{t('appSettings.accessibility.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-6 pt-0 sm:pt-0">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="voice-guidance" className="text-xs sm:text-sm">{t('appSettings.accessibility.voiceGuidance')}</Label>
              <p className="text-xs text-muted-foreground">{t('appSettings.accessibility.voiceGuidanceDesc')}</p>
            </div>
            <Switch
              id="voice-guidance"
              checked={voiceGuidance}
              onCheckedChange={setVoiceGuidance}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs sm:text-sm">{t('appSettings.accessibility.voiceVolume')}: {voiceVolume[0]}%</Label>
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
              <Label htmlFor="high-contrast" className="text-xs sm:text-sm">{t('appSettings.accessibility.highContrast')}</Label>
              <p className="text-xs text-muted-foreground">{t('appSettings.accessibility.highContrastDesc')}</p>
            </div>
            <Switch
              id="high-contrast"
              checked={highContrast}
              onCheckedChange={setHighContrast}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs sm:text-sm">{t('appSettings.accessibility.fontSize')}: {fontSize[0]}px</Label>
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
              <Label htmlFor="haptic-feedback" className="text-xs sm:text-sm">{t('appSettings.accessibility.hapticFeedback')}</Label>
              <p className="text-xs text-muted-foreground">{t('appSettings.accessibility.hapticFeedbackDesc')}</p>
            </div>
            <Switch id="haptic-feedback" defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
            {t('appSettings.appearance.title')}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">{t('appSettings.appearance.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-6 pt-0 sm:pt-0">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode" className="text-xs sm:text-sm">{t('appSettings.appearance.darkMode')}</Label>
              <p className="text-xs text-muted-foreground">{t('appSettings.appearance.darkModeDesc')}</p>
            </div>
            <Switch
              id="dark-mode"
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="theme" className="text-xs sm:text-sm">{t('appSettings.appearance.colorTheme')}</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder={t('appSettings.appearance.colorTheme')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">{t('appSettings.appearance.defaultBlue')}</SelectItem>
                <SelectItem value="green">{t('appSettings.appearance.healthGreen')}</SelectItem>
                <SelectItem value="purple">{t('appSettings.appearance.calmPurple')}</SelectItem>
                <SelectItem value="orange">{t('appSettings.appearance.energeticOrange')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
            {t('appSettings.privacy.title')}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">{t('appSettings.privacy.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-6 pt-0 sm:pt-0">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="biometric-lock" className="text-xs sm:text-sm">{t('appSettings.privacy.biometricLock')}</Label>
              <p className="text-xs text-muted-foreground">
                {biometricSupported ? t('appSettings.privacy.biometricEnabled') : t('appSettings.privacy.biometricNotSupported')}
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
                      title: t('appSettings.privacy.biometricLock'),
                      description: t('appSettings.privacy.biometricNotSupported'),
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
              <Label htmlFor="auto-lock" className="text-xs sm:text-sm">{t('appSettings.privacy.autoLock')}</Label>
              <p className="text-xs text-muted-foreground">{t('appSettings.privacy.autoLockDesc')}</p>
            </div>
            <Switch id="auto-lock" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="analytics" className="text-xs sm:text-sm">{t('appSettings.privacy.analytics')}</Label>
              <p className="text-xs text-muted-foreground">{t('appSettings.privacy.analyticsDesc')}</p>
            </div>
            <Switch id="analytics" defaultChecked />
          </div>

          <div className="pt-4 space-y-3">
            <Button variant="outline" className="w-full text-xs sm:text-sm">
              {t('appSettings.privacy.exportData')}
            </Button>
            <Button variant="outline" className="w-full text-xs sm:text-sm">
              {t('appSettings.privacy.resetSettings')}
            </Button>
            <Button variant="destructive" className="w-full text-xs sm:text-sm">
              {t('appSettings.privacy.deleteAccount')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppSettings;
