import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

// Export is tab-separated despite its .csv.txt extension. Supports quoted fields,
// embedded newlines and doubled quotes without interpreting document text as code.
export function parseTSV(input) {
  const rows = [];
  let row = [],
    field = "",
    quoted = false;
  const source = input.replace(/^\uFEFF/, "");
  for (let i = 0; i < source.length; i++) {
    const char = source[i];
    if (char === '"') {
      if (quoted && source[i + 1] === '"') {
        field += '"';
        i++;
      } else if (quoted || field === "") quoted = !quoted;
      else field += char;
    } else if (!quoted && (char === "\t" || char === "\n" || char === "\r")) {
      row.push(field);
      field = "";
      if (char !== "\t") {
        if (row.some(Boolean)) rows.push(row);
        row = [];
        if (char === "\r" && source[i + 1] === "\n") i++;
      }
    } else field += char;
  }
  if (quoted) throw new Error("Hay un campo entre comillas sin cerrar.");
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}
const labels = {
  craft: "Cerveza artesanal",
  "AB.010": "Hamburguesas",
  "AB.020": "Picadas",
  "AB.030": "Salchipapas",
  "AB.040": "Sándwiches",
  "AB.050": "Para compartir",
  "AB.060": "Alitas",
  "AB.070": "Cócteles",
  "AB.080": "Sin alcohol",
  "AB.090": "Para brindar",
  "AB.100": "Licores",
  "AB.110001": "Cervezas nacionales",
  "AB.110002": "Cervezas importadas",
};
export function importMenu(input) {
  const [header, ...rows] = parseTSV(input);
  if (
    !header ||
    !header[0].includes("ID Producto") ||
    !header[1].includes("Nombre producto") ||
    header[3] !== "Precio Base"
  )
    throw new Error(
      "Formato inesperado: usa la exportación de productos Toteat separada por tabulaciones.",
    );
  const items = [],
    excluded = [],
    warnings = [],
    ids = new Set();
  const categories = Object.entries(labels).map(([id, name], index) => ({
    id,
    name,
    sort_order: index * 10,
    active: true,
  }));
  for (const [index, row] of rows.entries()) {
    const [
      id,
      name,
      description,
      priceText,
      costText,
      state,
      sourceCategory,
      extras,
    ] = row;
    if (
      row.length < 8 ||
      !id ||
      !name ||
      ids.has(id) ||
      !["0", "1"].includes(state)
    )
      throw new Error(
        `Fila ${index + 2}: registro inválido o código duplicado.`,
      );
    ids.add(id);
    if (["S1049", "TOTEATDVYCOST", "TOTEATDVYERROR"].includes(id)) {
      excluded.push({ id, name });
      continue;
    }
    const numeric = (raw, field) => {
      if (!raw.trim()) return null;
      if (!/^\d+(?:[.,]\d+)?$/.test(raw.trim()))
        throw new Error(`Fila ${index + 2}: ${field} inválido.`);
      const value = Number(raw.replace(",", "."));
      if (!Number.isFinite(value) || value > 999999999)
        throw new Error(`Fila ${index + 2}: ${field} fuera de rango.`);
      return value;
    };
    const price = numeric(priceText, "precio"),
      cost = numeric(costText, "costo");
    const category = /^(C100[0-2]|j1000)$/.test(id)
      ? "craft"
      : sourceCategory || "uncategorized";
    if (!categories.some((c) => c.id === category)) {
      categories.push({
        id: category,
        name: `Revisar categoría ${category}`,
        sort_order: categories.length * 10,
        active: false,
      });
      warnings.push(
        `${id}: categoría sin nombre en el archivo; creada oculta para revisión.`,
      );
    }
    if (price === null)
      warnings.push(`${id}: precio vacío; se importa oculto.`);
    if (cost !== null && cost > 0 && cost < 100)
      warnings.push(
        `${id}: costo ${cost}; revisar el separador decimal en el origen.`,
      );
    if (price !== null && price % 100 !== 0)
      warnings.push(`${id}: precio ${price}; conservado sin redondear.`);
    items.push({
      id,
      name,
      description,
      price,
      cost,
      category_id: category,
      active: state === "1" && price !== null,
      available: true,
      featured: false,
      image_url: "",
      sort_order: index * 10,
      extras_codes: extras,
      source_category: sourceCategory,
    });
  }
  return {
    seed: { categories, items },
    report: {
      total: items.length,
      published: items.filter((i) => i.active).length,
      hidden: items.filter((i) => !i.active).length,
      excluded,
      warnings,
      notes: [
        "Los nombres de categorías se infieren de los productos y son editables.",
        "Los códigos de extras se conservan como referencia; no hay nombres, precios ni reglas de selección en el archivo.",
        "No se interpreta la última columna sin encabezado como un indicador de foto o destacado.",
      ],
    },
  };
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  if (!process.argv[2])
    throw new Error('Uso: npm run menu:import -- "ruta/al/archivo.csv.txt"');
  const { seed, report } = importMenu(await readFile(process.argv[2], "utf8"));
  await writeFile(
    new URL("./seed.json", import.meta.url),
    JSON.stringify(seed, null, 2) + "\n",
  );
  await writeFile(
    new URL("./import-report.json", import.meta.url),
    JSON.stringify(report, null, 2) + "\n",
  );
  console.log(JSON.stringify(report, null, 2));
}
