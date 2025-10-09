import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface MealCategory {
  id: string;
  name: string;
  color_class: string;
  description?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  meal_items?: any[];
}

export const useMealCategories = () => {
  const [categories, setCategories] = useState<MealCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchCategories = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('meal_categories')
        .select(`
          *,
          meal_items (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }

      setCategories(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addCategory = async (name: string, description = '', colorClass = 'bg-purple-100 text-purple-800') => {
    if (!user || !name.trim()) return null;

    try {
      // Check if category already exists
      const { data: existing } = await supabase
        .from('meal_categories')
        .select('id')
        .eq('user_id', user.id)
        .eq('name', name.trim())
        .maybeSingle();
      
      if (existing) {
        toast({
          title: "Category exists",
          description: `Category "${name}" already exists.`,
          variant: "destructive",
        });
        return null;
      }

      const { data, error } = await supabase
        .from('meal_categories')
        .insert({
          user_id: user.id,
          name: name.trim(),
          description,
          color_class: colorClass
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Category Added",
        description: `"${name}" category has been created.`,
      });

      await fetchCategories();
      return data;
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    fetchCategories,
    addCategory
  };
};