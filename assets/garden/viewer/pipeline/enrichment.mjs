/**
 * enrichment.mjs — Auto-enrichment pipeline.
 *
 * Fires when a node is focused. Fills in missing description, image, and geodata
 * from Wikipedia REST and locationHelper. Results cached in IndexedDB (7-day TTL).
 *
 * Fallback chain for images:
 *   node.image → Wikipedia thumbnail → Wikidata P18 → Liquipedia metaimage → null
 */

import { graph }                from './graph.mjs';
import { fetchWikiSummary }     from './sources/wikipedia.mjs';
import { geocode }              from './sources/locationHelper.mjs';
import { log }                  from '../logger.mjs';
import { refreshNodeVisual }    from '../canvas/nodes.mjs';

// ── IndexedDB enrichment cache ────────────────────────────────────────────────

const DB_NAME    = 'kaaroViewer';
const DB_VERSION = 2;   // bumped from 1 to add enrichments store
const STORE      = 'enrichments';
const TTL_MS     = 7 * 24 * 60 * 60 * 1000; // 7 days

let _db = null;

async function _openDB() {
  if (_db) return _db;
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('explorations')) {
        const store = db.createObjectStore('explorations', { keyPath: 'id' });
        store.createIndex('savedAt', 'savedAt');
      }
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = e => { _db = e.target.result; resolve(_db); };
    req.onerror   = e => reject(e.target.error);
  });
}

async function _getCached(id) {
  try {
    const db  = await _openDB();
    return new Promise(resolve => {
      const req = db.transaction(STORE, 'readonly').objectStore(STORE).get(id);
      req.onsuccess = e => {
        const entry = e.target.result;
        if (!entry) return resolve(null);
        if (Date.now() - entry.enrichedAt > TTL_MS) return resolve(null); // stale
        resolve(entry);
      };
      req.onerror = () => resolve(null);
    });
  } catch { return null; }
}

async function _setCache(id, data) {
  try {
    const db = await _openDB();
    const doc = { id, ...data, enrichedAt: Date.now() };
    const req = db.transaction(STORE, 'readwrite').objectStore(STORE).put(doc);
    req.onerror = () => {};
  } catch { /* silently ignore cache errors */ }
}

// ── Enrichment logic ──────────────────────────────────────────────────────────

const _inflight = new Set(); // prevent concurrent enrichments for the same node

/**
 * Enrich a node in-place with Wikipedia + geodata.
 * @param {string} nodeId
 * @returns {Promise<boolean>} true if any new data was added
 */
export async function enrichNode(nodeId) {
  if (_inflight.has(nodeId)) return false;
  _inflight.add(nodeId);

  try {
    const node = graph.getNode(nodeId);
    if (!node) return false;

    // Check cache first
    const cached = await _getCached(nodeId);
    if (cached) {
      _applyEnrichment(node, cached);
      log('SOURCE', `[Enrich] cache hit for "${node.label}"`);
      return true;
    }

    log('SOURCE', `[Enrich] enriching "${node.label}" (${nodeId})`);
    let changed = false;
    const enrichment = {};

    // ── Wikipedia summary + thumbnail ──────────────────────────────────────
    const wiki = await fetchWikiSummary(node.label);
    if (wiki) {
      enrichment.wikiSummary   = wiki.summary;
      enrichment.wikiThumbnail = wiki.thumbnail;
      enrichment.wikiUrl       = wiki.wikiUrl;
      changed = true;
    }

    // ── Geocoding (only for place-type nodes) ─────────────────────────────
    const placeTypes = ['place', 'country', 'city', 'location', 'geographic'];
    const nodeType   = (node.type ?? '').toLowerCase();
    const instLabel  = (node.instanceofLabel ?? '').toLowerCase();

    if (placeTypes.some(t => nodeType.includes(t) || instLabel.includes(t))) {
      const geo = await geocode(node.label);
      if (geo) {
        enrichment.geo = geo;
        changed = true;
      }
    }

    // ── Apply and cache ────────────────────────────────────────────────────
    if (changed) {
      _applyEnrichment(node, enrichment);
      await _setCache(nodeId, enrichment);
      log('SOURCE', `[Enrich] enriched "${node.label}"`, {
        wiki:  !!wiki,
        geo:   !!enrichment.geo,
      });
      // Rebuild visual arcs + label now that temporal/metric/profile data may exist
      refreshNodeVisual(nodeId, node);
    }

    return changed;
  } finally {
    _inflight.delete(nodeId);
  }
}

function _applyEnrichment(node, enrichment) {
  // Wikipedia summary: use if current description is empty or very short
  if (enrichment.wikiSummary && (!node.description || node.description.length < 30)) {
    node.description = enrichment.wikiSummary;
  }

  // Image fallback: only set if node has no image yet
  if (!node.image && enrichment.wikiThumbnail) {
    node.image = enrichment.wikiThumbnail;
  }

  // Wiki URL
  if (enrichment.wikiUrl) {
    node._wikiUrl = enrichment.wikiUrl;
  }

  // Geodata
  if (enrichment.geo) {
    node._geo = enrichment.geo;
  }

  // Mark as enriched
  node._enriched = true;
}
