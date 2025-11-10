import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Brain, 
  Smartphone, 
  Shield, 
  Activity, 
  MessageCircle, 
  MapPin, 
  Users,
  ArrowRight,
  Check,
  VolumeX,
  Volume2
} from "lucide-react";
import hemappLogo from "@/assets/Hemapp-Logo.png";
import VoiceCommandsSidebar from "@/components/VoiceCommandsSidebar";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useState } from "react";
import { useTranslation } from 'react-i18next';

interface WelcomePageProps {
  onGetStarted: () => void;
  brailleMode?: boolean;
  speechEnabled?: boolean;
  onSpeechToggle?: () => void;
  onBrailleToggle?: () => void;
}

const WelcomePage = ({ 
  onGetStarted, 
  brailleMode = false, 
  speechEnabled = false, 
  onSpeechToggle, 
  onBrailleToggle 
}: WelcomePageProps) => {
  const [autoReadText, setAutoReadText] = useState("");
  const { t } = useTranslation();
  
  // Function to read page content
  const readWelcomePageContent = () => {
    if (!speechEnabled) return;
    
    const textContent = `
      Welcome to HemApp. Your Complete Health Management Companion.
      Welcome to the future of healthcare management. 
      HemApp combines cutting-edge AI technology with intuitive design to help you take control of your health journey.
      
      Our key features include:
      AI-Powered Health Insights. Get personalized health recommendations powered by advanced AI technology.
      Health Monitoring. Track your vital signs, diet, and overall health progress in real-time.
      HemBot AI Consultation. Chat with our intelligent health assistant for instant medical guidance.
      Health Facilities Locator. Find nearby hospitals, clinics, and healthcare providers.
      Connect with Healthcare. Stay connected with your doctors and healthcare team.
      Mobile-First Design. Access your health data anywhere, anytime with our responsive design.
      
      Why Choose HemApp?
      Personalized health recommendations.
      Real-time health monitoring.
      AI-powered medical consultations.
      Secure and private health data.
      Integration with wearable devices.
      Emergency health alerts.
      
      Ready to Transform Your Health Journey?
      Join thousands of users who trust HemApp for their daily health management needs.
      Click Get Started Now to begin.
    `.trim();
    
    // Use speech synthesis to read the content
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      
      const utterance = new SpeechSynthesisUtterance(textContent);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      // Use saved voice preference if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = localStorage.getItem('preferred-voice');
      if (preferredVoice && voices.length > 0) {
        const voice = voices.find(v => v.voiceURI === preferredVoice);
        if (voice) {
          utterance.voice = voice;
        }
      }
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const features = [
    {
      icon: Brain,
      title: t('welcome.features.aiConsultation.title'),
      description: t('welcome.features.aiConsultation.description'),
      color: "bg-blue-500"
    },
    {
      icon: Activity,
      title: t('welcome.features.dietMonitoring.title'),
      description: t('welcome.features.dietMonitoring.description'),
      color: "bg-green-500"
    },
    {
      icon: MessageCircle,
      title: t('welcome.features.healthTracking.title'),
      description: t('welcome.features.healthTracking.description'),
      color: "bg-purple-500"
    },
    {
      icon: MapPin,
      title: t('welcome.features.emergency.title'),
      description: t('welcome.features.emergency.description'),
      color: "bg-red-500"
    }
  ];

  const benefits = t('welcome.benefits.items', { returnObjects: true }) as string[];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-background via-muted/20 to-background ${brailleMode ? 'font-mono text-lg' : ''}`}>
      {/* Voice Commands Sidebar - Only on Welcome Page */}
      <VoiceCommandsSidebar 
        speechEnabled={speechEnabled}
        onSpeechToggle={onSpeechToggle}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <img 
              src={hemappLogo} 
              alt="Hemapp Logo" 
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
            />
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
                HEMAPP
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">{t('welcome.subtitle')}</p>
            </div>
          </div>
          
          <div className="max-w-3xl mx-auto px-2 sm:px-4">
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-4 sm:mb-6">
              {t('welcome.description')}
            </p>
            <Badge variant="secondary" className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              {t('welcome.securityBadge')}
            </Badge>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12 px-2 sm:px-0">
          {features.map((feature, index) => (
            <Card key={index} className="border-border hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center p-4 sm:p-6">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4`}>
                  <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <CardTitle className="text-base sm:text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <CardDescription className="text-center text-muted-foreground text-xs sm:text-sm">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="max-w-4xl mx-auto mb-8 sm:mb-12 px-2 sm:px-0">
          <Card className="border-border">
            <CardHeader className="text-center p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl mb-2">{t('welcome.benefits.title')}</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {t('welcome.cta.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 sm:gap-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 text-primary-foreground" />
                    </div>
                    <span className="text-foreground text-xs sm:text-base">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center px-2 sm:px-0">
          <Card className="border-border bg-gradient-to-r from-primary/10 via-background to-primary/10 max-w-2xl mx-auto">
            <CardContent className="pt-6 sm:pt-8 p-4 sm:p-6">
              <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-primary mx-auto mb-4 sm:mb-6" />
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">
                {t('welcome.cta.title')}
              </h2>
              <p className="text-sm sm:text-lg text-muted-foreground mb-6 sm:mb-8">
                {t('welcome.cta.description')}
              </p>
              <Button 
                onClick={onGetStarted}
                size="lg"
                className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 hover:scale-105 transition-transform duration-200"
              >
                {t('welcome.getStarted')}
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-border">
          <p className="text-muted-foreground">
            © 2024 HemApp. All rights reserved. • Built with ❤️ for better health outcomes
          </p>
        </div>
      </div>

      {/* Assistive Features - Bottom */}
      <div className="fixed bottom-4 left-2 right-2 sm:left-4 sm:right-4 z-40 flex justify-center">
        <div className="bg-background/80 backdrop-blur-sm border rounded-lg p-2 flex flex-wrap items-center justify-center gap-2 shadow-lg">
          <LanguageSwitcher />
          <Button
            size="sm"
            variant={brailleMode ? "default" : "outline"}
            onClick={onBrailleToggle}
            className="text-xs"
          >
            {t('common.braille')}
          </Button>
          <Button
            size="sm"
            variant={speechEnabled ? "default" : "outline"}
            onClick={() => {
              if (!speechEnabled) {
                onSpeechToggle?.();
                setTimeout(readWelcomePageContent, 100);
              } else {
                readWelcomePageContent();
              }
            }}
            className="text-xs flex items-center gap-1"
          >
            {speechEnabled ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
            {t('common.readPage')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;