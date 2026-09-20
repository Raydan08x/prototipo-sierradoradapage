import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Search,
  SlidersHorizontal,
  X,
  MapPin,
  Leaf,
  UtensilsCrossed,
} from "lucide-react";
import {
  MenuData,
  MenuItem,
  menuRequest,
  money,
  normalizeSearch,
  menuImageSource,
} from "../lib/menu";
import { publicAsset } from "../lib/assets";
import "../styles/gastrobar-menu.css";

function ProductPhoto({ item }: { item: MenuItem }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [item.image_url]);
  return item.image_url && !failed ? (
    <img
      className="gm-photo"
      src={menuImageSource(item.image_url)}
      alt={item.name}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  ) : null;
}

export default function GastrobarMenuPage() {
  const [data, setData] = useState<MenuData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [photos, setPhotos] = useState(true);
  const [selected, setSelected] = useState<MenuItem | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      setData(await menuRequest<MenuData>());
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo cargar la carta.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, []);
  useEffect(() => {
    const onFocus = () => {
      void menuRequest<MenuData>()
        .then(setData)
        .catch(() => {});
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);
  useEffect(() => {
    if (selected) dialog.current?.showModal();
    else dialog.current?.close();
  }, [selected]);

  const categories =
    data?.categories.filter((c) =>
      data.items.some((item) => item.category_id === c.id),
    ) || [];
  const filtered =
    data?.items.filter(
      (item) =>
        (category === "all" || item.category_id === category) &&
        normalizeSearch(`${item.name} ${item.description}`).includes(
          normalizeSearch(query),
        ),
    ) || [];

  return (
    <div className="gm">
      <header className="gm-header">
        <Link to="/gastrobar" className="gm-brand">
          <img src={publicAsset("assets/isotipo.png")} alt="" />
          <span>
            SIERRA DORADA<small>CERVEZA ARTESANAL · GASTROBAR</small>
          </span>
        </Link>
        <Link to="/gastrobar" className="gm-back">
          <ArrowLeft size={16} /> El gastrobar
        </Link>
      </header>
      <main>
        <section className="gm-hero">
          <div>
            <div className="gm-eyebrow">
              <span /> HECHO AQUÍ. PARA COMPARTIR.
            </div>
            <h1>
              Buena mesa.
              <br />
              Mejor compañía<span>.</span>
            </h1>
            <p>
              Sabores con raíces, cerveza con carácter.
              <br />
              Encuentra tu próximo favorito en Sierra Dorada.
            </p>
            <div className="gm-location">
              <MapPin size={16} /> Zipaquirá · CC Paseo de Gracia, Local 112
            </div>
          </div>
          <div className="gm-hero-stamp" aria-hidden="true">
            <Leaf size={29} strokeWidth={1} />
            <span>
              DE NUESTRA
              <br />
              <em>cocina</em>
              <br />A TU MESA
            </span>
            <div>EST. SIERRA DORADA</div>
          </div>
        </section>
        <div className="gm-toolbar">
          <label className="gm-search">
            <Search size={19} />
            <input
              type="search"
              aria-label="Buscar en la carta"
              placeholder="¿Qué se te antoja hoy?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Limpiar búsqueda"
              >
                <X size={16} />
              </button>
            )}
          </label>
          <button
            className="gm-view"
            aria-pressed={!photos}
            onClick={() => setPhotos(!photos)}
          >
            <SlidersHorizontal size={17} />{" "}
            {photos ? "Ver sin fotos" : "Ver con fotos"}
          </button>
        </div>
        <div className="gm-catalog">
          <aside className="gm-sidebar">
            <span className="gm-eyebrow">NUESTRA CARTA</span>
            <nav aria-label="Categorías del menú">
              <button
                className={category === "all" ? "selected" : ""}
                onClick={() => setCategory("all")}
              >
                Toda la carta <span>{data?.items.length || 0}</span>
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  className={category === c.id ? "selected" : ""}
                  onClick={() => setCategory(c.id)}
                >
                  {c.name}
                  <span>
                    {data?.items.filter((i) => i.category_id === c.id).length}
                  </span>
                </button>
              ))}
            </nav>
            <div className="gm-sidebar-note">
              <UtensilsCrossed size={22} />
              <p>Lo bueno se comparte.</p>
              <small>Pregunta a nuestro equipo por tu maridaje ideal.</small>
            </div>
          </aside>
          <div className="gm-sections" aria-live="polite" aria-busy={loading}>
            {loading && !data && (
              <div className="gm-empty">Preparando la carta…</div>
            )}
            {error && (
              <div role="alert" className="gm-empty">
                <h2>No pudimos abrir la carta</h2>
                <p>{error}</p>
                <button className="gm-primary" onClick={() => void load()}>
                  Volver a intentar
                </button>
              </div>
            )}
            {!loading && !error && !filtered.length && (
              <div className="gm-empty">
                <Search size={30} />
                <h2>
                  {query
                    ? "No encontramos ese antojo"
                    : "Estamos preparando nuestra carta"}
                </h2>
                <p>
                  {query
                    ? "Prueba con otro nombre o ingrediente."
                    : "Consulta con nuestro equipo por las opciones disponibles."}
                </p>
                {query && (
                  <button
                    className="gm-primary"
                    onClick={() => {
                      setQuery("");
                      setCategory("all");
                    }}
                  >
                    Ver toda la carta
                  </button>
                )}
              </div>
            )}
            {!error &&
              categories.map((c) => {
                const items = filtered.filter(
                  (item) => item.category_id === c.id,
                );
                if (!items.length) return null;
                return (
                  <section key={c.id} className="gm-section">
                    <div className="gm-section-heading">
                      <h2>{c.name}</h2>
                      <span>
                        {items.length}{" "}
                        {items.length === 1 ? "opción" : "opciones"}
                      </span>
                    </div>
                    <div className="gm-items">
                      {items.map((item) => (
                        <button
                          key={item.id}
                          className={`gm-item ${!item.available ? "gm-unavailable" : ""}`}
                          onClick={() => setSelected(item)}
                        >
                          <div className="gm-item-copy">
                            {item.featured && (
                              <span className="gm-badge">
                                FAVORITO DE LA CASA
                              </span>
                            )}
                            <h3>{item.name}</h3>
                            {item.description && <p>{item.description}</p>}
                            <div className="gm-item-bottom">
                              <strong>{money(item.price)}</strong>
                              {item.available ? (
                                <span>
                                  Ver detalle <ArrowUpRight size={14} />
                                </span>
                              ) : (
                                <span className="gm-soldout">
                                  Agotado por hoy
                                </span>
                              )}
                            </div>
                          </div>
                          {photos && <ProductPhoto item={item} />}
                        </button>
                      ))}
                    </div>
                  </section>
                );
              })}
            {data && !error && (
              <p className="gm-menu-note">
                Precios en pesos colombianos (COP). Si tienes alergias o
                restricciones alimentarias, consulta a nuestro equipo antes de
                elegir.
              </p>
            )}
          </div>
        </div>
      </main>
      <footer className="gm-footer">
        <div>
          <strong>SIERRA DORADA</strong>
          <span>Nos vemos en la mesa.</span>
        </div>
        <Link to="/admin/gastrobar">
          Administrar carta <ArrowUpRight size={14} />
        </Link>
      </footer>
      <dialog
        ref={dialog}
        className="gm-dialog"
        onCancel={() => setSelected(null)}
        onClick={(e) => {
          if (e.target === dialog.current) setSelected(null);
        }}
      >
        {selected && (
          <>
            <button
              className="gm-dialog-close"
              autoFocus
              onClick={() => setSelected(null)}
              aria-label="Cerrar detalle"
            >
              <X />
            </button>
            {photos && <ProductPhoto item={selected} />}
            <div className="gm-eyebrow">
              {
                data?.categories.find((c) => c.id === selected.category_id)
                  ?.name
              }
            </div>
            <h2>{selected.name}</h2>
            {selected.description && <p>{selected.description}</p>}
            <strong className="gm-detail-price">{money(selected.price)}</strong>
            {!selected.available && (
              <p className="gm-soldout">Agotado por hoy</p>
            )}
            <p className="gm-menu-note">
              Para pedir o consultar ingredientes y acompañamientos, habla con
              nuestro equipo.
            </p>
          </>
        )}
      </dialog>
    </div>
  );
}
