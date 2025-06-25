
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface MenuItem {
  id: 'dashboard' | 'consultation' | 'diet' | 'goals' | 'facilities' | 'messages' | 'account' | 'settings';
  label: string;
  icon: React.FC<any>;
}

export const useMainAppState = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<MenuItem['id']>('dashboard');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [brailleMode, setBrailleMode] = useState(false);

  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    // Check for braille preference in localStorage
    const savedBrailleMode = localStorage.getItem('brailleMode') === 'true';
    setBrailleMode(savedBrailleMode);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleOnlineToggle = () => {
    const newOnlineStatus = !isOnline;
    setIsOnline(newOnlineStatus);
    toast({
      title: newOnlineStatus ? "Going online" : "Going offline",
      description: newOnlineStatus ? "Reconnecting to online services" : "App will work in offline mode",
    });
  };

  const handleBrailleToggle = () => {
    const newBrailleMode = !brailleMode;
    setBrailleMode(newBrailleMode);
    localStorage.setItem('brailleMode', newBrailleMode.toString());
    toast({
      title: newBrailleMode ? "Braille mode enabled" : "Braille mode disabled",
      description: newBrailleMode ? "Screen reader optimizations active" : "Standard display mode active",
    });
  };

  const handleSpeechToggle = () => {
    setSpeechEnabled(!speechEnabled);
  };

  return {
    user,
    activeSection,
    setActiveSection,
    isOnline,
    speechEnabled,
    brailleMode,
    handleSignOut,
    handleOnlineToggle,
    handleBrailleToggle,
    handleSpeechToggle,
  };
};
