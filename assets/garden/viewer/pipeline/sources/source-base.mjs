/**
 * source-base.mjs — ContentSource base class.
 *
 * Every external source (Liquipedia, Reddit, YouTube) extends this.
 * Returns data in the same node/edge shape the graph understands.
 */

export class ContentSource {
  /** @type {string} internal key, e.g. 'liquipedia' */
  name = '';
  /** @type {string} human-readable, e.g. 'Liquipedia' */
  displayName = '';
  /** @type {string} single char / emoji for UI badges */
  icon = '◆';
  /** @type {boolean} */
  enabled = true;

  /**
   * Search the source for a query string.
   * @param {string} query
   * @returns {Promise<{nodes: object[], edges: object[]}>}
   */
  async search(query) {
    throw new Error(`${this.name}: search() not implemented`);
  }

  /**
   * Get detail + neighbors for a single source-native ID.
   * @param {string} id
   * @returns {Promise<{node: object|null, neighbors: object[]}>}
   */
  async getDetail(id) {
    return { node: null, neighbors: [] };
  }

  /** Human description of this source. */
  describe() {
    return `${this.displayName} content source`;
  }
}
