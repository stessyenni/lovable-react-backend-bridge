
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Heart, Loader2, Shield, Smartphone, Brain } from "lucide-react";

const AuthPage = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const { toast } = useToast();
  const { signUp, signIn } = useAuth();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signUp(email, password, firstName, lastName);

      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome to Hemapp! 🎉",
          description: "Please check your email for verification.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred during sign up",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back! 👋",
          description: "Successfully signed in to Hemapp.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred during sign in",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-royal-blue via-hemapp-green to-dark-purple flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-white rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white rounded-full blur-xl"></div>
        <div className="absolute bottom-40 right-10 w-16 h-16 bg-white rounded-full blur-xl"></div>
      </div>

      <Card className="w-full max-w-md glass-effect shadow-2xl border-white/20">
        <CardHeader className="text-center space-y-4">
          {/* Logo Section */}
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Heart className="h-10 w-10 text-royal-blue" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold gradient-text bg-gradient-to-r from-royal-blue to-dark-purple bg-clip-text text-transparent">
                Hemapp
              </h1>
              <p className="text-sm text-muted-foreground">Your AI Health Companion</p>
            </div>
          </div>

          <CardTitle className="text-white">Welcome to Your Health Journey</CardTitle>
          <CardDescription className="text-white/80">
            Sign in to access AI-powered health insights, diet monitoring, and personalized care
          </CardDescription>

          {/* Features Preview */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <p className="text-xs text-white/80">AI Insights</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              <p className="text-xs text-white/80">Mobile Ready</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <p className="text-xs text-white/80">Secure</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/10 border-white/20">
              <TabsTrigger value="signin" className="data-[state=active]:bg-white data-[state=active]:text-royal-blue">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-white data-[state=active]:text-royal-blue">
                Sign Up
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="mt-6">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-white">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-white">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-white text-royal-blue hover:bg-white/90 font-semibold" 
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In to Hemapp
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="mt-6">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-white">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-white">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-white">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-white">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-white text-royal-blue hover:bg-white/90 font-semibold" 
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Join Hemapp
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* App Features */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-center text-white/80 text-sm mb-4">What you'll get with Hemapp:</p>
            <div className="space-y-2 text-xs text-white/70">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-hemapp-green rounded-full"></div>
                <span>AI-powered health consultations</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-royal-blue rounded-full"></div>
                <span>Smart diet monitoring with photo analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-dark-purple rounded-full"></div>
                <span>Accessibility features (Speech-to-text, Braille support)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-hemapp-green rounded-full"></div>
                <span>Offline functionality and health facility maps</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
