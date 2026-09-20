import "dotenv/config";
import pg from "pg";
import { readFile } from "node:fs/promises";
import { hashPassword, menuSecret } from "./security.js";

// Explicitly configured database only; no built-in production credentials.
if (!process.env.DB_HOST || !process.env.DB_NAME || !process.env.DB_USER)
  throw new Error("Configura DB_HOST, DB_NAME y DB_USER.");
const pool = new pg.Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});
const client = await pool.connect();
try {
  await client.query("BEGIN");
  await client.query(
    await readFile(
      new URL("../../database/gastrobar.sql", import.meta.url),
      "utf8",
    ),
  );
  if (process.argv.includes("--seed")) {
    const seed = JSON.parse(
      await readFile(new URL("./seed.json", import.meta.url), "utf8"),
    );
    for (const category of seed.categories) {
      await client.query(
        "INSERT INTO gastrobar_categories (id, name, sort_order, active) VALUES ($1,$2,$3,$4) ON CONFLICT (id) DO NOTHING",
        [category.id, category.name, category.sort_order, category.active],
      );
    }
    for (const item of seed.items) {
      const keys = Object.keys(item);
      await client.query(
        `INSERT INTO gastrobar_items (${keys.join(",")}) VALUES (${keys.map((_, i) => `$${i + 1}`).join(",")}) ON CONFLICT (id) DO NOTHING`,
        Object.values(item),
      );
    }
    console.log(
      `Importación inicial: ${seed.items.length} productos; no se sobrescriben registros existentes.`,
    );
  }
  if (process.argv.includes("--recipes")) {
    const updates = JSON.parse(await readFile(new URL('./recipe-updates.json', import.meta.url), 'utf8'));
    for (const item of updates) {
      const result = await client.query('UPDATE gastrobar_items SET description = $1, recipe_notes = $2, image_url = $3, updated_at = NOW() WHERE id = $4 RETURNING id', [item.description, item.recipe_notes, item.image_url, item.id]);
      if (!result.rows.length) throw new Error(`Importa primero el producto ${item.id} para aplicar su receta.`);
    }
    console.log('Cuatro recetas e imágenes actualizadas; se conservan precios y estados.');
  }
  if (process.argv.includes("--admin")) {
    menuSecret();
    const email = process.env.MENU_ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.MENU_ADMIN_PASSWORD;
    if (
      !email ||
      !email.includes("@") ||
      !password ||
      password.length < 12 ||
      password.length > 256
    )
      throw new Error(
        "Configura MENU_ADMIN_EMAIL y MENU_ADMIN_PASSWORD (12–256 caracteres).",
      );
    await client.query(
      "INSERT INTO gastrobar_admins (email, password_hash) VALUES ($1,$2) ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, active = TRUE",
      [email, hashPassword(password)],
    );
    console.log(
      "Administrador del menú configurado. Retira MENU_ADMIN_PASSWORD del entorno tras este paso.",
    );
  }
  await client.query("COMMIT");
  console.log("Base de datos del gastrobar preparada.");
} catch (error) {
  await client.query("ROLLBACK");
  console.error(error.message);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}
