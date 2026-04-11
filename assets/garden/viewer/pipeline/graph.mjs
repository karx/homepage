/**
 * graph.mjs — in-memory node/edge store with event emission.
 *
 * Nodes:  { qid, label, type, image, description, position, addedAt }
 * Edges:  { from, to, pid, relLabel, addedAt }
 *
 * Events: 'node:added', 'edge:added', 'graph:cleared'
 */

class Emitter {
  constructor() { this._h = {}; }
  on(event, fn)  { (this._h[event] ??= []).push(fn); return this; }
  off(event, fn) { this._h[event] = (this._h[event] ?? []).filter(f => f !== fn); }
  emit(event, ...args) { (this._h[event] ?? []).forEach(fn => fn(...args)); }
}

class Graph extends Emitter {
  constructor() {
    super();
    this.nodes = new Map(); // qid → node
    this.edges = new Map(); // edgeKey → edge
  }

  hasNode(qid)  { return this.nodes.has(qid); }
  getNode(qid)  { return this.nodes.get(qid); }

  addNode(qid, data) {
    if (this.nodes.has(qid)) return false;
    const node = { qid, ...data, addedAt: Date.now() };
    this.nodes.set(qid, node);
    this.emit('node:added', node);
    return true;
  }

  addEdge(from, to, pid, relLabel = '', meta = {}) {
    const key = `${from}→${to}→${pid}`;
    if (this.edges.has(key)) return false;
    const edge = {
      from, to, pid, relLabel,
      weight:   meta.weight   ?? 1,
      directed: meta.directed ?? false,
      temporal: meta.temporal ?? null,
      addedAt: Date.now(),
    };
    this.edges.set(key, edge);
    this.emit('edge:added', edge);
    return true;
  }

  getNeighborQids(qid) {
    const out = new Set();
    for (const e of this.edges.values()) {
      if (e.from === qid) out.add(e.to);
      if (e.to   === qid) out.add(e.from);
    }
    return [...out];
  }

  getEdgesFor(qid) {
    return [...this.edges.values()].filter(e => e.from === qid || e.to === qid);
  }

  removeNode(qid) {
    if (!this.nodes.has(qid)) return false;
    this.nodes.delete(qid);
    for (const [key, edge] of this.edges) {
      if (edge.from === qid || edge.to === qid) this.edges.delete(key);
    }
    this.emit('node:removed', { qid });
    return true;
  }

  clear() {
    this.nodes.clear();
    this.edges.clear();
    this.emit('graph:cleared');
  }

  stats() {
    return { nodes: this.nodes.size, edges: this.edges.size };
  }
}

export const graph = new Graph();
