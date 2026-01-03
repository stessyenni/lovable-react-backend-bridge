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
  // Force enable text-to-speech always for read aloud functionality
  const ttsEnabled = enableTextToSpeech || true;
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const { toast } = useToast();
  const { i18n, t } = useTranslation();
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);
  const recognitionRef = useRef<any>(null);
  const toastShownRef = useRef(false);

  // Map i18n language codes to speech recognition codes
  const getSpeechLangCode = (langCode: string) => {
    const langMap: { [key: string]: string } = {
      'en': 'en-US',
      'fr': 'fr-FR',
      'pdc': 'en-NG', // Pidgin - fallback to Nigerian English
    };
    return langMap[langCode] || 'en-US';
  };

  // Initialize speech synthesis and load voices
  useEffect(() => {
    if ('speechSynthesis' in window) {
      speechSynthesisRef.current = window.speechSynthesis;
      
      const loadVoices = () => {
        const voices = speechSynthesisRef.current?.getVoices();
        if (voices && voices.length > 0) {
          setVoicesLoaded(true);
        }
      };
      
      loadVoices();
      speechSynthesisRef.current.onvoiceschanged = loadVoices;
    }
    
    return () => {
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.onvoiceschanged = null;
        speechSynthesisRef.current.cancel();
      }
    };
  }, []);

  // Initialize speech recognition once
  useEffect(() => {
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
          const transcriptText = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptText;
          } else {
            interimTranscript += transcriptText;
          }
        }

        setTranscript(finalTranscript + interimTranscript);

        if (finalTranscript && onTextRecognized) {
          onTextRecognized(finalTranscript);
        }
        
        if (finalTranscript) {
          processVoiceCommand(finalTranscript);
        }
      };

      recognitionInstance.onstart = () => {
        setIsListening(true);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognitionInstance;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors on cleanup
        }
      }
    };
  }, []);

  // Update recognition language when i18n language changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = getSpeechLangCode(i18n.language);
    }
  }, [i18n.language]);

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
    if (recognitionRef.current && !isListening) {
      setTranscript("");
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const speakText = (text: string) => {
    if (!speechSynthesisRef.current) return;

    try {
      // Cancel any ongoing speech
      speechSynthesisRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;

      // Set language for the utterance
      utterance.lang = getSpeechLangCode(i18n.language);

      // Use a stored voice setting or select based on current language
      const voices = speechSynthesisRef.current.getVoices();
      if (voices.length > 0) {
        const preferredVoice = localStorage.getItem('preferred-voice');
        if (preferredVoice) {
          const voice = voices.find(v => v.voiceURI === preferredVoice);
          if (voice) {
            utterance.voice = voice;
          }
        } else {
          // Auto-select voice based on current language
          const langCode = getSpeechLangCode(i18n.language);
          const matchingVoice = voices.find(v => v.lang.startsWith(langCode.substring(0, 2))) || 
                               voices.find(v => v.lang.startsWith('en'));
          if (matchingVoice) {
            utterance.voice = matchingVoice;
          }
        }
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
        // Only show error toast once per session to avoid spam
        if (!toastShownRef.current) {
          toastShownRef.current = true;
          toast({
            title: t('voice.speechError', 'Speech Error'),
            description: t('voice.speechErrorDesc', 'Failed to read text aloud. Please check your browser speech settings.'),
            variant: "destructive"
          });
          // Reset after 5 seconds to allow future errors to show
          setTimeout(() => { toastShownRef.current = false; }, 5000);
        }
      };

      speechSynthesisRef.current.speak(utterance);
    } catch (error) {
      console.error('Speech synthesis error:', error);
      setIsSpeaking(false);
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
        disabled={!recognitionRef.current}
        className="flex items-center gap-1"
      >
        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        <span className="hidden sm:inline">
          {isListening ? "Stop" : "Listen"}
        </span>
      </Button>

      {/* Text-to-Speech Controls - Always visible */}
      <Button
        variant="outline"  
        size="sm"
        onClick={isSpeaking ? stopSpeaking : () => readPageContent()}
        className="flex items-center gap-1"
      >
        {isSpeaking ? <Pause className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        <span className="hidden sm:inline">
          {isSpeaking ? "Stop" : "Read Aloud"}
        </span>
      </Button>

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