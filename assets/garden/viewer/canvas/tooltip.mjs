/**
 * tooltip.mjs — rich hover tooltip that follows the cursor.
 *
 * showTooltip(node, x, y) — accepts a full graph node object.
 * Renders: label, type code, tier, sentiment dot, description snippet, first metric.
 */

const SENT_COLOR = { positive: '#00ff88', negative: '#ff4444', contested: '#ffaa00' };
const TIER_CODE  = { spine: 'SPN', primary: 'PRI', secondary: 'SEC', anchor: 'ANC' };

let _el = null;

export function initTooltip() {
  _el = document.createElement('div');
  _el.className = 'node-tooltip';
  _el.style.display = 'none';
  document.body.appendChild(_el);
  document.addEventListener('pointermove', e => {
    if (_el.style.display === 'none') return;
    _el.style.left = (e.clientX + 14) + 'px';
    _el.style.top  = (e.clientY - 10) + 'px';
  });
}

/**
 * @param {object} node  — graph node (label, type, tier, sentiment, description, metrics)
 * @param {number} x
 * @param {number} y
 */
export function showTooltip(node, x, y) {
  if (!_el) return;

  const label      = node.label ?? node.qid ?? '';
  const typeStr    = node.instanceofLabel || node.type || '';
  const tierCode   = TIER_CODE[node.tier] ?? '';
  const sentColor  = SENT_COLOR[node.sentiment] ?? null;
  const sentDot    = sentColor
    ? `<span class="tt-sent-dot" style="background:${sentColor}"></span>`
    : '';
  const desc       = node.description
    ? _esc(node.description.length > 90
        ? node.description.slice(0, 89) + '…'
        : node.description)
    : '';
  const firstM     = node.metrics ? Object.entries(node.metrics)[0] : null;
  const metricHtml = firstM
    ? `<div class="tt-metric"><em>${_esc(firstM[0])}</em><span>${_esc(String(firstM[1]))}</span></div>`
    : '';

  _el.innerHTML = `
    <div class="tt-top">
      ${sentDot}
      <span class="tt-label">${_esc(label)}</span>
      ${tierCode ? `<span class="tt-tier">${tierCode}</span>` : ''}
    </div>
    <span class="tt-type">${_esc(typeStr.toUpperCase())}</span>
    ${desc ? `<p class="tt-desc">${desc}</p>` : ''}
    ${metricHtml}
  `;
  _el.style.display = 'block';
  _el.style.left = (x + 14) + 'px';
  _el.style.top  = (y - 10) + 'px';
}

export function hideTooltip() {
  if (_el) _el.style.display = 'none';
}

function _esc(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
