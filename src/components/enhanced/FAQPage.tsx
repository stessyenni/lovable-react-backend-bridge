import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  HelpCircle, 
  Book, 
  MessageCircle, 
  X,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Shield,
  Smartphone,
  Heart,
  Utensils,
  Users
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

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
    { id: "all", name: "All Topics", icon: Book },
    { id: "getting-started", name: "Getting Started", icon: Lightbulb },
    { id: "diet", name: "Diet & Nutrition", icon: Utensils },
    { id: "health", name: "Health Goals", icon: Heart },
    { id: "messaging", name: "Messaging", icon: MessageCircle },
    { id: "privacy", name: "Privacy & Security", icon: Shield },
    { id: "mobile", name: "Mobile App", icon: Smartphone },
    { id: "social", name: "Social Features", icon: Users }
  ];

  const faqs: FAQ[] = [
    {
      id: "1",
      question: "How do I get started with the app?",
      answer: "Welcome to your health companion! Start by creating your profile with basic health information. Then explore the Diet Monitoring section to log your first meal, set up health goals in the Goals section, and connect with other users in the Messages area. The app works offline, so you can use most features even without internet connectivity.",
      category: "getting-started",
      tags: ["setup", "profile", "first-time"]
    },
    {
      id: "2",
      question: "How does the AI food analysis work?",
      answer: "Our AI analyzes food photos using advanced computer vision to identify ingredients, estimate calories, and provide nutritional information. Simply take a photo of your meal, and the AI will automatically detect food items and calculate nutritional values. You can also manually edit the results if needed.",
      category: "diet",
      tags: ["AI", "food", "analysis", "calories"]
    },
    {
      id: "3",
      question: "Can I use the app offline?",
      answer: "Yes! The app supports offline functionality for key features including diet monitoring, messaging, AI consultations, and health goal tracking. Your data is saved locally and automatically synced when you reconnect to the internet. You'll see a sync status indicator showing pending items.",
      category: "getting-started",
      tags: ["offline", "sync", "connectivity"]
    },
    {
      id: "4",
      question: "How do I add meals to different categories?",
      answer: "Navigate to Diet Monitoring > Meal Categories. You can create custom categories (like 'Protein Rich' or 'Vegetables') with color coding and descriptions. When adding meals, select the appropriate category and include nutritional information. The enhanced categories system shows all your meals with their nutritional values.",
      category: "diet",
      tags: ["categories", "meals", "organization"]
    },
    {
      id: "5",
      question: "How are my health goals tracked?",
      answer: "Health goals are tracked through daily progress updates. You can set numeric targets (like steps), duration goals (like exercise time), or boolean goals (like taking vitamins). The app provides sample goals with tips for success, and you can monitor progress with visual charts and statistics.",
      category: "health",
      tags: ["goals", "tracking", "progress"]
    },
    {
      id: "6",
      question: "Can I connect with other users?",
      answer: "Yes! Use the Messages section to discover and connect with other users. The app automatically recommends new users based on activity and provides search functionality. You can send connection requests and build your health community for motivation and support.",
      category: "social",
      tags: ["connections", "social", "community"]
    },
    {
      id: "7",
      question: "How does the calorie calculation work?",
      answer: "Calories are calculated from multiple sources: AI analysis of food photos, manual meal entries, and nutritional data from our comprehensive database. The system aggregates your daily intake and displays it in easy-to-understand charts with breakdowns by meal type and nutritional content.",
      category: "diet",
      tags: ["calories", "calculation", "nutrition"]
    },
    {
      id: "8",
      question: "Is my health data private and secure?",
      answer: "Absolutely. All your health data is encrypted and stored securely. Only you can access your personal information. When connecting with other users, you control what information to share. The app follows strict privacy standards and never sells your data to third parties.",
      category: "privacy",
      tags: ["privacy", "security", "data"]
    },
    {
      id: "9",
      question: "Can I connect my smartwatch or fitness tracker?",
      answer: "Yes! The app supports universal smartwatch connectivity. Go to Settings > Connect Watch to pair your device. Supported devices include Apple Watch, Fitbit, Garmin, Samsung Galaxy Watch, and other popular fitness trackers. This allows automatic step counting and activity tracking.",
      category: "mobile",
      tags: ["smartwatch", "fitness", "tracking"]
    },
    {
      id: "10",
      question: "How do I consult with healthcare professionals?",
      answer: "The app offers multiple consultation options: AI-powered health consultations for immediate guidance, voice calls, video calls, and in-app messaging with healthcare providers. The AI can help detect when you should seek professional medical advice and can connect you with appropriate healthcare services.",
      category: "health",
      tags: ["consultation", "doctors", "healthcare"]
    },
    {
      id: "11",
      question: "Can I export my health data?",
      answer: "Yes, you can export your complete health data including diet logs, goal progress, and consultation history. Go to Settings > Export Data to download your information in standard formats (PDF, CSV) for sharing with healthcare providers or personal records.",
      category: "privacy",
      tags: ["export", "data", "backup"]
    },
    {
      id: "12",
      question: "How do I enable dark mode themes?",
      answer: "Go to Settings > Appearance to choose from multiple theme options including several dark mode variants with different shades of black. The app automatically adapts to your device's theme preference, or you can manually select your preferred color scheme.",
      category: "mobile",
      tags: ["dark mode", "themes", "appearance"]
    }
  ];

  const userGuide: UserGuideSection[] = [
    {
      id: "profile-setup",
      title: "Setting Up Your Profile",
      description: "Create a complete health profile for personalized recommendations",
      icon: Users,
      steps: [
        "Tap on your profile icon in the top right corner",
        "Fill in basic information: name, age, height, weight",
        "Add medical conditions and allergies if applicable",
        "Set emergency contact information",
        "Upload a profile picture (optional)",
        "Save your profile to enable personalized features"
      ]
    },
    {
      id: "meal-tracking",
      title: "Tracking Your Meals",
      description: "Log meals with AI-powered nutritional analysis",
      icon: Utensils,
      steps: [
        "Go to Diet Monitoring section",
        "Tap 'Add Meal' or 'Photo Analysis'",
        "Take a photo of your food or enter manually",
        "Review AI-generated nutritional information",
        "Edit portions or add missing details",
        "Select meal category and save",
        "View daily nutrition summary and trends"
      ]
    },
    {
      id: "health-goals",
      title: "Setting Health Goals",
      description: "Create and track personalized health objectives",
      icon: Heart,
      steps: [
        "Navigate to Health Goals section",
        "Browse recommended goals or create custom ones",
        "Set target values and deadlines",
        "Choose goal category (fitness, nutrition, etc.)",
        "Add personal notes and motivation",
        "Track daily progress updates",
        "Review achievements and adjust goals as needed"
      ]
    },
    {
      id: "offline-mode",
      title: "Using Offline Features",
      description: "Continue using the app without internet connectivity",
      icon: Smartphone,
      steps: [
        "Enable offline mode in Settings",
        "Use core features: meal logging, messaging, goals",
        "Data is saved locally on your device",
        "Check sync status indicator for pending items",
        "Automatic sync when connection is restored",
        "View offline data in dedicated section"
      ]
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch = searchTerm === "" || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="h-full max-h-[90vh] flex flex-col w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background shrink-0">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Help Center & User Guide
          </h3>
          <p className="text-sm text-muted-foreground">
            Find answers to common questions and learn how to use the app effectively
          </p>
        </div>
        {onClose && (
          <Button onClick={onClose} variant="outline" size="sm" className="ml-2">
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        )}
      </div>

      <Tabs defaultValue="faq" className="flex-1 flex flex-col h-0">
        <TabsList className="grid w-full grid-cols-2 mx-4 mt-4">
          <TabsTrigger value="faq">Frequently Asked Questions</TabsTrigger>
          <TabsTrigger value="guide">User Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="flex-1 h-0">
          <div className="p-4 space-y-4">
            {/* Search and Filter */}
            <div className="space-y-3">
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
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center gap-2"
                  >
                    <category.icon className="h-4 w-4" />
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className="space-y-3">
                {filteredFAQs.length === 0 ? (
                  <Card>
                    <CardContent className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No FAQs found</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Try adjusting your search or filter criteria
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Accordion type="single" collapsible className="space-y-2">
                    {filteredFAQs.map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg px-4">
                        <AccordionTrigger className="text-left hover:no-underline">
                          <div className="flex items-start gap-3 w-full">
                            <HelpCircle className="h-5 w-5 mt-0.5 text-primary shrink-0" />
                            <div className="flex-1">
                              <p className="font-medium">{faq.question}</p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {faq.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pl-8">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        <TabsContent value="guide" className="flex-1 h-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-6">
              <div className="text-center mb-6">
                <Book className="h-12 w-12 text-primary mx-auto mb-4" />
                <h4 className="text-lg font-semibold">Step-by-Step User Guide</h4>
                <p className="text-sm text-muted-foreground">
                  Learn how to make the most of your health companion app
                </p>
              </div>

              {userGuide.map((section) => (
                <Card key={section.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <section.icon className="h-6 w-6 text-primary" />
                      {section.title}
                    </CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {section.steps.map((step, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <p className="text-sm flex-1 pt-0.5">{step}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-6 text-center">
                  <Lightbulb className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h5 className="font-semibold mb-2">Need More Help?</h5>
                  <p className="text-sm text-muted-foreground mb-4">
                    Can't find what you're looking for? Our support team is here to help!
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact Support
                    </Button>
                    <Button variant="outline" size="sm">
                      <Book className="h-4 w-4 mr-2" />
                      Video Tutorials
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FAQPage;