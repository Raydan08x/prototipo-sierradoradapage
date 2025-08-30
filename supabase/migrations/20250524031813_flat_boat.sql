/*
  # Initial Customer Database Schema

  1. Tables
    - profiles: Extended user profile information
    - products: Beer catalog
    - orders: Customer orders
    - order_items: Individual items in orders
    - cart_items: Shopping cart items

  2. Security
    - RLS policies for data protection
    - User-specific access controls
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  full_name text,
  birth_date timestamptz,
  address text,
  phone text,
  gender text CHECK (gender IN ('male', 'female')),
  terms_accepted boolean DEFAULT false,
  terms_accepted_at timestamptz,
  newsletter_subscription boolean DEFAULT false,
  marketing_consent boolean DEFAULT false,
  created_at timestamptz DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz DEFAULT timezone('utc'::text, now()),
  CONSTRAINT check_age CHECK (
    EXTRACT(YEAR FROM age(CURRENT_DATE, birth_date::date)) >= 18
  )
);

-- Create products table
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  image_url text,
  abv numeric(3,1),
  ibu integer,
  color_hex text,
  color_name text,
  serving_temp text,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz DEFAULT timezone('utc'::text, now())
);

-- Create orders table
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  total_amount numeric(10,2) NOT NULL,
  shipping_address text NOT NULL,
  shipping_phone text NOT NULL,
  created_at timestamptz DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz DEFAULT timezone('utc'::text, now()),
  CONSTRAINT valid_status CHECK (
    status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')
  )
);

-- Create order_items table
CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) NOT NULL,
  product_id uuid REFERENCES products(id) NOT NULL,
  quantity integer NOT NULL,
  unit_price numeric(10,2) NOT NULL,
  total_price numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT timezone('utc'::text, now())
);

-- Create cart_items table
CREATE TABLE cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  product_id uuid REFERENCES products(id) NOT NULL,
  quantity integer NOT NULL,
  created_at timestamptz DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, product_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Profiles: Users can read/update their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Products: Anyone can view products, only authenticated users can check availability
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

-- Orders: Users can view and create their own orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Order Items: Users can view their own order items
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Cart Items: Users can manage their own cart
CREATE POLICY "Users can manage own cart"
  ON cart_items FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_profiles_user ON profiles(id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_cart_items_user ON cart_items(user_id);

-- Insert initial products
INSERT INTO products (
  name,
  description,
  price,
  image_url,
  abv,
  ibu,
  color_hex,
  color_name,
  serving_temp,
  is_available
) VALUES
  (
    'Dorada Imperial',
    'Una cerveza dorada de cuerpo completo con notas a caramelo y un final suave.',
    12000,
    'https://images.unsplash.com/photo-1608270586620-248524c67de9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    6.5,
    25,
    '#FFD700',
    'Dorado brillante',
    '6-8°C',
    true
  ),
  (
    'Leyenda Negra',
    'Stout imperial con intensos sabores a café y chocolate negro.',
    14000,
    'https://images.unsplash.com/photo-1571767454098-246b94fbcf70?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    8.0,
    45,
    '#1A1A1A',
    'Negro intenso',
    '8-10°C',
    true
  ),
  (
    'Rubia Mítica',
    'Cerveza rubia tipo Pilsner, refrescante con un toque de lúpulo aromático.',
    10000,
    'https://images.unsplash.com/photo-1523567830207-96731740fa71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    4.8,
    20,
    '#F4C430',
    'Dorado pálido',
    '4-6°C',
    true
  ),
  (
    'Tesoro Rojo',
    'Red Ale con carácter maltoso y un equilibrado amargor.',
    11000,
    'https://images.unsplash.com/photo-1612528443702-f6741f70a049?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    5.5,
    30,
    '#8B0000',
    'Ámbar rojizo',
    '7-9°C',
    true
  );