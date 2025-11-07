import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mic, MicOff, Volume2, VolumeX, Play, Pause } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SpeechInterfaceProps {
  onTextRecognized?: (text: string) => void;
  onNavigate?: (page: string) => void;
  enableTextToSpeech?: boolean;
  autoReadText?: boolean;
}

const SpeechInterface = ({ 
  onTextRecognized, 
  onNavigate,
  enableTextToSpeech = true, 
  autoReadText = false 
}: SpeechInterfaceProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<any>(null);
  const { toast } = useToast();
  const { i18n } = useTranslation();
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);

  // Map i18n language codes to speech recognition codes
  const getSpeechLangCode = (langCode: string) => {
    const langMap: { [key: string]: string } = {
      'en': 'en-US',
      'fr': 'fr-FR',
      'pdc': 'en-CM', // Pidgin - fallback to Cameroon English
    };
    return langMap[langCode] || 'en-US';
  };

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionConstructor = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognitionConstructor();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = getSpeechLangCode(i18n.language);

      recognitionInstance.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript + interimTranscript);

        if (finalTranscript && onTextRecognized) {
          onTextRecognized(finalTranscript);
        }
        
        // Process voice commands for navigation
        if (finalTranscript) {
          processVoiceCommand(finalTranscript);
        }
      };

      recognitionInstance.onstart = () => {
        setIsListening(true);
        const messages: { [key: string]: { title: string; description: string } } = {
          'en': { title: "Listening Started", description: "Speak now, your voice is being recorded..." },
          'fr': { title: "Écoute Démarrée", description: "Parlez maintenant, votre voix est enregistrée..." },
          'pdc': { title: "I Don Start Listening", description: "Talk now, I dey record your voice..." }
        };
        const msg = messages[i18n.language] || messages['en'];
        toast({
          title: msg.title,
          description: msg.description,
        });
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        const messages: { [key: string]: { title: string; description: string } } = {
          'en': { title: "Voice Recognition Error", description: `Error: ${event.error}. Please check your microphone permissions.` },
          'fr': { title: "Erreur de Reconnaissance Vocale", description: `Erreur: ${event.error}. Vérifiez les autorisations du microphone.` },
          'pdc': { title: "Voice Recognition Error", description: `Error: ${event.error}. Check your microphone permission.` }
        };
        const msg = messages[i18n.language] || messages['en'];
        toast({
          title: msg.title,
          description: msg.description,
          variant: "destructive"
        });
      };

      setRecognition(recognitionInstance);
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      speechSynthesisRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, []);

  // Auto-read text from page if enabled
  useEffect(() => {
    if (autoReadText && enableTextToSpeech) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.TEXT_NODE && node.textContent) {
                const text = node.textContent.trim();
                if (text.length > 10) { // Only read substantial text
                  speakText(text);
                }
              }
            });
          }
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      return () => observer.disconnect();
    }
  }, [autoReadText, enableTextToSpeech]);

  const startListening = () => {
    if (recognition && !isListening) {
      setTranscript("");
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  const speakText = (text: string) => {
    if (!enableTextToSpeech || !speechSynthesisRef.current) return;

    try {
      // Cancel any ongoing speech
      speechSynthesisRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;

      // Use a stored voice setting or select based on current language
      const voices = speechSynthesisRef.current.getVoices();
      const preferredVoice = localStorage.getItem('preferred-voice');
      if (preferredVoice && voices.length > 0) {
        const voice = voices.find(v => v.voiceURI === preferredVoice);
        if (voice) {
          utterance.voice = voice;
        }
      } else {
        // Auto-select voice based on current language
        const langCode = i18n.language;
        const matchingVoice = voices.find(v => v.lang.startsWith(langCode)) || 
                             voices.find(v => v.lang.startsWith('en'));
        if (matchingVoice) {
          utterance.voice = matchingVoice;
        }
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
        const messages: { [key: string]: { title: string; description: string } } = {
          'en': { title: "Speech Error", description: "Failed to read text aloud. Please check your browser's speech settings." },
          'fr': { title: "Erreur de Parole", description: "Échec de la lecture du texte. Vérifiez les paramètres de parole du navigateur." },
          'pdc': { title: "Speech Error", description: "I no fit read the text. Check your browser speech settings." }
        };
        const msg = messages[i18n.language] || messages['en'];
        toast({
          title: msg.title,
          description: msg.description,
          variant: "destructive"
        });
      };

      speechSynthesisRef.current.speak(utterance);
    } catch (error) {
      console.error('Speech synthesis error:', error);
      setIsSpeaking(false);
      toast({
        title: "Speech Error",
        description: "Speech synthesis is not available in your browser.",
        variant: "destructive"
      });
    }
  };

  const stopSpeaking = () => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const readPageContent = () => {
    try {
      // Get main content text from the page
      const mainContent = document.querySelector('main') || document.body;
      let textContent = '';
      
      // Extract text from headings and paragraphs
      const headings = mainContent.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const paragraphs = mainContent.querySelectorAll('p');
      const buttons = mainContent.querySelectorAll('button');
      
      // Read headings first
      headings.forEach(heading => {
        if (heading.textContent?.trim()) {
          textContent += heading.textContent.trim() + '. ';
        }
      });
      
      // Then read paragraph content
      paragraphs.forEach(paragraph => {
        if (paragraph.textContent?.trim() && paragraph.textContent.length > 10) {
          textContent += paragraph.textContent.trim() + '. ';
        }
      });
      
      // If no significant content, try to read button labels
      if (textContent.length < 20) {
        buttons.forEach(button => {
          if (button.textContent?.trim() && button.textContent.length > 2) {
            textContent += button.textContent.trim() + '. ';
          }
        });
      }
      
      // Fallback message if no content found
      if (!textContent.trim()) {
        textContent = "This page contains visual content that cannot be read aloud. Please navigate to other sections for audio content.";
      }
      
      speakText(textContent);
    } catch (error) {
      console.error('Error reading page content:', error);
      speakText("Sorry, I cannot read this page content right now.");
    }
  };

  const processVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    // Navigation commands
    if (lowerCommand.includes('dashboard') || lowerCommand.includes('home')) {
      onNavigate?.('dashboard');
      speakText("Opening dashboard");
    } else if (lowerCommand.includes('diet') || lowerCommand.includes('food')) {
      onNavigate?.('diet');
      speakText("Opening diet monitoring");
    } else if (lowerCommand.includes('health') || lowerCommand.includes('monitoring')) {
      onNavigate?.('health');
      speakText("Opening health monitoring");
    } else if (lowerCommand.includes('goals')) {
      onNavigate?.('goals');
      speakText("Opening health goals");
    } else if (lowerCommand.includes('emergency')) {
      onNavigate?.('emergency');
      speakText("Opening emergency page");
    } else if (lowerCommand.includes('messages') || lowerCommand.includes('chat')) {
      onNavigate?.('messages');
      speakText("Opening messages");
    } else if (lowerCommand.includes('profile') || lowerCommand.includes('account')) {
      onNavigate?.('profile');
      speakText("Opening user profile");
    } else if (lowerCommand.includes('facilities') || lowerCommand.includes('hospital')) {
      onNavigate?.('facilities');
      speakText("Opening health facilities");
    } else {
      speakText("Command not recognized. Try saying 'dashboard', 'diet', 'health', 'goals', 'emergency', 'messages', 'profile', or 'facilities'");
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Speech-to-Text Controls */}
      <Button
        variant={isListening ? "destructive" : "outline"}
        size="sm"
        onClick={isListening ? stopListening : startListening}
        disabled={!recognition}
        className="flex items-center gap-1"
      >
        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        <span className="hidden sm:inline">
          {isListening ? "Stop" : "Listen"}
        </span>
      </Button>

      {/* Text-to-Speech Controls */}
      {enableTextToSpeech && (
        <>
          <Button
            variant="outline"  
            size="sm"
            onClick={isSpeaking ? stopSpeaking : () => readPageContent()}
            className="flex items-center gap-1"
          >
            {isSpeaking ? <Pause className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            <span className="hidden sm:inline">
              {isSpeaking ? "Stop" : "Read Page"}
            </span>
          </Button>
        </>
      )}

      {/* Status indicator */}
      {(isListening || isSpeaking) && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          {isListening && "Listening..."}
          {isSpeaking && "Speaking..."}
        </div>
      )}

      {/* Live transcript display */}
      {transcript && isListening && (
        <div className="max-w-xs text-xs text-muted-foreground truncate">
          "{transcript}"
        </div>
      )}
    </div>
  );
};

export default SpeechInterface;