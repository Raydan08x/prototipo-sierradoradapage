/*
  # Insert Initial Production Data

  1. Initial Data
    - Insert raw materials
    - Insert initial recipes for existing products
    - Set up initial inventory levels

  2. Recipe Details
    - Dorada Imperial (300L batch)
    - Leyenda Negra (300L batch)
    - Rubia Mítica (300L batch)
    - Tesoro Rojo (300L batch)
*/

-- Insert initial supplier
INSERT INTO suppliers (name, contact_name, email, phone, address, active)
VALUES (
  'Insumos Cerveceros SAS',
  'Juan Pérez',
  'juan.perez@insumoscerveceros.co',
  '+573101234567',
  'Calle 123 #45-67, Bogotá',
  true
) ON CONFLICT DO NOTHING;

-- Get supplier ID
DO $$ 
DECLARE
  v_supplier_id uuid;
BEGIN
  SELECT id INTO v_supplier_id FROM suppliers LIMIT 1;

  -- Insert raw materials
  INSERT INTO raw_materials (name, type, unit, stock_quantity, min_stock, supplier_id, unit_cost)
  VALUES
    ('Malta Pilsner', 'malt', 'kg', 1000, 200, v_supplier_id, 8000),
    ('Malta Chocolate', 'malt', 'kg', 500, 100, v_supplier_id, 9000),
    ('Malta Tostada', 'malt', 'kg', 500, 100, v_supplier_id, 8500),
    ('Malta Base', 'malt', 'kg', 800, 150, v_supplier_id, 7500),
    ('Malta Pale Ale', 'malt', 'kg', 800, 150, v_supplier_id, 8000),
    ('Malta Caramelo', 'malt', 'kg', 600, 120, v_supplier_id, 8500),
    ('Malta Munich', 'malt', 'kg', 500, 100, v_supplier_id, 8500),
    ('Lúpulo Saaz', 'hops', 'g', 5000, 1000, v_supplier_id, 800),
    ('Lúpulo Fuggles', 'hops', 'g', 5000, 1000, v_supplier_id, 750),
    ('Lúpulo Cascade', 'hops', 'g', 5000, 1000, v_supplier_id, 850),
    ('Lúpulo Amarillo', 'hops', 'g', 5000, 1000, v_supplier_id, 900),
    ('Levadura Lager', 'yeast', 'unit', 50, 10, v_supplier_id, 15000),
    ('Levadura Stout', 'yeast', 'unit', 50, 10, v_supplier_id, 15000),
    ('Levadura Ale', 'yeast', 'unit', 50, 10, v_supplier_id, 15000)
  ON CONFLICT DO NOTHING;

  -- Set up inventory alerts
  INSERT INTO inventory_alerts (material_id, threshold_quantity, alert_type)
  SELECT 
    id,
    min_stock,
    'low_stock'
  FROM raw_materials
  ON CONFLICT DO NOTHING;
END $$;

-- Insert recipes for existing products
DO $$
DECLARE
  v_created_by uuid;
BEGIN
  -- Get a valid user ID (preferably an admin)
  SELECT id INTO v_created_by 
  FROM profiles 
  WHERE email_domain = 'sierradorada.co' 
  LIMIT 1;

  -- Insert recipes
  WITH recipe_inserts AS (
    INSERT INTO beer_recipes (
      name, 
      style, 
      description, 
      og, 
      fg, 
      abv, 
      ibu, 
      srm, 
      batch_size, 
      efficiency,
      created_by,
      status,
      version
    )
    VALUES
      (
        'Dorada Imperial',
        'Imperial Pilsner',
        'Cerveza dorada de cuerpo completo con notas a caramelo',
        1.065,
        1.012,
        6.5,
        25,
        4,
        300,
        75,
        v_created_by,
        'active',
        1
      ),
      (
        'Leyenda Negra',
        'Imperial Stout',
        'Stout imperial con intensos sabores a café y chocolate negro',
        1.080,
        1.020,
        8.0,
        45,
        40,
        300,
        75,
        v_created_by,
        'active',
        1
      ),
      (
        'Rubia Mítica',
        'Pilsner',
        'Cerveza rubia tipo Pilsner, refrescante con un toque de lúpulo aromático',
        1.048,
        1.010,
        4.8,
        20,
        3,
        300,
        75,
        v_created_by,
        'active',
        1
      ),
      (
        'Tesoro Rojo',
        'Red Ale',
        'Red Ale con carácter maltoso y un equilibrado amargor',
        1.055,
        1.012,
        5.5,
        30,
        15,
        300,
        75,
        v_created_by,
        'active',
        1
      )
    RETURNING id, name
  )
  -- Insert recipe ingredients
  INSERT INTO recipe_ingredients (recipe_id, name, type, amount, unit, timing)
  SELECT 
    r.id,
    i.name,
    i.type,
    i.amount,
    i.unit,
    i.timing
  FROM recipe_inserts r
  CROSS JOIN LATERAL (
    VALUES
      -- Dorada Imperial
      ('Malta Pilsner', 'malt', 18, 'kg', NULL),
      ('Lúpulo Saaz', 'hops', 360, 'g', 60),
      ('Levadura Lager', 'yeast', 3, 'unit', NULL),
      
      -- Leyenda Negra
      ('Malta Chocolate', 'malt', 9, 'kg', NULL),
      ('Malta Tostada', 'malt', 9, 'kg', NULL),
      ('Malta Base', 'malt', 6, 'kg', NULL),
      ('Lúpulo Fuggles', 'hops', 300, 'g', 60),
      ('Levadura Stout', 'yeast', 3, 'unit', NULL),
      
      -- Rubia Mítica
      ('Malta Pale Ale', 'malt', 15, 'kg', NULL),
      ('Malta Caramelo', 'malt', 6, 'kg', NULL),
      ('Lúpulo Cascade', 'hops', 240, 'g', 60),
      ('Levadura Ale', 'yeast', 3, 'unit', NULL),
      
      -- Tesoro Rojo
      ('Malta Caramelo', 'malt', 12, 'kg', NULL),
      ('Malta Munich', 'malt', 6, 'kg', NULL),
      ('Lúpulo Amarillo', 'hops', 300, 'g', 60),
      ('Levadura Ale', 'yeast', 3, 'unit', NULL)
    ) i(name, type, amount, unit, timing)
  WHERE 
    CASE r.name
      WHEN 'Dorada Imperial' THEN i.name IN ('Malta Pilsner', 'Lúpulo Saaz', 'Levadura Lager')
      WHEN 'Leyenda Negra' THEN i.name IN ('Malta Chocolate', 'Malta Tostada', 'Malta Base', 'Lúpulo Fuggles', 'Levadura Stout')
      WHEN 'Rubia Mítica' THEN i.name IN ('Malta Pale Ale', 'Malta Caramelo', 'Lúpulo Cascade', 'Levadura Ale')
      WHEN 'Tesoro Rojo' THEN i.name IN ('Malta Caramelo', 'Malta Munich', 'Lúpulo Amarillo', 'Levadura Ale')
    END;
END $$;