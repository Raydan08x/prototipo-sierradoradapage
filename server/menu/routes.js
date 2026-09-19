import express from "express";
import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import { checkPassword, hashPassword, menuSecret } from "./security.js";
import { InputError, itemInput, categoryInput } from "./validation.js";

const wrap = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
const normalize = (row) => ({
  ...row,
  ...(Object.hasOwn(row, "price")
    ? { price: row.price === null ? null : Number(row.price) }
    : {}),
  ...(Object.hasOwn(row, "cost")
    ? { cost: row.cost === null ? null : Number(row.cost) }
    : {}),
});

export function createMenuRouter(db) {
  const router = express.Router();
  const attempts = new Map();
  const dummyHash = hashPassword(randomUUID());
  router.use(express.json({ limit: "1mb" }));
  router.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  });

  router.get(
    "/",
    wrap(async (req, res) => {
      const categories = await db.query(
        "SELECT id, name, sort_order FROM gastrobar_categories WHERE active = TRUE ORDER BY sort_order, name",
      );
      const items =
        await db.query(`SELECT i.id, i.name, i.description, i.price, i.category_id, i.available, i.featured, i.image_url, i.sort_order
      FROM gastrobar_items i JOIN gastrobar_categories c ON c.id = i.category_id
      WHERE i.active = TRUE AND c.active = TRUE AND i.price IS NOT NULL ORDER BY i.sort_order, i.name`);
      res.json({
        categories: categories.rows,
        items: items.rows.map(normalize),
      });
    }),
  );

  router.post(
    "/session",
    wrap(async (req, res) => {
      const now = Date.now();
      for (const [ip, attempt] of attempts)
        if (attempt.until < now) attempts.delete(ip);
      const key = req.ip;
      const attempt = attempts.get(key) || {
        count: 0,
        until: now + 15 * 60 * 1000,
      };
      if (attempt.count >= 8 || attempts.size > 10000)
        return res
          .status(429)
          .json({ error: "Demasiados intentos. Intenta en 15 minutos." });
      attempt.count++;
      attempts.set(key, attempt);
      const { email, password } = req.body || {};
      if (
        typeof email !== "string" ||
        email.length > 254 ||
        typeof password !== "string" ||
        password.length > 256
      )
        return res.status(400).json({ error: "Credenciales inválidas." });
      const secret = menuSecret();
      const result = await db.query(
        "SELECT email, password_hash FROM gastrobar_admins WHERE email = $1 AND active = TRUE",
        [email.trim().toLowerCase()],
      );
      const admin = result.rows[0];
      const valid = checkPassword(password, admin?.password_hash || dummyHash);
      if (!admin || !valid)
        return res
          .status(401)
          .json({ error: "Correo o contraseña incorrectos." });
      attempts.delete(key);
      const token = jwt.sign({ email: admin.email }, secret, {
        audience: "gastrobar-admin",
        issuer: "sierra-dorada-menu",
        expiresIn: "8h",
      });
      res.json({ token });
    }),
  );

  router.use(
    "/admin",
    wrap(async (req, res, next) => {
      let decoded;
      try {
        const token = req.headers.authorization?.replace(/^Bearer /, "");
        decoded = jwt.verify(token || "", menuSecret(), {
          algorithms: ["HS256"],
          audience: "gastrobar-admin",
          issuer: "sierra-dorada-menu",
        });
      } catch {
        return res
          .status(401)
          .json({ error: "Inicia sesión para administrar la carta." });
      }
      const result = await db.query(
        "SELECT email FROM gastrobar_admins WHERE email = $1 AND active = TRUE",
        [decoded.email],
      );
      if (!result.rows.length)
        return res.status(403).json({ error: "Acceso no autorizado." });
      next();
    }),
  );

  router.get(
    "/admin",
    wrap(async (req, res) => {
      const categories = await db.query(
        "SELECT * FROM gastrobar_categories ORDER BY sort_order, name",
      );
      const items = await db.query(
        "SELECT * FROM gastrobar_items ORDER BY sort_order, name",
      );
      res.json({
        categories: categories.rows,
        items: items.rows.map(normalize),
      });
    }),
  );

  for (const [resource, table, validate] of [
    ["items", "gastrobar_items", itemInput],
    ["categories", "gastrobar_categories", categoryInput],
  ]) {
    router.post(
      `/admin/${resource}`,
      wrap(async (req, res) => {
        const value = validate(req.body);
        const keys = Object.keys(value);
        const result = await db.query(
          `INSERT INTO ${table} (id, ${keys.join(",")}) VALUES ($1, ${keys.map((_, i) => `$${i + 2}`).join(",")}) RETURNING *`,
          [randomUUID(), ...Object.values(value)],
        );
        res.status(201).json(normalize(result.rows[0]));
      }),
    );
    router.put(
      `/admin/${resource}/:id`,
      wrap(async (req, res) => {
        const value = validate(req.body);
        const keys = Object.keys(value);
        const result = await db.query(
          `UPDATE ${table} SET ${keys.map((key, i) => `${key} = $${i + 1}`).join(",")} ${resource === "items" ? ", updated_at = NOW()" : ""} WHERE id = $${keys.length + 1} RETURNING *`,
          [...Object.values(value), req.params.id],
        );
        if (!result.rows.length)
          return res
            .status(404)
            .json({ error: "El registro ya no existe. Actualiza la lista." });
        res.json(normalize(result.rows[0]));
      }),
    );
    router.delete(
      `/admin/${resource}/:id`,
      wrap(async (req, res) => {
        const result = await db.query(
          `DELETE FROM ${table} WHERE id = $1 RETURNING id`,
          [req.params.id],
        );
        if (!result.rows.length)
          return res.status(404).json({ error: "El registro ya no existe." });
        res.status(204).end();
      }),
    );
  }
  router.use((err, req, res, _next) => {
    if (err instanceof InputError)
      return res.status(400).json({ error: err.message });
    if (err.code === "23503")
      return res
        .status(409)
        .json({
          error:
            "La categoría no existe o todavía contiene productos. Mueve sus productos antes de eliminarla.",
        });
    if (err.type === "entity.too.large")
      return res.status(413).json({ error: "La foto es demasiado grande." });
    if (err.type === "entity.parse.failed")
      return res.status(400).json({ error: "Formato JSON inválido." });
    console.error("Menu API:", err.message);
    res
      .status(503)
      .json({
        error: "No se pudo acceder al menú. Intenta de nuevo en un momento.",
      });
  });
  return router;
}
