-- Create enhanced meal categories table with images and nutritional data
CREATE TABLE public.meal_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  color_class TEXT DEFAULT 'bg-purple-100 text-purple-800',
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create meal items table linked to categories
CREATE TABLE public.meal_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES meal_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  calories_per_serving INTEGER,
  protein_per_serving DECIMAL(5,2),
  carbs_per_serving DECIMAL(5,2),
  fat_per_serving DECIMAL(5,2),
  fiber_per_serving DECIMAL(5,2),
  serving_size TEXT DEFAULT '100g',
  image_url TEXT,
  ai_analysis_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.meal_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_items ENABLE ROW LEVEL SECURITY;

-- Create policies for meal_categories
CREATE POLICY "Users can view their own meal categories" 
ON public.meal_categories 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own meal categories" 
ON public.meal_categories 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meal categories" 
ON public.meal_categories 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meal categories" 
ON public.meal_categories 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for meal_items
CREATE POLICY "Users can view meal items in their categories" 
ON public.meal_items 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM meal_categories 
  WHERE meal_categories.id = meal_items.category_id 
  AND meal_categories.user_id = auth.uid()
));

CREATE POLICY "Users can create meal items in their categories" 
ON public.meal_items 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM meal_categories 
  WHERE meal_categories.id = meal_items.category_id 
  AND meal_categories.user_id = auth.uid()
));

CREATE POLICY "Users can update meal items in their categories" 
ON public.meal_items 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM meal_categories 
  WHERE meal_categories.id = meal_items.category_id 
  AND meal_categories.user_id = auth.uid()
));

CREATE POLICY "Users can delete meal items in their categories" 
ON public.meal_items 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM meal_categories 
  WHERE meal_categories.id = meal_items.category_id 
  AND meal_categories.user_id = auth.uid()
));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_meal_categories_updated_at
BEFORE UPDATE ON public.meal_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_meal_items_updated_at
BEFORE UPDATE ON public.meal_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default meal categories with nutritional data
INSERT INTO public.meal_categories (user_id, name, description, color_class) VALUES 
('00000000-0000-0000-0000-000000000000', 'Protein Rich', 'High protein foods for muscle building and repair', 'bg-red-100 text-red-800'),
('00000000-0000-0000-0000-000000000000', 'Vegetables', 'Fresh vegetables rich in vitamins and minerals', 'bg-green-100 text-green-800'),
('00000000-0000-0000-0000-000000000000', 'Fruits', 'Natural sweet fruits packed with vitamins', 'bg-yellow-100 text-yellow-800'),
('00000000-0000-0000-0000-000000000000', 'Carbohydrates', 'Energy-rich carbohydrate sources', 'bg-blue-100 text-blue-800'),
('00000000-0000-0000-0000-000000000000', 'Healthy Fats', 'Essential fatty acids and healthy fats', 'bg-purple-100 text-purple-800');

-- Note: Using placeholder user_id - these will need to be created per user or made public