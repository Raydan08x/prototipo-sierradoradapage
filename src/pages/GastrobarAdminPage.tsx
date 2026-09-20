import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Download,
  LogOut,
  Plus,
  Search,
  X,
  Pencil,
  Trash2,
  QrCode,
  Printer,
  ImagePlus,
} from "lucide-react";
import QRCode from "qrcode";
import toast from "react-hot-toast";
import {
  MenuCategory,
  MenuData,
  MenuItem,
  menuRequest,
  menuToken,
  money,
  normalizeSearch,
  permanentMenuUrl,
  menuImageSource,
} from "../lib/menu";
import "../styles/gastrobar-menu.css";
import "../styles/gastrobar-admin.css";

type Draft = Omit<MenuItem, "id"> & { id?: string };
type CategoryDraft = Omit<MenuCategory, "id"> & { id?: string };
const errorText = (e: unknown) =>
  e instanceof Error ? e.message : "No se pudo completar la operación.";
const saveBlob = (blob: Blob, filename: string) => {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
};
const loadCanvasImage = (source: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("No se pudo preparar la imagen."));
    image.src = source;
  });
const canvasBlob = (canvas: HTMLCanvasElement) =>
  new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("No se pudo crear el PNG.")),
      "image/png",
    ),
  );
const drawSpacedText = (
  context: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  y: number,
  spacing: number,
) => {
  const widths = [...text].map((character) => context.measureText(character).width);
  const total = widths.reduce((sum, width) => sum + width, 0) +
    spacing * Math.max(0, text.length - 1);
  let x = centerX - total / 2;
  [...text].forEach((character, index) => {
    context.fillText(character, x, y);
    x += widths[index] + spacing;
  });
};
const newItem = (category: string): Draft => ({
  name: "",
  description: "",
  price: null,
  cost: null,
  category_id: category,
  active: false,
  available: true,
  featured: false,
  image_url: "",
  sort_order: 0,
  extras_codes: "",
  recipe_notes: "",
});

function Login({ onLogin }: { onLogin: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const fields = new FormData(event.currentTarget);
    try {
      const result = await menuRequest<{ token: string }>("/session", {
        method: "POST",
        body: JSON.stringify({
          email: fields.get("email"),
          password: fields.get("password"),
        }),
      });
      sessionStorage.setItem("gastrobar-token", result.token);
      onLogin();
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="gm ga-login">
      <form onSubmit={submit}>
        <div className="gm-eyebrow">SIERRA DORADA · GASTROBAR</div>
        <h1>
          Tu carta,
          <br />a tu manera.
        </h1>
        <p>Inicia sesión para administrar el menú.</p>
        <label>
          Correo
          <input type="email" name="email" autoComplete="username" required />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            required
          />
        </label>
        {error && (
          <p className="ga-error" role="alert">
            {error}
          </p>
        )}
        <button className="gm-primary" disabled={busy}>
          {busy ? "Ingresando…" : "Entrar a administración"}
        </button>
        <Link to="/gastrobar/menu">Volver a la carta</Link>
      </form>
    </div>
  );
}

function FixedQR() {
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");
  const url = permanentMenuUrl();
  let isPermanent = false;
  try {
    const parsed = new URL(url);
    isPermanent =
      parsed.protocol === "https:" &&
      !/^(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(parsed.hostname) &&
      !parsed.search &&
      !parsed.hash;
  } catch {
    /* Show configuration error below. */
  }
  useEffect(() => {
    QRCode.toString(url, {
      type: "svg",
      errorCorrectionLevel: "H",
      margin: 4,
      width: 900,
      color: { dark: "#000000", light: "#ffffff" },
    })
      .then(setSvg)
      .catch(() =>
        setError("No se pudo generar el QR. Revisa la dirección del menú."),
      );
  }, [url]);
  async function downloadQr(type: "svg" | "png") {
    try {
      const blob =
        type === "svg"
          ? new Blob([svg], { type: "image/svg+xml" })
          : await (
              await fetch(
                await QRCode.toDataURL(url, {
                  width: 1800,
                  margin: 4,
                  errorCorrectionLevel: "H",
                }),
              )
            ).blob();
      saveBlob(blob, `sierra-dorada-qr-menu.${type}`);
    } catch (e) {
      toast.error(errorText(e));
    }
  }
  async function downloadCard() {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1600;
      canvas.height = 2400;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Tu navegador no permite crear la tarjeta.");

      const x = 70;
      const y = 60;
      const width = 1460;
      const height = 2280;
      const archHeight = 570;
      const bottomRadius = 22;
      context.beginPath();
      context.moveTo(x, y + archHeight);
      context.bezierCurveTo(x, y + archHeight * 0.34, x + width * 0.24, y, x + width / 2, y);
      context.bezierCurveTo(x + width * 0.76, y, x + width, y + archHeight * 0.34, x + width, y + archHeight);
      context.lineTo(x + width, y + height - bottomRadius);
      context.quadraticCurveTo(x + width, y + height, x + width - bottomRadius, y + height);
      context.lineTo(x + bottomRadius, y + height);
      context.quadraticCurveTo(x, y + height, x, y + height - bottomRadius);
      context.closePath();
      context.fillStyle = "#fffdf6";
      context.fill();
      context.strokeStyle = "#b39a69";
      context.lineWidth = 4;
      context.stroke();

      const centerX = canvas.width / 2;
      context.textAlign = "center";
      context.textBaseline = "alphabetic";
      context.fillStyle = "#8a662c";
      context.font = "700 42px Arial, sans-serif";
      drawSpacedText(context, "SIERRA DORADA", centerX, 300, 9);
      context.fillStyle = "#28271e";
      context.font = "20px Arial, sans-serif";
      drawSpacedText(context, "GASTROBAR · ZIPAQUIRÁ", centerX, 360, 9);

      context.font = "92px Georgia, serif";
      context.fillText("Tu próximo", centerX, 600);
      context.font = "italic 104px Georgia, serif";
      context.fillText("antojo está aquí.", centerX, 720);

      const qrSource = await QRCode.toDataURL(url, {
        width: 1200,
        margin: 4,
        errorCorrectionLevel: "H",
        color: { dark: "#000000", light: "#ffffff" },
      });
      const qrImage = await loadCanvasImage(qrSource);
      const qrSize = 1020;
      const qrX = centerX - qrSize / 2;
      const qrY = 820;
      context.fillStyle = "#ffffff";
      context.fillRect(qrX, qrY, qrSize, qrSize);
      context.drawImage(qrImage, qrX, qrY, qrSize, qrSize);

      context.fillStyle = "#28271e";
      context.font = "700 25px Arial, sans-serif";
      drawSpacedText(context, "ESCANEA Y DESCUBRE LA CARTA", centerX, 1950, 4);
      context.font = "italic 42px Georgia, serif";
      context.fillText("Buena mesa. Mejor compañía.", centerX, 2050);
      context.fillStyle = "#686555";
      context.font = "22px Arial, sans-serif";
      context.fillText(url, centerX, 2200);

      saveBlob(await canvasBlob(canvas), "sierra-dorada-tarjeta-mesa.png");
      toast.success("Tarjeta PNG lista para imprimir.");
    } catch (e) {
      toast.error(errorText(e));
    }
  }
  return (
    <section className="ga-qr">
      <div className="ga-qr-description">
        <div className="gm-eyebrow">UN QR. TODA TU CARTA.</div>
        <h2>Listo para tus mesas</h2>
        <p>
          Este QR abre siempre la misma dirección. Cada cambio que guardes en la
          carta aparecerá al abrirla de nuevo, sin volver a imprimir el código.
        </p>
        <label>
          Dirección permanente
          <input readOnly value={url} />
        </label>
        <p className="gm-menu-note">
          Conserva este dominio y esta ruta. Si cambias el alojamiento, mantén
          una redirección desde esta dirección. El QR no depende de un servicio
          de suscripción ni tiene fecha de caducidad.
        </p>
        {!isPermanent && (
          <p className="ga-error" role="alert">
            Vista local: configura VITE_GASTROBAR_MENU_URL con la dirección
            HTTPS definitiva antes de descargar o imprimir.
          </p>
        )}
        {error && <p role="alert">{error}</p>}
        <div className="ga-actions">
          <button
            className="gm-primary"
            disabled={!svg || !isPermanent}
            onClick={() => void downloadQr("png")}
          >
            <Download size={16} /> Descargar QR
          </button>
          <button
            className="ga-secondary"
            disabled={!svg || !isPermanent}
            onClick={() => void downloadCard()}
          >
            <ImagePlus size={16} /> Descargar tarjeta
          </button>
          <button
            className="ga-secondary"
            disabled={!svg || !isPermanent}
            onClick={() => void downloadQr("svg")}
          >
            QR vectorial
          </button>
          <button
            className="ga-secondary"
            disabled={!svg || !isPermanent}
            onClick={() => window.print()}
          >
            <Printer size={16} /> Imprimir
          </button>
        </div>
        <a className="ga-link" href={url} target="_blank" rel="noreferrer">
          Comprobar dirección del menú <ArrowUpRight size={14} />
        </a>
      </div>
      <div className="ga-qr-card" id="gastrobar-qr-card">
        <div className="gm-eyebrow">SIERRA DORADA</div>
        <p className="ga-qr-subtitle">GASTROBAR · ZIPAQUIRÁ</p>
        <h2>
          Tu próximo
          <br />
          <em>antojo está aquí.</em>
        </h2>
        {svg && (
          <img
            src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`}
            alt={`QR del menú: ${url}`}
          />
        )}
        <strong>ESCANEA Y DESCUBRE LA CARTA</strong>
        <p>Buena mesa. Mejor compañía.</p>
        <small>{url}</small>
      </div>
    </section>
  );
}

export default function GastrobarAdminPage() {
  const [authenticated, setAuthenticated] = useState(Boolean(menuToken()));
  const [data, setData] = useState<MenuData>({ categories: [], items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"items" | "categories" | "qr">("items");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [categoryDraft, setCategoryDraft] = useState<CategoryDraft | null>(
    null,
  );
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState("");
  const productDialog = useRef<HTMLDialogElement>(null);
  const categoryDialog = useRef<HTMLDialogElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await menuRequest<MenuData>("/admin"));
    } catch (e) {
      setError(errorText(e));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    if (authenticated) void load();
  }, [authenticated, load]);
  useEffect(() => {
    const expire = () => setAuthenticated(false);
    window.addEventListener("menu-session-expired", expire);
    return () => window.removeEventListener("menu-session-expired", expire);
  }, []);
  useEffect(() => {
    if (draft) productDialog.current?.showModal();
    else productDialog.current?.close();
  }, [draft]);
  useEffect(() => {
    if (categoryDraft) categoryDialog.current?.showModal();
    else categoryDialog.current?.close();
  }, [categoryDraft]);
  function edit(item: Draft) {
    setFormError("");
    setDraft({ ...item });
  }
  function editCategory(category: CategoryDraft) {
    setFormError("");
    setCategoryDraft({ ...category });
  }

  async function save(event: FormEvent, resource: "items" | "categories") {
    event.preventDefault();
    const value = resource === "items" ? draft : categoryDraft;
    if (!value || busy) return;
    setBusy(true);
    setFormError("");
    try {
      const saved = await menuRequest<MenuItem & MenuCategory>(
        `/admin/${resource}${value.id ? `/${encodeURIComponent(value.id)}` : ""}`,
        { method: value.id ? "PUT" : "POST", body: JSON.stringify(value) },
      );
      setData((current) => ({
        ...current,
        [resource]: value.id
          ? current[resource].map((row) => (row.id === value.id ? saved : row))
          : [...current[resource], saved],
      }));
      if (resource === "items") setDraft(null);
      else setCategoryDraft(null);
      toast.success("Cambios guardados en la carta.");
    } catch (e) {
      setFormError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  async function remove(
    resource: "items" | "categories",
    value: MenuItem | MenuCategory,
  ) {
    if (
      !window.confirm(
        `¿Eliminar “${value.name}”? Esta acción no se puede deshacer.${resource === "items" ? " También puedes ocultarlo desde Editar." : ""}`,
      )
    )
      return;
    setBusy(true);
    try {
      await menuRequest(`/admin/${resource}/${encodeURIComponent(value.id)}`, {
        method: "DELETE",
      });
      setData((current) => ({
        ...current,
        [resource]: current[resource].filter((row) => row.id !== value.id),
      }));
      toast.success("Registro eliminado.");
    } catch (e) {
      toast.error(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  async function uploadPhoto(file?: File) {
    if (!file) return;
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 500000
    ) {
      setFormError("Selecciona una foto JPEG, PNG o WebP de máximo 500 KB.");
      return;
    }
    setFormError("");
    try {
      const encoded = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("No se pudo leer la foto."));
        reader.readAsDataURL(file);
      });
      setDraft((current) =>
        current ? { ...current, image_url: encoded } : null,
      );
    } catch (e) {
      setFormError(errorText(e));
    }
  }

  if (!authenticated) return <Login onLogin={() => setAuthenticated(true)} />;
  const filtered = data.items.filter(
    (item) =>
      normalizeSearch(`${item.name} ${item.id}`).includes(
        normalizeSearch(search),
      ) &&
      (categoryFilter === "all" || item.category_id === categoryFilter) &&
      (statusFilter === "all" ||
        (statusFilter === "active" ? item.active : !item.active)),
  );
  return (
    <div className="gm ga">
      <header className="ga-header">
        <Link to="/admin/gastrobar" className="gm-brand">
          SIERRA DORADA<small>ADMINISTRACIÓN · GASTROBAR</small>
        </Link>
        <div className="ga-actions">
          <Link to="/gastrobar/menu" target="_blank" className="ga-link">
            Ver carta <ArrowUpRight size={15} />
          </Link>
          <button
            className="ga-icon"
            aria-label="Cerrar sesión"
            onClick={() => {
              sessionStorage.removeItem("gastrobar-token");
              setAuthenticated(false);
              setDraft(null);
              setCategoryDraft(null);
            }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>
      <main>
        <div className="ga-title">
          <div>
            <div className="gm-eyebrow">TODO LISTO PARA SERVIR</div>
            <h1>Tu carta, al día.</h1>
            <p>
              Actualiza sabores, precios y disponibilidad desde un solo lugar.
            </p>
          </div>
          {tab === "items" && (
            <button
              className="gm-primary"
              disabled={loading || !!error || !data.categories.length}
              onClick={() => edit(newItem(data.categories[0].id))}
            >
              <Plus size={17} /> Nuevo producto
            </button>
          )}
          {tab === "categories" && (
            <button
              className="gm-primary"
              disabled={loading || !!error}
              onClick={() =>
                editCategory({
                  name: "",
                  active: true,
                  sort_order: data.categories.length * 10,
                })
              }
            >
              <Plus size={17} /> Nueva categoría
            </button>
          )}
        </div>
        <div className="ga-stats">
          <div>
            <strong>{data.items.length}</strong>
            <span>Productos en la carta</span>
          </div>
          <div>
            <strong>{data.items.filter((i) => i.active).length}</strong>
            <span>Productos publicados</span>
          </div>
          <div>
            <strong>{data.items.filter((i) => !i.active).length}</strong>
            <span>Ocultos / borradores</span>
          </div>
          <div>
            <strong>{data.categories.length}</strong>
            <span>Categorías</span>
          </div>
        </div>
        <nav className="ga-tabs" aria-label="Administración">
          <button
            className={tab === "items" ? "selected" : ""}
            onClick={() => setTab("items")}
          >
            Productos
          </button>
          <button
            className={tab === "categories" ? "selected" : ""}
            onClick={() => setTab("categories")}
          >
            Categorías
          </button>
          <button
            className={tab === "qr" ? "selected" : ""}
            onClick={() => setTab("qr")}
          >
            <QrCode size={16} /> QR de las mesas
          </button>
        </nav>
        {error && (
          <div className="ga-error" role="alert">
            {error} <button onClick={() => void load()}>Reintentar</button>
          </div>
        )}
        {tab === "qr" ? (
          <FixedQR />
        ) : loading ? (
          <p className="gm-empty">Cargando administración…</p>
        ) : (
          <>
            {tab === "items" && (
              <>
                <div className="ga-filters">
                  <label className="gm-search">
                    <Search size={17} />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Buscar producto o código"
                      aria-label="Buscar producto o código"
                    />
                  </label>
                  <select
                    aria-label="Filtrar por categoría"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">Todas las categorías</option>
                    {data.categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <select
                    aria-label="Filtrar por estado"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">Todos los estados</option>
                    <option value="active">Publicados</option>
                    <option value="hidden">Ocultos</option>
                  </select>
                </div>
                <div className="ga-table-wrap">
                  <table className="ga-table">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Categoría</th>
                        <th>Precio</th>
                        <th>Estado</th>
                        <th>
                          <span className="sr-only">Acciones</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <strong>{item.name}</strong>
                            <small>
                              {item.id}
                              {item.image_url ? " · Con foto" : " · Sin foto"}
                            </small>
                          </td>
                          <td>
                            {
                              data.categories.find(
                                (c) => c.id === item.category_id,
                              )?.name
                            }
                          </td>
                          <td>{money(item.price)}</td>
                          <td>
                            <span
                              className={`ga-status ${item.active ? "active" : ""}`}
                            >
                              {!item.active
                                ? "Oculto"
                                : !data.categories.find(
                                      (c) => c.id === item.category_id,
                                    )?.active
                                  ? "Categoría oculta"
                                  : !item.available
                                    ? "Agotado"
                                    : "Publicado"}
                            </span>
                          </td>
                          <td>
                            <div className="ga-actions">
                              <button
                                className="ga-icon"
                                aria-label={`Editar ${item.name}`}
                                onClick={() => edit(item)}
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                className="ga-icon"
                                disabled={busy}
                                aria-label={`Eliminar ${item.name}`}
                                onClick={() => void remove("items", item)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {!filtered.length && (
                    <div className="gm-empty">
                      No hay productos para estos filtros.
                      {!data.categories.length && (
                        <p>
                          Crea una categoría para empezar a agregar productos.
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <p className="gm-menu-note">
                  Los productos ocultos no aparecen en la carta. Los agotados
                  permanecen visibles con su estado. Los costos solo se muestran
                  al editar.
                </p>
              </>
            )}
            {tab === "categories" && (
              <div className="ga-category-list">
                {data.categories.map((c) => (
                  <article key={c.id}>
                    <span className="ga-category-order">{c.sort_order}</span>
                    <div>
                      <h2>{c.name}</h2>
                      <p>
                        {
                          data.items.filter((i) => i.category_id === c.id)
                            .length
                        }{" "}
                        productos · {c.active ? "Visible" : "Oculta"}
                      </p>
                    </div>
                    <div className="ga-actions">
                      <button
                        className="ga-icon"
                        aria-label={`Editar categoría ${c.name}`}
                        onClick={() => editCategory(c)}
                      >
                        <Pencil size={17} />
                      </button>
                      <button
                        className="ga-icon"
                        disabled={busy}
                        aria-label={`Eliminar categoría ${c.name}`}
                        onClick={() => void remove("categories", c)}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </article>
                ))}
                {!data.categories.length && (
                  <p className="gm-empty">Crea tu primera categoría.</p>
                )}
                <p className="gm-menu-note">
                  Un orden menor aparece primero. Ocultar una categoría oculta
                  también sus productos; puedes volver a mostrarla cuando
                  quieras.
                </p>
              </div>
            )}
          </>
        )}
      </main>
      <dialog
        className="gm-dialog ga-dialog"
        ref={productDialog}
        onCancel={(e) => {
          if (busy) e.preventDefault();
          else setDraft(null);
        }}
        aria-labelledby="product-editor-title"
      >
        {draft && (
          <form onSubmit={(e) => void save(e, "items")}>
            <button
              type="button"
              disabled={busy}
              className="gm-dialog-close"
              aria-label="Cerrar editor"
              onClick={() => setDraft(null)}
            >
              <X />
            </button>
            <div className="gm-eyebrow">EDITOR DE CARTA</div>
            <h2 id="product-editor-title">
              {draft.id ? "Editar producto" : "Nuevo producto"}
            </h2>
            <fieldset disabled={busy}>
              <label>
                Nombre del producto
                <input
                  autoFocus
                  required
                  maxLength={150}
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
              </label>
              <label>
                Descripción e ingredientes
                <textarea
                  maxLength={4000}
                  rows={4}
                  value={draft.description}
                  onChange={(e) =>
                    setDraft({ ...draft, description: e.target.value })
                  }
                />
              </label>
              <div className="ga-form-grid">
                <label>
                  Precio de venta (COP)
                  <input
                    type="number"
                    min="0"
                    max="999999999"
                    step="0.01"
                    required={draft.active}
                    value={draft.price ?? ""}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        price:
                          e.target.value === "" ? null : Number(e.target.value),
                      })
                    }
                  />
                </label>
                <label>
                  Costo interno (COP)
                  <input
                    type="number"
                    min="0"
                    max="999999999"
                    step="any"
                    value={draft.cost ?? ""}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        cost:
                          e.target.value === "" ? null : Number(e.target.value),
                      })
                    }
                  />
                </label>
                <label>
                  Categoría
                  <select
                    required
                    value={draft.category_id}
                    onChange={(e) =>
                      setDraft({ ...draft, category_id: e.target.value })
                    }
                  >
                    {data.categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                        {!c.active ? " (oculta)" : ""}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Orden en la categoría
                  <input
                    type="number"
                    min="0"
                    max="100000"
                    step="1"
                    required
                    value={draft.sort_order}
                    onChange={(e) =>
                      setDraft({ ...draft, sort_order: Number(e.target.value) })
                    }
                  />
                </label>
              </div>
              <div className="ga-checks">
                <label>
                  <input
                    type="checkbox"
                    checked={draft.active}
                    onChange={(e) =>
                      setDraft({ ...draft, active: e.target.checked })
                    }
                  />{" "}
                  Publicado en la carta
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={draft.available}
                    onChange={(e) =>
                      setDraft({ ...draft, available: e.target.checked })
                    }
                  />{" "}
                  Disponible hoy
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={draft.featured}
                    onChange={(e) =>
                      setDraft({ ...draft, featured: e.target.checked })
                    }
                  />{" "}
                  Favorito de la casa
                </label>
              </div>
              <div className="ga-photo-editor">
                <label>
                  Foto opcional · URL HTTPS o imagen del catálogo
                  <input
                    type="text"
                    inputMode="url"
                    value={
                      draft.image_url.startsWith("data:") ? "" : draft.image_url
                    }
                    placeholder="https://…"
                    onChange={(e) =>
                      setDraft({ ...draft, image_url: e.target.value })
                    }
                  />
                </label>
                <label className="ga-upload">
                  <ImagePlus size={17} /> Subir foto (máx. 500 KB)
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => void uploadPhoto(e.target.files?.[0])}
                  />
                </label>
                {draft.image_url && (
                  <div className="ga-photo-preview">
                    <img
                      src={menuImageSource(draft.image_url)}
                      alt="Vista previa del producto"
                    />
                    <button
                      className="ga-secondary"
                      type="button"
                      onClick={() => setDraft({ ...draft, image_url: "" })}
                    >
                      Quitar foto
                    </button>
                  </div>
                )}
                <p className="gm-menu-note">
                  Sin foto, la carta muestra el nombre, la descripción y el
                  precio.
                </p>
              </div>
              <label>
                Ficha de receta interna · ingredientes y cantidades
                <textarea rows={7} maxLength={8000} value={draft.recipe_notes ?? ''} onChange={e => setDraft({ ...draft, recipe_notes: e.target.value })} />
              </label>
              {draft.extras_codes && (
                <p className="gm-menu-note">
                  Referencia de extras importada: {draft.extras_codes}. El
                  archivo no incluye los nombres ni precios de estos extras.
                </p>
              )}
            </fieldset>
            {formError && (
              <p className="ga-error" role="alert">
                {formError}
              </p>
            )}
            <div className="ga-form-actions">
              <button
                type="button"
                className="ga-secondary"
                disabled={busy}
                onClick={() => setDraft(null)}
              >
                Cancelar
              </button>
              <button type="submit" className="gm-primary" disabled={busy}>
                {busy ? "Guardando…" : "Guardar producto"}
              </button>
            </div>
          </form>
        )}
      </dialog>
      <dialog
        className="gm-dialog ga-dialog"
        ref={categoryDialog}
        onCancel={(e) => {
          if (busy) e.preventDefault();
          else setCategoryDraft(null);
        }}
        aria-labelledby="category-editor-title"
      >
        {categoryDraft && (
          <form onSubmit={(e) => void save(e, "categories")}>
            <button
              type="button"
              className="gm-dialog-close"
              disabled={busy}
              aria-label="Cerrar editor de categoría"
              onClick={() => setCategoryDraft(null)}
            >
              <X />
            </button>
            <h2 id="category-editor-title">
              {categoryDraft.id ? "Editar categoría" : "Nueva categoría"}
            </h2>
            <fieldset disabled={busy}>
              <label>
                Nombre
                <input
                  autoFocus
                  required
                  maxLength={80}
                  value={categoryDraft.name}
                  onChange={(e) =>
                    setCategoryDraft({ ...categoryDraft, name: e.target.value })
                  }
                />
              </label>
              <label>
                Orden
                <input
                  type="number"
                  min="0"
                  max="100000"
                  step="1"
                  required
                  value={categoryDraft.sort_order}
                  onChange={(e) =>
                    setCategoryDraft({
                      ...categoryDraft,
                      sort_order: Number(e.target.value),
                    })
                  }
                />
              </label>
              <div className="ga-checks">
                <label>
                  <input
                    type="checkbox"
                    checked={categoryDraft.active}
                    onChange={(e) =>
                      setCategoryDraft({
                        ...categoryDraft,
                        active: e.target.checked,
                      })
                    }
                  />{" "}
                  Visible en la carta
                </label>
              </div>
            </fieldset>
            {formError && (
              <p className="ga-error" role="alert">
                {formError}
              </p>
            )}
            <div className="ga-form-actions">
              <button
                type="button"
                className="ga-secondary"
                disabled={busy}
                onClick={() => setCategoryDraft(null)}
              >
                Cancelar
              </button>
              <button className="gm-primary" disabled={busy}>
                {busy ? "Guardando…" : "Guardar categoría"}
              </button>
            </div>
          </form>
        )}
      </dialog>
    </div>
  );
}
