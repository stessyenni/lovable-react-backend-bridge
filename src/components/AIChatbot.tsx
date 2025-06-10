
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Send, Bot, User } from "lucide-react";

const AIChatbot = () => {
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["chat-messages", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (userMessage: string) => {
      // First, save the user message
      const { error: saveError } = await supabase
        .from("chat_messages")
        .insert({
          user_id: user?.id,
          message: userMessage,
          is_user_message: true,
        });

      if (saveError) throw saveError;

      // For now, simulate an AI response
      const aiResponse = `Thank you for your message: "${userMessage}". I'm here to help you with your health journey! You can ask me about nutrition, exercise, symptoms, or general health advice.`;

      // Save the AI response
      const { error: responseError } = await supabase
        .from("chat_messages")
        .insert({
          user_id: user?.id,
          message: aiResponse,
          is_user_message: false,
        });

      if (responseError) throw responseError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-messages"] });
      setMessage("");
      toast({
        title: "Message sent",
        description: "Your message has been sent to the AI assistant.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendMessageMutation.mutate(message);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">AI Health Assistant</h2>
        <p className="text-muted-foreground">
          Chat with our AI assistant for health advice, recipe suggestions, and more
        </p>
      </div>

      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Health Chat</span>
          </CardTitle>
          <CardDescription>
            Ask questions about nutrition, exercise, symptoms, or general health advice
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col space-y-4">
          <ScrollArea className="flex-1 border rounded-lg p-4">
            {isLoading ? (
              <div className="text-center text-muted-foreground">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="text-center text-muted-foreground">
                Start a conversation by sending a message below!
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start space-x-2 ${
                      msg.is_user_message ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!msg.is_user_message && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-blue-600" />
                        </div>
                      </div>
                    )}
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.is_user_message
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                    </div>
                    {msg.is_user_message && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about your health, nutrition, or symptoms..."
              disabled={sendMessageMutation.isPending}
            />
            <Button
              type="submit"
              disabled={sendMessageMutation.isPending || !message.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIChatbot;
