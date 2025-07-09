import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface OfflineData {
  id: string;
  data_type: string;
  data_payload: any;
  created_at: string;
  sync_status: 'pending' | 'syncing' | 'synced' | 'failed';
}

interface UseOfflineSyncReturn {
  isOnline: boolean;
  pendingSync: OfflineData[];
  syncPendingData: () => Promise<void>;
  saveOfflineData: (dataType: string, payload: any) => Promise<void>;
  clearSyncedData: () => Promise<void>;
}

export const useOfflineSync = (): UseOfflineSyncReturn => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSync, setPendingSync] = useState<OfflineData[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Back Online",
        description: "Syncing pending data...",
      });
      syncPendingData();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Offline Mode",
        description: "Data will be synced when connection is restored.",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load pending sync data on mount
  useEffect(() => {
    if (user) {
      loadPendingSync();
    }
  }, [user]);

  const loadPendingSync = async () => {
    if (!user) return;

    try {
      // First try to get from local storage
      const localData = localStorage.getItem(`offline_sync_${user.id}`);
      if (localData) {
        setPendingSync(JSON.parse(localData));
      }

      // If online, also check the database
      if (isOnline) {
        const { data, error } = await supabase
          .from('offline_sync')
          .select('*')
          .eq('user_id', user.id)
          .eq('sync_status', 'pending')
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error loading pending sync:', error);
          return;
        }

        if (data && data.length > 0) {
          const typedData = data.map(item => ({
            ...item,
            sync_status: item.sync_status as 'pending' | 'syncing' | 'synced' | 'failed'
          }));
          setPendingSync(typedData);
          // Also save to local storage as backup
          localStorage.setItem(`offline_sync_${user.id}`, JSON.stringify(typedData));
        }
      }
    } catch (error) {
      console.error('Error loading pending sync data:', error);
    }
  };

  const saveOfflineData = useCallback(async (dataType: string, payload: any) => {
    if (!user) return;

    const offlineItem: OfflineData = {
      id: crypto.randomUUID(),
      data_type: dataType,
      data_payload: payload,
      created_at: new Date().toISOString(),
      sync_status: 'pending'
    };

    try {
      // Always save to local storage first
      const existingData = localStorage.getItem(`offline_sync_${user.id}`);
      const currentData = existingData ? JSON.parse(existingData) : [];
      const updatedData = [...currentData, offlineItem];
      
      localStorage.setItem(`offline_sync_${user.id}`, JSON.stringify(updatedData));
      setPendingSync(updatedData);

      // If online, also save to database
      if (isOnline) {
        const { error } = await supabase
          .from('offline_sync')
          .insert({
            id: offlineItem.id,
            user_id: user.id,
            data_type: dataType,
            data_payload: payload,
            sync_status: 'pending'
          });

        if (error) {
          console.error('Error saving to database, keeping in local storage:', error);
        }
      }

      toast({
        title: isOnline ? "Data Saved" : "Saved Offline",
        description: isOnline ? "Data has been saved successfully." : "Data saved locally and will sync when online.",
      });
    } catch (error) {
      console.error('Error saving offline data:', error);
      toast({
        title: "Error",
        description: "Failed to save data. Please try again.",
        variant: "destructive",
      });
    }
  }, [user, isOnline, toast]);

  const syncPendingData = useCallback(async () => {
    if (!user || !isOnline || pendingSync.length === 0) return;

    try {
      const itemsToSync = pendingSync.filter(item => item.sync_status === 'pending');
      
      for (const item of itemsToSync) {
        try {
          // Update status to syncing
          const updatedItem = { ...item, sync_status: 'syncing' as const };
          setPendingSync(prev => prev.map(p => p.id === item.id ? updatedItem : p));

          // Process based on data type
          await processOfflineItem(item);

          // Mark as synced
          const syncedItem = { ...item, sync_status: 'synced' as const };
          setPendingSync(prev => prev.map(p => p.id === item.id ? syncedItem : p));

          // Update in database
          await supabase
            .from('offline_sync')
            .update({ 
              sync_status: 'synced',
              synced_at: new Date().toISOString()
            })
            .eq('id', item.id);

        } catch (error) {
          console.error(`Error syncing item ${item.id}:`, error);
          
          // Mark as failed
          const failedItem = { ...item, sync_status: 'failed' as const };
          setPendingSync(prev => prev.map(p => p.id === item.id ? failedItem : p));

          await supabase
            .from('offline_sync')
            .update({ sync_status: 'failed' })
            .eq('id', item.id);
        }
      }

      // Update local storage
      const updatedData = pendingSync.filter(item => item.sync_status !== 'synced');
      localStorage.setItem(`offline_sync_${user.id}`, JSON.stringify(updatedData));
      setPendingSync(updatedData);

      const syncedCount = itemsToSync.length - updatedData.length;
      if (syncedCount > 0) {
        toast({
          title: "Sync Complete",
          description: `${syncedCount} items synced successfully.`,
        });
      }

    } catch (error) {
      console.error('Error during sync:', error);
      toast({
        title: "Sync Error",
        description: "Some items failed to sync. Will retry later.",
        variant: "destructive",
      });
    }
  }, [user, isOnline, pendingSync, toast]);

  const processOfflineItem = async (item: OfflineData) => {
    const { data_type, data_payload } = item;

    switch (data_type) {
      case 'diet_entry':
        await supabase.from('diet_entries').insert(data_payload);
        break;
      
      case 'message':
        await supabase.from('messages').insert(data_payload);
        break;
      
      case 'health_goal':
        await supabase.from('health_goals').insert(data_payload);
        break;
      
      case 'ai_consultation':
        await supabase.from('ai_consultations').insert(data_payload);
        break;
      
      case 'profile_update':
        await supabase.from('profiles').upsert(data_payload);
        break;
      
      case 'meal_category':
        await (supabase as any).from('meal_categories').insert(data_payload);
        break;
      
      case 'meal_item':
        await (supabase as any).from('meal_items').insert(data_payload);
        break;

      default:
        console.warn(`Unknown data type for sync: ${data_type}`);
    }
  };

  const clearSyncedData = useCallback(async () => {
    if (!user) return;

    try {
      // Remove synced items from local storage
      const updatedData = pendingSync.filter(item => item.sync_status !== 'synced');
      localStorage.setItem(`offline_sync_${user.id}`, JSON.stringify(updatedData));
      setPendingSync(updatedData);

      // Remove synced items from database
      if (isOnline) {
        await supabase
          .from('offline_sync')
          .delete()
          .eq('user_id', user.id)
          .eq('sync_status', 'synced');
      }
    } catch (error) {
      console.error('Error clearing synced data:', error);
    }
  }, [user, isOnline, pendingSync]);

  return {
    isOnline,
    pendingSync,
    syncPendingData,
    saveOfflineData,
    clearSyncedData
  };
};