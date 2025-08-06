
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useOfflineMode } from "./useOfflineMode";

interface MenuItem {
  id: 'dashboard' | 'consultation' | 'diet' | 'goals' | 'facilities' | 'messages' | 'account' | 'faq' | 'settings' | 'smartwatch' | 'emergency' | 'analytics';
  label: string;
  icon: React.FC<any>;
}

export const useMainAppState = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isOffline, toggleOfflineMode, syncOfflineData } = useOfflineMode();
  const [activeSection, setActiveSection] = useState<MenuItem['id']>('dashboard');
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [brailleMode, setBrailleMode] = useState(false);

  useEffect(() => {
    const savedBrailleMode = localStorage.getItem('brailleMode') === 'true';
    setBrailleMode(savedBrailleMode);

    if (!isOffline) {
      syncOfflineData();
    }
  }, [isOffline, syncOfflineData]);

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
    toggleOfflineMode();
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
    isOnline: !isOffline,
    speechEnabled,
    brailleMode,
    handleSignOut,
    handleOnlineToggle,
    handleBrailleToggle,
    handleSpeechToggle,
  };
};
