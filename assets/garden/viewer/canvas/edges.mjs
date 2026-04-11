/**
 * edges.mjs — relationship lines between node meshes.
 *
 * Each edge entry: { line, glow, arrow }
 *   line   — THREE.Line (always present)
 *   glow   — second wider transparent line for weight ≥ 4 edges
 *   arrow  — THREE.Mesh cone for directed edges, positioned at 72% along edge
 */

import * as THREE from 'three';
import { resolveRelType, getRelStyle } from '../ontology.mjs';
import { getScene } from './scene.mjs';
import { getNodeMesh } from './nodes.mjs';

const _edges = new Map(); // edgeKey → { line, glow, arrow }

export function addEdgeLine(edge) {
  const key = `${edge.from}→${edge.to}→${edge.pid}`;
  if (_edges.has(key)) return;

  const fromMesh = getNodeMesh(edge.from);
  const toMesh   = getNodeMesh(edge.to);
  if (!fromMesh || !toMesh) return;

  const relType = resolveRelType(edge.pid);
  const style   = getRelStyle(relType);
  const weight  = edge.weight ?? 1;

  // ── Primary line ──────────────────────────────────────────────────────────
  // weight 1→0.35  2→0.48  3→0.60  4→0.73  5→0.87
  const opacity = 0.22 + weight * 0.13;

  const pts = [fromMesh.position.clone(), toMesh.position.clone()];
  const line = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(pts),
    new THREE.LineBasicMaterial({
      color: style.color, transparent: true, opacity, depthWrite: false,
    })
  );
  line.renderOrder = 0;
  line.userData = { edgeKey: key, from: edge.from, to: edge.to };
  getScene().add(line);

  // ── Glow line — second pass for high-weight edges (weight ≥ 4) ───────────
  let glow = null;
  if (weight >= 4) {
    glow = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({
        color: style.color, transparent: true,
        opacity: (opacity * 0.45),
        depthWrite: false,
      })
    );
    glow.renderOrder = 0;
    glow.userData = { edgeKey: key, from: edge.from, to: edge.to };
    getScene().add(glow);
  }

  // ── Arrowhead — small cone for directed edges ─────────────────────────────
  //   Positioned at ~72% along the edge, pointing toward target
  let arrow = null;
  if (edge.directed) {
    const arrowRadius = 0.10 + weight * 0.025;  // scales slightly with weight
    const arrowHeight = arrowRadius * 2.8;

    // ConeGeometry points along +Y by default; we'll orient it via quaternion
    arrow = new THREE.Mesh(
      new THREE.ConeGeometry(arrowRadius, arrowHeight, 8),
      new THREE.MeshBasicMaterial({
        color: style.color, transparent: true,
        opacity: Math.min(opacity + 0.15, 0.95),
        depthWrite: false,
      })
    );
    arrow.renderOrder = 1;
    arrow.userData = { edgeKey: key, from: edge.from, to: edge.to };
    getScene().add(arrow);

    // Initial orientation
    _orientArrow(arrow, fromMesh.position, toMesh.position);
  }

  _edges.set(key, { line, glow, arrow });
}

/** Sync edge positions (and arrow orientation) after nodes have moved. */
export function syncEdgePositions() {
  for (const [, entry] of _edges) {
    const from = getNodeMesh(entry.line.userData.from);
    const to   = getNodeMesh(entry.line.userData.to);
    if (!from || !to) continue;

    // Update line geometry
    _setPts(entry.line, from.position, to.position);
    if (entry.glow) _setPts(entry.glow, from.position, to.position);

    // Update arrowhead
    if (entry.arrow) _orientArrow(entry.arrow, from.position, to.position);
  }
}

export function clearEdgesFor(qid) {
  for (const [key, entry] of _edges) {
    if (entry.line.userData.from === qid || entry.line.userData.to === qid) {
      _disposeEntry(entry);
      _edges.delete(key);
    }
  }
}

export function clearAllEdges() {
  for (const [key, entry] of _edges) {
    _disposeEntry(entry);
    _edges.delete(key);
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function _setPts(line, a, b) {
  const pos = line.geometry.attributes.position;
  a.toArray(pos.array, 0);
  b.toArray(pos.array, 3);
  pos.needsUpdate = true;
}

// Position arrow at T=0.72 along the edge; orient cone to face target
const _up   = new THREE.Vector3(0, 1, 0);
const _quat = new THREE.Quaternion();
const _dir  = new THREE.Vector3();

function _orientArrow(arrow, from, to) {
  // Position at 72% along the edge
  arrow.position.lerpVectors(from, to, 0.72);

  // Rotate cone (+Y) to point along from→to
  _dir.subVectors(to, from).normalize();
  _quat.setFromUnitVectors(_up, _dir);
  arrow.quaternion.copy(_quat);
}

function _disposeEntry({ line, glow, arrow }) {
  getScene().remove(line);
  line.geometry.dispose();
  line.material.dispose();
  if (glow) {
    getScene().remove(glow);
    glow.geometry.dispose();
    glow.material.dispose();
  }
  if (arrow) {
    getScene().remove(arrow);
    arrow.geometry.dispose();
    arrow.material.dispose();
  }
}
