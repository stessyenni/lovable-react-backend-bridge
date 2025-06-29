
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export const useOfflineMode = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      toast({
        title: "Back Online",
        description: "Connection restored. Syncing data...",
      });
    };

    const handleOffline = () => {
      setIsOffline(true);
      toast({
        title: "Offline Mode",
        description: "App is now working in offline mode.",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  const saveOfflineData = (key: string, data: any) => {
    try {
      localStorage.setItem(`offline_${key}`, JSON.stringify({
        data,
        timestamp: Date.now(),
        synced: false
      }));
    } catch (error) {
      console.error('Error saving offline data:', error);
    }
  };

  const getOfflineData = (key: string) => {
    try {
      const stored = localStorage.getItem(`offline_${key}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error retrieving offline data:', error);
      return null;
    }
  };

  const syncOfflineData = async () => {
    if (isOffline) return;

    // Get all offline data and sync with server
    const keys = Object.keys(localStorage).filter(key => key.startsWith('offline_'));
    
    for (const key of keys) {
      const offlineData = getOfflineData(key.replace('offline_', ''));
      if (offlineData && !offlineData.synced) {
        // Sync logic would go here
        console.log('Syncing offline data:', key, offlineData);
        
        // Mark as synced
        localStorage.setItem(key, JSON.stringify({
          ...offlineData,
          synced: true
        }));
      }
    }
  };

  return {
    isOffline,
    saveOfflineData,
    getOfflineData,
    syncOfflineData
  };
};
