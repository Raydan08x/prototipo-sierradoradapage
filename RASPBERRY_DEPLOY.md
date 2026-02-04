# 🍺 Sierra Dorada - Guía de Despliegue en Raspberry Pi

## Requisitos Previos

| Componente | Versión Mínima |
|------------|----------------|
| Raspberry Pi | 3B+ o superior |
| Raspberry Pi OS | Bullseye (64-bit recomendado) |
| RAM | 2GB mínimo |
| Almacenamiento | 16GB SD (32GB recomendado) |

---

## 🚀 Despliegue Rápido (Automático)

```bash
# En tu Raspberry Pi:
curl -sSL https://raw.githubusercontent.com/Raydan08x/prototipo-sierradoradapage/main/deploy.sh | bash
```

O manualmente:
```bash
git clone https://github.com/Raydan08x/prototipo-sierradoradapage.git /home/pi/sierra-dorada
cd /home/pi/sierra-dorada
chmod +x deploy.sh
./deploy.sh
```

---

## 📝 Configuración Manual Paso a Paso

### 1. Instalar Dependencias del Sistema

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx postgresql postgresql-contrib git curl

# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# PM2 (gestor de procesos)
sudo npm install -g pm2
```

### 2. Configurar PostgreSQL

```bash
# Crear usuario y base de datos
sudo -u postgres psql

# Dentro de psql:
CREATE USER sierra_admin WITH PASSWORD 'TU_PASSWORD_SEGURO';
CREATE DATABASE sierradorada OWNER sierra_admin;
GRANT ALL PRIVILEGES ON DATABASE sierradorada TO sierra_admin;
\q
```

### 3. Configurar la Aplicación

```bash
cd /home/pi/sierra-dorada

# Copiar y editar variables de entorno
cp .env.production.example .env
nano .env
```

Edita el archivo `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sierradorada
DB_USER=sierra_admin
DB_PASSWORD=TU_PASSWORD_SEGURO
NODE_ENV=production
PORT=3003
```

### 4. Construir la Aplicación

```bash
npm ci
npm run build
npm run db:setup
```

### 5. Configurar Nginx

```bash
sudo cp nginx.conf /etc/nginx/sites-available/sierradorada.co
sudo ln -sf /etc/nginx/sites-available/sierradorada.co /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### 6. Iniciar con PM2

```bash
pm2 start ecosystem.config.cjs --env production
pm2 save
pm2 startup
```

---

## ☁️ Configuración de Cloudflare

### DNS
| Tipo | Nombre | Contenido | Proxy |
|------|--------|-----------|-------|
| A | @ | TU_IP_PUBLICA | ✅ Proxied |
| A | www | TU_IP_PUBLICA | ✅ Proxied |

### SSL/TLS
- Modo: **Flexible** (si no tienes certificado local)
- Modo: **Full** (si instalas certificado en la Raspberry)

### Reglas Recomendadas
1. **Always HTTPS**: Activar
2. **Auto Minify**: CSS, JS, HTML
3. **Brotli**: Activar

### Port Forwarding en tu Router
| Puerto Externo | Puerto Interno | Protocolo |
|----------------|----------------|-----------|
| 80 | 80 | TCP |
| 443 | 443 | TCP |

---

## 🔧 Comandos Útiles

```bash
# Ver estado de la aplicación
pm2 status

# Ver logs en tiempo real
pm2 logs sierra-dorada-api

# Reiniciar aplicación
pm2 restart sierra-dorada-api

# Actualizar desde GitHub
cd /home/pi/sierra-dorada
git pull
npm ci
npm run build
pm2 restart sierra-dorada-api

# Ver uso de recursos
pm2 monit
```

---

## 🔒 Seguridad Adicional

```bash
# Firewall básico
sudo apt install ufw
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable

# Fail2ban (protección contra ataques)
sudo apt install fail2ban
sudo systemctl enable fail2ban
```

---

## 📊 Estructura de Archivos en Producción

```
/home/pi/sierra-dorada/
├── dist/                 # Frontend compilado (servido por Nginx)
├── server/               # Backend Express
├── .env                  # Variables de entorno (NO en git)
├── ecosystem.config.cjs  # Configuración PM2
└── nginx.conf            # Plantilla Nginx

/etc/nginx/sites-available/
└── sierradorada.co       # Config Nginx activa

/home/pi/logs/
├── sierra-api-out.log    # Logs de salida
└── sierra-api-error.log  # Logs de errores
```

---

## ✅ Verificación Final

1. Abre `https://www.sierradorada.co` en tu navegador
2. Verifica que Bachu 🐻 responda en el chatbot
3. Prueba el menú del Gastrobar
4. Verifica las reservas por WhatsApp

¡Listo! 🍺 Tu cervecería está en línea.
