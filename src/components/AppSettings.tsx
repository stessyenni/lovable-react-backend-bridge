
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Bell, Moon, Accessibility, Volume2, Vibrate, Shield } from "lucide-react";

const AppSettings = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [voiceGuidance, setVoiceGuidance] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState([16]);
  const [voiceVolume, setVoiceVolume] = useState([75]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">App Settings</h2>
        <p className="text-muted-foreground">Customize your Hemapp experience</p>
      </div>

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
            <div className="space-y-3">
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
            <Switch id="biometric-lock" />
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
