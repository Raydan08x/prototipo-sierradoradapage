import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { randomBytes } from "node:crypto";
import { readFile } from "node:fs/promises";
import express from "express";
import pg from "pg";
import jwt from "jsonwebtoken";
import { createMenuRouter } from "./routes.js";
import { hashPassword } from "./security.js";
import { itemInput } from "./validation.js";
import { importMenu, parseTSV } from "./import.js";

const product = {
  name: "Hamburguesa de prueba",
  description: "Pan y queso",
  price: 25001,
  cost: 9000.123456,
  category_id: "food",
  active: true,
  available: true,
  featured: false,
  image_url: "",
  sort_order: 0,
  extras_codes: "BA.010",
};
test("import preserves prices and states, excludes service records and tolerates quoted descriptions", () => {
  const input =
    ' ID Producto **\tNombre producto *\tDescripción\tPrecio Base\tCosto\tEstado\tJerarquías\tExtras\nS1\tPlato\t"Pan\ty queso\nartesanal"\t25001\t2,166\t1\tAB.010\tBA.010\nS2\tBorrador\t\t\t0\t0\tAB.010\t\nTOTEATDVYCOST\tServicio\t\t10\t2\t1\t\t\n';
  const { seed, report } = importMenu(input);
  assert.equal(seed.items.length, 2);
  assert.equal(seed.items[0].price, 25001);
  assert.equal(seed.items[0].cost, 2.166);
  assert.equal(seed.items[1].active, false);
  assert.equal(seed.items[1].price, null);
  assert.equal(report.excluded.length, 1);
  assert.equal(seed.items[0].description, "Pan\ty queso\nartesanal");
  assert.throws(() => parseTSV('"unfinished'));
  assert.throws(() =>
    importMenu(input + "S1\tDuplicate\t\t1\t1\t1\tAB.010\t\n"),
  );
});
test("validation rejects invalid publication, coercion and unsafe images", () => {
  assert.equal(itemInput(product).price, 25001);
  assert.equal(
    itemInput({
      ...product,
      image_url: "/assets/gastrobar/muisca.png",
      recipe_notes: "Carne: 150 g.",
    }).recipe_notes,
    "Carne: 150 g.",
  );
  for (const change of [
    { price: -1 },
    { price: null },
    { price: "100" },
    { price: true },
    { price: Infinity },
    { active: "false" },
    { sort_order: 1.2 },
    { image_url: "javascript:alert(1)" },
    { image_url: "/assets/../secret.png" },
    { image_url: "data:image/svg+xml,<svg/>" },
    { image_url: "data:image/png;base64,YWJj" },
  ])
    assert.throws(() => itemInput({ ...product, ...change }));
  assert.equal(
    itemInput({ ...product, active: false, price: null }).price,
    null,
  );
});

test(
  "HTTP API: auth, public privacy, CRUD, categories and persistence",
  { skip: !process.env.MENU_TEST_DATABASE_URL },
  async (t) => {
    const connectionString = process.env.MENU_TEST_DATABASE_URL;
    const hostname = new URL(connectionString).hostname;
    assert.ok(
      ["127.0.0.1", "localhost"].includes(hostname),
      "Use an isolated local test database.",
    );
    const schema = `menu_test_${randomBytes(8).toString("hex")}`;
    const root = new pg.Pool({ connectionString });
    await root.query(`CREATE SCHEMA ${schema}`);
    const db = new pg.Pool({
      connectionString,
      options: `-c search_path=${schema}`,
    });
    let server;
    t.after(async () => {
      if (server) await new Promise((resolve) => server.close(resolve));
      await db.end();
      await root.query(`DROP SCHEMA ${schema} CASCADE`);
      await root.end();
    });
    await db.query(
      await readFile(
        new URL("../../database/gastrobar.sql", import.meta.url),
        "utf8",
      ),
    );
    process.env.MENU_JWT_SECRET = randomBytes(32).toString("hex");
    await db.query(
      "INSERT INTO gastrobar_admins (email, password_hash) VALUES ($1,$2)",
      ["test@example.test", hashPassword("test-password-12345")],
    );
    const app = express();
    app.use("/api/menu", createMenuRouter(db));
    server = app.listen(0, "127.0.0.1");
    await once(server, "listening");
    const base = `http://127.0.0.1:${server.address().port}/api/menu`;
    const request = (path = "", method = "GET", value, token) =>
      fetch(base + path, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        ...(value ? { body: JSON.stringify(value) } : {}),
      });
    assert.equal((await request("/admin")).status, 401);
    assert.equal((await request("/admin/items", "POST", product)).status, 401);
    assert.equal(
      (
        await request("/session", "POST", {
          email: "test@example.test",
          password: "wrong",
        })
      ).status,
      401,
    );
    const login = await request("/session", "POST", {
      email: "test@example.test",
      password: "test-password-12345",
    });
    assert.equal(login.status, 200);
    const { token } = await login.json();
    const wrongAudience = jwt.sign(
      { email: "test@example.test" },
      process.env.MENU_JWT_SECRET,
      { audience: "other-app" },
    );
    assert.equal(
      (await request("/admin", "GET", null, wrongAudience)).status,
      401,
    );
    const expired = jwt.sign(
      { email: "test@example.test" },
      process.env.MENU_JWT_SECRET,
      {
        audience: "gastrobar-admin",
        issuer: "sierra-dorada-menu",
        expiresIn: -1,
      },
    );
    assert.equal((await request("/admin", "GET", null, expired)).status, 401);
    const catResponse = await request(
      "/admin/categories",
      "POST",
      { name: "Comida", active: true, sort_order: 0 },
      token,
    );
    assert.equal(catResponse.status, 201);
    const category = await catResponse.json();
    const create = await request(
      "/admin/items",
      "POST",
      { ...product, category_id: category.id },
      token,
    );
    assert.equal(create.status, 201);
    const item = await create.json();
    let menu = await (await request()).json();
    assert.equal(menu.items.length, 1);
    assert.equal(menu.items[0].price, 25001);
    for (const key of [
      "cost",
      "extras_codes",
      "source_category",
      "recipe_notes",
      "password_hash",
    ])
      assert.equal(Object.hasOwn(menu.items[0], key), false);
    assert.equal(
      (
        await request(
          "/admin/items/" + item.id,
          "PUT",
          { ...item, price: -3 },
          token,
        )
      ).status,
      400,
    );
    assert.equal(
      (await request("/admin/categories/" + category.id, "DELETE", null, token))
        .status,
      409,
    );
    assert.equal(
      (
        await request(
          "/admin/items/" + item.id,
          "PUT",
          { ...item, available: false },
          token,
        )
      ).status,
      200,
    );
    menu = await (await request()).json();
    assert.equal(menu.items[0].available, false);
    await request(
      "/admin/categories/" + category.id,
      "PUT",
      { ...category, active: false },
      token,
    );
    menu = await (await request()).json();
    assert.equal(menu.items.length, 0);
    assert.equal(menu.categories.length, 0);
    await request("/admin/categories/" + category.id, "PUT", category, token);
    await request(
      "/admin/items/" + item.id,
      "PUT",
      { ...item, active: false, price: null },
      token,
    );
    menu = await (await request()).json();
    assert.equal(menu.items.length, 0);
    assert.equal(
      (
        await db.query("SELECT price FROM gastrobar_items WHERE id = $1", [
          item.id,
        ])
      ).rows[0].price,
      null,
    );
    const privateData = await (
      await request("/admin", "GET", null, token)
    ).json();
    assert.equal(privateData.items[0].cost, 9000.123456);
    assert.equal(
      (await request("/admin/items/" + item.id, "DELETE", null, token)).status,
      204,
    );
    assert.equal(
      (await request("/admin/items/" + item.id, "DELETE", null, token)).status,
      404,
    );
    assert.equal(
      (await request("/admin/categories/" + category.id, "DELETE", null, token))
        .status,
      204,
    );
    await db.query("UPDATE gastrobar_admins SET active = FALSE");
    assert.equal((await request("/admin", "GET", null, token)).status, 403);
    // The same application keeps a bounded login throttle, including wrong accounts.
    for (let i = 0; i < 8; i++)
      await request("/session", "POST", {
        email: "missing@example.test",
        password: "wrong",
      });
    assert.equal(
      (
        await request("/session", "POST", {
          email: "missing@example.test",
          password: "wrong",
        })
      ).status,
      429,
    );
  },
);
