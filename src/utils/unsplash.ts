const cache = new Map<string, string | null>();

// Fetches a single representative photo URL from Unsplash for a search query (e.g. a product name).
// Returns null if no API key is configured, no result is found, or the request fails.
export async function fetchUnsplashImage(query: string): Promise<string | null> {
  if (cache.has(query)) return cache.get(query) ?? null;

  const accessKey = process.env.EXPO_PUBLIC_UNSPLASH_ACCESS_KEY;
  if (!accessKey) return null;

  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=squarish`;
    const response = await fetch(url, {
      headers: { Authorization: `Client-ID ${accessKey}` },
    });
    if (!response.ok) {
      cache.set(query, null);
      return null;
    }
    const data = (await response.json()) as { results?: { urls?: { small?: string; regular?: string } }[] };
    const photoUrl = data.results?.[0]?.urls?.small ?? data.results?.[0]?.urls?.regular ?? null;
    cache.set(query, photoUrl);
    return photoUrl;
  } catch {
    cache.set(query, null);
    return null;
  }
}
