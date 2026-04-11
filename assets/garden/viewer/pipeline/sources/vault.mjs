/**
 * vault.mjs — Local vault (digital garden) content source.
 *
 * Loads a pre-built garden-graph.json (emitted by homepage/scripts/build-garden.mjs)
 * and provides local search + graph population for vault-note nodes.
 *
 * Node schema (vault):
 *   { id, type:'vault-note', label, description, tags[], image, date, noteUrl, wikiLinks[] }
 *
 * The graph uses `id` as the qid for vault nodes. Edges use slug IDs.
 *
 * Usage:
 *   const vault = new VaultSource('/assets/garden/garden-graph.json');
 *   await vault.loadGraph(graph);          // populate graph store
 *   const results = vault.search('stream'); // local search
 */

import { ContentSource } from './source-base.mjs';
import { log } from '../../logger.mjs';

export class VaultSource extends ContentSource {
  name        = 'vault';
  displayName = 'Garden';
  icon        = '◈';

  /** @type {string} URL to garden-graph.json */
  _graphUrl = '';

  /** @type {{ nodes: object[], edges: object[], clusters: object, index: object[] } | null} */
  _data = null;

  /** @type {boolean} */
  _loaded = false;

  constructor(graphUrl) {
    super();
    this._graphUrl = graphUrl;
  }

  // ── Load ──────────────────────────────────────────────────────────────────

  /**
   * Fetch garden-graph.json and cache it.
   * @returns {Promise<void>}
   */
  async load() {
    if (this._loaded) return;
    try {
      const res = await fetch(this._graphUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      this._data   = await res.json();
      this._loaded = true;
      log('SOURCE', `[Vault] loaded ${this._data.nodes.length} notes, ${this._data.edges.length} edges`);
    } catch (err) {
      log('ERROR', `[Vault] failed to load ${this._graphUrl}`, { message: err.message });
    }
  }

  /**
   * Populate the kaaroViewer graph store with all published vault notes.
   * Call once on Garden page init — nodes get their IDs, edges are resolved.
   *
   * @param {import('../graph.mjs').Graph} graph
   */
  async loadGraph(graph) {
    await this.load();
    if (!this._data) return;

    for (const node of this._data.nodes) {
      graph.addNode(node.id, {
        ...node,
        qid:     node.id,    // alias for compatibility with rest of codebase
        _source: 'vault',
        _state:  'unvisited',
      });
    }

    for (const edge of this._data.edges) {
      graph.addEdge(edge.from, edge.to, edge.relLabel, edge.relLabel, {
        weight:   edge.weight   ?? 1,
        directed: edge.directed ?? true,
      });
    }

    log('SOURCE', `[Vault] graph populated`);
  }

  // ── Search ────────────────────────────────────────────────────────────────

  /**
   * Local search — no network.
   * Matches against id (slug), title, and tags.
   *
   * Returns ContentSource-compatible shape: { nodes, edges }
   * Matches are returned as node stubs for the caller to look up from graph.
   */
  async search(query) {
    await this.load();
    if (!this._data) return { nodes: [], edges: [] };

    const q = query.toLowerCase().trim();
    if (!q) return { nodes: [], edges: [] };

    const matched = this._data.index.filter(entry =>
      entry.id.includes(q) ||
      entry.title.toLowerCase().includes(q) ||
      entry.tags.some(t => t.toLowerCase().includes(q))
    );

    // Return full node objects for matched entries
    const nodeMap = new Map(this._data.nodes.map(n => [n.id, n]));
    const nodes   = matched.map(m => nodeMap.get(m.id)).filter(Boolean);

    log('SOURCE', `[Vault] search "${q}" → ${nodes.length} results`);
    return { nodes, edges: [] };
  }

  /**
   * Get a single node + its neighbors from the pre-loaded data.
   * @param {string} id — slug
   */
  async getDetail(id) {
    await this.load();
    if (!this._data) return { node: null, neighbors: [] };

    const node = this._data.nodes.find(n => n.id === id) ?? null;
    if (!node) return { node: null, neighbors: [] };

    const neighborIds = [
      ...this._data.edges.filter(e => e.from === id).map(e => e.to),
      ...this._data.edges.filter(e => e.to   === id).map(e => e.from),
    ];
    const nodeMap   = new Map(this._data.nodes.map(n => [n.id, n]));
    const neighbors = [...new Set(neighborIds)].map(nid => nodeMap.get(nid)).filter(Boolean);

    return { node, neighbors };
  }

  // ── Accessors ─────────────────────────────────────────────────────────────

  /** Returns the clusters object from the graph JSON (tag → color). */
  get clusters() { return this._data?.clusters ?? {}; }

  /** Returns the full node list (for layout seeding). */
  get allNodes() { return this._data?.nodes ?? []; }

  describe() { return 'Local digital garden — published notes from the vault'; }
}
