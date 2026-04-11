/**
 * narrative.mjs — Guided tour / narrative mode.
 *
 * Reads a `tour` array from library docs or auto-generates from breadcrumbs.
 * F6 starts/pauses. Arrow keys for manual prev/next. Escape exits.
 *
 * Tour format (in library JSON):
 *   "tour": [
 *     { "node": "qcommerce",      "narration": "India's Q-Commerce sector..." },
 *     { "node": "algo-management", "narration": "Workers managed by algorithms" }
 *   ]
 */

import { graph }     from '../pipeline/graph.mjs';
import { getCrumbs } from './breadcrumb.mjs';
import { log }       from '../logger.mjs';

let _tour       = [];      // current tour steps
let _stepIndex  = -1;
let _playing    = false;
let _timerId    = null;
let _overlay     = null;
let _onFocus     = null;   // callback(qid) provided by main.mjs
let _stepPause   = 3500;   // ms between auto-advance steps

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Initialize narrative module.
 * @param {function} focusFn — function(qid) to focus a node
 */
export function initNarrative(focusFn) {
  _onFocus = focusFn;
  _createOverlay();
}

/**
 * Load a tour from a library doc's tour field.
 * @param {Array} tour — [{node, narration}]
 */
export function loadTour(tour) {
  if (!Array.isArray(tour) || tour.length === 0) return;
  _tour = tour.filter(s => s.node && graph.hasNode(s.node));
  log('SYSTEM', `narrative: loaded ${_tour.length} tour steps`);
}

/**
 * Toggle play/pause. If no tour loaded, auto-generate from breadcrumbs.
 */
export function toggleNarrative() {
  if (_playing) {
    _pause();
    return;
  }

  // Auto-generate tour from breadcrumbs if none loaded
  if (_tour.length === 0) {
    const crumbs = getCrumbs();
    if (crumbs.length < 2) {
      log('SYSTEM', 'narrative: explore some nodes first, or load a doc with a "tour" field');
      return;
    }
    _tour = crumbs.map(c => ({
      node:      c.qid,
      narration: graph.getNode(c.qid)?.description?.slice(0, 120) ?? c.label,
    }));
    log('SYSTEM', `narrative: auto-generated ${_tour.length} steps from breadcrumbs`);
  }

  _stepIndex = -1;
  _play();
}

export function narrativeNext() {
  if (_tour.length === 0) return;
  _pause();
  _advance(1);
}

export function narrativePrev() {
  if (_tour.length === 0) return;
  _pause();
  _advance(-1);
}

export function stopNarrative() {
  _pause();
  _tour = [];
  _stepIndex = -1;
  _hideOverlay();
  log('SYSTEM', 'narrative: stopped');
}

export function isNarrativeActive() { return _playing || _stepIndex >= 0; }

// ── Internal ──────────────────────────────────────────────────────────────────

function _play() {
  _playing = true;
  log('SYSTEM', 'narrative: playing');
  _advance(1);
}

function _pause() {
  _playing = false;
  if (_timerId) { clearTimeout(_timerId); _timerId = null; }
}

function _advance(dir) {
  _stepIndex = Math.max(0, Math.min(_tour.length - 1, _stepIndex + dir));
  const step = _tour[_stepIndex];
  if (!step) return;

  // Focus the node
  if (_onFocus && graph.hasNode(step.node)) {
    _onFocus(step.node);
  }

  // Show narration overlay
  _showOverlay(step, _stepIndex, _tour.length);

  // Auto-advance if playing
  if (_playing && _stepIndex < _tour.length - 1) {
    _timerId = setTimeout(() => _advance(1), _stepPause);
  } else if (_playing && _stepIndex >= _tour.length - 1) {
    _playing = false;
    log('SYSTEM', 'narrative: tour complete');
  }
}

// ── Overlay DOM ───────────────────────────────────────────────────────────────

function _createOverlay() {
  if (document.getElementById('narrative-overlay')) {
    _overlay = document.getElementById('narrative-overlay');
    return;
  }

  _overlay = document.createElement('div');
  _overlay.id = 'narrative-overlay';
  _overlay.className = 'narrative-overlay hidden';
  _overlay.innerHTML = `
    <div class="narr-progress"></div>
    <div class="narr-label"></div>
    <div class="narr-text"></div>
    <div class="narr-controls">
      <span class="narr-step-info"></span>
      <span class="narr-hint">← → navigate · SPACE pause · ESC exit</span>
    </div>
  `;
  document.body.appendChild(_overlay);
}

function _showOverlay(step, index, total) {
  if (!_overlay) return;

  const node = graph.getNode(step.node);
  const label = node?.label ?? step.node;

  _overlay.querySelector('.narr-label').textContent = label.toUpperCase();
  _overlay.querySelector('.narr-text').textContent  = step.narration ?? '';
  _overlay.querySelector('.narr-step-info').textContent = `${index + 1} / ${total}`;

  // Progress dots
  const dots = _overlay.querySelector('.narr-progress');
  dots.innerHTML = Array.from({ length: total }, (_, i) =>
    `<span class="narr-dot ${i === index ? 'narr-dot-active' : ''} ${i < index ? 'narr-dot-done' : ''}"></span>`
  ).join('');

  _overlay.classList.remove('hidden');
}

function _hideOverlay() {
  if (_overlay) _overlay.classList.add('hidden');
}
