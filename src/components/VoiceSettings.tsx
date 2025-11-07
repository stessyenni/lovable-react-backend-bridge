import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { 
  Volume2, 
  VolumeX, 
  Settings, 
  User, 
  UserCheck,
  Play,
  Pause
} from "lucide-react";

interface VoiceSettingsProps {
  speechEnabled?: boolean;
  onSpeechToggle?: () => void;
}

interface Voice {
  name: string;
  lang: string;
  gender: 'male' | 'female';
  voiceURI: string;
}

const VoiceSettings = ({ speechEnabled = false, onSpeechToggle }: VoiceSettingsProps) => {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [rate, setRate] = useState([1]);
  const [pitch, setPitch] = useState([1]);
  const [volume, setVolume] = useState([0.8]);
  const [isTestingSpeech, setIsTestingSpeech] = useState(false);
  const { toast } = useToast();
  const { i18n } = useTranslation();

  useEffect(() => {
    const loadVoices = () => {
      if ('speechSynthesis' in window) {
        const availableVoices = window.speechSynthesis.getVoices();
        const currentLang = i18n.language;
        
        // Filter voices based on current language
        let filteredVoices: Voice[] = [];
        
        if (currentLang === 'fr') {
          // French voices - prioritize African French
          filteredVoices = availableVoices
            .filter(voice => {
              const lang = voice.lang.toLowerCase();
              return lang.includes('fr-') || lang.startsWith('fr');
            })
            .map(voice => ({
              name: voice.name,
              lang: voice.lang,
              gender: voice.name.toLowerCase().includes('male') ? 'male' as const : 'female' as const,
              voiceURI: voice.voiceURI
            }));
        } else if (currentLang === 'pdc' || currentLang === 'en') {
          // English/Pidgin voices - prioritize African English
          filteredVoices = availableVoices
            .filter(voice => {
              const name = voice.name.toLowerCase();
              const lang = voice.lang.toLowerCase();
              
              return lang.includes('en-za') || // South African English
                     lang.includes('en-ng') || // Nigerian English
                     lang.includes('en-ke') || // Kenyan English
                     lang.includes('en-cm') || // Cameroon English
                     lang.startsWith('en-') ||
                     name.includes('zira') ||
                     name.includes('david') ||
                     name.includes('mark') ||
                     name.includes('hazel');
            })
            .map(voice => ({
              name: voice.name,
              lang: voice.lang,
              gender: (voice.name.toLowerCase().includes('male') || 
                     voice.name.toLowerCase().includes('david') || 
                     voice.name.toLowerCase().includes('mark')) ? 'male' as const : 'female' as const,
              voiceURI: voice.voiceURI
            }));
        }

        // Fallback to any available voices if no language-specific voices found
        if (filteredVoices.length === 0) {
          filteredVoices = availableVoices
            .slice(0, 10)
            .map(voice => ({
              name: voice.name,
              lang: voice.lang,
              gender: voice.name.toLowerCase().includes('male') ? 'male' as const : 'female' as const,
              voiceURI: voice.voiceURI
            }));
        }

        setVoices(filteredVoices);

        // Set default voice
        const defaultVoice = filteredVoices.find(v => v.gender === 'female') || 
                           filteredVoices[0];
        if (defaultVoice) {
          setSelectedVoice(defaultVoice.voiceURI);
        }
      }
    };

    loadVoices();
    
    // Voices might not be loaded immediately
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [i18n.language]);

  const testVoice = () => {
    if (!speechEnabled || !selectedVoice) {
      const messages: { [key: string]: { title: string; description: string } } = {
        'en': { title: "Speech Disabled", description: "Please enable speech to test voices" },
        'fr': { title: "Parole Désactivée", description: "Veuillez activer la parole pour tester les voix" },
        'pdc': { title: "Speech Disabled", description: "Enable speech first to test voices" }
      };
      const msg = messages[i18n.language] || messages['en'];
      toast({
        title: msg.title,
        description: msg.description,
        variant: "destructive"
      });
      return;
    }

    setIsTestingSpeech(true);
    
    const testTexts: { [key: string]: string } = {
      'en': "Hello! I am your voice assistant. I can help you navigate the app and read content aloud.",
      'fr': "Bonjour! Je suis votre assistant vocal. Je peux vous aider à naviguer dans l'application et lire le contenu à haute voix.",
      'pdc': "Hello! I be your voice assistant. I fit help you move for the app and read content loud."
    };
    const testText = testTexts[i18n.language] || testTexts['en'];
    const utterance = new SpeechSynthesisUtterance(testText);
    
    // Find the selected voice
    const voice = window.speechSynthesis.getVoices().find(v => v.voiceURI === selectedVoice);
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.rate = rate[0];
    utterance.pitch = pitch[0];
    utterance.volume = volume[0];
    
    utterance.onend = () => setIsTestingSpeech(false);
    utterance.onerror = () => {
      setIsTestingSpeech(false);
      const messages: { [key: string]: { title: string; description: string } } = {
        'en': { title: "Speech Error", description: "Failed to test voice. Please try a different voice." },
        'fr': { title: "Erreur de Parole", description: "Échec du test vocal. Essayez une autre voix." },
        'pdc': { title: "Speech Error", description: "Voice test no work. Try another voice." }
      };
      const msg = messages[i18n.language] || messages['en'];
      toast({
        title: msg.title,
        description: msg.description,
        variant: "destructive"
      });
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsTestingSpeech(false);
  };

  const getVoiceDisplayName = (voice: Voice) => {
    return `${voice.name} (${voice.gender === 'male' ? 'Male' : 'Female'})`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Voice Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Speech Enable/Disable */}
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">Text-to-Speech</Label>
          <Button
            variant={speechEnabled ? "default" : "outline"}
            onClick={onSpeechToggle}
            className="flex items-center gap-2"
          >
            {speechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            {speechEnabled ? "Enabled" : "Disabled"}
          </Button>
        </div>

        {speechEnabled && (
          <>
            {/* Voice Selection */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Choose Voice</Label>
              <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
                <SelectContent>
                  {voices.map((voice) => (
                    <SelectItem key={voice.voiceURI} value={voice.voiceURI}>
                      <div className="flex items-center gap-2">
                        {voice.gender === 'male' ? 
                          <User className="h-4 w-4 text-blue-500" /> : 
                          <UserCheck className="h-4 w-4 text-pink-500" />
                        }
                        <span>{getVoiceDisplayName(voice)}</span>
                        <Badge variant="outline" className="text-xs">
                          {voice.lang}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {voices.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Loading voices...
                </p>
              )}
            </div>

            {/* Voice Controls */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Speech Rate: {rate[0]}</Label>
                <Slider
                  value={rate}
                  onValueChange={setRate}
                  min={0.5}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Pitch: {pitch[0]}</Label>
                <Slider
                  value={pitch}
                  onValueChange={setPitch}
                  min={0.5}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Volume: {Math.round(volume[0] * 100)}%</Label>
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  min={0.1}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>

            {/* Test Voice */}
            <div className="flex gap-2">
              <Button
                onClick={testVoice}
                disabled={isTestingSpeech || !selectedVoice}
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                Test Voice
              </Button>
              
              {isTestingSpeech && (
                <Button
                  onClick={stopSpeech}
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <Pause className="h-4 w-4" />
                  Stop
                </Button>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default VoiceSettings;