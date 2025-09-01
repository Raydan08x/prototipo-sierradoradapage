/*
  # Production Management Schema

  1. New Tables
    - `raw_materials`
      - Track ingredients used in beer production
      - Store stock levels and supplier information
    
    - `suppliers`
      - Store supplier information
      - Track contact details and performance metrics

    - `production_schedule`
      - Plan production batches
      - Track batch status and timeline

    - `inventory_alerts`
      - Configure and track stock alerts
      - Store threshold levels for notifications

  2. Changes
    - Add new columns to existing tables
    - Set up relationships between tables
    - Configure RLS policies
*/

-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  contact_name text,
  email text,
  phone text,
  address text,
  active boolean DEFAULT true,
  performance_rating numeric(3,2),
  notes text,
  created_at timestamptz DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz DEFAULT timezone('utc'::text, now())
);

-- Create raw_materials table
CREATE TABLE IF NOT EXISTS raw_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  unit text NOT NULL,
  stock_quantity numeric(10,2) DEFAULT 0,
  min_stock numeric(10,2) DEFAULT 0,
  supplier_id uuid REFERENCES suppliers(id),
  unit_cost numeric(10,2),
  last_purchase_date timestamptz,
  notes text,
  created_at timestamptz DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz DEFAULT timezone('utc'::text, now()),
  CONSTRAINT valid_material_type CHECK (
    type IN ('malt', 'hops', 'yeast', 'adjunct')
  ),
  CONSTRAINT valid_unit CHECK (
    unit IN ('kg', 'g', 'unit', 'l', 'ml')
  )
);

-- Create production_schedule table
CREATE TABLE IF NOT EXISTS production_schedule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES beer_recipes(id) NOT NULL,
  planned_start_date timestamptz NOT NULL,
  planned_end_date timestamptz NOT NULL,
  actual_start_date timestamptz,
  actual_end_date timestamptz,
  batch_size numeric(10,2) NOT NULL DEFAULT 300,
  status text NOT NULL DEFAULT 'planned',
  notes text,
  created_by uuid REFERENCES profiles(id) NOT NULL,
  created_at timestamptz DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz DEFAULT timezone('utc'::text, now()),
  CONSTRAINT valid_status CHECK (
    status IN ('planned', 'in_progress', 'completed', 'cancelled')
  )
);

-- Create inventory_alerts table
CREATE TABLE IF NOT EXISTS inventory_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id uuid REFERENCES raw_materials(id) NOT NULL,
  threshold_quantity numeric(10,2) NOT NULL,
  alert_type text NOT NULL,
  last_triggered_at timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz DEFAULT timezone('utc'::text, now()),
  CONSTRAINT valid_alert_type CHECK (
    alert_type IN ('low_stock', 'out_of_stock', 'expiring')
  )
);

-- Add triggers for updated_at
CREATE TRIGGER update_suppliers_updated_at
  BEFORE UPDATE ON suppliers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_raw_materials_updated_at
  BEFORE UPDATE ON raw_materials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_production_schedule_updated_at
  BEFORE UPDATE ON production_schedule
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE raw_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_alerts ENABLE ROW LEVEL SECURITY;

-- Create policies for Sierra Dorada employees
CREATE POLICY "Allow full access for Sierra Dorada employees"
ON suppliers FOR ALL TO authenticated
USING (auth.jwt()->>'email' LIKE '%@sierradorada.co')
WITH CHECK (auth.jwt()->>'email' LIKE '%@sierradorada.co');

CREATE POLICY "Allow full access for Sierra Dorada employees"
ON raw_materials FOR ALL TO authenticated
USING (auth.jwt()->>'email' LIKE '%@sierradorada.co')
WITH CHECK (auth.jwt()->>'email' LIKE '%@sierradorada.co');

CREATE POLICY "Allow full access for Sierra Dorada employees"
ON production_schedule FOR ALL TO authenticated
USING (auth.jwt()->>'email' LIKE '%@sierradorada.co')
WITH CHECK (auth.jwt()->>'email' LIKE '%@sierradorada.co');

CREATE POLICY "Allow full access for Sierra Dorada employees"
ON inventory_alerts FOR ALL TO authenticated
USING (auth.jwt()->>'email' LIKE '%@sierradorada.co')
WITH CHECK (auth.jwt()->>'email' LIKE '%@sierradorada.co');