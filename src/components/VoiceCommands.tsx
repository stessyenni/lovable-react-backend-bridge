import { useState, useEffect } from "react";
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
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionConstructor = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognitionConstructor();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
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

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: "Please try again or check your microphone permissions.",
          variant: "destructive"
        });
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const processVoiceCommand = (command: string) => {
    const commandMap: { [key: string]: { action: string; section?: string } } = {
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
    };

    // Find matching command
    const matchedCommand = Object.keys(commandMap).find(cmd => 
      command.includes(cmd) || cmd.includes(command)
    );

    if (matchedCommand) {
      const { action, section } = commandMap[matchedCommand];
      
      if (action === 'navigate' && section && onNavigate) {
        onNavigate(section);
        speak(`Opening ${section.replace('_', ' ')}`);
        toast({
          title: "Voice Command Executed",
          description: `Navigating to ${section.replace('_', ' ')}`
        });
      } else if (action === 'feature') {
        speak(`Feature ${section?.replace('_', ' ')} would be activated here`);
        toast({
          title: "Voice Command Recognized",
          description: `${section?.replace('_', ' ')} feature activated`
        });
      } else if (action === 'help') {
        showVoiceHelp();
      }
    } else {
      speak("Sorry, I didn't understand that command. Say 'help' to see available commands.");
      toast({
        title: "Command Not Recognized",
        description: "Say 'help' to see available voice commands"
      });
    }
  };

  const speak = (text: string) => {
    if (speechEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognition && !isListening) {
      setTranscript("");
      setIsListening(true);
      recognition.start();
      toast({
        title: "Listening...",
        description: "Speak your command now"
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
    const helpText = "Available commands: Go to dashboard, Go to diet, Add meal, Set goal, Emergency mode, Show trends, Go to settings, and more.";
    speak(helpText);
    toast({
      title: "Voice Commands Help",
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
            Voice Commands
          </CardTitle>
          <CardDescription>
            Control the app using your voice
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
                {isListening ? "Stop Listening" : "Start Listening"}
              </Button>
              
              <Button
                variant="outline"
                onClick={onSpeechToggle}
              >
                {speechEnabled ? <Volume2 className="h-4 w-4 mr-2" /> : <VolumeX className="h-4 w-4 mr-2" />}
                {speechEnabled ? "Speech On" : "Speech Off"}
              </Button>
            </div>
            
            <Badge variant={isListening ? "destructive" : "secondary"}>
              {isListening ? "Listening..." : "Ready"}
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
                Voice recognition is not supported in this browser. Please use Chrome, Edge, or Safari.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Voice Commands</CardTitle>
          <CardDescription>Here are some commands you can try</CardDescription>
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