# 🍺 Sierra Dorada - Instalación en Raspberry Pi 5

Guía paso a paso para desplegar la aplicación en tu Raspberry Pi.

## 🔑 Credenciales
**Usuario:** `sdpi`
**IP:** `192.168.1.5`

## 1. Conexión SSH

Abre tu terminal (PowerShell o CMD) y conéctate a la Raspberry:

```powershell
ssh sdpi@192.168.1.5
```
*(Cuando te pida la contraseña, escribe `199611cm` y presiona Enter)*

## 2. Instalación Automática

Una vez dentro de la Raspberry, copia y pega este comando para instalar todo automáticamente:

```bash
curl -sSL https://raw.githubusercontent.com/Raydan08x/prototipo-sierradoradapage/main/deploy.sh | bash
```

Este script se encargará de:
- Instalar Node.js, Nginx, PostgreSQL y Git.
- Clonar el proyecto.
- Configurar el servidor web.
- Iniciar la aplicación.

## 3. Configuración Post-Instalación

El script te pedirá que edites el archivo `.env` al finalizar. Hazlo con este comando:

```bash
nano /home/sdpi/sierra-dorada/.env
```

Asegúrate de configurar los datos de la base de datos (según lo que creaste en PostgreSQL).

## 📊 Comandos Útiles

- **Ver logs**: `pm2 logs sierra-dorada-api`
- **Ver estado**: `pm2 status`
- **Reiniciar todo**: `pm2 restart all`

## 🐛 Solución de Problemas

Si algo falla, verifica los logs de error:
```bash
cat /home/sdpi/logs/sierra-api-error.log
```
