
-- Create table for user profile images and app settings
CREATE TABLE public.user_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  profile_image_url TEXT,
  language_preference TEXT DEFAULT 'en',
  voice_preference TEXT DEFAULT 'alloy',
  enable_speech_to_text BOOLEAN DEFAULT true,
  enable_text_to_speech BOOLEAN DEFAULT true,
  enable_braille BOOLEAN DEFAULT false,
  enable_screen_reader BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for diet uploads and AI suggestions
CREATE TABLE public.diet_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  image_url TEXT NOT NULL,
  analysis_result JSONB,
  ai_suggestions TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for AI consultation records
CREATE TABLE public.ai_consultations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  symptoms TEXT[],
  ai_recommendation TEXT,
  severity_level TEXT CHECK (severity_level IN ('low', 'medium', 'high', 'urgent')),
  recommended_action TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for offline data sync
CREATE TABLE public.offline_sync (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  data_type TEXT NOT NULL,
  data_payload JSONB NOT NULL,
  sync_status TEXT DEFAULT 'pending' CHECK (sync_status IN ('pending', 'synced', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  synced_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on all new tables
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diet_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offline_sync ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_settings
CREATE POLICY "Users can view their own settings" 
  ON public.user_settings 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own settings" 
  ON public.user_settings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" 
  ON public.user_settings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create RLS policies for diet_uploads
CREATE POLICY "Users can view their own diet uploads" 
  ON public.diet_uploads 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own diet uploads" 
  ON public.diet_uploads 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for ai_consultations
CREATE POLICY "Users can view their own consultations" 
  ON public.ai_consultations 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own consultations" 
  ON public.ai_consultations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for offline_sync
CREATE POLICY "Users can view their own offline data" 
  ON public.offline_sync 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own offline data" 
  ON public.offline_sync 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Create storage bucket for profile images and diet uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('user-uploads', 'user-uploads', true);

-- Create storage policies
CREATE POLICY "Users can upload their own files" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own files" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own files" 
  ON storage.objects 
  FOR UPDATE 
  USING (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own files" 
  ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
