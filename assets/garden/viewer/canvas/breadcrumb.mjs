/**
 * breadcrumb.mjs — navigation trail across focused entities.
 * Emits 'bc:navigate' on the #breadcrumb element when a crumb is clicked.
 */

const _trail = []; // [{ qid, label }]

export function pushCrumb(qid, label) {
  // If QID already in trail, truncate back to it (navigating backwards)
  const idx = _trail.findIndex(c => c.qid === qid);
  if (idx !== -1) {
    _trail.splice(idx + 1);
  } else {
    _trail.push({ qid, label: label ?? qid });
  }
  _render();
}

export function getCrumbs() { return [..._trail]; }
export function clearCrumbs() { _trail.length = 0; _render(); }

function _render() {
  const el = document.getElementById('breadcrumb');
  if (!el) return;

  if (!_trail.length) {
    el.innerHTML = '<span class="bc-empty">explore something…</span>';
    return;
  }

  el.innerHTML = _trail.map((c, i) => {
    const isCurrent = i === _trail.length - 1;
    return `<span class="bc-item${isCurrent ? ' bc-current' : ''}" data-qid="${c.qid}">${_esc(c.label)}</span>`;
  }).join('<span class="bc-sep">›</span>');

  el.querySelectorAll('.bc-item').forEach(item => {
    item.addEventListener('click', () => {
      el.dispatchEvent(new CustomEvent('bc:navigate', {
        detail: { qid: item.dataset.qid },
        bubbles: true,
      }));
    });
  });
}

function _esc(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
