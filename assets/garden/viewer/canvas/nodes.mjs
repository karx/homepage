/**
 * nodes.mjs — node mesh lifecycle manager.
 *
 * Owns the qid → THREE.Group map and node state machine.
 * Visual construction is fully delegated to node-factory.mjs.
 *
 * Public API:
 *   addNodeMesh(node)             — build + register a node group
 *   removeNodeMesh(qid)           — dispose + deregister
 *   clearAllNodes()
 *   setNodeState(qid, state)      — seed|unvisited|visited|expanded|focused|pinned
 *   getNodeState(qid)
 *   updateNodeDegree(qid, degree) — scales glow ring with connectivity
 *   refreshNodeVisual(qid, node)  — rebuild data arcs + label after enrichment
 *   getNodeMesh(qid) / getAllMeshes()
 */

import * as THREE from 'three';
import { getEntityStyle } from '../ontology.mjs';
import { getScene } from './scene.mjs';
import { buildNodeGroup, rebuildDataArcs, rebuildLabel, rebuildTagDots } from './node-factory.mjs';

const _meshes = new Map();   // qid → THREE.Group
const _states = new Map();   // qid → state string

// ── State styles ──────────────────────────────────────────────────────────────

const STATE_STYLE = {
  seed:      { emissive: 0.35, opacity: 1.0,  scaleMult: 1.20 },
  unvisited: { emissive: 0.06, opacity: 0.42, scaleMult: 1.00 },
  visited:   { emissive: 0.18, opacity: 1.0,  scaleMult: 1.00 },
  expanded:  { emissive: 0.22, opacity: 1.0,  scaleMult: 1.00 },
  focused:   { emissive: 0.55, opacity: 1.0,  scaleMult: 1.15 },
  pinned:    { emissive: 0.35, opacity: 1.0,  scaleMult: 1.10 },
  dimmed:    { emissive: 0.03, opacity: 0.10, scaleMult: 0.88 },
};

// ── Public API ────────────────────────────────────────────────────────────────

export function addNodeMesh(node) {
  if (_meshes.has(node.qid)) return _meshes.get(node.qid);

  const group = buildNodeGroup(node);
  getScene().add(group);
  _meshes.set(node.qid, group);
  return group;
}

export function removeNodeMesh(qid) {
  const m = _meshes.get(qid);
  if (!m) return;
  getScene().remove(m);
  m.traverse(c => { c.geometry?.dispose(); c.material?.dispose(); });
  _meshes.delete(qid);
  _states.delete(qid);
}

export function clearAllNodes() {
  for (const qid of [..._meshes.keys()]) removeNodeMesh(qid);
}

export function getNodeMesh(qid)  { return _meshes.get(qid) ?? null; }
export function getAllMeshes()     { return _meshes; }
export function getNodeState(qid) { return _states.get(qid) ?? 'unvisited'; }

export function updateNodePosition(qid, pos) {
  const m = _meshes.get(qid);
  if (m) m.position.set(...pos);
}

// ── State machine ─────────────────────────────────────────────────────────────

export function setNodeState(qid, state) {
  if (!_meshes.has(qid)) return;
  _states.set(qid, state);
  const group = _meshes.get(qid);
  const s     = STATE_STYLE[state] ?? STATE_STYLE.visited;

  const core = group.getObjectByName('core');
  if (core?.material) {
    core.material.emissiveIntensity = s.emissive;
    core.material.opacity           = s.opacity;
    core.material.transparent       = s.opacity < 1;
  }

  // Compose: tier base scale × state scale multiplier
  group.scale.setScalar((group.userData.baseScale ?? 1.0) * s.scaleMult);

  // ── Focus ring (white) ────────────────────────────────────────────────────
  const existingFR = group.getObjectByName('focus-ring');
  if (state === 'focused' && !existingFR) {
    const { radius: rad } = getEntityStyle(group.userData.type ?? 'default');
    const fr = new THREE.Mesh(
      new THREE.RingGeometry(rad * 1.50, rad * 1.65, 64),
      new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.60, depthWrite: false })
    );
    fr.name = 'focus-ring';
    fr.rotation.x = Math.PI / 2;
    group.add(fr);
  } else if (state !== 'focused' && existingFR) {
    existingFR.geometry.dispose(); existingFR.material.dispose();
    group.remove(existingFR);
  }

  // ── Pin ring (gold) ───────────────────────────────────────────────────────
  const existingPR = group.getObjectByName('pin-ring');
  if (state === 'pinned' && !existingPR) {
    const { radius: rad } = getEntityStyle(group.userData.type ?? 'default');
    const pr = new THREE.Mesh(
      new THREE.RingGeometry(rad * 1.55, rad * 1.72, 64),
      new THREE.MeshBasicMaterial({ color: 0xffd700, side: THREE.DoubleSide, transparent: true, opacity: 0.70, depthWrite: false })
    );
    pr.name = 'pin-ring';
    pr.rotation.x = Math.PI / 2;
    group.add(pr);
  } else if (state !== 'pinned' && existingPR) {
    existingPR.geometry.dispose(); existingPR.material.dispose();
    group.remove(existingPR);
  }
}

// ── Degree ring update ────────────────────────────────────────────────────────

/**
 * Scale the glow ring proportional to the node's degree centrality.
 * Called from main.mjs on every edge:added event.
 *   degree 0  → 1.0× (default ring)
 *   degree 10 → 2.0× (ring doubles)
 *   degree 18 → 2.8× (capped)
 */
export function updateNodeDegree(qid, degree) {
  const group = _meshes.get(qid);
  if (!group) return;
  const glow = group.getObjectByName('glow-ring');
  if (!glow) return;
  glow.scale.setScalar(1 + Math.min(degree / 10, 1.8));
  glow.material.opacity = Math.min(0.20 + degree * 0.018, 0.55);
}

// ── Cluster / focus isolation ─────────────────────────────────────────────────

/**
 * Dim all nodes whose qid is not in the provided set.
 * Call clearDim() to restore all dimmed nodes to their previous state.
 */
export function dimAllExcept(qids) {
  const keep = new Set(qids);
  for (const [qid] of _meshes) {
    if (!keep.has(qid)) setNodeState(qid, 'dimmed');
  }
}

/**
 * Restore all dimmed nodes to 'visited' state.
 */
export function clearDim() {
  for (const [qid, state] of _states) {
    if (state === 'dimmed') setNodeState(qid, 'visited');
  }
}

// ── Sentiment / tier overlay ──────────────────────────────────────────────────

/**
 * Temporarily override a node's core color for overlay modes (sentiment / tier).
 * Stores the original color on first call so clearNodeColorOverrides can restore it.
 */
export function setNodeColorOverride(qid, hexColor) {
  const group = _meshes.get(qid);
  const core  = group?.getObjectByName('core');
  if (!core?.material) return;
  if (core.userData._origColor == null)
    core.userData._origColor = core.material.color.getHex();
  core.material.color.setHex(hexColor);
  core.material.emissiveIntensity = Math.max(
    core.material.emissiveIntensity, 0.20
  );
}

/** Restore all nodes to their original entity-type colors. */
export function clearNodeColorOverrides() {
  for (const [, group] of _meshes) {
    const core = group.getObjectByName('core');
    if (!core?.material || core.userData._origColor == null) continue;
    core.material.color.setHex(core.userData._origColor);
    delete core.userData._origColor;
  }
}

// ── Post-enrichment visual refresh ───────────────────────────────────────────

/**
 * Rebuild the data arcs, tag dots and label for a node after enrichment data
 * (temporal, metrics, profile) has been written into the graph node object.
 *
 * @param {string} qid
 * @param {object} node — the updated graph node (from graph.getNode)
 */
export function refreshNodeVisual(qid, node) {
  const group = _meshes.get(qid);
  if (!group || !node) return;
  rebuildDataArcs(group, node);
  rebuildTagDots(group, node);
  rebuildLabel(group, node);
}
