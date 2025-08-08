import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useHemBot = (userId: string | undefined) => {
  const [isResponding, setIsResponding] = useState(false);
  const { toast } = useToast();

  const HEMBOT_ID = '99999999-9999-9999-9999-999999999999';

  const sendToHemBot = useCallback(async (userMessage: string) => {
    if (!userId || !userMessage.trim()) return;

    setIsResponding(true);
    try {
      // Call the hembot edge function
      const { data, error } = await supabase.functions.invoke('hembot-ai', {
        body: {
          message: userMessage,
          userId: userId
        }
      });

      if (error) {
        console.error('Error calling HemBot:', error);
        toast({
          title: "HemBot Error",
          description: "Failed to get response from HemBot. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // HemBot response is handled by the edge function
      // which automatically saves the response message to the database
      
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred with HemBot.",
        variant: "destructive",
      });
    } finally {
      setIsResponding(false);
    }
  }, [userId, toast]);

  const checkIfHemBotMessage = useCallback((recipientId: string) => {
    return recipientId === HEMBOT_ID;
  }, []);

  return { 
    sendToHemBot, 
    isResponding, 
    checkIfHemBotMessage,
    HEMBOT_ID 
  };
};