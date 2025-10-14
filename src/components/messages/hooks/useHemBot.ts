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
      // 1) Save the user's message so it appears in the chat immediately
      const { error: insertError } = await supabase.from('messages').insert({
        sender_id: userId,
        recipient_id: HEMBOT_ID,
        content: userMessage,
        message_type: 'text'
      });

      if (insertError) {
        console.error('Error saving user message:', insertError);
        toast({
          title: 'Message not sent',
          description: 'Could not save your message. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      // 2) Call the HemBot edge function (it will save the bot reply)
      const { error } = await supabase.functions.invoke('hembot-ai', {
        body: { message: userMessage, userId }
      });

      if (error) {
        console.error('Error calling HemBot:', error);
        toast({
          title: 'HemBot Error',
          description: 'Failed to get response from HemBot. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      // Bot response will be inserted by the edge function
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred with HemBot.',
        variant: 'destructive',
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