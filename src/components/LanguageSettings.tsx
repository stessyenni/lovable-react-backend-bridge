
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Globe, Volume2, Download, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const LanguageSettings = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [autoTranslate, setAutoTranslate] = useState(false);
  const [speechLanguage, setSpeechLanguage] = useState("en");

  const languages = [
    { code: "en", name: "English", nativeName: "English", downloaded: true },
    { code: "es", name: "Spanish", nativeName: "Español", downloaded: true },
    { code: "fr", name: "French", nativeName: "Français", downloaded: false },
    { code: "de", name: "German", nativeName: "Deutsch", downloaded: false },
    { code: "it", name: "Italian", nativeName: "Italiano", downloaded: false },
    { code: "pt", name: "Portuguese", nativeName: "Português", downloaded: false },
    { code: "ru", name: "Russian", nativeName: "Русский", downloaded: false },
    { code: "zh", name: "Chinese", nativeName: "中文", downloaded: false },
    { code: "ja", name: "Japanese", nativeName: "日本語", downloaded: false },
    { code: "ar", name: "Arabic", nativeName: "العربية", downloaded: false },
    { code: "hi", name: "Hindi", nativeName: "हिन्दी", downloaded: false },
    { code: "sw", name: "Swahili", nativeName: "Kiswahili", downloaded: false }
  ];

  const voiceLanguages = [
    { code: "en-US", name: "English (US)", voice: "Natural" },
    { code: "en-GB", name: "English (UK)", voice: "Natural" },
    { code: "es-ES", name: "Spanish (Spain)", voice: "Natural" },
    { code: "es-MX", name: "Spanish (Mexico)", voice: "Natural" },
    { code: "fr-FR", name: "French", voice: "Natural" },
    { code: "de-DE", name: "German", voice: "Natural" },
    { code: "it-IT", name: "Italian", voice: "Natural" },
    { code: "pt-BR", name: "Portuguese (Brazil)", voice: "Natural" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Language & Accessibility</h2>
        <p className="text-muted-foreground">Configure language preferences and accessibility features</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Display Language
          </CardTitle>
          <CardDescription>Choose your preferred language for the app interface</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="display-language">App Language</Label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.filter(lang => lang.downloaded).map((language) => (
                  <SelectItem key={language.code} value={language.code}>
                    <div className="flex items-center justify-between w-full">
                      <span>{language.name} ({language.nativeName})</span>
                      {language.downloaded && <Check className="h-4 w-4 text-green-500 ml-2" />}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-translate">Auto-translate Medical Terms</Label>
              <p className="text-sm text-muted-foreground">Automatically translate complex medical terminology</p>
            </div>
            <Switch
              id="auto-translate"
              checked={autoTranslate}
              onCheckedChange={setAutoTranslate}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Speech & Voice
          </CardTitle>
          <CardDescription>Configure text-to-speech and voice recognition settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="speech-language">Voice Language</Label>
            <Select value={speechLanguage} onValueChange={setSpeechLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select voice language" />
              </SelectTrigger>
              <SelectContent>
                {voiceLanguages.map((language) => (
                  <SelectItem key={language.code} value={language.code}>
                    <div className="flex items-center justify-between w-full">
                      <span>{language.name}</span>
                      <Badge variant="secondary" className="ml-2">{language.voice}</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="speech-to-text">Speech-to-Text</Label>
                <p className="text-sm text-muted-foreground">Use voice commands to navigate and input data</p>
              </div>
              <Switch id="speech-to-text" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="text-to-speech">Text-to-Speech</Label>
                <p className="text-sm text-muted-foreground">Have app content read aloud</p>
              </div>
              <Switch id="text-to-speech" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="voice-commands">Voice Commands</Label>
                <p className="text-sm text-muted-foreground">Control app functions with voice</p>
              </div>
              <Switch id="voice-commands" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Offline Languages
          </CardTitle>
          <CardDescription>Download languages for offline use</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {languages.map((language) => (
              <div key={language.code} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{language.name}</h4>
                  <p className="text-sm text-muted-foreground">{language.nativeName}</p>
                </div>
                <div className="flex items-center gap-2">
                  {language.downloaded ? (
                    <Badge variant="default">
                      <Check className="h-3 w-3 mr-1" />
                      Downloaded
                    </Badge>
                  ) : (
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Braille Support</CardTitle>
          <CardDescription>Configure Braille display and input settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="braille-support">Enable Braille Support</Label>
              <p className="text-sm text-muted-foreground">Connect and use Braille displays</p>
            </div>
            <Switch id="braille-support" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="braille-type">Braille Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Braille type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grade1">Grade 1 Braille</SelectItem>
                <SelectItem value="grade2">Grade 2 Braille</SelectItem>
                <SelectItem value="computer">Computer Braille</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" className="w-full">
            Configure Braille Display
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LanguageSettings;
