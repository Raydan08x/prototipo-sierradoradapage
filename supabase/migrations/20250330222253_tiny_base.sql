/*
  # Logistics Management Schema

  1. New Tables
    - `inventory_transactions`
      - Track all inventory movements
      - Record type of transaction (production, sales, adjustment)
      - Store reference to related entities

    - `purchase_orders`
      - Manage orders for raw materials
      - Track order status and delivery
      - Store supplier information

    - `purchase_order_items`
      - Store individual items in purchase orders
      - Track quantities and costs

    - `shipments`
      - Track incoming and outgoing shipments
      - Store shipping details and status

  2. Changes
    - Add new columns to existing tables
    - Set up relationships between tables
    - Configure RLS policies
*/

-- Create inventory_transactions table if not exists
CREATE TABLE IF NOT EXISTS inventory_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) NOT NULL,
  type text NOT NULL,
  quantity integer NOT NULL,
  reference_id uuid,
  reference_type text,
  notes text,
  created_by uuid REFERENCES profiles(id) NOT NULL,
  created_at timestamptz DEFAULT timezone('utc'::text, now())
);

-- Create purchase_orders table
CREATE TABLE IF NOT EXISTS purchase_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid REFERENCES suppliers(id) NOT NULL,
  order_date timestamptz DEFAULT timezone('utc'::text, now()),
  expected_delivery_date timestamptz,
  status text NOT NULL DEFAULT 'draft',
  total_amount numeric(10,2) NOT NULL DEFAULT 0,
  notes text,
  created_by uuid REFERENCES profiles(id) NOT NULL,
  created_at timestamptz DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz DEFAULT timezone('utc'::text, now()),
  CONSTRAINT valid_status CHECK (
    status IN ('draft', 'ordered', 'in_transit', 'received', 'cancelled')
  )
);

-- Create purchase_order_items table
CREATE TABLE IF NOT EXISTS purchase_order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id uuid REFERENCES purchase_orders(id) NOT NULL,
  material_id uuid REFERENCES raw_materials(id) NOT NULL,
  quantity numeric(10,2) NOT NULL,
  unit_price numeric(10,2) NOT NULL,
  total_price numeric(10,2) NOT NULL,
  received_quantity numeric(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT timezone('utc'::text, now())
);

-- Create shipments table
CREATE TABLE IF NOT EXISTS shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  origin text,
  destination text,
  carrier text,
  tracking_number text,
  expected_date timestamptz,
  actual_date timestamptz,
  notes text,
  reference_id uuid,
  reference_type text,
  created_by uuid REFERENCES profiles(id) NOT NULL,
  created_at timestamptz DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz DEFAULT timezone('utc'::text, now()),
  CONSTRAINT valid_type CHECK (
    type IN ('inbound', 'outbound')
  ),
  CONSTRAINT valid_status CHECK (
    status IN ('pending', 'in_transit', 'delivered', 'cancelled')
  )
);

-- Add triggers for updated_at
CREATE TRIGGER update_purchase_orders_updated_at
  BEFORE UPDATE ON purchase_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shipments_updated_at
  BEFORE UPDATE ON shipments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;

-- Create policies for Sierra Dorada employees
CREATE POLICY "Allow full access for Sierra Dorada employees"
ON inventory_transactions FOR ALL TO authenticated
USING (auth.jwt()->>'email' LIKE '%@sierradorada.co')
WITH CHECK (auth.jwt()->>'email' LIKE '%@sierradorada.co');

CREATE POLICY "Allow full access for Sierra Dorada employees"
ON purchase_orders FOR ALL TO authenticated
USING (auth.jwt()->>'email' LIKE '%@sierradorada.co')
WITH CHECK (auth.jwt()->>'email' LIKE '%@sierradorada.co');

CREATE POLICY "Allow full access for Sierra Dorada employees"
ON purchase_order_items FOR ALL TO authenticated
USING (auth.jwt()->>'email' LIKE '%@sierradorada.co')
WITH CHECK (auth.jwt()->>'email' LIKE '%@sierradorada.co');

CREATE POLICY "Allow full access for Sierra Dorada employees"
ON shipments FOR ALL TO authenticated
USING (auth.jwt()->>'email' LIKE '%@sierradorada.co')
WITH CHECK (auth.jwt()->>'email' LIKE '%@sierradorada.co');

-- Create indexes if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_inventory_product'
  ) THEN
    CREATE INDEX idx_inventory_product ON inventory_transactions(product_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_purchase_orders_supplier'
  ) THEN
    CREATE INDEX idx_purchase_orders_supplier ON purchase_orders(supplier_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_purchase_order_items_po'
  ) THEN
    CREATE INDEX idx_purchase_order_items_po ON purchase_order_items(purchase_order_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_shipments_reference'
  ) THEN
    CREATE INDEX idx_shipments_reference ON shipments(reference_id);
  END IF;
END $$;