# 🗄️ Configuración de PostgreSQL en Raspberry Pi 5

## Guía Completa: Base de datos + Cloudflare + Dominio

---

## 1️⃣ Instalar PostgreSQL en Raspberry Pi

```bash
# Conectar al Raspberry Pi
ssh sdpi@192.168.1.5

# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Verificar instalación
sudo systemctl status postgresql
```

---

## 2️⃣ Configurar PostgreSQL

### Crear usuario y base de datos

```bash
# Acceder como usuario postgres
sudo -u postgres psql

# Dentro de psql:
CREATE USER sierra_admin WITH PASSWORD 'TuContraseñaSegura123!';
CREATE DATABASE "SDDB" OWNER sierra_admin;
GRANT ALL PRIVILEGES ON DATABASE "SDDB" TO sierra_admin;
\q
```

### Importar el esquema

```bash
# Desde el directorio del proyecto en la Pi
cd ~/sierra-dorada
sudo -u postgres psql -d SDDB -f database/schema.sql
```

---

## 3️⃣ Configurar acceso remoto (opcional, para desarrollo)

```bash
# Editar postgresql.conf
sudo nano /etc/postgresql/15/main/postgresql.conf
# Cambiar: listen_addresses = '*'

# Editar pg_hba.conf para permitir conexiones
sudo nano /etc/postgresql/15/main/pg_hba.conf
# Agregar línea:
# host    SDDB    sierra_admin    192.168.1.0/24    scram-sha-256

# Reiniciar PostgreSQL
sudo systemctl restart postgresql
```

---

## 4️⃣ Variables de Entorno en Raspberry Pi

Crear archivo `.env` en el proyecto:

```bash
cd ~/sierra-dorada
nano .env
```

Contenido del `.env`:

```env
# Base de Datos (PostgreSQL local en la Pi)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=SDDB
DB_USER=sierra_admin
DB_PASSWORD=TuContraseñaSegura123!

# Servidor
NODE_ENV=production
PORT=3000

# JWT Secret (genera uno seguro)
JWT_SECRET=tu-jwt-secret-super-seguro-cambiar-en-produccion

# URLs de producción
API_URL=https://www.sierradorada.co/api
FRONTEND_URL=https://www.sierradorada.co
```

---

## 5️⃣ Configurar Cloudflare Tunnel

### Instalar Cloudflared

```bash
# Descargar e instalar cloudflared
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64.deb
sudo dpkg -i cloudflared.deb

# Autenticar con Cloudflare
cloudflared tunnel login
```

### Crear Tunnel

```bash
# Crear el tunnel
cloudflared tunnel create sierra-dorada

# Configurar el tunnel
mkdir -p ~/.cloudflared
nano ~/.cloudflared/config.yml
```

Contenido de `config.yml`:

```yaml
tunnel: <TUNNEL_ID>
credentials-file: /home/sdpi/.cloudflared/<TUNNEL_ID>.json

ingress:
  # API Backend
  - hostname: api.sierradorada.co
    service: http://localhost:3000
  
  # Frontend
  - hostname: www.sierradorada.co
    service: http://localhost:8880
  
  - hostname: sierradorada.co
    service: http://localhost:8880
  
  # Fallback
  - service: http_status:404
```

### Ejecutar como servicio

```bash
# Instalar como servicio
sudo cloudflared service install

# Iniciar
sudo systemctl start cloudflared
sudo systemctl enable cloudflared
```

---

## 6️⃣ Configurar DNS en Cloudflare

En el dashboard de Cloudflare:

1. Ve a **DNS** → **Records**
2. Agrega registros CNAME:

| Tipo | Nombre | Contenido | Proxy |
|------|--------|-----------|-------|
| CNAME | www | `<TUNNEL_ID>.cfargotunnel.com` | ✅ |
| CNAME | @ | `<TUNNEL_ID>.cfargotunnel.com` | ✅ |
| CNAME | api | `<TUNNEL_ID>.cfargotunnel.com` | ✅ |

---

## 7️⃣ Configurar Dominio en Hostinger

1. **Ir a Hostinger** → Dashboard → Dominios
2. **Cambiar Nameservers** a Cloudflare:
   - `ns1.cloudflare.com`
   - `ns2.cloudflare.com`
3. **Esperar propagación** (puede tardar hasta 48h)

---

## 8️⃣ Verificar la Configuración

```bash
# Probar conexión a PostgreSQL
psql -h localhost -U sierra_admin -d SDDB

# Probar el servidor
curl http://localhost:3000

# Ver estado del tunnel
cloudflared tunnel info sierra-dorada

# Ver logs de la aplicación
pm2 logs sierra-dorada-api
```

---

## 9️⃣ Comandos Útiles

```bash
# PostgreSQL
sudo systemctl status postgresql
sudo systemctl restart postgresql

# Cloudflare Tunnel
sudo systemctl status cloudflared
cloudflared tunnel list

# PM2 (Aplicación)
pm2 status
pm2 restart sierra-dorada-api
pm2 logs

# Ver conexiones activas a la BD
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity WHERE datname='SDDB';"
```

---

## 🔒 Seguridad Recomendada

1. **Firewall UFW**:
```bash
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

2. **NO exponer PostgreSQL a internet** (puerto 5432 cerrado)

3. **Usar contraseñas fuertes** para:
   - Usuario de la Pi
   - PostgreSQL
   - JWT Secret

4. **Backups automáticos**:
```bash
# Crear backup
pg_dump -U sierra_admin SDDB > backup_$(date +%Y%m%d).sql

# Restaurar backup
psql -U sierra_admin -d SDDB < backup.sql
```

---

## 📊 Arquitectura Final

```
Internet
    │
    ▼
┌─────────────────┐
│   Cloudflare    │ ← www.sierradorada.co
│   (DNS + CDN)   │
└────────┬────────┘
         │
    Tunnel (seguro)
         │
         ▼
┌─────────────────────────────────────┐
│        Raspberry Pi 5               │
│  ┌─────────────┐  ┌──────────────┐  │
│  │   Nginx     │  │  PostgreSQL  │  │
│  │  (8880)     │  │    (5432)    │  │
│  │  Frontend   │  │     SDDB     │  │
│  └─────┬───────┘  └──────┬───────┘  │
│        │                 │          │
│        └────────┬────────┘          │
│                 ▼                   │
│        ┌───────────────┐            │
│        │  Express.js   │            │
│        │   (3000)      │            │
│        │    PM2        │            │
│        └───────────────┘            │
└─────────────────────────────────────┘
```

---

*Última actualización: Febrero 2026*
