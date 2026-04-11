/**
 * layout.mjs — spatial positioning for graph nodes.
 *
 * Strategy:
 *   - New root node → near origin
 *   - New neighbor → sphere shell around its parent, radius scales with degree
 *   - After placement, run a short force-directed relaxation to prevent overlap
 */

import { graph } from '../pipeline/graph.mjs';
import { updateNodePosition } from './nodes.mjs';
import { syncEdgePositions }  from './edges.mjs';

const _positions = new Map(); // qid → [x, y, z]
let   _rafId     = null;

// ── Public ────────────────────────────────────────────────────────────────────

/** Compute and store an initial position for a new node. */
export function placeNode(qid, parentQid = null) {
  if (_positions.has(qid)) return _positions.get(qid);

  let pos;
  if (!parentQid || !_positions.has(parentQid)) {
    // Root node: scatter slightly around origin so multiple roots spread out
    pos = _jitter([0, 0, 0], 1.5);
  } else {
    const parentPos  = _positions.get(parentQid);
    const siblings   = graph.getNeighborQids(parentQid).length;
    const r          = 5 + siblings * 0.4;          // orbit radius grows with degree
    pos = _sphereShell(parentPos, r);
  }

  _positions.set(qid, pos);
  return pos;
}

/** Run N iterations of force-directed relaxation, then stop. */
export function runForceRelax(iterations = 80) {
  if (_rafId !== null) cancelAnimationFrame(_rafId); // restart cleanly

  const nodes   = [..._positions.entries()];
  if (nodes.length < 2) return;

  let remaining = iterations;

  function step() {
    if (remaining-- <= 0) { _rafId = null; return; }

    const deltas = new Map(nodes.map(([qid]) => [qid, [0, 0, 0]]));

    // Repulsion: every pair of nodes pushes apart
    for (let a = 0; a < nodes.length; a++) {
      for (let b = a + 1; b < nodes.length; b++) {
        const [qa, pa] = nodes[a];
        const [qb, pb] = nodes[b];
        const [dx, dy, dz] = [pa[0]-pb[0], pa[1]-pb[1], pa[2]-pb[2]];
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz) || 0.01;
        const f    = Math.min(6 / (dist * dist), 0.5); // clamp to avoid explosion
        const da   = deltas.get(qa), db = deltas.get(qb);
        da[0] += dx/dist*f;  da[1] += dy/dist*f;  da[2] += dz/dist*f;
        db[0] -= dx/dist*f;  db[1] -= dy/dist*f;  db[2] -= dz/dist*f;
      }
    }

    // Attraction: edges pull endpoints toward each other (rest length = 4.5)
    const REST = 4.5;
    for (const edge of graph.edges.values()) {
      const pa = _positions.get(edge.from), pb = _positions.get(edge.to);
      if (!pa || !pb) continue;
      const [dx, dy, dz] = [pb[0]-pa[0], pb[1]-pa[1], pb[2]-pa[2]];
      const dist = Math.sqrt(dx*dx + dy*dy + dz*dz) || 0.01;
      const f    = (dist - REST) * 0.015;
      const da   = deltas.get(edge.from), db = deltas.get(edge.to);
      if (da) { da[0] += dx/dist*f; da[1] += dy/dist*f; da[2] += dz/dist*f; }
      if (db) { db[0] -= dx/dist*f; db[1] -= dy/dist*f; db[2] -= dz/dist*f; }
    }

    // Apply deltas, update meshes
    for (const [qid, d] of deltas) {
      const p = _positions.get(qid);
      if (!p) continue;
      p[0] += d[0]; p[1] += d[1]; p[2] += d[2];
      updateNodePosition(qid, p);
    }
    syncEdgePositions();

    _rafId = requestAnimationFrame(step);
  }

  _rafId = requestAnimationFrame(step);
}

export function getPosition(qid) { return _positions.get(qid) ?? null; }

/** Directly set a position (used when restoring a saved session). */
export function setPosition(qid, pos) { _positions.set(qid, pos); }

export function clearLayout() {
  if (_rafId !== null) { cancelAnimationFrame(_rafId); _rafId = null; }
  _positions.clear();
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function _jitter([x, y, z], amount) {
  return [
    x + (Math.random() - 0.5) * amount,
    y + (Math.random() - 0.5) * amount,
    z + (Math.random() - 0.5) * amount,
  ];
}

function _sphereShell([cx, cy, cz], r) {
  const theta = Math.random() * Math.PI * 2;
  const phi   = Math.acos(2 * Math.random() - 1);
  return [
    cx + r * Math.sin(phi) * Math.cos(theta),
    cy + r * Math.sin(phi) * Math.sin(theta),
    cz + r * Math.cos(phi),
  ];
}
