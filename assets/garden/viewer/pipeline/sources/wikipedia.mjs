/**
 * wikipedia.mjs — Wikipedia REST API v1 enrichment source.
 *
 * Free, CORS-enabled, no auth required.
 * Returns a summary, thumbnail URL, and Wikipedia page link for a given title.
 *
 * Endpoint: https://en.wikipedia.org/api/rest_v1/page/summary/{title}
 */

import { log } from '../../logger.mjs';

const REST_BASE = 'https://en.wikipedia.org/api/rest_v1/page/summary';

/**
 * Fetch Wikipedia summary for an entity label.
 * @param {string} label — entity name (e.g. "India", "TheViper")
 * @returns {Promise<{summary:string, thumbnail:string|null, wikiUrl:string}|null>}
 */
export async function fetchWikiSummary(label) {
  if (!label) return null;

  // Normalise: "Age of Empires II" → "Age_of_Empires_II"
  const title = encodeURIComponent(label.trim().replace(/\s+/g, '_'));

  try {
    const res = await fetch(`${REST_BASE}/${title}`, {
      headers: { 'Api-User-Agent': 'kaaroViewer/2.0 (karx@akriya.co.in)' },
    });

    if (res.status === 404) {
      log('SOURCE', `[Wikipedia] no article for "${label}"`);
      return null;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    // Skip disambiguation pages
    if (data.type === 'disambiguation') {
      log('SOURCE', `[Wikipedia] "${label}" is a disambiguation page`);
      return null;
    }

    return {
      summary:   data.extract ?? data.description ?? '',
      thumbnail: data.thumbnail?.source ?? null,
      wikiUrl:   data.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${title}`,
    };
  } catch (err) {
    log('ERROR', `[Wikipedia] fetch failed for "${label}"`, { message: err.message });
    return null;
  }
}
