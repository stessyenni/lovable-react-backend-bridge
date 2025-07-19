-- Create storage bucket for meal images
INSERT INTO storage.buckets (id, name, public) VALUES ('meal-images', 'meal-images', true);

-- Create policies for meal images
CREATE POLICY "Meal images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'meal-images');

CREATE POLICY "Users can upload meal images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'meal-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their meal images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'meal-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their meal images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'meal-images' AND auth.uid()::text = (storage.foldername(name))[1]);