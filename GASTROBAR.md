# Carta digital Sierra Dorada

Implementación sobre `prototipo-sierradoradapage`, base `51c6093f8be1cbfee91f490b715a1c59b3817701`. El e-commerce de cerveza se utilizó como referencia de administración; sus productos, pedidos, pagos y API Java no se modifican.

## Uso

- Carta pública: `/gastrobar/menu`.
- Administración: `/admin/gastrobar`.
- En la sección Gastrobar, “Ver Menú Digital” abre la nueva carta.
- Productos: crear, editar, eliminar, ocultar, marcar agotado, destacar, cambiar categoría y orden; descripción, precio, costo interno y foto opcional.
- Fotos: cargar JPEG/PNG/WebP de hasta 500 KB o pegar una URL HTTPS. Para quitarla, usar “Quitar foto”. Las fotos cargadas se guardan en PostgreSQL y se incluyen en sus copias de seguridad.
- Categorías: crear, renombrar, ordenar, ocultar y eliminar. Una categoría con productos no se puede eliminar hasta mover o eliminar sus productos.
- El cliente puede buscar por nombre o ingrediente, filtrar categorías y alternar vistas con/sin fotos. No se incluyen pedidos, pagos, comandas ni sincronización automática con Toteat.

## Datos importados

73 productos; 51 publicados y 22 ocultos; 13 categorías. Se conserva `Estado` del archivo original. `available` se inicia en verdadero: el archivo no incluye un estado separado de agotado. Se añadieron las cuatro imágenes KISS proporcionadas por el usuario a Muisca, Zipa, Chía y Xuè, junto con sus descripciones actualizadas y fichas de receta internas. Xuè se recibió duplicada y se incluyó una sola vez. Se conservan precios y costos del CSV (los costos no se recalculan con las nuevas recetas). No se inventan favoritos; la columna final sin encabezado se ignora.

Se excluyen de la carta `S1049` (contacto de domicilio), `TOTEATDVYCOST` y `TOTEATDVYERROR` (registros de servicio). `S1043` no trae precio y queda oculto. Se conserva el precio de $25.001 de `S1061`. Los costos 2,166 / 2,708 se interpretan como decimales de acuerdo con el formato del archivo y se señalan para revisión. No se corrigen automáticamente.

Los nombres de categorías se infieren del contenido; son editables. Las cervezas propias `C1000`–`C1002` y `j1000` se agrupan en Cerveza artesanal. Los códigos de extras se guardan como referencia, pero el archivo no contiene sus nombres, precios, reglas de selección ni cantidades de una receta para los demás productos. Para implementar modificadores como en Toteat hace falta esa exportación adicional.

`server/menu/seed.json` y `server/menu/import-report.json` se excluyen de Git porque contienen información interna. El paquete local incluye ambos para instalar esta carta. **No publicar el seed ni los costos en el repositorio público o en el directorio web.**

## Instalación

Requisitos: Node.js 20 o superior y PostgreSQL. Ejecutar desde la raíz del prototipo.

1. Instalar dependencias con `npm ci`.
2. Configurar las variables de `.env.menu.example` en el entorno o en un archivo privado de configuración. No reemplazar a ciegas el `.env` existente. `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` deben apuntar a la base elegida para el gastrobar.
3. Generar un `MENU_JWT_SECRET` aleatorio de al menos 32 caracteres. Configurar `MENU_ADMIN_EMAIL` y una `MENU_ADMIN_PASSWORD` de al menos 12 caracteres para la cuenta de administración. Es una cuenta independiente de los accesos del e-commerce y del prototipo.
4. Preparar la base y la cuenta:

   ```sh
   npm run menu:setup -- --seed --recipes --admin
   ```

   Para un archivo privado separado, Node permite `node --env-file=ruta/al/archivo.env server/menu/setup.js --seed --recipes --admin`. Este comando crea las tablas dentro de una transacción. Al repetir `--seed` no sobrescribe productos existentes; no debe usarse como sincronización continua. Las siguientes ediciones se hacen desde el CRUD. `--recipes` aplica explícitamente las cuatro fichas KISS; vuelve a escribir sus descripciones, imágenes y notas, por lo que solo debe repetirse si se quiere restaurar esas referencias. `--admin` permite crear otra cuenta o cambiar su contraseña desde el entorno del servidor. Retirar `MENU_ADMIN_PASSWORD` del entorno después de usarlo.

5. Iniciar la API dedicada con `npm run menu:server`. Escucha por defecto en `127.0.0.1:3001`; se puede cambiar con `MENU_HOST` y `MENU_PORT`. En contenedores, configurar `MENU_HOST=0.0.0.0` y exponerla solo en la red interna.
6. Para desarrollo, configurar `VITE_API_PROXY_TARGET=http://127.0.0.1:3001`, `VITE_BASE_PATH=/` y ejecutar `npm run dev`. El despliegue bajo la tienda se construye con `VITE_BASE_PATH=/menu/` y `VITE_GASTROBAR_MENU_URL=https://shop.sierradorada.co/menu/gastrobar/menu`. Las variables Vite se fijan al compilar; no contienen secretos.
7. Publicar únicamente `dist/` como frontend. Mantener fallback de las rutas de React hacia `index.html` y proxy de `/api/menu` hacia la API dedicada.

Ejemplo de bloque Nginx para una API en la misma máquina (adaptar el destino si corre en Docker):

```nginx
location ^~ /api/menu {
    client_max_body_size 1m;
    proxy_pass http://127.0.0.1:3001;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
    add_header Cache-Control "no-store" always;
}
location / {
    try_files $uri $uri/ /index.html;
}
```

La configuración del repositorio usa otro destino (`backend:3000`) para su API preexistente. El nuevo router también se monta en `server/index.js` para compatibilidad, pero se incluye la entrada dedicada para publicar solo la carta. El prototipo original contiene accesos y rutas genéricas de datos sin protección suficiente; esos módulos no deben exponerse como parte de un despliegue nuevo del menú. La entrada `menu:server` no los monta. El login de la carta usa scrypt, tokens con audiencia propia y comprobación de cuenta activa en cada operación; el cliente público nunca recibe costos.

El Dockerfile del frontend acepta `--build-arg VITE_BASE_PATH=/menu/ --build-arg VITE_GASTROBAR_MENU_URL=https://shop.sierradorada.co/menu/gastrobar/menu`.

Las imágenes originales de las fichas se sirven desde `public/assets/gastrobar/`; se muestran completas en el detalle del producto. La ficha de receta interna permite editar ingredientes y cantidades como texto; no calcula costos automáticamente. En Chía, Muisca y Zipa la referencia repite 80 g de pan arriba y abajo; se señala esta ambigüedad sin sumarlos. La carta y la administración usan fondo oscuro con acentos dorados.

Para volver a generar la importación desde otra exportación del mismo formato:

```sh
npm run menu:import -- "ruta/PROD.csv.txt"
```

Revisar `server/menu/import-report.json` antes de ejecutar `menu:setup -- --seed`. La importación acepta tabulaciones, campos con comillas y saltos de línea internos; rechaza duplicados, importes y estados inválidos. Categorías nuevas sin correspondencia se crean ocultas para revisión.

## QR fijo para mesas

En Administración → QR de las mesas se puede descargar SVG, PNG o imprimir una tarjeta A5. El SVG es apropiado para imprenta y no pierde nitidez al ampliar. El código contiene únicamente la URL permanente, sin identificadores de producto, fechas, tokens, servicios intermediarios ni vencimiento.

La dirección permanente es **https://shop.sierradorada.co/menu/gastrobar/menu**. Usa el dominio público existente de la tienda y una ruta reservada para la carta. Verificar la dirección desde un celular antes de imprimir las tarjetas definitivas. Si la infraestructura cambia en el futuro, conservar este dominio y esta ruta para no reemplazar los QR de las mesas.

Un QR impreso no puede cambiar su contenido; lo editable es la carta que carga esa dirección. Los cambios se muestran al abrir/recargar la carta, y se actualiza al volver a enfocar la pestaña. No se usa un catálogo de respaldo desactualizado cuando falla la API.

## Verificación realizada

- Compilación Vite de producción.
- ESLint de las nuevas páginas, componente QR y cliente de API.
- `npm run test:menu`: importación y validaciones. Para ejecutar también la integración HTTP sobre PostgreSQL, definir `MENU_TEST_DATABASE_URL` con una base local de pruebas. La suite crea y elimina un esquema aleatorio aislado.
- Integración HTTP: login, tokens inválidos y vencidos, bloqueo sin sesión, revocación de cuenta, limitación de intentos, CRUD, categorías con productos, ocultos/agotados, precios y persistencia; costos ausentes en el endpoint público.
- Navegador: carta a 390 px sin desborde horizontal, búsqueda “chia” → “Chía Burger”, detalle de plato, login administrativo, creación de borrador, edición, publicación y carga de PNG. El producto temporal de prueba se eliminó de la base local.
- QR PNG decodificado automáticamente: coincide exactamente con la dirección permanente indicada.
- TypeScript completo del repositorio conserva errores preexistentes en ContactForm, AuthContext y otros componentes; no se detectaron errores en las nuevas páginas del gastrobar. La compilación Vite sí finaliza.

No se modificó ni publicó el sitio de producción y no se enviaron commits a GitHub.
