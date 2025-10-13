import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, Loader2 } from "lucide-react";
import { useHemBot } from "@/components/messages/hooks/useHemBot";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const HemBotChat = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { sendToHemBot, isResponding, HEMBOT_ID } = useHemBot(user?.id);

  // Fetch messages between user and HemBot
  const { data: messages = [] } = useQuery({
    queryKey: ["hembot-messages", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${HEMBOT_ID}),and(sender_id.eq.${HEMBOT_ID},recipient_id.eq.${user.id})`)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || isResponding) return;

    const userMessage = message;
    setMessage("");
    await sendToHemBot(userMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div ref={scrollRef} className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <Bot className="h-12 w-12 text-green-700 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Welcome to HemBot!</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                I'm here to help answer your health questions. What would you like to know?
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isFromHemBot = msg.sender_id === HEMBOT_ID;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isFromHemBot ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      isFromHemBot
                        ? "bg-green-50 text-green-900 border border-green-200"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {isFromHemBot && (
                      <div className="flex items-center gap-2 mb-1">
                        <Bot className="h-4 w-4" />
                        <span className="text-xs font-semibold">HemBot</span>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(msg.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          {isResponding && (
            <div className="flex justify-start">
              <div className="bg-green-50 text-green-900 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">HemBot is typing...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t p-4 bg-background">
        <div className="flex gap-2">
          <Input
            placeholder="Ask me anything about your health..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isResponding}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!message.trim() || isResponding}
            size="icon"
            className="bg-green-700 hover:bg-green-800"
          >
            {isResponding ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HemBotChat;
