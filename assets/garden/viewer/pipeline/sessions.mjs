/**
 * sessions.mjs — IndexedDB-backed exploration sessions.
 *
 * A session is a snapshot of:
 *   - graph nodes + edges
 *   - camera position + target
 *   - breadcrumb trail
 *   - pinned nodes
 */

const DB_NAME    = 'kaaroViewer';
const DB_VERSION = 1;
const STORE      = 'explorations';

let _db = null;

async function _open() {
  if (_db) return _db;
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id' });
        store.createIndex('savedAt', 'savedAt');
      }
    };
    req.onsuccess = e => { _db = e.target.result; resolve(_db); };
    req.onerror   = e => reject(e.target.error);
  });
}

function _uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export async function saveSession({ name, nodes, edges, camera, breadcrumb, pinned = [] }) {
  const db  = await _open();
  const doc = {
    id:         _uid(),
    name:       name || `Session ${new Date().toLocaleString()}`,
    savedAt:    Date.now(),
    nodes, edges, camera, breadcrumb, pinned,
  };
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE, 'readwrite').objectStore(STORE).put(doc);
    req.onsuccess = () => resolve(doc);
    req.onerror   = e => reject(e.target.error);
  });
}

export async function updateSession(id, patch) {
  const db      = await _open();
  const existing = await loadSession(id);
  if (!existing) throw new Error(`Session ${id} not found`);
  const doc = { ...existing, ...patch, id, savedAt: Date.now() };
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE, 'readwrite').objectStore(STORE).put(doc);
    req.onsuccess = () => resolve(doc);
    req.onerror   = e => reject(e.target.error);
  });
}

export async function loadSession(id) {
  const db = await _open();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE, 'readonly').objectStore(STORE).get(id);
    req.onsuccess = e => resolve(e.target.result ?? null);
    req.onerror   = e => reject(e.target.error);
  });
}

export async function listSessions() {
  const db = await _open();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE, 'readonly').objectStore(STORE).index('savedAt').getAll();
    req.onsuccess = e => resolve((e.target.result ?? []).reverse());
    req.onerror   = e => reject(e.target.error);
  });
}

export async function deleteSession(id) {
  const db = await _open();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE, 'readwrite').objectStore(STORE).delete(id);
    req.onsuccess = () => resolve();
    req.onerror   = e => reject(e.target.error);
  });
}
