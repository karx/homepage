/**
 * logger.mjs — structured event logger for kaaroViewer
 *
 * Usage:
 *   import { log } from './logger.mjs';
 *   log('SPARQL', 'entity byte fetched', { qid: 'Q668', bindings: 12 });
 *
 * Console access:
 *   window.kaaroLogs.get()       → array of all log entries
 *   window.kaaroLogs.download()  → download session as JSON file
 *   window.kaaroLogs.clear()     → clear current session
 *   window.kaaroLogs.filter(type) → filter by event type
 */

export const LOG_TYPES = {
  INPUT:        { color: '#00cec9' },  // teal   — user text input
  ENTITY_MATCH: { color: '#fdcb6e' },  // yellow — OpenTapioca NLP
  SPARQL:       { color: '#a29bfe' },  // purple — Wikidata SPARQL
  VIEWER:       { color: '#55efc4' },  // green  — 3D scene events
  MQTT:         { color: '#fd79a8' },  // pink   — MQTT messages
  ERROR:        { color: '#ff7675' },  // red    — failures
  SYSTEM:       { color: '#b2bec3' },  // grey   — lifecycle events
};

const RING_SIZE = 500;
export const SESSION_ID = Date.now().toString(36).toUpperCase();

let _entries = [];
let _seq = 0;

/**
 * Log an event.
 * @param {keyof LOG_TYPES} type  - event category
 * @param {string}          label - short human-readable summary
 * @param {object}          payload - full data to store (optional)
 * @returns the log entry object
 */
export function log(type, label, payload = {}) {
  const entry = {
    id:      ++_seq,
    ts:      new Date().toISOString(),
    session: SESSION_ID,
    type,
    label:   String(label),
    payload,
  };

  // Ring buffer — drop oldest when full
  if (_entries.length >= RING_SIZE) _entries.shift();
  _entries.push(entry);

  _persist();
  _renderDOM(entry);
  _consoleLog(entry);

  return entry;
}

/**
 * Wrap an async function call and log its request + response automatically.
 * @param {string}   type       - LOG_TYPES key
 * @param {string}   label      - base label (e.g. "OpenTapioca")
 * @param {object}   reqPayload - logged with the "request" entry
 * @param {Function} fn         - async function to call; its return value is logged
 * @returns the return value of fn
 */
export async function logCall(type, label, reqPayload, fn) {
  log(type, `${label} → request`, reqPayload);
  const t0 = performance.now();
  try {
    const result = await fn();
    const ms = Math.round(performance.now() - t0);
    log(type, `${label} ← response (${ms}ms)`, _summarise(result));
    return result;
  } catch (err) {
    const ms = Math.round(performance.now() - t0);
    log('ERROR', `${label} failed (${ms}ms)`, { message: err.message, stack: err.stack });
    throw err;
  }
}

// ── Accessors ────────────────────────────────────────────────────────────────

export function getLogs()           { return [..._entries]; }
export function filterLogs(type)    { return _entries.filter(e => e.type === type); }

export function downloadLogs() {
  const data = JSON.stringify({ session: SESSION_ID, entries: _entries }, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), {
    href:     url,
    download: `kaaro-logs-${SESSION_ID}.json`,
  });
  a.click();
  URL.revokeObjectURL(url);
  log('SYSTEM', `logs downloaded (${_entries.length} entries)`);
}

export function clearLogs() {
  const count = _entries.length;
  _entries = [];
  _seq = 0;
  try { localStorage.removeItem(`kaaro_log_${SESSION_ID}`); } catch(_) {}
  document.querySelectorAll('#logger .log-entry').forEach(el => el.remove());
  log('SYSTEM', `log cleared (${count} entries removed)`);
}

// ── Internal ─────────────────────────────────────────────────────────────────

function _persist() {
  try {
    localStorage.setItem(`kaaro_log_${SESSION_ID}`, JSON.stringify(_entries));
  } catch (_) { /* storage full — silently skip */ }
}

function _renderDOM(entry) {
  const logger = document.getElementById('logger');
  if (!logger) return;

  const color = LOG_TYPES[entry.type]?.color ?? '#ccc';

  const el = document.createElement('div');
  el.classList.add('log-string', 'log-entry');
  el.dataset.logType = entry.type;
  el.dataset.logId   = String(entry.id);

  el.innerHTML =
    `<span class="log-type-badge" style="background:${color}15;color:${color};border:1px solid ${color}40">${_esc(entry.type)}</span>` +
    `<span class="log-label-text">${_esc(entry.label)}</span>`;

  // Click → toggle payload panel
  el.addEventListener('click', () => {
    const existing = el.querySelector('.log-payload-panel');
    if (existing) { existing.remove(); return; }
    const pre = document.createElement('pre');
    pre.classList.add('log-payload-panel');
    pre.textContent = JSON.stringify(entry.payload, null, 2);
    el.appendChild(pre);
  });

  logger.appendChild(el);
  // Keep latest entry in view (horizontal scroll)
  logger.scrollLeft = logger.scrollWidth;
}

function _consoleLog(entry) {
  const color = LOG_TYPES[entry.type]?.color ?? '#fff';
  console.log(
    `%c[${entry.type}]%c #${entry.id} ${entry.label}`,
    `color:${color};font-weight:700`,
    'color:#94a3b8',
    entry.payload,
  );
}

/** Summarise a SPARQL response payload so it doesn't bloat the log. */
function _summarise(result) {
  if (!result || typeof result !== 'object') return { value: result };

  // SPARQL results shape
  if (result.results?.bindings) {
    const bindings = result.results.bindings;
    return {
      bindingCount: bindings.length,
      sample: bindings.slice(0, 2),
    };
  }

  // Entity byte shape { data, firsthop }
  if (result.data?.results && result.firsthop?.results) {
    return {
      dataBindings:     result.data.results.bindings?.length ?? 0,
      firsthopBindings: result.firsthop.results.bindings?.length ?? 0,
    };
  }

  // Generic — trim arrays to avoid huge payloads
  const out = {};
  for (const [k, v] of Object.entries(result)) {
    out[k] = Array.isArray(v) ? `[${v.length} items]` : v;
  }
  return out;
}

function _esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ── Global console access ────────────────────────────────────────────────────

window.kaaroLogs = {
  get:      getLogs,
  filter:   filterLogs,
  download: downloadLogs,
  clear:    clearLogs,
  session:  SESSION_ID,
};

log('SYSTEM', `session started · id:${SESSION_ID} · ring:${RING_SIZE}`);
