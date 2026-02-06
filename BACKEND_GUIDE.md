# 🍺 Sierra Dorada - Guía de Backend

## Resumen del Stack

| Componente | Tecnología | Versión |
|------------|------------|---------|
| **Runtime** | Node.js | v18+ |
| **Framework** | Express.js | 5.2.1 |
| **Base de Datos** | PostgreSQL | 14+ |
| **Autenticación** | JWT (jsonwebtoken) | 9.0.3 |
| **Hash Passwords** | bcryptjs | 3.0.3 |
| **Process Manager** | PM2 | (producción) |

---

## 📁 Estructura del Backend

```
server/
├── index.js                    # Punto de entrada del servidor
├── db.js                       # Conexión a PostgreSQL
├── routes/
│   ├── auth.js                 # Autenticación (login, registro)
│   └── data.js                 # CRUD genérico para todas las tablas
├── setup_db_reservations.js    # Script para crear tabla de reservas
└── migrate_reservations.js     # Script de migración

database/
├── schema.sql                  # Esquema completo de la BD
└── SDDB.sql                    # Backup/dump de la BD
```

---

## 🔑 Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# Base de Datos
DB_USER=postgres
DB_PASSWORD=199611Cm.
DB_HOST=localhost
DB_PORT=5432
DB_NAME=SDDB

# Servidor
PORT=3000

# JWT (CAMBIAR EN PRODUCCIÓN!)
JWT_SECRET=your-secret-key-change-me
```

---

## 🗄️ Base de Datos (PostgreSQL)

### Tablas Principales

| # | Tabla | Descripción |
|---|-------|-------------|
| 1 | `users` | Usuarios del sistema (admin, client, employee) |
| 2 | `profiles` | Información adicional de usuarios |
| 3 | `products` | Catálogo de cervezas |
| 4 | `orders` | Pedidos de clientes |
| 5 | `order_items` | Items de cada pedido |
| 6 | `cart_items` | Carrito de compras |
| 7 | `suppliers` | Proveedores de materias primas |
| 8 | `raw_materials` | Inventario de materias primas |
| 9 | `beer_recipes` | Recetas de cerveza |
| 10 | `recipe_ingredients` | Ingredientes por receta |
| 11 | `production_schedule` | Programación de lotes |
| 12 | `purchase_orders` | Órdenes de compra a proveedores |
| 13 | `purchase_order_items` | Items de órdenes de compra |
| 14 | `shipments` | Envíos (entrantes y salientes) |
| 15 | `inventory_transactions` | Historial de movimientos de inventario |
| 16 | `reservations` | Reservas para visitas a la planta |

### Usuarios Administradores Predefinidos

| Email | Contraseña | Rol |
|-------|------------|-----|
| admin@admin | 199611Cm. | admin |
| carlosmadero@sierradorada.co | 12345678 | admin |
| cmadero08x@gmail.com | 12345678 | admin |
| sierradoradacb@gmail.com | 12345678 | admin |

---

## 🛣️ API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Autenticación (`/api/auth`)

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| POST | `/signup` | Registro de usuario | `{ email, password, full_name, phone }` |
| POST | `/signin` | Inicio de sesión | `{ email, password }` |
| GET | `/me` | Obtener usuario actual | Header: `Authorization: Bearer <token>` |

**Respuesta de Login:**
```json
{
  "access_token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@email.com",
    "role": "client",
    "full_name": "Nombre"
  }
}
```

### Datos CRUD (`/api/data`)

Rutas dinámicas para todas las tablas permitidas.

| Método | Endpoint | Descripción | Ejemplo |
|--------|----------|-------------|---------|
| GET | `/:table` | Listar registros | `/api/data/products` |
| GET | `/:table?campo=valor` | Filtrar registros | `/api/data/orders?status=pending` |
| POST | `/:table` | Crear registro | `/api/data/products` + body JSON |
| PATCH | `/:table?id=<uuid>` | Actualizar registro | `/api/data/products?id=abc123` |
| DELETE | `/:table?id=<uuid>` | Eliminar registro | `/api/data/products?id=abc123` |

**Tablas permitidas:**
```
products, users, profiles, orders, order_items, cart_items,
suppliers, raw_materials, beer_recipes, recipe_ingredients,
production_schedule, purchase_orders, purchase_order_items,
shipments, inventory_transactions, reservations
```

---

## 🚀 Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run server

# Iniciar en producción (con PM2)
npm run start:prod

# Configurar tabla de reservaciones
npm run db:setup
```

---

## 🔧 Configuración de PostgreSQL

### Crear la base de datos

```sql
-- En psql como superusuario
CREATE DATABASE "SDDB";
\c SDDB

-- Ejecutar schema.sql
\i database/schema.sql
```

### Conexión desde el servidor

El archivo `server/db.js` maneja la conexión:

```javascript
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'SDDB',
    password: process.env.DB_PASSWORD || '199611Cm.',
    port: 5432,
});
```

---

## ⚠️ Mejoras Pendientes (TO-DO para Backend)

### 🔴 Crítico (Seguridad)
- [ ] **Hashear contraseñas con bcrypt** (actualmente se guardan en texto plano)
- [ ] **Mover JWT_SECRET a .env** (actualmente hardcodeado)
- [ ] **Implementar rate limiting** para prevenir ataques de fuerza bruta
- [ ] **Validar inputs** con librería como `joi` o `zod`

### 🟡 Importante
- [ ] **Usar Knex.js o Prisma** para queries más seguras (evitar SQL injection)
- [ ] **Agregar middleware de autenticación** para rutas protegidas
- [ ] **Implementar refresh tokens** para sesiones más seguras
- [ ] **Agregar logs estructurados** con Winston o Pino

### 🟢 Nice to Have
- [ ] **Documentación con Swagger/OpenAPI**
- [ ] **Tests automatizados** con Jest
- [ ] **Docker Compose** para desarrollo local
- [ ] **CI/CD pipeline** con GitHub Actions

---

## 📡 Ejemplo de Uso de la API

### Login
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@admin","password":"199611Cm."}'
```

### Listar Productos
```bash
curl http://localhost:3000/api/data/products
```

### Crear Reservación
```bash
curl -X POST http://localhost:3000/api/data/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "client_name": "Juan Pérez",
    "client_email": "juan@email.com",
    "client_phone": "3001234567",
    "visit_date": "2026-03-15",
    "group_size": 6,
    "notes": "Cumpleaños"
  }'
```

---

## 🖥️ Despliegue en Raspberry Pi

El backend corre en el Raspberry Pi con PM2:

```bash
# Ver estado
pm2 status

# Reiniciar
pm2 restart sierra-dorada-api

# Ver logs
pm2 logs sierra-dorada-api

# Monitorear
pm2 monit
```

**URL en producción:** `http://192.168.1.5:3000`

---

## 📞 Contacto

Para dudas sobre el backend, contactar al equipo de desarrollo.

---

*Última actualización: Febrero 2026*
