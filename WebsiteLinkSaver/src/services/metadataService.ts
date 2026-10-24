import { ensureHttps, faviconUrl, titleFromUrl } from "../utils/links";

export interface PageMetadata {
  title: string;
  description: string;
  imageUrl: string;
}

export async function lookupPage(
  rawUrl: string,
  signal?: AbortSignal
): Promise<PageMetadata | null> {
  const url = ensureHttps(rawUrl);
  const fallback = fallbackMetadata(url);

  try {
    const response = await fetch(
      `https://api.microlink.io/?url=${encodeURIComponent(url)}`,
      { signal }
    );
    if (signal?.aborted) return null;
    if (!response.ok) return fallback;

    const body = await response.json();
    const data = body?.data;
    if (body?.status !== "success" || !data) return fallback;

    const description =
      typeof data.description === "string" ? data.description.slice(0, 280) : "";

    return {
      title: typeof data.title === "string" && data.title.trim() ? data.title.trim() : fallback.title,
      description,
      imageUrl: data.image?.url || data.logo?.url || fallback.imageUrl,
    };
  } catch {
    if (signal?.aborted) return null;
    return fallback;
  }
}

function fallbackMetadata(url: string): PageMetadata {
  return {
    title: titleFromUrl(url),
    description: "",
    imageUrl: faviconUrl(url),
  };
}
