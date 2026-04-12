/**
 * garden-main.mjs — Garden page orchestrator.
 *
 * Vault-only mode: loads all published notes as a 3D knowledge graph.
 * No Wikidata, no source toggles. Local search + tag clusters.
 *
 * URL params:
 *   graph=/assets/garden/garden-graph.json   path to the pre-built graph JSON
 */

import { initScene, onNodeClick, onNodeHover,
         focusOn, getCamera, addTick, tickHover } from './canvas/scene.mjs';
import { addNodeMesh, getNodeMesh, setNodeState, clearAllNodes,
         dimAllExcept, clearDim, updateNodeDegree } from './canvas/nodes.mjs';
import { addEdgeLine, syncEdgePositions, clearAllEdges } from './canvas/edges.mjs';
import { placeNode, runForceRelax, setPosition, clearLayout } from './canvas/layout.mjs';
import { graph }            from './pipeline/graph.mjs';
import { inputBus }         from './pipeline/input.mjs';
import { saveSession, listSessions, loadSession, deleteSession } from './pipeline/sessions.mjs';
import { initDetail, showDetail, hideDetail, getCurrentQid } from './canvas/detail.mjs';
import { initTooltip, showTooltip, hideTooltip }  from './canvas/tooltip.mjs';
import { pushCrumb, clearCrumbs }                  from './canvas/breadcrumb.mjs';
import { log }                                     from './logger.mjs';
import { VaultSource }                             from './pipeline/sources/vault.mjs';

// ── Config ────────────────────────────────────────────────────────────────────

const params   = new URLSearchParams(location.search);
const GRAPH_URL = params.get('graph') ?? '/assets/garden/garden-graph.json';

const vault = new VaultSource(GRAPH_URL);

// ── UI state ──────────────────────────────────────────────────────────────────

let _isDimmed = false;

// ── Tag cluster centroids ─────────────────────────────────────────────────────
// Tags become spatial regions. Centroids are placed on a circle in XZ plane.

function buildClusterCentroids(clusters) {
  const tags    = Object.keys(clusters);
  const count   = tags.length;
  const radius  = Math.max(14, count * 3.5);
  const map     = {};
  tags.forEach((tag, i) => {
    const angle   = (i / count) * Math.PI * 2;
    map[tag] = {
      x: Math.cos(angle) * radius,
      y: (Math.random() - 0.5) * 6,
      z: Math.sin(angle) * radius,
      color: clusters[tag].color,
    };
  });
  return map;
}

function tagCentroid(node, centroids) {
  const primary = node.tags?.[0];
  if (primary && centroids[primary]) return centroids[primary];
  return { x: 0, y: 0, z: 0 };
}

// ── Init ──────────────────────────────────────────────────────────────────────

const container = document.getElementById('theScene');

requestAnimationFrame(async () => {
  initScene(container);
  initDetail();
  initTooltip();

  // ── Graph → canvas ──────────────────────────────────────────────────────────
  graph.on('node:added', node => {
    addNodeMesh(node);
    setNodeState(node.qid, node._state ?? 'unvisited');
  });

  graph.on('edge:added', edge => {
    addEdgeLine(edge);
    syncEdgePositions();
    updateNodeDegree(edge.from, graph.getEdgesFor(edge.from).length);
    updateNodeDegree(edge.to,   graph.getEdgesFor(edge.to).length);
  });

  // ── Hover → tooltip ─────────────────────────────────────────────────────────
  let _hoveredQid = null;
  addTick(tickHover);
  onNodeHover(qid => {
    if (qid === _hoveredQid) return;
    _hoveredQid = qid;
    if (!qid) { hideTooltip(); return; }
    const node = graph.getNode(qid);
    if (!node) return;
    const rect = container.getBoundingClientRect();
    showTooltip(node, rect.left + rect.width / 2, rect.top + 40);
  });

  // ── Load vault graph ─────────────────────────────────────────────────────────
  await vault.load();
  const centroids = buildClusterCentroids(vault.clusters);

  // Assign tag-cluster positions before adding nodes so the layout is seeded
  for (const node of vault.allNodes) {
    const c = tagCentroid(node, centroids);
    const jitter = () => (Math.random() - 0.5) * 5;
    setPosition(node.id, [c.x + jitter(), c.y + jitter(), c.z + jitter()]);
  }

  await vault.loadGraph(graph);
  runForceRelax(200);

  log('GARDEN', `loaded ${graph.stats().nodes} notes, ${graph.stats().edges} edges`);
  _updateStatsLabel();
});

// ── Node interactions ─────────────────────────────────────────────────────────

onNodeClick(qid => {
  clearDim(); _isDimmed = false;
  const node = graph.getNode(qid);
  if (!node) return;
  const prev = getCurrentQid();
  if (prev && prev !== qid) setNodeState(prev, 'visited');
  setNodeState(qid, 'focused');
  pushCrumb(qid, node.label);
  const mesh = getNodeMesh(qid);
  if (mesh) focusOn(mesh.position.toArray(), 12);
  showDetail(node, graph.getEdgesFor(qid), id => graph.getNode(id));
  _updateFnBar();
});

document.addEventListener('detail:navigate', e => {
  const node = graph.getNode(e.detail.qid);
  if (!node) return;
  setNodeState(e.detail.qid, 'focused');
  const mesh = getNodeMesh(e.detail.qid);
  if (mesh) focusOn(mesh.position.toArray(), 12);
  showDetail(node, graph.getEdgesFor(e.detail.qid), id => graph.getNode(id));
});

document.addEventListener('detail:pin', e => setNodeState(e.detail.qid, 'pinned'));
document.getElementById('breadcrumb')?.addEventListener('bc:navigate',
  e => document.dispatchEvent(new CustomEvent('detail:navigate', { detail: { qid: e.detail.qid } })));

// ── Search input ──────────────────────────────────────────────────────────────

inputBus.bindTextInput(document.getElementById('main-input'));

inputBus.addEventListener('intent', async e => {
  const text = e.detail.text.trim();

  // Tag isolation: "tag:streaming" or "#streaming"
  const tagMatch = text.match(/^(?:tag:|#)(.+)$/i);
  if (tagMatch) {
    _isolateTag(tagMatch[1].toLowerCase().trim());
    return;
  }

  // Local search
  const results = await vault.search(text);
  if (!results.nodes.length) {
    log('GARDEN', `no results for "${text}"`);
    return;
  }

  // Focus the first match; dim others
  const firstId = results.nodes[0].id;
  dimAllExcept(results.nodes.map(n => n.id)); _isDimmed = true; _updateFnBar();
  const node = graph.getNode(firstId);
  if (!node) return;
  setNodeState(firstId, 'focused');
  const mesh = getNodeMesh(firstId);
  if (mesh) focusOn(mesh.position.toArray(), 16);
  showDetail(node, graph.getEdgesFor(firstId), id => graph.getNode(id));
});

function _isolateTag(tag) {
  const matching = vault.allNodes.filter(n => n.tags.includes(tag)).map(n => n.id);
  if (!matching.length) {
    log('GARDEN', `no notes tagged "${tag}"`);
    return;
  }
  dimAllExcept(matching);
  // Frame all matching nodes
  const meshes = matching.map(id => getNodeMesh(id)).filter(Boolean);
  if (meshes.length) {
    const cx = meshes.reduce((s, m) => s + m.position.x, 0) / meshes.length;
    const cy = meshes.reduce((s, m) => s + m.position.y, 0) / meshes.length;
    const cz = meshes.reduce((s, m) => s + m.position.z, 0) / meshes.length;
    focusOn([cx, cy, cz], 20);
  }
  log('GARDEN', `isolated tag "${tag}": ${matching.length} notes`);
}

// ── Save / restore sessions ───────────────────────────────────────────────────

document.getElementById('save-btn')?.addEventListener('click', () => {
  const nodes = [...graph.nodes.values()];
  const edges = [...graph.edges.values()];
  const id    = saveSession({ version: 2, sourceType: 'vault', nodes, edges });
  log('GARDEN', `session saved: ${id}`);
});

document.getElementById('sessions-btn')?.addEventListener('click', () => {
  _renderSessions();
  document.getElementById('sessions-wrap')?.classList.toggle('open');
});

function _renderSessions() {
  const drawer = document.getElementById('sessions-drawer');
  if (!drawer) return;
  const sessions = listSessions().filter(s => s.sourceType === 'vault');
  drawer.innerHTML = sessions.length ? sessions.map(s => `
    <div class="sess-item" role="listitem">
      <button class="sess-load" data-id="${s.id}">${s.title ?? s.id} <span class="sess-meta">${s.nodeCount} notes</span></button>
      <button class="sess-del"  data-id="${s.id}" aria-label="Delete session">✕</button>
    </div>`).join('') : '<p class="sess-empty">No saved garden sessions</p>';

  drawer.addEventListener('click', e => {
    const loadBtn = e.target.closest('.sess-load');
    const delBtn  = e.target.closest('.sess-del');
    if (loadBtn) _restoreSession(loadBtn.dataset.id);
    if (delBtn)  { deleteSession(delBtn.dataset.id); _renderSessions(); }
  }, { once: true });
}

function _restoreSession(id) {
  const s = loadSession(id);
  if (!s) return;
  clearAllNodes(); clearAllEdges(); clearLayout(); graph.clear(); clearCrumbs();
  for (const n of (s.nodes ?? [])) {
    if (n.position) setPosition(n.id ?? n.qid, n.position);
    graph.addNode(n.id ?? n.qid, { ...n, qid: n.id ?? n.qid });
  }
  for (const e of (s.edges ?? [])) {
    graph.addEdge(e.from, e.to, e.pid ?? e.relLabel ?? 'wikilink', e.relLabel ?? 'wikilink');
  }
  runForceRelax(100);
  log('GARDEN', `session restored: ${id}`);
}

// ── Debug log toggle ──────────────────────────────────────────────────────────

document.getElementById('log-toggle')?.addEventListener('click', () => {
  const bar  = document.getElementById('log-bar');
  const btn  = document.getElementById('log-toggle');
  const open = bar?.classList.toggle('hidden') === false;
  btn?.setAttribute('aria-expanded', String(open));
});

// ── Stats label ───────────────────────────────────────────────────────────────

function _updateStatsLabel() {
  const strip = document.getElementById('stats-strip');
  if (!strip) return;
  const { nodes, edges } = graph.stats();
  strip.textContent = `${nodes} notes · ${edges} links`;
  strip.classList.remove('hidden');
}
