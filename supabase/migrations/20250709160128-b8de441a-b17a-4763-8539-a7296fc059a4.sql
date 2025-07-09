-- Create sample health goals table for recommendations
CREATE TABLE public.sample_health_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'fitness', 'nutrition', 'mental_health', 'sleep', 'weight'
  target_type TEXT NOT NULL, -- 'numeric', 'boolean', 'duration'
  default_target_value TEXT,
  default_current_value TEXT DEFAULT '0',
  icon_name TEXT,
  difficulty_level TEXT DEFAULT 'beginner', -- 'beginner', 'intermediate', 'advanced'
  estimated_timeframe TEXT, -- '1 week', '1 month', '3 months', etc.
  tips TEXT[],
  is_popular BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert sample health goals
INSERT INTO public.sample_health_goals (title, description, category, target_type, default_target_value, icon_name, difficulty_level, estimated_timeframe, tips, is_popular) VALUES 
('Walk 10,000 Steps Daily', 'Increase daily physical activity by walking at least 10,000 steps each day', 'fitness', 'numeric', '10000', 'footprints', 'beginner', '1 month', ARRAY['Start with shorter walks and gradually increase', 'Use a step counter or smartphone app', 'Take stairs instead of elevators', 'Park farther away from destinations'], true),

('Drink 8 Glasses of Water Daily', 'Stay hydrated by drinking at least 8 glasses (64oz) of water per day', 'nutrition', 'numeric', '8', 'droplets', 'beginner', '2 weeks', ARRAY['Keep a water bottle with you', 'Set reminders on your phone', 'Drink a glass before each meal', 'Add lemon or cucumber for flavor'], true),

('Exercise 30 Minutes Daily', 'Commit to 30 minutes of physical exercise every day', 'fitness', 'duration', '30 minutes', 'dumbbell', 'intermediate', '6 weeks', ARRAY['Start with 15 minutes and build up', 'Mix cardio and strength training', 'Find activities you enjoy', 'Schedule workouts like appointments'], true),

('Get 8 Hours of Sleep', 'Establish a healthy sleep routine with 8 hours of quality sleep nightly', 'sleep', 'duration', '8 hours', 'moon', 'beginner', '3 weeks', ARRAY['Set a consistent bedtime', 'Avoid screens 1 hour before bed', 'Keep bedroom cool and dark', 'Create a relaxing bedtime routine'], true),

('Eat 5 Servings of Fruits & Vegetables', 'Include at least 5 servings of fruits and vegetables in your daily diet', 'nutrition', 'numeric', '5', 'apple', 'beginner', '1 month', ARRAY['Add fruits to breakfast', 'Include vegetables in every meal', 'Try new recipes with vegetables', 'Keep healthy snacks visible'], true),

('Meditate 10 Minutes Daily', 'Practice mindfulness meditation for 10 minutes each day', 'mental_health', 'duration', '10 minutes', 'brain', 'beginner', '3 weeks', ARRAY['Start with 5 minutes', 'Use guided meditation apps', 'Find a quiet space', 'Be consistent with timing'], true),

('Lose 2 Pounds Per Month', 'Achieve sustainable weight loss of 2 pounds per month', 'weight', 'numeric', '2', 'scale', 'intermediate', '3 months', ARRAY['Focus on portion control', 'Combine diet and exercise', 'Track your progress weekly', 'Celebrate small victories'], false),

('Read 20 Pages Daily', 'Develop a reading habit by reading at least 20 pages every day', 'mental_health', 'numeric', '20', 'book', 'beginner', '1 month', ARRAY['Choose books you enjoy', 'Set aside dedicated reading time', 'Always carry a book', 'Join a reading group for motivation'], false),

('Do 50 Push-ups Daily', 'Build upper body strength by doing 50 push-ups each day', 'fitness', 'numeric', '50', 'zap', 'advanced', '8 weeks', ARRAY['Start with modified push-ups if needed', 'Break into sets throughout the day', 'Focus on proper form', 'Gradually increase repetitions'], false),

('Cook 5 Healthy Meals Weekly', 'Prepare at least 5 healthy, home-cooked meals each week', 'nutrition', 'numeric', '5', 'chef-hat', 'intermediate', '4 weeks', ARRAY['Plan meals in advance', 'Prep ingredients on weekends', 'Start with simple recipes', 'Cook in batches for leftovers'], false),

('Limit Screen Time to 2 Hours', 'Reduce recreational screen time to maximum 2 hours per day', 'mental_health', 'duration', '2 hours', 'smartphone', 'intermediate', '6 weeks', ARRAY['Use app timers and limits', 'Find alternative activities', 'Create phone-free zones', 'Set specific times for checking devices'], false),

('Take 10,000 IU Vitamin D Daily', 'Maintain healthy vitamin D levels by taking daily supplements', 'nutrition', 'boolean', 'Yes', 'sun', 'beginner', '1 week', ARRAY['Consult with healthcare provider first', 'Take with meals for better absorption', 'Set daily reminders', 'Consider natural sunlight exposure too'], false);

-- Enable RLS (even though this is read-only data, it's good practice)
ALTER TABLE public.sample_health_goals ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read sample goals
CREATE POLICY "Anyone can view sample health goals" 
ON public.sample_health_goals 
FOR SELECT 
USING (true);