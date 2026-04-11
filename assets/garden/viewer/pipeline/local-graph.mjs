/**
 * local-graph.mjs — loads a library JSON document into the graph.
 *
 * Extended schema:
 *   meta        — id, title, subtitle, source, domain, year, tags, tone
 *   report_card — summary, key_stats, spine[], protagonists[], antagonists[], themes[]
 *   story[]     — ordered narrative beats: { id, title, node, nodes[], narration, tension, focus }
 *   insights[]  — analytical findings: { id, title, body, type, evidence[], severity }
 *   clusters[]  — visual groupings: { id, label, color, nodes[], description }
 *   nodes[]     — { id, label, type, description, metrics, wikidata, image, tier, sentiment }
 *   edges[]     — { from, to, rel, label, weight, directed, temporal, notes }
 *
 * Node tiers:    spine | primary | secondary | context
 * Insight types: finding | warning | pattern | conclusion | paradox | opportunity
 * Severities:    low | medium | high
 */

import { graph }           from './graph.mjs';
import { placeNode }       from '../canvas/layout.mjs';
import { log }             from '../logger.mjs';

// ── Story / report state (accessible by UI) ────────────────────────────────────
const _docMeta       = new Map(); // docId → enriched meta
const _wikidataIndex = new Map(); // wikidata QID → Set<docId>

export function getDocMeta(docId) { return _docMeta.get(docId) ?? null; }
export function getAllDocs()       { return [..._docMeta.values()]; }

/** Returns all docIds that contain a node with this Wikidata QID. */
export function getCrossDocEntities(wikidataQid) {
  return [...(_wikidataIndex.get(wikidataQid) ?? [])];
}

/**
 * Fetch and load a library JSON file into the live graph.
 * Returns the enriched meta object (includes story, report_card, clusters, insights).
 */
export async function loadLocalDoc(path) {
  log('SYSTEM', `loading local doc: ${path}`);

  let doc;
  try {
    const res = await fetch(path);
    doc = await res.json();
  } catch (err) {
    log('ERROR', `failed to load ${path}`, { message: err.message });
    return null;
  }

  const {
    meta,
    nodes      = [],
    edges      = [],
    insights   = [],
    story      = [],
    report_card = {},
    clusters   = [],
  } = doc;

  log('SYSTEM', `doc "${meta.title}" — ${nodes.length} nodes, ${edges.length} edges, ${insights.length} insights, ${story.length} story beats`);

  // ── Determine spine for placement hints ────────────────────────────────────
  const spineIds = new Set(report_card.spine ?? []);
  const firstSpineId = report_card.spine?.[0] ?? null;

  // ── Place + add nodes ───────────────────────────────────────────────────────
  // Pass 1: spine nodes first (near origin)
  for (const n of nodes) {
    if (!spineIds.has(n.id) || graph.hasNode(n.id)) continue;
    const pos = placeNode(n.id, null);
    _addDocNode(n, meta, pos);
  }

  // Pass 2: all remaining nodes (orbit around first spine node)
  for (const n of nodes) {
    if (spineIds.has(n.id) || graph.hasNode(n.id)) continue;
    const parentHint = n.tier === 'context' ? null : firstSpineId;
    const pos = placeNode(n.id, parentHint);
    _addDocNode(n, meta, pos);
  }

  // ── Add edges ───────────────────────────────────────────────────────────────
  for (const e of edges) {
    if (!graph.hasNode(e.from) || !graph.hasNode(e.to)) continue;
    graph.addEdge(e.from, e.to, e.rel ?? 'default', e.label ?? e.rel ?? '', {
      weight:   e.weight   ?? 1,
      directed: e.directed ?? false,
      temporal: e.temporal ?? null,
    });
  }

  // ── Materialise insight nodes + evidence edges ──────────────────────────────
  for (const ins of insights) {
    if (!graph.hasNode(ins.id)) {
      const pos = placeNode(ins.id, firstSpineId);
      graph.addNode(ins.id, {
        qid:            ins.id,
        label:          ins.title,
        type:           'insight',
        description:    ins.body,
        metrics:        {
          TYPE:     (ins.type     ?? 'finding').toUpperCase(),
          SEVERITY: (ins.severity ?? 'medium').toUpperCase(),
        },
        instanceofLabel: 'Insight',
        instanceofQids:  [],
        _source:         'local',
        _docId:          meta.id,
        _insightType:    ins.type,
        _severity:       ins.severity,
        position:        pos,
      });
    }
    for (const evidenceId of (ins.evidence ?? [])) {
      if (graph.hasNode(evidenceId)) {
        // weight scales with severity: high=4, medium=2, low=1
        const w = ins.severity === 'high' ? 4 : ins.severity === 'medium' ? 2 : 1;
        graph.addEdge(ins.id, evidenceId, 'reveals', 'supports', { weight: w, directed: true });
      }
    }
  }

  // ── Index wikidata QIDs for cross-document entity linking ──────────────────
  for (const n of nodes) {
    if (n.wikidata) {
      const entry = _wikidataIndex.get(n.wikidata) ?? new Set();
      entry.add(meta.id);
      _wikidataIndex.set(n.wikidata, entry);
    }
  }

  // ── Store enriched meta for UI consumption ──────────────────────────────────
  const nodeLookup = {};
  for (const n of nodes) nodeLookup[n.id] = n;
  for (const ins of insights) {
    nodeLookup[ins.id] = {
      id: ins.id, label: ins.title, type: 'insight',
      description: ins.body,
      metrics: { TYPE: ins.type, SEVERITY: ins.severity },
      tier: 'insight', sentiment: ins.type === 'warning' ? 'negative' : 'neutral',
    };
  }
  const analytics = _deriveAnalytics(nodes, edges, clusters, insights, story);
  const enrichedMeta = { ...meta, story, report_card, clusters, insights, nodes, nodeLookup, analytics };
  _docMeta.set(meta.id, enrichedMeta);

  log('SYSTEM', `doc loaded — graph now ${graph.stats().nodes} nodes, ${graph.stats().edges} edges, analytics derived`);
  return enrichedMeta;
}

// ── Derived Analytics Engine ──────────────────────────────────────────────────

function _deriveAnalytics(nodes, edges, clusters, insights, story) {
  const a = {};

  // ── Degree centrality ────────────────────────────────────────────────────
  const degree = {};
  for (const n of nodes) degree[n.id] = 0;
  for (const e of edges) {
    degree[e.from] = (degree[e.from] ?? 0) + 1;
    degree[e.to]   = (degree[e.to]   ?? 0) + 1;
  }
  const maxDeg = Math.max(1, ...Object.values(degree));
  a.centrality = {};
  for (const [id, d] of Object.entries(degree)) a.centrality[id] = +(d / maxDeg).toFixed(3);

  // ── Causal chains (walk directed 'causes' edges) ─────────────────────────
  const causalAdj = {};
  for (const e of edges) {
    if (e.rel === 'causes' && e.directed) {
      (causalAdj[e.from] ??= []).push(e.to);
    }
  }
  const roots = Object.keys(causalAdj).filter(id => !edges.some(e => e.rel === 'causes' && e.directed && e.to === id));
  a.causalChains = [];
  for (const root of roots) {
    const chain = [];
    const walk = (id) => {
      chain.push(id);
      const children = causalAdj[id] ?? [];
      if (!children.length) { a.causalChains.push([...chain]); }
      else { for (const c of children) { walk(c); } }
      chain.pop();
    };
    walk(root);
  }

  // ── Cross-cluster edges ──────────────────────────────────────────────────
  const nodeToCluster = {};
  for (const cl of clusters) {
    for (const nid of (cl.nodes ?? [])) nodeToCluster[nid] = cl.id;
  }
  a.crossClusterEdges = [];
  for (const e of edges) {
    const fc = nodeToCluster[e.from], tc = nodeToCluster[e.to];
    if (fc && tc && fc !== tc) {
      a.crossClusterEdges.push({ from: e.from, to: e.to, fromCluster: fc, toCluster: tc, rel: e.rel, weight: e.weight ?? 1 });
    }
  }

  // ── Co-occurrence (entity × section matrix) ──────────────────────────────
  a.coOccurrence = {};
  for (const n of nodes) a.coOccurrence[n.id] = { story: [], insights: [], clusters: [] };
  for (let i = 0; i < story.length; i++) {
    const beat = story[i];
    if (beat.node && a.coOccurrence[beat.node]) a.coOccurrence[beat.node].story.push(i);
    for (const nid of (beat.nodes ?? [])) {
      if (a.coOccurrence[nid]) a.coOccurrence[nid].story.push(i);
    }
  }
  for (let i = 0; i < insights.length; i++) {
    for (const eid of (insights[i].evidence ?? [])) {
      if (a.coOccurrence[eid]) a.coOccurrence[eid].insights.push(i);
    }
  }
  for (let i = 0; i < clusters.length; i++) {
    for (const nid of (clusters[i].nodes ?? [])) {
      if (a.coOccurrence[nid]) a.coOccurrence[nid].clusters.push(i);
    }
  }

  // ── Sentiment distribution ───────────────────────────────────────────────
  a.sentimentDist = { positive: 0, negative: 0, neutral: 0, contested: 0 };
  for (const n of nodes) a.sentimentDist[n.sentiment ?? 'neutral'] = (a.sentimentDist[n.sentiment ?? 'neutral'] ?? 0) + 1;

  // ── Tier distribution ────────────────────────────────────────────────────
  a.tierDist = { spine: 0, primary: 0, secondary: 0, context: 0 };
  for (const n of nodes) a.tierDist[n.tier ?? 'primary'] = (a.tierDist[n.tier ?? 'primary'] ?? 0) + 1;

  // ── Relationship type distribution ───────────────────────────────────────
  a.relTypeDist = {};
  for (const e of edges) a.relTypeDist[e.rel ?? 'default'] = (a.relTypeDist[e.rel ?? 'default'] ?? 0) + 1;

  // ── Tension curve ────────────────────────────────────────────────────────
  const TENSION_VAL = { low: 1, medium: 2, high: 3, climax: 4 };
  a.tensionCurve = story.map(b => TENSION_VAL[b.tension] ?? 1);

  // ── Temporal sequence ────────────────────────────────────────────────────
  a.temporalSequence = edges
    .filter(e => e.temporal)
    .map(e => ({ edge: e, date: e.temporal }))
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));

  return a;
}

// ── Internal helpers ───────────────────────────────────────────────────────────

function _addDocNode(n, meta, pos) {
  graph.addNode(n.id, {
    qid:            n.id,
    label:          n.label,
    type:           n.type ?? 'default',
    description:    n.description ?? '',
    image:          n.image ?? null,
    instanceofLabel: n.type ?? '',
    instanceofQids:  [],
    metrics:         n.metrics ?? null,
    wikidata:        n.wikidata ?? null,
    tier:            n.tier      ?? 'primary',
    sentiment:       n.sentiment ?? 'neutral',
    _source:         'local',
    _docId:          meta.id,
    position:        pos,
  });
}

/**
 * List available documents in /library/.
 * Extend this array as more docs are added.
 */
export const LIBRARY = [
  {
    id:     'gig-worker-projects',
    title:  'Algorithmic Panopticon: Gig Economy India',
    path:   './library/gig-worker-projects.json',
    domain: 'Labour / Technology',
    year:   '2025',
  },
  {
    id:     'aoe-2-redbull-april-2026',
    title:  'Red Bull Wololo: Londinium — April 2026',
    path:   './library/aoe-2-redbull-april-2026.json',
    domain: 'Esports / Age of Empires',
    year:   '2026',
  },
  {
    id:     'poker-tooling-2026',
    title:  "The Modern Poker Player's Toolkit",
    path:   './library/poker-tooling-2026.json',
    domain: 'Gaming / Technology',
    year:   '2026',
  },
  {
    id:     'art-of-intent',
    title:  'Art of Intent: Codebase Intelligence Brief',
    path:   './library/art-of-intent.json',
    domain: 'Software / Game Design',
    year:   '2024',
  },
];
