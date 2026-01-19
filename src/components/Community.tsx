import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { 
  MessageSquare, 
  Heart, 
  Share2, 
  Plus, 
  Send,
  Users,
  TrendingUp,
  HelpCircle,
  Lightbulb,
  X,
  Copy,
  Facebook,
  Twitter,
  Sparkles,
  Bot
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  profile?: {
    first_name: string | null;
    last_name: string | null;
    profile_image_url: string | null;
  };
  user_liked?: boolean;
  is_ai_generated?: boolean;
}

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profile?: {
    first_name: string | null;
    last_name: string | null;
    profile_image_url: string | null;
  };
}

const CATEGORIES = [
  { id: 'general', label: 'community.categories.general', icon: MessageSquare },
  { id: 'experiences', label: 'community.categories.experiences', icon: Users },
  { id: 'questions', label: 'community.categories.questions', icon: HelpCircle },
  { id: 'tips', label: 'community.categories.tips', icon: Lightbulb },
  { id: 'success', label: 'community.categories.success', icon: TrendingUp },
];

// Daily health tips for PWDs (Persons with Disabilities)
const DAILY_HEALTH_TIPS = [
  {
    title: "Iron-Rich Foods for Hemoglobin",
    content: "Include iron-rich foods like spinach, lentils, red meat, and fortified cereals in your diet. Pair them with vitamin C sources like citrus fruits to enhance iron absorption. This is especially important for managing hemoglobin levels and preventing anemia."
  },
  {
    title: "Staying Hydrated for Better Health",
    content: "Proper hydration is crucial for overall health. Aim for 8 glasses of water daily. If you have mobility challenges, keep a water bottle within reach. Staying hydrated helps with circulation, digestion, and energy levels."
  },
  {
    title: "Gentle Exercise for Everyone",
    content: "Physical activity is beneficial for all abilities. Chair exercises, gentle stretching, or adaptive yoga can improve circulation and mood. Always consult your healthcare provider before starting new exercises."
  },
  {
    title: "Managing Stress and Mental Health",
    content: "Mental health is just as important as physical health. Practice deep breathing, meditation, or connect with supportive communities. Don't hesitate to reach out for help when needed."
  },
  {
    title: "Vitamin B12 and Your Health",
    content: "Vitamin B12 is essential for nerve function and red blood cell production. Include eggs, dairy, fish, or B12-fortified foods in your diet. Those with dietary restrictions may need supplements."
  },
  {
    title: "Sleep and Recovery",
    content: "Quality sleep is vital for recovery and health maintenance. Establish a consistent sleep schedule, create a comfortable sleep environment, and limit screen time before bed."
  },
  {
    title: "Protein for Strength and Energy",
    content: "Adequate protein intake supports muscle health and energy. Include lean meats, beans, eggs, or plant-based proteins in your meals. Spread protein intake throughout the day for best results."
  },
  {
    title: "Folic Acid Benefits",
    content: "Folic acid helps produce healthy red blood cells. Dark leafy greens, beans, citrus fruits, and fortified grains are excellent sources. This is particularly important for preventing certain types of anemia."
  },
  {
    title: "Accessible Meal Preparation Tips",
    content: "Plan meals ahead and use adaptive kitchen tools if needed. Batch cooking can save energy. Ask for help when needed - community support makes healthy eating easier."
  },
  {
    title: "Regular Health Check-ups",
    content: "Regular monitoring of health metrics is important. Track your hemoglobin levels, blood pressure, and other vital signs. Use apps like HemApp to maintain records and share with your healthcare team."
  },
  {
    title: "Building a Support Network",
    content: "Connect with others who understand your health journey. Support groups, online communities, and family connections provide emotional support and practical advice."
  },
  {
    title: "Understanding Food Labels",
    content: "Learn to read nutrition labels to make informed food choices. Look for iron, fiber, and protein content. Avoid excessive sodium and added sugars for better health management."
  },
  {
    title: "Calcium and Vitamin D",
    content: "These nutrients work together for bone health. Include dairy, fortified plant milks, fatty fish, and get safe sun exposure. Especially important for those with limited mobility."
  },
  {
    title: "Managing Fatigue",
    content: "Fatigue is common with hemoglobin-related conditions. Pace your activities, take rest breaks, and prioritize important tasks. Small, frequent meals can help maintain energy levels."
  }
];

const Community = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCreating, setIsCreating] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'general' });
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [dailyTip, setDailyTip] = useState<typeof DAILY_HEALTH_TIPS[0] | null>(null);

  // Generate daily tip on mount only (not dependent on category)
  useEffect(() => {
    generateDailyTip();
  }, []);

  // Fetch posts when category changes
  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  const generateDailyTip = () => {
    // Use current date to consistently show the same tip each day
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const tipIndex = dayOfYear % DAILY_HEALTH_TIPS.length;
    setDailyTip(DAILY_HEALTH_TIPS[tipIndex]);
  };

  const fetchPosts = async () => {
    setIsLoading(true);
    let query = supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (selectedCategory !== 'all') {
      query = query.eq('category', selectedCategory);
    }

    const { data: postsData } = await query;

    if (postsData) {
      // Fetch profiles for each post
      const userIds = [...new Set(postsData.map(p => p.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, profile_image_url')
        .in('id', userIds);

      // Fetch likes for current user
      let userLikes: string[] = [];
      if (user?.id) {
        const { data: likes } = await supabase
          .from('post_likes')
          .select('post_id')
          .eq('user_id', user.id);
        userLikes = likes?.map(l => l.post_id) || [];
      }

      const postsWithProfiles = postsData.map(post => ({
        ...post,
        profile: profiles?.find(p => p.id === post.user_id),
        user_liked: userLikes.includes(post.id)
      }));

      setPosts(postsWithProfiles);
    }
    setIsLoading(false);
  };

  const handleCreatePost = async () => {
    if (!user?.id || !newPost.title.trim() || !newPost.content.trim()) {
      toast({ title: t('community.error'), description: t('community.fillAllFields'), variant: "destructive" });
      return;
    }

    const { error } = await supabase
      .from('community_posts')
      .insert({
        user_id: user.id,
        title: newPost.title.trim(),
        content: newPost.content.trim(),
        category: newPost.category
      });

    if (error) {
      toast({ title: t('community.error'), description: t('community.postFailed'), variant: "destructive" });
      return;
    }

    setNewPost({ title: '', content: '', category: 'general' });
    setIsCreating(false);
    fetchPosts();
    toast({ title: t('community.success'), description: t('community.postCreated') });
  };

  const handleLike = async (postId: string, currentlyLiked: boolean) => {
    if (!user?.id) return;

    if (currentlyLiked) {
      await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', user.id);
      await supabase.from('community_posts').update({ likes_count: posts.find(p => p.id === postId)!.likes_count - 1 }).eq('id', postId);
    } else {
      await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id });
      await supabase.from('community_posts').update({ likes_count: posts.find(p => p.id === postId)!.likes_count + 1 }).eq('id', postId);
    }
    
    fetchPosts();
  };

  const openComments = async (post: Post) => {
    setSelectedPost(post);
    
    const { data: commentsData } = await supabase
      .from('post_comments')
      .select('*')
      .eq('post_id', post.id)
      .order('created_at', { ascending: true });

    if (commentsData) {
      const userIds = [...new Set(commentsData.map(c => c.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, profile_image_url')
        .in('id', userIds);

      setComments(commentsData.map(comment => ({
        ...comment,
        profile: profiles?.find(p => p.id === comment.user_id)
      })));
    }
  };

  const handleAddComment = async () => {
    if (!user?.id || !selectedPost || !newComment.trim()) return;

    const { error } = await supabase
      .from('post_comments')
      .insert({
        post_id: selectedPost.id,
        user_id: user.id,
        content: newComment.trim()
      });

    if (!error) {
      await supabase.from('community_posts').update({ comments_count: selectedPost.comments_count + 1 }).eq('id', selectedPost.id);
      setNewComment('');
      openComments(selectedPost);
      fetchPosts();
    }
  };

  const handleShare = async (post: Post, platform: 'copy' | 'whatsapp' | 'facebook' | 'twitter') => {
    const shareText = `${post.title}\n\n${post.content.substring(0, 200)}${post.content.length > 200 ? '...' : ''}\n\n- Shared from HemApp Community`;
    const shareUrl = window.location.href;
    
    switch (platform) {
      case 'copy':
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        toast({ title: t('community.success'), description: t('community.linkCopied') });
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = CATEGORIES.find(c => c.id === category);
    return cat ? cat.icon : MessageSquare;
  };

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase() || 'U';
  };

  return (
    <div className="space-y-4 lg:space-y-6 w-full max-w-5xl mx-auto p-2 sm:p-4 lg:p-6 min-w-0">
      <div className="space-y-2">
        <h2 className="text-xl lg:text-2xl font-bold">{t('community.title')}</h2>
        <p className="text-sm lg:text-base text-muted-foreground">{t('community.subtitle')}</p>
      </div>

      {/* Daily Health Tip Card */}
      {dailyTip && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-primary/10">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-lg flex items-center gap-2">
                {t('community.dailyHealthTip')}
                <Badge variant="secondary" className="text-xs">
                  <Bot className="h-3 w-3 mr-1" />
                  AI
                </Badge>
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold mb-2">{dailyTip.title}</h3>
            <p className="text-sm text-muted-foreground">{dailyTip.content}</p>
            <div className="flex gap-2 mt-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4 mr-1" />
                    {t('community.share')}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleShare({ id: '', user_id: '', title: dailyTip.title, content: dailyTip.content, category: 'tips', likes_count: 0, comments_count: 0, created_at: '' }, 'copy')}>
                    <Copy className="h-4 w-4 mr-2" />
                    {t('community.copyLink')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare({ id: '', user_id: '', title: dailyTip.title, content: dailyTip.content, category: 'tips', likes_count: 0, comments_count: 0, created_at: '' }, 'whatsapp')}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {t('community.shareWhatsApp')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare({ id: '', user_id: '', title: dailyTip.title, content: dailyTip.content, category: 'tips', likes_count: 0, comments_count: 0, created_at: '' }, 'facebook')}>
                    <Facebook className="h-4 w-4 mr-2" />
                    {t('community.shareFacebook')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare({ id: '', user_id: '', title: dailyTip.title, content: dailyTip.content, category: 'tips', likes_count: 0, comments_count: 0, created_at: '' }, 'twitter')}>
                    <Twitter className="h-4 w-4 mr-2" />
                    {t('community.shareTwitter')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="all" className="text-xs">
            {t('community.all')}
          </TabsTrigger>
          {CATEGORIES.map(cat => (
            <TabsTrigger key={cat.id} value={cat.id} className="text-xs flex items-center gap-1">
              <cat.icon className="h-3 w-3" />
              <span className="hidden sm:inline">{t(cat.label)}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-4 space-y-4">
          {/* Create Post Button */}
          {!isCreating && (
            <Button onClick={() => setIsCreating(true)} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              {t('community.createPost')}
            </Button>
          )}

          {/* Create Post Form */}
          {isCreating && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('community.newPost')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder={t('community.postTitle')}
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                />
                <Textarea
                  placeholder={t('community.postContent')}
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  rows={4}
                />
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <Button
                      key={cat.id}
                      variant={newPost.category === cat.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNewPost({ ...newPost, category: cat.id })}
                    >
                      <cat.icon className="h-3 w-3 mr-1" />
                      {t(cat.label)}
                    </Button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreatePost}>{t('community.post')}</Button>
                  <Button variant="outline" onClick={() => setIsCreating(false)}>{t('community.cancel')}</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Posts List */}
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">{t('community.loading')}</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>{t('community.noPosts')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map(post => {
                const CategoryIcon = getCategoryIcon(post.category);
                return (
                  <Card key={post.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={post.profile?.profile_image_url || undefined} />
                          <AvatarFallback>{getInitials(post.profile?.first_name, post.profile?.last_name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium">
                              {post.profile?.first_name} {post.profile?.last_name}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              <CategoryIcon className="h-3 w-3 mr-1" />
                              {t(`community.categories.${post.category}`)}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                            </span>
                          </div>
                          <h3 className="font-semibold mt-1">{post.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{post.content}</p>
                          <div className="flex items-center gap-2 mt-3 flex-wrap">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={post.user_liked ? "text-red-500" : ""}
                              onClick={() => handleLike(post.id, post.user_liked || false)}
                            >
                              <Heart className={`h-4 w-4 mr-1 ${post.user_liked ? 'fill-current' : ''}`} />
                              {post.likes_count}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => openComments(post)}>
                              <MessageSquare className="h-4 w-4 mr-1" />
                              {post.comments_count}
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Share2 className="h-4 w-4 mr-1" />
                                  {t('community.share')}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleShare(post, 'copy')}>
                                  <Copy className="h-4 w-4 mr-2" />
                                  {t('community.copyLink')}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleShare(post, 'whatsapp')}>
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  {t('community.shareWhatsApp')}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleShare(post, 'facebook')}>
                                  <Facebook className="h-4 w-4 mr-2" />
                                  {t('community.shareFacebook')}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleShare(post, 'twitter')}>
                                  <Twitter className="h-4 w-4 mr-2" />
                                  {t('community.shareTwitter')}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Comments Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <CardHeader className="flex-shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{selectedPost.title}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedPost(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription className="whitespace-pre-wrap">{selectedPost.content}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-4">
              {comments.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">{t('community.noComments')}</p>
              ) : (
                comments.map(comment => (
                  <div key={comment.id} className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.profile?.profile_image_url || undefined} />
                      <AvatarFallback>{getInitials(comment.profile?.first_name, comment.profile?.last_name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 bg-muted p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {comment.profile?.first_name} {comment.profile?.last_name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{comment.content}</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
            <div className="flex-shrink-0 p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder={t('community.writeComment')}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <Button onClick={handleAddComment}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Community;
