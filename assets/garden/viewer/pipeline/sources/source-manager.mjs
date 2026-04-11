/**
 * source-manager.mjs — registry for all external content sources.
 *
 * Provides:
 *   register(source)        — add a ContentSource
 *   searchAll(query)        — search ALL enabled sources, merge results
 *   searchSource(name, q)   — search a specific source
 *   toggle(name, enabled)   — enable/disable a source
 *   getAll()                — list all sources with their status
 *
 * Returns merged { nodes, edges } in the same shape local-graph.mjs uses.
 */

import { log } from '../../logger.mjs';

class SourceManager {
  /** @type {Map<string, import('./source-base.mjs').ContentSource>} */
  _sources = new Map();

  /** Register a content source. */
  register(source) {
    this._sources.set(source.name, source);
    log('SYSTEM', `source registered: ${source.displayName} ${source.icon}`);
  }

  /** Toggle a source on/off. */
  toggle(name, enabled) {
    const src = this._sources.get(name);
    if (src) {
      src.enabled = enabled;
      log('SYSTEM', `source ${name} ${enabled ? 'enabled' : 'disabled'}`);
    }
  }

  /** Get all registered sources. */
  getAll() {
    return [...this._sources.values()];
  }

  /** Get active (enabled) sources. */
  getActive() {
    return [...this._sources.values()].filter(s => s.enabled);
  }

  /** Search a specific source by name. */
  async searchSource(name, query) {
    const src = this._sources.get(name);
    if (!src) {
      log('ERROR', `unknown source: ${name}`);
      return { nodes: [], edges: [] };
    }
    if (!src.enabled) {
      log('SOURCE', `source ${name} is disabled`);
      return { nodes: [], edges: [] };
    }
    return src.search(query);
  }

  /**
   * Search ALL enabled sources in parallel, merge results.
   * @param {string} query
   * @returns {Promise<{nodes: object[], edges: object[]}>}
   */
  async searchAll(query) {
    const active = this.getActive();
    if (!active.length) {
      log('SOURCE', 'no active sources');
      return { nodes: [], edges: [] };
    }

    log('SOURCE', `searching ${active.length} sources: ${active.map(s => s.name).join(', ')}`);

    const results = await Promise.allSettled(
      active.map(src => src.search(query))
    );

    const nodes = [];
    const edges = [];

    for (let i = 0; i < results.length; i++) {
      const r = results[i];
      if (r.status === 'fulfilled') {
        nodes.push(...r.value.nodes);
        edges.push(...r.value.edges);
      } else {
        log('ERROR', `source ${active[i].name} failed`, { message: r.reason?.message });
      }
    }

    log('SOURCE', `merged: ${nodes.length} nodes, ${edges.length} edges`);
    return { nodes, edges };
  }
}

export const sourceManager = new SourceManager();
