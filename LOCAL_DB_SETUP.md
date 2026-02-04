# Configuración de Base de Datos Local (SDDB)

Esta guía te ayudará a crear la base de datos "SDDB" (Sierra Dorada Data Base) en tu entorno local usando **pgAdmin** y PostgreSQL, tal como lo solicitaste.

## Requisitos Previos
Asegúrate de tener instalados:
1.  **PostgreSQL** (El motor de base de datos).
2.  **pgAdmin 4** (La interfaz gráfica de administración).

## Paso 1: Crear la Base de Datos

1.  Abre **pgAdmin 4**.
2.  En el panel izquierdo ("Browser"), haz clic derecho en **Servers** > **Databases**.
3.  Selecciona **Create** > **Database...**.
4.  En la ventana que aparece:
    *   **Database**: Escribe `SDDB`
    *   **Owner**: Deja el valor por defecto (usualmente `postgres`).
5.  Haz clic en **Save**.

## Paso 2: Crear la Estructura (Tablas)

1.  En el panel izquierdo, busca la nueva base de datos `SDDB` y haz clic derecho sobre ella.
2.  Selecciona **Query Tool**.
3.  Se abrirá un editor de texto a la derecha.
4.  Abre el archivo `database/schema.sql` que he creado en tu proyecto.
5.  Copia todo el contenido de `schema.sql`.
6.  Pégalo en el **Query Tool** de pgAdmin.
7.  Haz clic en el botón de "Play" (Execute/Refresh) o presiona `F5`.

¡Listo! Tu base de datos local `SDDB` ha sido creada con las tablas necesarias y los usuarios administradores insertados.

## Nota Importante sobre la Aplicación

Actualmente, la página web (`prototipo-sierradoradapage`) está configurada para funcionar con la nube de **Supabase**.

Si deseas que la aplicación web se conecte a esta base de datos local `SDDB`, se requeriría crear un **Servidor Backend (API)** intermedio (por ejemplo, con Node.js y Express) que gestione la conexión, ya que los navegadores web no pueden conectarse de forma segura ni directa a una base de datos PostgreSQL local.

Por ahora, esta base de datos `SDDB` servirá como tu respaldo local de la estructura y datos.
