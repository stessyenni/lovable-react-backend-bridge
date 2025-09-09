import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mic, MicOff, Volume2, VolumeX, Play, Pause } from "lucide-react";

interface SpeechInterfaceProps {
  onTextRecognized?: (text: string) => void;
  enableTextToSpeech?: boolean;
  autoReadText?: boolean;
}

const SpeechInterface = ({ 
  onTextRecognized, 
  enableTextToSpeech = true, 
  autoReadText = false 
}: SpeechInterfaceProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<any>(null);
  const { toast } = useToast();
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionConstructor = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognitionConstructor();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

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
      };

      recognitionInstance.onstart = () => {
        setIsListening(true);
        toast({
          title: "Listening Started",
          description: "Speak now, your voice is being recorded...",
        });
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: `Error: ${event.error}. Please check your microphone permissions.`,
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

    // Cancel any ongoing speech
    speechSynthesisRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      toast({
        title: "Speech Error",
        description: "Failed to read text aloud",
        variant: "destructive"
      });
    };

    speechSynthesisRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const readPageContent = () => {
    const content = document.body.innerText;
    const cleanContent = content
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 500); // Limit to first 500 characters
    
    speakText(`Reading page content: ${cleanContent}`);
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
            onClick={isSpeaking ? stopSpeaking : readPageContent}
            className="flex items-center gap-1"
          >
            {isSpeaking ? <Pause className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            <span className="hidden sm:inline">
              {isSpeaking ? "Stop" : "Read"}
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