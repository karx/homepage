/**
 * detail.mjs — Bloomberg Terminal–style entity detail panel.
 *
 * Ontology labels are full words (Person, Country, located in…).
 * Acronyms only for UI controls (F2 PIN, F3 XPND, F4 CLR).
 *
 * Events dispatched on document:
 *   detail:navigate  { qid }
 *   detail:expand    { qid }
 *   detail:pin       { qid }
 */

import { getEntityStyle } from '../ontology.mjs';
import { getCrossDocEntities, getDocMeta } from '../pipeline/local-graph.mjs';

let _panel      = null;
let _currentQid = null;

export function initDetail() {
  _panel = document.getElementById('detail-panel');
  if (!_panel) return;
  _panel.addEventListener('click', _handleClick);
}

export function showDetail(node, edges, graphGetNode) {
  if (!_panel) return;
  _currentQid = node.qid;

  // Vault notes get their own panel layout
  if (node.type === 'vault-note') {
    return _showVaultDetail(node, edges, graphGetNode);
  }

  const typeLabel = getEntityStyle(node.type ?? 'default').label;
  const ts        = new Date().toISOString().slice(0, 19).replace('T', ' ');

  // Source badge
  const src      = node._source ?? 'wikidata';
  const srcIcon  = node._sourceIcon ?? '◇';
  const srcLabel = { wikidata: 'Wikidata', liquipedia: 'Liquipedia', reddit: 'Reddit', youtube: 'YouTube', local: 'Local' }[src] ?? src;

  const connections = edges
    .map(e => {
      const nQid     = e.from === node.qid ? e.to : e.from;
      const neighbor = graphGetNode(nQid);
      const nType    = getEntityStyle(neighbor?.type ?? 'default').label;
      return {
        qid:      nQid,
        label:    neighbor?.label ?? nQid,
        relLabel: e.relLabel || 'related to',
        type:     nType,
      };
    })
    .filter(c => c.label);

  // Geo section
  const geoHtml = node._geo ? `
    <div class="dp-row">
      <span class="dp-key">Location</span>
      <span class="dp-val dp-val-dim">${node._geo.lat.toFixed(4)}, ${node._geo.lon.toFixed(4)}</span>
    </div>` : '';

  // Cross-document entity occurrences (IA-01)
  const crossDocIds  = node.wikidata ? getCrossDocEntities(node.wikidata) : [];
  const otherDocIds  = crossDocIds.filter(id => id !== node._docId);
  const crossDocHtml = otherDocIds.length
    ? `<div class="dp-row">
        <span class="dp-key">Also in</span>
        <span class="dp-val dp-val-crossdoc">${
          otherDocIds.map(id => {
            const meta = getDocMeta(id);
            return `<span class="dp-crossdoc-pill" data-action="navigate-doc" data-doc-id="${_esc(id)}">${_esc(meta?.title ?? id)}</span>`;
          }).join('')
        }</span>
      </div>`
    : '';

  // Wiki link
  const wikiHtml = node._wikiUrl ? `
    <div class="dp-row">
      <span class="dp-key">Wikipedia</span>
      <span class="dp-val"><a href="${_esc(node._wikiUrl)}" target="_blank" style="color:#00ccff;text-decoration:none">Open article ↗</a></span>
    </div>` : '';

  // External URL (Liquipedia, Reddit, YouTube)
  const extHtml = node.url && !node._wikiUrl ? `
    <div class="dp-row">
      <span class="dp-key">Link</span>
      <span class="dp-val"><a href="${_esc(node.url)}" target="_blank" style="color:#ff6600;text-decoration:none">View on ${_esc(srcLabel)} ↗</a></span>
    </div>` : (node.url && node._wikiUrl ? `
    <div class="dp-row">
      <span class="dp-key">Source</span>
      <span class="dp-val"><a href="${_esc(node.url)}" target="_blank" style="color:#ff6600;text-decoration:none">${_esc(srcLabel)} ↗</a></span>
    </div>` : '');

  _panel.innerHTML = `
    <div class="dp-terminal">

      <div class="dp-header">
        <span class="dp-qid-code">${_esc(node.qid)}</span>
        <span class="dp-type-label">${_esc(typeLabel)}</span>
        <span class="dp-source-badge" data-src="${_esc(src)}">${srcIcon} ${_esc(srcLabel).toUpperCase()}</span>
        <div class="dp-header-actions">
          <button class="dp-key-btn" data-action="pin"    title="Pin">F2 PIN</button>
          <button class="dp-key-btn" data-action="expand" title="Expand">F3 XPND</button>
          <button class="dp-key-btn dp-close-btn" data-action="close">F4 CLR</button>
        </div>
      </div>

      <div class="dp-entity-title">${_esc((node.label ?? node.qid).toUpperCase())}</div>

      ${node.image
        ? `<div class="dp-img-wrap"><img class="dp-img" src="${_esc(node.image)}" alt="" loading="lazy"></div>`
        : ''}

      <div class="dp-rows">
        <div class="dp-row">
          <span class="dp-key">Type</span>
          <span class="dp-val">${_esc(node.instanceofLabel || typeLabel)}</span>
        </div>
        ${node.description ? `
        <div class="dp-row">
          <span class="dp-key">About</span>
          <span class="dp-val dp-val-desc">${_esc(node.description)}</span>
        </div>` : ''}
        ${geoHtml}
        ${crossDocHtml}
        ${wikiHtml}
        ${extHtml}
        <div class="dp-row">
          <span class="dp-key">Fetched</span>
          <span class="dp-val dp-val-dim">${ts} UTC${node._enriched ? ' · enriched' : ''}</span>
        </div>
        <div class="dp-row">
          <span class="dp-key">Connections</span>
          <span class="dp-val dp-val-orange">${connections.length}</span>
        </div>
      </div>

      ${connections.length ? `
        <div class="dp-section-hdr">─── connections ───────────────</div>
        <ul class="dp-conn-list">
          ${connections.map(c => `
            <li class="dp-conn" data-action="navigate" data-qid="${_esc(c.qid)}">
              <span class="dp-conn-type">${_esc(c.type)}</span>
              <span class="dp-conn-rel">${_esc(c.relLabel)}</span>
              <span class="dp-conn-label">${_esc(c.label)}</span>
            </li>
          `).join('')}
        </ul>
      ` : `<div class="dp-empty-msg">&gt; No connections loaded yet<br>&gt; Press F3 XPND to expand</div>`}

      <div class="dp-footer">kaaroViewer  ·  ${_esc(srcLabel)}  ·  ${_esc(node.qid)}</div>
    </div>
  `;

  _panel.classList.add('open');
}

// ── Vault note panel ─────────────────────────────────────────────────────────

function _showVaultDetail(node, edges, graphGetNode) {
  const connections = edges
    .map(e => {
      const nId      = e.from === node.qid ? e.to : e.from;
      const neighbor = graphGetNode(nId);
      return { id: nId, label: neighbor?.label ?? nId };
    })
    .filter(c => c.label);

  const tagsHtml = (node.tags ?? []).length
    ? `<div class="dp-row">
        <span class="dp-key">Tags</span>
        <span class="dp-val">${node.tags.map(t =>
          `<span class="dp-tag-pill">${_esc(t)}</span>`
        ).join(' ')}</span>
      </div>`
    : '';

  const dateHtml = node.date
    ? `<div class="dp-row">
        <span class="dp-key">Updated</span>
        <span class="dp-val dp-val-dim">${_esc(node.date)}</span>
      </div>`
    : '';

  _panel.innerHTML = `
    <div class="dp-terminal dp-vault">

      <div class="dp-header">
        <span class="dp-qid-code">${_esc(node.id)}</span>
        <span class="dp-type-label">garden note</span>
        <span class="dp-source-badge" data-src="vault">◈ GARDEN</span>
        <div class="dp-header-actions">
          <button class="dp-key-btn" data-action="pin"   title="Pin">F2 PIN</button>
          <button class="dp-key-btn dp-close-btn" data-action="close">F4 CLR</button>
        </div>
      </div>

      <div class="dp-entity-title">${_esc((node.label ?? node.id).toUpperCase())}</div>

      ${node.image
        ? `<div class="dp-img-wrap"><img class="dp-img" src="${_esc(node.image)}" alt="" loading="lazy"></div>`
        : ''}

      <div class="dp-rows">
        ${node.description ? `
        <div class="dp-row">
          <span class="dp-key">About</span>
          <span class="dp-val dp-val-desc">${_esc(node.description)}</span>
        </div>` : ''}
        ${tagsHtml}
        ${dateHtml}
        <div class="dp-row">
          <span class="dp-key">Connections</span>
          <span class="dp-val dp-val-orange">${connections.length}</span>
        </div>
      </div>

      ${connections.length ? `
        <div class="dp-section-hdr">─── linked notes ───────────────</div>
        <ul class="dp-conn-list">
          ${connections.map(c => `
            <li class="dp-conn" data-action="navigate" data-qid="${_esc(c.id)}">
              <span class="dp-conn-rel">→</span>
              <span class="dp-conn-label">${_esc(c.label)}</span>
            </li>
          `).join('')}
        </ul>
      ` : `<div class="dp-empty-msg">&gt; No linked notes<br>&gt; Add [[WikiLinks]] in the vault</div>`}

      ${node.noteUrl ? `
        <div class="dp-vault-cta">
          <a href="${_esc(node.noteUrl)}" target="_blank" class="dp-read-link">Read full note ↗</a>
        </div>
      ` : ''}

      <div class="dp-footer">garden  ·  ${_esc(node.id)}</div>
    </div>
  `;

  _panel.classList.add('open');
}

export function hideDetail() {
  if (!_panel) return;
  _panel.classList.remove('open');
  _currentQid = null;
}

export function getCurrentQid() { return _currentQid; }

function _handleClick(e) {
  const t = e.target.closest('[data-action]');
  if (!t) return;
  const a = t.dataset.action;
  if (a === 'close')    return hideDetail();
  if (a === 'expand')   return document.dispatchEvent(new CustomEvent('detail:expand',   { detail: { qid: _currentQid } }));
  if (a === 'pin')      return document.dispatchEvent(new CustomEvent('detail:pin',      { detail: { qid: _currentQid } }));
  if (a === 'navigate') return document.dispatchEvent(new CustomEvent('detail:navigate', { detail: { qid: t.dataset.qid } }));
  if (a === 'navigate-doc') return document.dispatchEvent(new CustomEvent('detail:navigate-doc', { detail: { docId: t.dataset.docId } }));
}

function _esc(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
