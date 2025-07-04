
-- Add missing columns to diet_entries table for better functionality
ALTER TABLE public.diet_entries 
ADD COLUMN IF NOT EXISTS meal_content text,
ADD COLUMN IF NOT EXISTS image_url text,
ADD COLUMN IF NOT EXISTS category text;

-- Create a meal_images storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('meal-images', 'meal-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for meal-images bucket
CREATE POLICY IF NOT EXISTS "Users can upload meal images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'meal-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY IF NOT EXISTS "Users can view meal images" ON storage.objects
FOR SELECT USING (bucket_id = 'meal-images');

-- Add theme preference to user_settings table
ALTER TABLE public.user_settings 
ADD COLUMN IF NOT EXISTS theme_preference text DEFAULT 'system';

-- Create nutrition goals table
CREATE TABLE IF NOT EXISTS public.nutrition_goals (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  daily_calories integer,
  daily_protein integer,
  daily_fiber integer,
  daily_water integer,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for nutrition_goals
ALTER TABLE public.nutrition_goals ENABLE ROW LEVEL SECURITY;

-- Create policies for nutrition_goals
CREATE POLICY IF NOT EXISTS "Users can view their own nutrition goals" 
  ON public.nutrition_goals 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can create their own nutrition goals" 
  ON public.nutrition_goals 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own nutrition goals" 
  ON public.nutrition_goals 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create trends tracking table
CREATE TABLE IF NOT EXISTS public.health_trends (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  date date NOT NULL,
  calories_consumed integer,
  protein_consumed integer,
  fiber_consumed integer,
  weight numeric,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for health_trends
ALTER TABLE public.health_trends ENABLE ROW LEVEL SECURITY;

-- Create policies for health_trends
CREATE POLICY IF NOT EXISTS "Users can view their own health trends" 
  ON public.health_trends 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can create their own health trends" 
  ON public.health_trends 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own health trends" 
  ON public.health_trends 
  FOR UPDATE 
  USING (auth.uid() = user_id);
