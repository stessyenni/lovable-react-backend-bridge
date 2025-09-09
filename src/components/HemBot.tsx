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
    <div className="space-y-4">
      {/* WhatsApp Meta AI Style Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-4 text-white shadow-lg">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center ring-2 ring-white/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">HemBot AI</h2>
            <div className="flex items-center space-x-1 text-green-100">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
              <p className="text-sm">Online • AI Health Assistant</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-xs text-green-100">
          <div className="flex items-center space-x-1">
            <Heart className="w-3 h-3" />
            <span>Health Advice</span>
          </div>
          <div className="flex items-center space-x-1">
            <Activity className="w-3 h-3" />
            <span>Nutrition Tips</span>
          </div>
          <div className="flex items-center space-x-1">
            <Bot className="w-3 h-3" />
            <span>24/7 Available</span>
          </div>
        </div>
      </div>

      {/* WhatsApp Style Chat Interface */}
      <Card className="h-[500px] flex flex-col border-0 shadow-xl rounded-2xl overflow-hidden">
        {/* Chat Header */}
        <div className="bg-green-50 border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-green-800">HemBot AI</h3>
              {isResponding ? (
                <div className="flex items-center space-x-1 text-xs text-green-600">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>typing...</span>
                </div>
              ) : (
                <p className="text-xs text-green-600">Online</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Chat Messages Area */}
        <div className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 bg-green-50/30 p-4" ref={scrollAreaRef}>
            {hemBotMessages.length === 0 ? (
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-green-100 text-green-600 text-xs">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-white rounded-2xl rounded-tl-sm p-3 max-w-xs shadow-sm border border-green-100">
                    <p className="text-sm text-gray-800">
                      👋 Hello! I'm HemBot, your AI health assistant.
                    </p>
                    <div className="mt-2 space-y-1 text-xs text-gray-600">
                      <p>🩺 Health & nutrition advice</p>
                      <p>💪 Exercise recommendations</p>
                      <p>🔍 Symptom guidance</p>
                      <p>🌟 General wellness tips</p>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 font-medium">
                      How can I help you today?
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
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
                      className={`flex items-end space-x-2 mb-4 ${
                        isUserMessage ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!isUserMessage && (
                        <Avatar className="w-8 h-8 mb-1">
                          <AvatarFallback className="bg-green-100 text-green-600 text-xs">
                            <Bot className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-xs lg:max-w-md px-3 py-2 ${
                          isUserMessage
                            ? "bg-green-500 text-white rounded-2xl rounded-br-sm"
                            : "bg-white text-gray-800 rounded-2xl rounded-bl-sm shadow-sm border border-green-100"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        <p className={`text-xs mt-1 ${
                          isUserMessage 
                            ? 'text-green-100' 
                            : 'text-gray-400'
                        }`}>
                          {new Date(msg.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </p>
                      </div>
                      {isUserMessage && (
                        <Avatar className="w-8 h-8 mb-1">
                          <AvatarFallback className="bg-green-100 text-green-600 text-xs">
                            {user?.user_metadata?.first_name?.[0] || user?.email?.[0] || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  );
                })}
                {isResponding && (
                  <div className="flex items-end space-x-2 mb-4">
                    <Avatar className="w-8 h-8 mb-1">
                      <AvatarFallback className="bg-green-100 text-green-600 text-xs">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-white rounded-2xl rounded-bl-sm p-3 shadow-sm border border-green-100">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* WhatsApp Style Input */}
          <div className="bg-white border-t px-4 py-3">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                disabled={isResponding}
                className="flex-1 rounded-full border-green-200 focus:border-green-400 focus:ring-green-400"
              />
              <Button
                type="submit"
                disabled={isResponding || !message.trim()}
                size="icon"
                className="rounded-full bg-green-500 hover:bg-green-600 w-10 h-10 shrink-0"
              >
                {isResponding ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
            
            {/* Disclaimer */}
            <div className="mt-2">
              <p className="text-xs text-gray-500 text-center">
                HemBot provides general health info. Consult healthcare providers for medical concerns.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HemBot;