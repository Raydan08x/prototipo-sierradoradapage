export class InputError extends Error {}
const fail = (message) => {
  throw new InputError(message);
};
const text = (value, max, label, required = false) => {
  if (
    typeof value !== "string" ||
    value.length > max ||
    (required && !value.trim())
  )
    fail(`${label}: valor inválido.`);
  return value.trim();
};
const bool = (value, label) =>
  typeof value === "boolean"
    ? value
    : fail(`${label}: debe ser verdadero o falso.`);
const money = (value, label, optional = false) => {
  if (optional && value === null) return null;
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < 0 ||
    value > 999999999
  )
    fail(`${label}: importe inválido.`);
  return value;
};
const order = (value) =>
  Number.isInteger(value) && value >= 0 && value <= 100000
    ? value
    : fail("Orden inválido.");
export function imageUrl(value) {
  const url = text(value, 700000, "Foto");
  if (!url) return "";
  if (/^\/assets\/gastrobar\/[a-z0-9_-]+\.(png|jpg|jpeg|webp)$/.test(url)) return url;
  if (/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(url)) {
    const bytes = Buffer.from(url.split(",")[1], "base64");
    const valid = url.startsWith("data:image/png;")
      ? bytes
          .subarray(0, 8)
          .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
      : url.startsWith("data:image/jpeg;")
        ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
        : bytes.toString("ascii", 0, 4) === "RIFF" &&
          bytes.toString("ascii", 8, 12) === "WEBP";
    if (valid) return url;
  } else {
    try {
      const parsed = new URL(url);
      if (
        parsed.protocol === "https:" &&
        !parsed.username &&
        !parsed.password &&
        url.length <= 2048
      )
        return url;
    } catch {
      /* invalid URL */
    }
  }
  fail("Usa una URL HTTPS o una foto PNG, JPEG o WebP de hasta 500 KB.");
}
export function categoryInput(body) {
  if (!body || typeof body !== "object" || Array.isArray(body))
    fail("Registro inválido.");
  return {
    name: text(body.name, 80, "Nombre", true),
    sort_order: order(body.sort_order),
    active: bool(body.active, "Visible"),
  };
}
export function itemInput(body) {
  if (!body || typeof body !== "object" || Array.isArray(body))
    fail("Registro inválido.");
  const value = {
    name: text(body.name, 150, "Nombre", true),
    description: text(body.description, 4000, "Descripción"),
    price: money(body.price, "Precio", true),
    cost: money(body.cost, "Costo", true),
    category_id: text(body.category_id, 80, "Categoría", true),
    active: bool(body.active, "Publicado"),
    available: bool(body.available, "Disponible"),
    featured: bool(body.featured, "Destacado"),
    image_url: imageUrl(body.image_url),
    sort_order: order(body.sort_order),
    extras_codes: text(body.extras_codes, 500, "Códigos de extras"),
    recipe_notes: text(body.recipe_notes ?? "", 8000, "Ficha de receta"),
  };
  if (value.active && value.price === null)
    fail("Agrega un precio antes de publicar el producto.");
  return value;
}
