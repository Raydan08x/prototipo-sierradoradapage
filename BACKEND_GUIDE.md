# 🍺 Sierra Dorada - Guía de Backend

## Resumen del Stack

| Componente | Tecnología | Versión |
|------------|------------|---------|
| **Contenerización** | Docker + Compose | 20+ |
| **Runtime** | Node.js (Alpine) | v18 |
| **Framework** | Express.js | 5.2.1 |
| **Base de Datos** | PostgreSQL 15 | Alpine |
| **Gestión DB** | pgAdmin 4 | Latest |

---

## 🚀 Despliegue con Docker (Recomendado)

Todo el proyecto está orquestado con Docker. Para iniciar o actualizar:

```bash
cd ~/sierra-dorada
git pull
docker compose up -d --build
```

### Servicios en Docker:

| Servicio | Contenedor | Puerto Host | Descripción |
|----------|------------|-------------|-------------|
| **Frontend** | `sierra-dorada-frontend` | 8880 | React + Nginx |
| **Backend** | `sierra-dorada-backend` | 3000 | Express API |
| **Database** | `sierra-dorada-db` | 5432 | PostgreSQL |
| **pgAdmin** | `sierra-dorada-pgadmin` | 5050 | Panel de Gestión |

---

## 📁 Estructura del Backend (Docker)

```
server/
├── Dockerfile                  # Imagen del Backend
├── index.js                    # Punto de entrada
├── db.js                       # Conexión con reintentos
└── routes/                     # Rutas de la API

database/
└── schema.sql                  # Importado automáticamente por Docker
```

---

## 🔑 Variables de Entorno

El proyecto usa un archivo `.env` (o `.env.docker`) para configurar los contenedores:

```env
# Base de Datos (Interna de Docker)
DB_HOST=db
DB_NAME=sddb
DB_USER=sierra_admin
DB_PASSWORD=199611Cm.

# Seguridad
JWT_SECRET=tu-secreto-seguro
```

---

## 🗄️ Base de Datos (pgAdmin)

Puedes gestionar la base de datos visualmente entrando a:
`http://<IP-DE-TU-PI>:5050`

- **Usuario**: `admin@sierradorada.co`
- **Contraseña**: `199611Cm.`

---

## ⚠️ Mejoras Pendientes (TO-DO)

- [ ] **Hashear contraseñas** (Actual: texto plano)
- [ ] **Optimizar imágenes de Docker** para producción
- [ ] **Configurar backups automáticos** del volumen de Docker

---

## 📞 Soporte

Si algo falla en los contenedores, usa:
`docker compose logs -f`

*Última actualización: Febrero 2026*
