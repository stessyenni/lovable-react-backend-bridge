import { useState, useEffect } from "react";
import { Bot, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HemBot from "@/components/HemBot";
import hemappLogo from "@/assets/Hemapp-Logo.png";

const FloatingHemBot = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Auto-close when clicking on menu items
  useEffect(() => {
    const handleMenuClick = (event: MouseEvent) => {
      const target = event.target as Element;
      // Check if clicked element is a menu item or sidebar item
      if (target.closest('[data-sidebar]') || 
          target.closest('nav') || 
          target.closest('.sidebar') ||
          target.closest('[role="menuitem"]') ||
          target.closest('button[data-nav]')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleMenuClick);
      return () => document.removeEventListener('click', handleMenuClick);
    }
  }, [isOpen]);

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-green-700 hover:bg-green-800 shadow-lg z-50 animate-pulse"
          size="icon"
        >
          <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-white animate-bounce" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-96 sm:h-[500px] sm:max-w-md z-50 sm:shadow-2xl">
          <Card className="h-full flex flex-col sm:rounded-lg rounded-none">
            <CardHeader className="pb-3 bg-gradient-to-r from-red-500 via-pink-500 to-red-600 text-white sm:rounded-t-lg shadow-lg">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <img src={hemappLogo} alt="Hemapp logo" className="h-6 w-auto" />
                  HemBot
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-4 overflow-hidden">
              <div className="h-full overflow-hidden">
                <HemBot />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default FloatingHemBot;
