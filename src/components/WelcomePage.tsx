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
  Check
} from "lucide-react";
import hemappLogo from "@/assets/Hemapp-Logo.png";

interface WelcomePageProps {
  onGetStarted: () => void;
}

const WelcomePage = ({ onGetStarted }: WelcomePageProps) => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Health Insights",
      description: "Get personalized health recommendations powered by advanced AI technology",
      color: "bg-blue-500"
    },
    {
      icon: Activity,
      title: "Health Monitoring",
      description: "Track your vital signs, diet, and overall health progress in real-time",
      color: "bg-green-500"
    },
    {
      icon: MessageCircle,
      title: "HemBot AI Consultation",
      description: "Chat with our intelligent health assistant for instant medical guidance",
      color: "bg-purple-500"
    },
    {
      icon: MapPin,
      title: "Health Facilities Locator",
      description: "Find nearby hospitals, clinics, and healthcare providers",
      color: "bg-red-500"
    },
    {
      icon: Users,
      title: "Connect with Healthcare",
      description: "Stay connected with your doctors and healthcare team",
      color: "bg-indigo-500"
    },
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Access your health data anywhere, anytime with our responsive design",
      color: "bg-teal-500"
    }
  ];

  const benefits = [
    "Personalized health recommendations",
    "Real-time health monitoring",
    "AI-powered medical consultations",
    "Secure and private health data",
    "Integration with wearable devices",
    "Emergency health alerts"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <img 
              src={hemappLogo} 
              alt="Hemapp Logo" 
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
            />
            <div className="text-left">
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
                HEMAPP
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground">Your Complete Health Management Companion</p>
            </div>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-muted-foreground mb-6">
              Welcome to the future of healthcare management. HemApp combines cutting-edge AI technology 
              with intuitive design to help you take control of your health journey.
            </p>
            <Badge variant="secondary" className="text-sm px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Secure • Private • HIPAA Compliant
            </Badge>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="border-border hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center">
                <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="border-border">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2">Why Choose HemApp?</CardTitle>
              <CardDescription>
                Experience the next generation of health management with these powerful features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="border-border bg-gradient-to-r from-primary/10 via-background to-primary/10 max-w-2xl mx-auto">
            <CardContent className="pt-8">
              <Heart className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Ready to Transform Your Health Journey?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of users who trust HemApp for their daily health management needs.
              </p>
              <Button 
                onClick={onGetStarted}
                size="lg"
                className="text-lg px-8 py-6 hover:scale-105 transition-transform duration-200"
              >
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
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
    </div>
  );
};

export default WelcomePage;