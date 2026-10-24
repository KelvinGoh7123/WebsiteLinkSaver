import { WebsiteLink } from "../types";

const LAST_CATEGORY_KEY = "link-saver-last-category";

export function ensureHttps(url: string): string {
  const trimmed = url.trim();
  if (!trimmed || /^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export function looksLikeUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed || /\s/.test(trimmed)) return false;
  return /^https?:\/\//i.test(trimmed) || trimmed.includes(".");
}

export function canonicalUrl(url: string): string {
  try {
    const parsed = new URL(ensureHttps(url));
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
    const path =
      parsed.pathname === "/" ? "" : parsed.pathname.replace(/\/$/, "");
    return `${host}${path}${parsed.search}`;
  } catch {
    return url.trim().toLowerCase();
  }
}

export function findSavedWebsite(
  url: string,
  websites: WebsiteLink[]
): WebsiteLink | undefined {
  const key = canonicalUrl(url);
  return websites.find((website) => canonicalUrl(website.url) === key);
}

export function faviconUrl(url: string): string {
  try {
    const domain = new URL(ensureHttps(url)).hostname.replace(/^www\./, "");
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
  } catch {
    return "";
  }
}

export function isIconImage(url: string): boolean {
  return url.includes("google.com/s2/favicons") || url.includes("icons.duckduckgo.com");
}

export function titleFromUrl(url: string): string {
  try {
    const host = new URL(ensureHttps(url)).hostname.replace(/^www\./, "");
    const labels = host.split(".").filter(Boolean);
    const name = labels.length > 2 ? labels[labels.length - 2] : labels[0];
    if (!name) return host;
    return name.charAt(0).toUpperCase() + name.slice(1);
  } catch {
    return url.trim();
  }
}

export function getLastCategory(): string {
  try {
    return localStorage.getItem(LAST_CATEGORY_KEY) ?? "";
  } catch {
    return "";
  }
}

export function rememberCategory(category: string) {
  const trimmed = category.trim();
  if (!trimmed) return;
  try {
    localStorage.setItem(LAST_CATEGORY_KEY, trimmed);
  } catch {
    // Ignore storage failures in private browsing.
  }
}

export function normalizeImageUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed || trimmed.startsWith("data:")) {
    return trimmed;
  }
  return ensureHttps(trimmed);
}

export function resolveCategory(value: string, categories: string[]): string {
  const trimmed = value.trim();
  const match = categories.find(
    (category) => category.toLowerCase() === trimmed.toLowerCase()
  );
  return match ?? trimmed;
}
