/**
 * resolver.mjs — turn user input into Wikidata QIDs.
 *
 * Handles:
 *   "Q668"           → direct QID passthrough
 *   "wd:Q668"        → direct QID passthrough
 *   "Mahatma Gandhi" → Wikidata entity search → ['Q1001']
 *
 * Uses the Wikidata wbsearchentities API (supports CORS via origin=*).
 */

import { log } from '../logger.mjs';

const QID_RE = /^(?:wd:)?(Q\d+)$/i;

export async function resolve(input) {
  input = (input ?? '').trim();
  if (!input) return [];

  // Direct QID passthrough
  const m = input.match(QID_RE);
  if (m) return [m[1].toUpperCase()];

  if (input.length < 2) return [];

  log('ENTITY_MATCH', `search → "${input}"`);
  try {
    const url = `https://www.wikidata.org/w/api.php?` + new URLSearchParams({
      action:   'wbsearchentities',
      search:   input,
      language: 'en',
      limit:    '5',
      format:   'json',
      origin:   '*',       // enables CORS
    });
    const res  = await fetch(url);
    const json = await res.json();
    const qids = (json.search ?? []).map(r => r.id).filter(Boolean);
    log('ENTITY_MATCH', `${qids.length} QID(s) from "${input}"`, { input, qids });
    return qids;
  } catch (err) {
    log('ERROR', 'Wikidata search failed', { input, message: err.message });
    return [];
  }
}
