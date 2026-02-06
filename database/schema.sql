-- Database: SDDB
-- Password for DB User should be set to: 199611Cm.

-- 1. Users Table (Simulating Supabase Auth for local storage)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL, -- Store hashed passwords here
    role TEXT DEFAULT 'client', -- 'client', 'employee', 'admin'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_sign_in TIMESTAMP WITH TIME ZONE
);

-- 2. Profiles Table (Extends User information)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    full_name TEXT,
    birth_date DATE,
    address TEXT,
    phone TEXT,
    gender TEXT CHECK (gender IN ('male', 'female')),
    terms_accepted BOOLEAN DEFAULT FALSE,
    terms_accepted_at TIMESTAMP WITH TIME ZONE,
    newsletter_subscription BOOLEAN DEFAULT FALSE,
    marketing_consent BOOLEAN DEFAULT FALSE,
    role_title TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    abv DECIMAL(4, 1), -- Alcohol By Volume
    ibu INTEGER, -- International Bitterness Units
    color_hex TEXT,
    color_name TEXT,
    serving_temp TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'shipped', 'delivered', 'cancelled'
    total_amount DECIMAL(10, 2) NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_phone TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL, -- Calculated as quantity * unit_price
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Cart Items Table
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id) -- Prevent duplicate entries for same product
);

-- 7. Suppliers
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    contact_name TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Raw Materials
CREATE TABLE IF NOT EXISTS raw_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'malt', 'hops', 'yeast', 'adjunct'
    unit TEXT NOT NULL, -- 'kg', 'g', 'l', 'ml', 'unit'
    stock_quantity DECIMAL(10, 2) DEFAULT 0,
    min_stock DECIMAL(10, 2) DEFAULT 0,
    supplier_id UUID REFERENCES suppliers(id),
    unit_cost DECIMAL(10, 2),
    last_purchase_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Beer Recipes
CREATE TABLE IF NOT EXISTS beer_recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    style TEXT,
    description TEXT,
    og DECIMAL(4, 3), -- Original Gravity (e.g. 1.050)
    fg DECIMAL(4, 3), -- Final Gravity
    abv DECIMAL(4, 1),
    ibu INTEGER,
    srm INTEGER, -- Color
    batch_size DECIMAL(10, 2), -- Liters
    efficiency INTEGER, -- Percentage
    status TEXT DEFAULT 'active', -- 'active', 'archived', 'draft'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Recipe Ingredients
CREATE TABLE IF NOT EXISTS recipe_ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID REFERENCES beer_recipes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    unit TEXT NOT NULL,
    timing INTEGER, -- Minutes (boil time)
    alpha_acid DECIMAL(4, 1), -- For hops
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Production Schedule (Batches)
CREATE TABLE IF NOT EXISTS production_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID REFERENCES beer_recipes(id),
    planned_start_date DATE,
    planned_end_date DATE,
    status TEXT DEFAULT 'planned', -- 'planned', 'mashing', 'boiling', 'fermenting', 'conditioning', 'completed'
    batch_size DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Purchase Orders
CREATE TABLE IF NOT EXISTS purchase_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID REFERENCES suppliers(id),
    order_date DATE DEFAULT CURRENT_DATE,
    expected_delivery_date DATE,
    status TEXT DEFAULT 'draft', -- 'draft', 'ordered', 'in_transit', 'received', 'cancelled'
    total_amount DECIMAL(10, 2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Purchase Order Items
CREATE TABLE IF NOT EXISTS purchase_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_order_id UUID REFERENCES purchase_orders(id) ON DELETE CASCADE,
    material_id UUID REFERENCES raw_materials(id),
    quantity DECIMAL(10, 2) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    received_quantity DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. Shipments
CREATE TABLE IF NOT EXISTS shipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL, -- 'inbound', 'outbound'
    status TEXT DEFAULT 'pending', -- 'pending', 'in_transit', 'delivered', 'customs', 'delayed'
    origin TEXT,
    destination TEXT,
    carrier TEXT,
    tracking_number TEXT,
    expected_date DATE,
    actual_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. Inventory Transactions
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id),
    material_id UUID REFERENCES raw_materials(id), -- Nullable, track either product or material
    type TEXT NOT NULL, -- 'purchase', 'production', 'sale', 'adjustment', 'loss'
    quantity DECIMAL(10, 2) NOT NULL,
    reference_id UUID, -- ID related to the transaction (PO, Order, Batch)
    reference_type TEXT, -- 'purchase_order', 'order', 'production_batch'
    notes TEXT,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Initial Data Seeding
-- 1. Insert Admin Users with specific UUIDs for relationship mapping
INSERT INTO users (id, email, password_hash, role) VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin@admin', '199611Cm.', 'admin'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'carlosmadero@sierradorada.co', '12345678', 'admin'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'cmadero08x@gmail.com', '12345678', 'admin'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'sierradoradacb@gmail.com', '12345678', 'admin')
ON CONFLICT (email) DO NOTHING;

-- 2. Insert Profiles for these Admins (Required for Foreign Key constraints)
INSERT INTO profiles (id, full_name, role_title) VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Super Administrator', 'System Owner'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Carlos Madero', 'Gerente General'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'C. Madero', 'Admin Operativo'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Sierra Dorada Admin', 'Soporte Técnico')
ON CONFLICT (id) DO NOTHING;

-- 16. Reservations Table (Plant Visits)
CREATE TABLE IF NOT EXISTS reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    visit_date DATE NOT NULL,
    group_size INTEGER NOT NULL CHECK (group_size >= 4 AND group_size <= 20),
    status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled', 'completed'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
