import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  MessageSquare,
  Target,
  Apple,
  Activity
} from "lucide-react";

interface VoiceCommandsProps {
  onNavigate?: (section: string) => void;
  speechEnabled?: boolean;
  onSpeechToggle?: () => void;
}

const VoiceCommands = ({ onNavigate, speechEnabled = false, onSpeechToggle }: VoiceCommandsProps) => {
  const { t, i18n } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<any>(null);
  const { toast } = useToast();

  // Map i18n language to speech recognition language codes
  const getRecognitionLanguage = () => {
    const langMap: { [key: string]: string } = {
      'en': 'en-US',
      'fr': 'fr-FR',
      'pdc': 'en-NG' // Use Nigerian English for Pidgin
    };
    return langMap[i18n.language] || 'en-US';
  };

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionConstructor = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognitionConstructor();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = getRecognitionLanguage();

      recognitionInstance.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);
        
        if (event.results[current].isFinal) {
          processVoiceCommand(transcript.toLowerCase());
        }
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: t('voice.commandNotRecognized'),
          description: t('voice.speechNotSupported'),
          variant: "destructive"
        });
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  // Update recognition language when i18n language changes
  useEffect(() => {
    if (recognition) {
      recognition.lang = getRecognitionLanguage();
    }
  }, [i18n.language, recognition]);

  const processVoiceCommand = (command: string) => {
    // Multi-language command maps
    const commandMaps: { [lang: string]: { [key: string]: { action: string; section?: string } } } = {
      en: {
        'go to dashboard': { action: 'navigate', section: 'dashboard' },
        'open dashboard': { action: 'navigate', section: 'dashboard' },
        'go to diet': { action: 'navigate', section: 'diet' },
        'open diet monitoring': { action: 'navigate', section: 'diet' },
        'go to goals': { action: 'navigate', section: 'goals' },
        'open health goals': { action: 'navigate', section: 'goals' },
        'go to consultation': { action: 'navigate', section: 'consultation' },
        'open ai consultation': { action: 'navigate', section: 'consultation' },
        'go to messages': { action: 'navigate', section: 'messages' },
        'open messages': { action: 'navigate', section: 'messages' },
        'go to smartwatch': { action: 'navigate', section: 'smartwatch' },
        'open smartwatch': { action: 'navigate', section: 'smartwatch' },
        'go to emergency': { action: 'navigate', section: 'emergency' },
        'emergency mode': { action: 'navigate', section: 'emergency' },
        'go to analytics': { action: 'navigate', section: 'analytics' },
        'show trends': { action: 'navigate', section: 'analytics' },
        'go to settings': { action: 'navigate', section: 'settings' },
        'open settings': { action: 'navigate', section: 'settings' },
        'add meal': { action: 'feature', section: 'add_meal' },
        'log food': { action: 'feature', section: 'add_meal' },
        'set goal': { action: 'feature', section: 'add_goal' },
        'create goal': { action: 'feature', section: 'add_goal' },
        'help': { action: 'help' },
        'what can i say': { action: 'help' }
      },
      fr: {
        'aller au tableau de bord': { action: 'navigate', section: 'dashboard' },
        'ouvrir tableau de bord': { action: 'navigate', section: 'dashboard' },
        'aller à alimentation': { action: 'navigate', section: 'diet' },
        'ouvrir alimentation': { action: 'navigate', section: 'diet' },
        'aller aux objectifs': { action: 'navigate', section: 'goals' },
        'ouvrir objectifs': { action: 'navigate', section: 'goals' },
        'aller à consultation': { action: 'navigate', section: 'consultation' },
        'ouvrir consultation': { action: 'navigate', section: 'consultation' },
        'aller aux messages': { action: 'navigate', section: 'messages' },
        'ouvrir messages': { action: 'navigate', section: 'messages' },
        'aller à montre': { action: 'navigate', section: 'smartwatch' },
        'ouvrir montre': { action: 'navigate', section: 'smartwatch' },
        'mode urgence': { action: 'navigate', section: 'emergency' },
        'aller à urgence': { action: 'navigate', section: 'emergency' },
        'voir tendances': { action: 'navigate', section: 'analytics' },
        'aller aux paramètres': { action: 'navigate', section: 'settings' },
        'ouvrir paramètres': { action: 'navigate', section: 'settings' },
        'ajouter repas': { action: 'feature', section: 'add_meal' },
        'créer objectif': { action: 'feature', section: 'add_goal' },
        'aide': { action: 'help' }
      },
      pdc: {
        'go dashboard': { action: 'navigate', section: 'dashboard' },
        'open dashboard': { action: 'navigate', section: 'dashboard' },
        'go food': { action: 'navigate', section: 'diet' },
        'open food': { action: 'navigate', section: 'diet' },
        'go goals': { action: 'navigate', section: 'goals' },
        'open goals': { action: 'navigate', section: 'goals' },
        'go messages': { action: 'navigate', section: 'messages' },
        'open messages': { action: 'navigate', section: 'messages' },
        'emergency': { action: 'navigate', section: 'emergency' },
        'wahala': { action: 'navigate', section: 'emergency' },
        'go settings': { action: 'navigate', section: 'settings' },
        'add food': { action: 'feature', section: 'add_meal' },
        'help': { action: 'help' },
        'wetin i fit talk': { action: 'help' }
      }
    };

    const currentLang = i18n.language;
    const commandMap = commandMaps[currentLang] || commandMaps['en'];

    // Find matching command
    const matchedCommand = Object.keys(commandMap).find(cmd => 
      command.includes(cmd) || cmd.includes(command)
    );

    if (matchedCommand) {
      const { action, section } = commandMap[matchedCommand];
      
      if (action === 'navigate' && section && onNavigate) {
        onNavigate(section);
        speak(`${t('voice.navigatingTo')} ${section.replace('_', ' ')}`);
        toast({
          title: t('voice.commandRecognized'),
          description: `${t('voice.navigatingTo')} ${section.replace('_', ' ')}`
        });
      } else if (action === 'feature') {
        speak(`Feature ${section?.replace('_', ' ')} activated`);
        toast({
          title: t('voice.commandRecognized'),
          description: `${section?.replace('_', ' ')} feature activated`
        });
      } else if (action === 'help') {
        showVoiceHelp();
      }
    } else {
      speak(t('voice.commandNotRecognized'));
      toast({
        title: t('voice.commandNotRecognized'),
        description: t('voice.availableCommands')
      });
    }
  };

  const speak = (text: string) => {
    if (speechEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      
      // Set language based on current i18n language
      const langMap: { [key: string]: string } = {
        'en': 'en-US',
        'fr': 'fr-FR',
        'pdc': 'en-NG'
      };
      utterance.lang = langMap[i18n.language] || 'en-US';
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognition && !isListening) {
      // Update language before starting
      recognition.lang = getRecognitionLanguage();
      setTranscript("");
      setIsListening(true);
      recognition.start();
      toast({
        title: t('voice.listening'),
        description: t('voice.availableCommands')
      });
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const showVoiceHelp = () => {
    const helpTexts: { [key: string]: string } = {
      en: "Available commands: Go to dashboard, Go to diet, Add meal, Set goal, Emergency mode, Show trends, Go to settings, and more.",
      fr: "Commandes disponibles: Aller au tableau de bord, Aller à alimentation, Ajouter repas, Mode urgence, Voir tendances, Aller aux paramètres, et plus.",
      pdc: "Commands wey dey: Go dashboard, Go food, Add food, Emergency, Go settings, and more."
    };
    const helpText = helpTexts[i18n.language] || helpTexts['en'];
    speak(helpText);
    toast({
      title: t('voice.availableCommands'),
      description: helpText
    });
  };

  const voiceCommands = [
    { category: "Navigation", commands: ["Go to dashboard", "Go to diet", "Go to goals", "Go to messages"] },
    { category: "Features", commands: ["Add meal", "Set goal", "Emergency mode", "Show trends"] },
    { category: "Help", commands: ["Help", "What can I say"] }
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            {t('voice.voiceCommands')}
          </CardTitle>
          <CardDescription>
            {t('appSettings.voiceCommands.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant={isListening ? "destructive" : "default"}
                size="lg"
                onClick={isListening ? stopListening : startListening}
                disabled={!recognition}
              >
                {isListening ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
                {isListening ? t('voice.stopListening') : t('voice.startListening')}
              </Button>
              
              <Button
                variant="outline"
                onClick={onSpeechToggle}
              >
                {speechEnabled ? <Volume2 className="h-4 w-4 mr-2" /> : <VolumeX className="h-4 w-4 mr-2" />}
                {speechEnabled ? t('voice.speaking') : t('voice.readAloud')}
              </Button>
            </div>
            
            <Badge variant={isListening ? "destructive" : "secondary"}>
              {isListening ? t('voice.listening') : t('common.loading').replace('...', '')}
            </Badge>
          </div>

          {transcript && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">Transcript:</p>
              <p className="text-sm">{transcript}</p>
            </div>
          )}

          {!recognition && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                {t('voice.speechNotSupported')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('voice.availableCommands')}</CardTitle>
          <CardDescription>{t('appSettings.voiceCommands.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {voiceCommands.map((category, index) => (
              <div key={index}>
                <h4 className="font-medium mb-2">{category.category}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {category.commands.map((command, cmdIndex) => (
                    <Badge key={cmdIndex} variant="outline" className="justify-start">
                      "{command}"
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceCommands;
