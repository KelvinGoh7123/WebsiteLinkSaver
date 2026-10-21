export function ensureHttps(url: string): string {
  const trimmed = url.trim();
  if (!trimmed || /^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
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
