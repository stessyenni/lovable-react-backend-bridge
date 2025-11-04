-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Users can view their own meal categories" ON meal_categories;

-- Create a new policy that allows viewing own categories AND system default categories
CREATE POLICY "Users can view their own and system meal categories"
ON meal_categories
FOR SELECT
USING (
  auth.uid() = user_id 
  OR user_id = '00000000-0000-0000-0000-000000000000'::uuid
);

-- Also update the meal_items policy to allow viewing items in system categories
DROP POLICY IF EXISTS "Users can view meal items in their categories" ON meal_items;

CREATE POLICY "Users can view meal items in their categories"
ON meal_items
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM meal_categories
    WHERE meal_categories.id = meal_items.category_id
    AND (
      meal_categories.user_id = auth.uid()
      OR meal_categories.user_id = '00000000-0000-0000-0000-000000000000'::uuid
    )
  )
);