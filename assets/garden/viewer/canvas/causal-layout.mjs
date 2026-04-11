/**
 * causal-layout.mjs — Layered left→right layout for domain reports.
 *
 * Arranges nodes by causal flow:
 *   [Root Causes / Concepts]  →  [Issues / Effects]  →  [Solutions / Mitigations]
 *          left                      center                    right
 *
 * Algorithm:
 *   1. Build directed adjacency from graph edges
 *   2. Topological layering: nodes with no incoming edges = layer 0
 *   3. Assign X by layer, Y by order within layer (spread evenly)
 *   4. Animate smoothly from current to target positions
 *
 * Toggle: F7 — switches between force-directed (default) and causal flow.
 */

import { graph }              from '../pipeline/graph.mjs';
import { updateNodePosition } from './nodes.mjs';
import { syncEdgePositions }  from './edges.mjs';
import { getPosition, setPosition } from './layout.mjs';
import { log }                from '../logger.mjs';

let _isCausal  = false;
let _animRafId = null;
const _savedPositions = new Map(); // store original positions for toggle-back

export function isCausalMode() { return _isCausal; }

/**
 * Toggle between force-directed and causal flow layout.
 */
export function toggleCausalLayout() {
  if (_isCausal) {
    _restorePositions();
    _isCausal = false;
    log('SYSTEM', 'layout: force-directed');
  } else {
    _applyCausalLayout();
    _isCausal = true;
    log('SYSTEM', 'layout: causal flow (L→R)');
  }
}

function _applyCausalLayout() {
  const nodeIds = [...graph.nodes.keys()];
  if (nodeIds.length < 3) {
    log('SYSTEM', 'causal layout requires ≥3 nodes');
    return;
  }

  // Save current positions for toggle-back
  _savedPositions.clear();
  for (const id of nodeIds) {
    const pos = getPosition(id);
    if (pos) _savedPositions.set(id, [...pos]);
  }

  // ── Build directed adjacency ────────────────────────────────────────────
  const incoming = new Map(nodeIds.map(id => [id, []]));
  const outgoing = new Map(nodeIds.map(id => [id, []]));

  for (const edge of graph.edges.values()) {
    if (incoming.has(edge.to)) incoming.get(edge.to).push(edge.from);
    if (outgoing.has(edge.from)) outgoing.get(edge.from).push(edge.to);
  }

  // ── Assign layers via BFS from roots ────────────────────────────────────
  const layer = new Map();
  const roots = nodeIds.filter(id => incoming.get(id).length === 0);

  // If no roots (all have incoming), pick nodes with min incoming as roots
  if (roots.length === 0) {
    const minIn = Math.min(...nodeIds.map(id => incoming.get(id).length));
    roots.push(...nodeIds.filter(id => incoming.get(id).length === minIn));
  }

  // BFS to assign layers
  const queue = [];
  for (const r of roots) {
    layer.set(r, 0);
    queue.push(r);
  }

  while (queue.length > 0) {
    const cur = queue.shift();
    const curLayer = layer.get(cur);
    for (const next of (outgoing.get(cur) ?? [])) {
      const existing = layer.get(next);
      if (existing === undefined || existing < curLayer + 1) {
        layer.set(next, curLayer + 1);
        queue.push(next);
      }
    }
  }

  // Assign unvisited nodes to layer 0
  for (const id of nodeIds) {
    if (!layer.has(id)) layer.set(id, 0);
  }

  // ── Group by layer ──────────────────────────────────────────────────────
  const layers = new Map(); // layerNum → [nodeId]
  for (const [id, l] of layer) {
    if (!layers.has(l)) layers.set(l, []);
    layers.get(l).push(id);
  }

  const numLayers = Math.max(...layers.keys()) + 1;
  const LAYER_GAP = 8;   // X distance between layers
  const NODE_GAP  = 5;   // Y distance between nodes in same layer

  // ── Compute target positions ────────────────────────────────────────────
  const targets = new Map();
  for (const [l, ids] of layers) {
    const x = (l - (numLayers - 1) / 2) * LAYER_GAP;
    const totalHeight = (ids.length - 1) * NODE_GAP;
    ids.forEach((id, i) => {
      const y = (i * NODE_GAP) - totalHeight / 2;
      targets.set(id, [x, y, 0]);
    });
  }

  // ── Animate to target positions ─────────────────────────────────────────
  _animateToTargets(targets, 60);
}

function _restorePositions() {
  if (_savedPositions.size === 0) return;
  _animateToTargets(_savedPositions, 40);
}

function _animateToTargets(targets, frames) {
  if (_animRafId !== null) cancelAnimationFrame(_animRafId);

  let remaining = frames;
  const speed = 1 / frames;

  function step() {
    if (remaining-- <= 0) { _animRafId = null; return; }

    for (const [id, target] of targets) {
      const current = getPosition(id);
      if (!current) continue;

      // Lerp toward target
      current[0] += (target[0] - current[0]) * speed * 4;
      current[1] += (target[1] - current[1]) * speed * 4;
      current[2] += (target[2] - current[2]) * speed * 4;

      setPosition(id, current);
      updateNodePosition(id, current);
    }
    syncEdgePositions();

    _animRafId = requestAnimationFrame(step);
  }

  _animRafId = requestAnimationFrame(step);
}
