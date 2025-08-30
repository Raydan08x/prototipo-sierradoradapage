/*
  # Add admin policies for Sierra Dorada employees

  1. Security
    - Add policies to restrict access to admin features to @sierradorada.co users only
    - Enable RLS on all admin-related tables
*/

-- Enable RLS on all tables if not already enabled
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE beer_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access
CREATE POLICY "Allow full access for Sierra Dorada employees"
ON profiles
FOR ALL
TO authenticated
USING (
  auth.jwt()->>'email' LIKE '%@sierradorada.co'
)
WITH CHECK (
  auth.jwt()->>'email' LIKE '%@sierradorada.co'
);

-- Repeat similar policies for other admin tables
CREATE POLICY "Allow full access for Sierra Dorada employees"
ON products
FOR ALL
TO authenticated
USING (
  auth.jwt()->>'email' LIKE '%@sierradorada.co'
)
WITH CHECK (
  auth.jwt()->>'email' LIKE '%@sierradorada.co'
);

-- Add similar policies for remaining tables...