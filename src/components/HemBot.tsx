
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useHemBot } from "./messages/hooks/useHemBot";
import { useMessages } from "./messages/hooks/useMessages";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Bot, Send, Loader2, Heart, Activity } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const HemBot = () => {
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const { isResponding, HEMBOT_ID } = useHemBot(user?.id);
  const { messages, fetchMessages, sendMessage } = useMessages(user?.id, 'hembot');

  // Filter messages to show only HemBot conversation
  const hemBotMessages = messages.filter(
    m => (m.sender_id === HEMBOT_ID && m.recipient_id === user?.id) ||
         (m.sender_id === user?.id && m.recipient_id === HEMBOT_ID)
  ).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user, fetchMessages]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [hemBotMessages, isResponding]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isResponding) return;

    const messageToSend = message.trim();
    setMessage("");
    
    try {
      await sendMessage(HEMBOT_ID, messageToSend);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      setMessage(messageToSend); // Restore message on error
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="gradient-hemapp rounded-lg p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">HemBot</h2>
            <p className="text-white/90">Your AI Health Assistant</p>
          </div>
        </div>
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <Heart className="w-4 h-4" />
            <span>Health Advice</span>
          </div>
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>Nutrition Tips</span>
          </div>
          <div className="flex items-center space-x-2">
            <Bot className="w-4 h-4" />
            <span>24/7 Available</span>
          </div>
        </div>
      </div>

      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-blue-600" />
            </div>
            <span>Chat with HemBot</span>
            {isResponding && (
              <div className="flex items-center space-x-1 text-sm text-blue-600">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Typing...</span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col space-y-4">
          <ScrollArea className="flex-1 border rounded-lg p-4" ref={scrollAreaRef}>
            {hemBotMessages.length === 0 ? (
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-xs">
                    <p className="text-sm text-blue-800">
                      Hello! I'm HemBot, your AI health assistant. I'm here to help you with:
                    </p>
                    <ul className="text-xs text-blue-700 mt-2 space-y-1">
                      <li>• Health and nutrition advice</li>
                      <li>• Exercise recommendations</li>
                      <li>• Symptom guidance</li>
                      <li>• General wellness tips</li>
                    </ul>
                    <p className="text-xs text-blue-700 mt-2">
                      How can I help you today?
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {hemBotMessages.map((msg) => {
                  const isUserMessage = msg.sender_id === user?.id;
                  
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-start space-x-2 ${
                        isUserMessage ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!isUserMessage && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                            <Bot className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isUserMessage
                            ? "bg-primary text-primary-foreground"
                            : "bg-blue-50 border border-blue-200 text-blue-800"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        <p className={`text-xs mt-1 ${
                          isUserMessage 
                            ? 'text-primary-foreground/70' 
                            : 'text-blue-600/70'
                        }`}>
                          {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                        </p>
                      </div>
                      {isUserMessage && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {user?.user_metadata?.first_name?.[0] || user?.email?.[0] || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  );
                })}
                {isResponding && (
                  <div className="flex items-start space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                        <span className="text-sm text-blue-600">HemBot is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your health, nutrition, symptoms, or wellness..."
              disabled={isResponding}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={isResponding || !message.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isResponding ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800">
              <strong>Disclaimer:</strong> HemBot provides general health information only and should not replace professional medical advice. Always consult healthcare providers for medical concerns.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HemBot;
