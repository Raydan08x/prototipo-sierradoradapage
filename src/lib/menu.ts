import { API_URL } from "./api";
import { publicAsset } from "./assets";

export interface MenuCategory {
  id: string;
  name: string;
  sort_order: number;
  active?: boolean;
}
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number | null;
  cost?: number | null;
  category_id: string;
  active?: boolean;
  available: boolean;
  featured: boolean;
  image_url: string;
  sort_order: number;
  extras_codes?: string;
  source_category?: string;
  recipe_notes?: string;
}
export interface MenuData {
  categories: MenuCategory[];
  items: MenuItem[];
}
export const money = (price: number | null) =>
  price === null
    ? "Sin precio"
    : new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 2,
      }).format(price);
export const normalizeSearch = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
export const menuToken = () => sessionStorage.getItem("gastrobar-token");
export const menuImageSource = (source: string) => source.startsWith('/assets/gastrobar/') ? publicAsset(source.slice(1)) : source;
export async function menuRequest<T>(
  path = "",
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}/menu${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(path.startsWith("/admin") && menuToken()
        ? { Authorization: `Bearer ${menuToken()}` }
        : {}),
      ...options.headers,
    },
  });
  if (response.status === 204) return undefined as T;
  const result = await response
    .json()
    .catch(() => ({ error: "No se pudo conectar con el menú." }));
  if (!response.ok) {
    if (response.status === 401 && path.startsWith("/admin")) {
      sessionStorage.removeItem("gastrobar-token");
      window.dispatchEvent(new Event("menu-session-expired"));
    }
    throw new Error(result.error || "No se pudo completar la operación.");
  }
  return result as T;
}

export function permanentMenuUrl() {
  const configured = import.meta.env.VITE_GASTROBAR_MENU_URL?.trim();
  return (
    configured ||
    new URL(`${import.meta.env.BASE_URL}gastrobar/menu`, window.location.origin)
      .href
  );
}
