import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Search, 
  X, 
  HelpCircle, 
  BookOpen, 
  MessageCircle, 
  Phone, 
  Mail,
  Apple,
  Stethoscope,
  Settings,
  Target,
  MapPin,
  Watch,
  AlertTriangle,
  User
} from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

interface UserGuideSection {
  id: string;
  title: string;
  description: string;
  icon: any;
  steps: string[];
}

interface FAQPageProps {
  onClose?: () => void;
}

const FAQPage = ({ onClose }: FAQPageProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All", icon: HelpCircle },
    { id: "diet", name: "Diet & Nutrition", icon: Apple },
    { id: "health", name: "Health Monitoring", icon: Stethoscope },
    { id: "goals", name: "Health Goals", icon: Target },
    { id: "smartwatch", name: "Smartwatch", icon: Watch },
    { id: "emergency", name: "Emergency", icon: AlertTriangle },
    { id: "facilities", name: "Health Facilities", icon: MapPin },
    { id: "account", name: "Account & Settings", icon: User },
    { id: "technical", name: "Technical Issues", icon: Settings },
  ];

  const faqs: FAQ[] = [
    {
      id: "1",
      question: "How do I log my meals and track nutrition?",
      answer: "To log meals: 1) Go to Diet Monitoring, 2) Tap 'Add Meal Entry', 3) Fill in meal details including name, type, and nutritional information, 4) Optionally add a photo, 5) Select or create a category, 6) Save your entry. The app will track your daily nutrition automatically.",
      category: "diet",
      tags: ["meals", "nutrition", "tracking", "calories"]
    },
    {
      id: "2",
      question: "Can I connect any smartwatch to the app?",
      answer: "Yes! The app supports universal Bluetooth connectivity, meaning you can connect any Bluetooth-enabled smartwatch regardless of brand. Simply enable Bluetooth on your watch, go to SmartWatch section in the app, and follow the pairing instructions.",
      category: "smartwatch",
      tags: ["bluetooth", "pairing", "universal", "sync"]
    },
    {
      id: "3",
      question: "How do I access emergency services quickly?",
      answer: "For emergencies: 1) Tap the Emergency section from the main menu, 2) Use the one-tap emergency calling feature, 3) Your location and medical information will be automatically shared with emergency contacts, 4) Critical health information is displayed without requiring login.",
      category: "emergency",
      tags: ["emergency", "help", "contacts", "medical info"]
    },
    {
      id: "4",
      question: "How do I find nearby healthcare facilities?",
      answer: "Go to Health Facilities section where you can: 1) View nearby facilities on a map, 2) Filter by type (hospitals, clinics, pharmacies), 3) See ratings, hours, and contact information, 4) Get directions to any facility, 5) Save favorites for quick access.",
      category: "facilities",
      tags: ["hospitals", "clinics", "directions", "map"]
    },
    {
      id: "5",
      question: "What should I do if my meal won't save?",
      answer: "If you're having trouble saving meals: 1) Check if a meal with the same name already exists, 2) The app will prompt you to either use the existing meal or save with a different name, 3) Ensure all required fields are filled, 4) Check your internet connection for sync issues.",
      category: "technical",
      tags: ["saving", "duplicates", "errors", "sync"]
    },
    {
      id: "6",
      question: "How do I set and track health goals?",
      answer: "To manage health goals: 1) Go to Health Goals section, 2) Choose from sample goals or create custom ones, 3) Set target values and deadlines, 4) Track progress regularly, 5) The app provides recommendations and progress visualization.",
      category: "goals",
      tags: ["goals", "targets", "progress", "tracking"]
    },
    {
      id: "7",
      question: "Can I use the app offline?",
      answer: "Yes! The app supports offline functionality: 1) Core features work without internet, 2) Data is stored locally and syncs when connection returns, 3) You can manually toggle offline mode, 4) Emergency features remain accessible offline.",
      category: "technical",
      tags: ["offline", "sync", "connectivity", "local storage"]
    },
    {
      id: "8",
      question: "How do I edit my meal categories?",
      answer: "To edit categories: 1) Go to Diet Monitoring, 2) Select 'View Categories', 3) Tap on any category to edit it, 4) You can modify name, description, and add new items, 5) Changes sync across all your meal entries.",
      category: "diet",
      tags: ["categories", "editing", "organization", "meals"]
    },
    {
      id: "9",
      question: "What accessibility features are available?",
      answer: "The app includes: 1) Voice-to-text input, 2) Text-to-speech output, 3) High contrast mode, 4) Adjustable font sizes, 5) Screen reader compatibility, 6) Voice navigation commands, 7) Gesture-based controls.",
      category: "account",
      tags: ["accessibility", "voice", "contrast", "screen reader"]
    },
    {
      id: "10",
      question: "How do I get AI health consultations?",
      answer: "For AI consultations: 1) Go to AI Consultation section, 2) Describe your symptoms or health concerns, 3) The AI will provide recommendations and severity assessments, 4) You'll get guidance on whether to seek immediate care or monitor symptoms.",
      category: "health",
      tags: ["AI", "consultation", "symptoms", "recommendations"]
    }
  ];

  const userGuide: UserGuideSection[] = [
    {
      id: "getting-started",
      title: "Getting Started",
      description: "Set up your profile and start using the app",
      icon: User,
      steps: [
        "Create your account with email and password",
        "Complete your profile with basic health information",
        "Set your initial health goals and preferences",
        "Take a tour of the main features",
        "Configure accessibility settings if needed"
      ]
    },
    {
      id: "meal-tracking",
      title: "Meal Tracking",
      description: "Log your meals and monitor nutrition",
      icon: Apple,
      steps: [
        "Navigate to Diet Monitoring section",
        "Tap 'Add Meal Entry' to log a new meal",
        "Fill in meal details: name, type, nutritional info",
        "Add a photo of your meal (optional)",
        "Select or create a meal category",
        "Save your entry and view in meal history"
      ]
    },
    {
      id: "smartwatch-setup",
      title: "Smartwatch Connection",
      description: "Connect and sync with your smartwatch",
      icon: Watch,
      steps: [
        "Enable Bluetooth on your smartwatch",
        "Go to SmartWatch section in the app",
        "Tap 'Connect Device' and scan for devices",
        "Select your smartwatch from the list",
        "Follow pairing instructions on both devices",
        "Configure sync settings and data preferences"
      ]
    },
    {
      id: "emergency-setup",
      title: "Emergency Preparedness",
      description: "Set up emergency contacts and medical info",
      icon: AlertTriangle,
      steps: [
        "Go to Emergency section",
        "Add emergency contact information",
        "Fill in critical medical conditions and allergies",
        "Set up location sharing preferences",
        "Test the emergency call feature",
        "Review and update information regularly"
      ]
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full max-h-[90vh] flex flex-col w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background shrink-0">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold">FAQ & User Guide</h3>
          <p className="text-sm text-muted-foreground">
            Find answers to common questions and learn how to use the app
          </p>
        </div>
        <div className="flex gap-2 ml-2">
          {onClose && (
            <Button onClick={onClose} variant="outline" size="sm">
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 h-0">
        <ScrollArea className="h-full">
          <div className="p-4">
            <Tabs defaultValue="faq" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="faq" className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  FAQ
                </TabsTrigger>
                <TabsTrigger value="guide" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  User Guide
                </TabsTrigger>
              </TabsList>

              <TabsContent value="faq" className="space-y-4">
                {/* Search and Filters */}
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search FAQs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <Badge
                          key={category.id}
                          variant={selectedCategory === category.id ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => setSelectedCategory(category.id)}
                        >
                          <IconComponent className="h-3 w-3 mr-1" />
                          {category.name}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                {/* FAQ Results */}
                <div className="space-y-4">
                  {filteredFAQs.length === 0 ? (
                    <Card>
                      <CardContent className="flex items-center justify-center py-12">
                        <div className="text-center">
                          <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">No FAQs found</p>
                          <p className="text-sm text-muted-foreground mt-2">
                            Try adjusting your search terms or category filter
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Accordion type="single" collapsible className="w-full">
                      {filteredFAQs.map((faq) => (
                        <AccordionItem key={faq.id} value={faq.id}>
                          <AccordionTrigger className="text-left">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-3">
                              <p className="text-sm leading-relaxed">{faq.answer}</p>
                              <div className="flex flex-wrap gap-1">
                                {faq.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="guide" className="space-y-6">
                {userGuide.map((section) => {
                  const IconComponent = section.icon;
                  return (
                    <Card key={section.id}>
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <IconComponent className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{section.title}</CardTitle>
                            <CardDescription>{section.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ol className="space-y-2">
                          {section.steps.map((step, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                                {index + 1}
                              </span>
                              <span className="text-sm leading-relaxed">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </CardContent>
                    </Card>
                  );
                })}
              </TabsContent>
            </Tabs>

            {/* Need More Help Section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Need More Help?
                </CardTitle>
                <CardDescription>
                  Can't find what you're looking for? Get in touch with our support team
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Support
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Support
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Support Hours: Monday - Friday, 9:00 AM - 6:00 PM</p>
                  <p>Response Time: Within 24 hours</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default FAQPage;