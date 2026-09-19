import "dotenv/config";
import express from "express";
import pg from "pg";
import { createMenuRouter } from "./routes.js";
import { menuSecret } from "./security.js";

// Standalone production entrypoint: exposes only the gastrobar API.
menuSecret();
if (!process.env.DB_HOST || !process.env.DB_NAME || !process.env.DB_USER)
  throw new Error("Configura DB_HOST, DB_NAME y DB_USER.");
const db = new pg.Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});
await db.query("SELECT 1 FROM gastrobar_categories LIMIT 1");
const app = express();
app.disable("x-powered-by");
app.set("trust proxy", "loopback");
app.use("/api/menu", createMenuRouter(db));
const server = app.listen(
  Number(process.env.MENU_PORT || 3001),
  process.env.MENU_HOST || "127.0.0.1",
  () => console.log("API de carta del gastrobar disponible."),
);
async function shutdown() {
  server.close(async () => {
    await db.end();
    process.exit(0);
  });
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
