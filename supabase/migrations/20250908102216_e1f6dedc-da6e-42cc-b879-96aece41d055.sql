-- Add missing column to diet_entries table
ALTER TABLE public.diet_entries ADD COLUMN meal_content text;

-- Create a function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at column and trigger if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'diet_entries' AND column_name = 'updated_at') THEN
        ALTER TABLE public.diet_entries ADD COLUMN updated_at timestamp with time zone DEFAULT now();
        
        CREATE TRIGGER update_diet_entries_updated_at 
            BEFORE UPDATE ON public.diet_entries 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;