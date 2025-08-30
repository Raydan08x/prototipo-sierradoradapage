/*
  # Asignar rol master a usuario administrador

  1. Cambios
    - Crear rol 'master' si no existe
    - Asignar permisos completos al rol master
    - Asignar rol master al usuario administrador
    
  2. Seguridad
    - El rol master tendrá acceso completo al sistema
    - Solo se asigna a usuarios específicamente autorizados
*/

-- Crear rol master si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM roles WHERE name = 'master'
  ) THEN
    INSERT INTO roles (name, permissions)
    VALUES (
      'master',
      jsonb_build_object(
        'products', jsonb_build_object('create', true, 'read', true, 'update', true, 'delete', true),
        'orders', jsonb_build_object('create', true, 'read', true, 'update', true, 'delete', true),
        'inventory', jsonb_build_object('create', true, 'read', true, 'update', true, 'delete', true),
        'users', jsonb_build_object('create', true, 'read', true, 'update', true, 'delete', true),
        'roles', jsonb_build_object('create', true, 'read', true, 'update', true, 'delete', true),
        'recipes', jsonb_build_object('create', true, 'read', true, 'update', true, 'delete', true),
        'production', jsonb_build_object('create', true, 'read', true, 'update', true, 'delete', true),
        'analytics', jsonb_build_object('read', true)
      )
    );
  END IF;
END $$;

-- Asignar rol master al usuario administrador
DO $$
DECLARE
  v_role_id uuid;
  v_user_id uuid;
BEGIN
  -- Obtener el ID del rol master
  SELECT id INTO v_role_id FROM roles WHERE name = 'master';
  
  -- Obtener el ID del usuario por email
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'carlosmadero@sierradorada.co';

  -- Actualizar el perfil del usuario con el rol master
  IF v_user_id IS NOT NULL THEN
    UPDATE profiles 
    SET role_id = v_role_id
    WHERE id = v_user_id;
  END IF;
END $$;