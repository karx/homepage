/**
 * node-factory.mjs — reusable pipeline for building Three.js node groups.
 *
 * buildNodeGroup(node) → THREE.Group
 *
 * Pipeline stages (each produces named children):
 *   1. 'core'           geometry  — shape encodes entity category
 *   2. 'glow-ring'                — degree centrality (scales with updateNodeDegree)
 *   3. 'temporal-arc'             — lifespan/age as a partial torus arc
 *   4. 'metric-arc'               — population/employees on log₁₀ scale
 *   5. 'sentiment-ring'           — polarity aura (positive/negative/contested)
 *   6. 'tier-wireframe'           — wireframe overlay for spine/hub nodes
 *   7. 'local-ring'               — square ring for library-doc nodes
 *   8. 'tag-dot-{n}'              — small orbital dots for occupations/industry/continent
 *   9. (label sprite)             — canvas sprite with rich metadata rows
 *
 * All functions are pure — no side effects, no imports from nodes.mjs.
 * The factory has no internal state; nodes.mjs owns the mesh map.
 */

import * as THREE from 'three';
import { getEntityStyle } from '../ontology.mjs';

// ── Geometry vocabulary ───────────────────────────────────────────────────────

const TYPE_GEOMETRY = {
  // Smooth sphere — organic/human
  person: 'sphere', player: 'sphere',
  // Institutional box
  organization: 'box', company: 'box', government: 'box', union: 'box',
  // Sharp/volatile octahedron
  event: 'octahedron', conflict: 'octahedron', issue: 'octahedron', ruling: 'octahedron',
  // Pointed/revelatory tetrahedron
  insight: 'tetrahedron', concept: 'tetrahedron', algorithm: 'tetrahedron',
  // Complex/natural icosahedron
  species: 'icosahedron', academic: 'icosahedron', language: 'icosahedron',
  religion: 'icosahedron', law: 'icosahedron', regulation: 'icosahedron', standard: 'icosahedron',
  // Upward cone — achievement
  milestone: 'cone', award: 'cone',
  // Flat disc — territorial
  place: 'cylinder', country: 'cylinder',
  // Torus — networked/circular
  platform: 'torus', subreddit: 'torus',
  // Cultural/faceted dodecahedron
  film: 'dodecahedron', book: 'dodecahedron', music: 'dodecahedron', artwork: 'dodecahedron',
  // Competitive/interlocked
  tournament: 'torusknot',
  // Flat screen/media + data slabs
  video: 'plane', channel: 'plane', post: 'plane', dataset: 'plane',
};

const FLAT_SHADED = new Set(['octahedron', 'tetrahedron', 'icosahedron', 'dodecahedron', 'box']);

function _buildCoreGeo(type, r) {
  switch (TYPE_GEOMETRY[type] ?? 'sphere') {
    case 'box':          return new THREE.BoxGeometry(r * 1.55, r * 1.55, r * 1.55);
    case 'octahedron':   return new THREE.OctahedronGeometry(r * 1.12, 0);
    case 'tetrahedron':  return new THREE.TetrahedronGeometry(r * 1.25, 0);
    case 'icosahedron':  return new THREE.IcosahedronGeometry(r * 1.06, 0);
    case 'cone':         return new THREE.ConeGeometry(r * 0.82, r * 2.1, 14);
    case 'cylinder':     return new THREE.CylinderGeometry(r * 1.05, r * 1.15, r * 0.30, 28);
    case 'torus':        return new THREE.TorusGeometry(r * 0.70, r * 0.27, 10, 34);
    case 'dodecahedron': return new THREE.DodecahedronGeometry(r * 1.02, 0);
    case 'torusknot':    return new THREE.TorusKnotGeometry(r * 0.50, r * 0.18, 64, 8);
    case 'plane':        return new THREE.BoxGeometry(r * 2.0, r * 1.35, r * 0.09);
    default:             return new THREE.SphereGeometry(r, 28, 28);
  }
}

// ── Tier base scales ──────────────────────────────────────────────────────────

const TIER_SCALE = { spine: 1.22, primary: 1.0, secondary: 0.88, anchor: 0.72 };

// ── Sentiment colours ─────────────────────────────────────────────────────────

const SENTIMENT_COLOR = { positive: 0x00ff88, negative: 0xff2244, contested: 0xffaa00 };

// ── Tag dot colours ───────────────────────────────────────────────────────────

const TAG_COLOR = {
  occupation: 0x00ccff,
  industry:   0xff8800,
  continent:  0x00ff88,
};

// ── Main entry ────────────────────────────────────────────────────────────────

/**
 * Build and return a fully decorated THREE.Group for the given node.
 * The group's children are named so they can be retrieved and updated later.
 *
 * @param {object} node — graph node data (may include temporal, metrics, profile)
 * @returns {THREE.Group}
 */
export function buildNodeGroup(node) {
  const style   = getEntityStyle(node.type ?? 'default');
  const geoKey  = TYPE_GEOMETRY[node.type] ?? 'sphere';
  const flat    = FLAT_SHADED.has(geoKey);
  const tier    = node.tier     ?? 'primary';
  const r       = style.radius;

  const group = new THREE.Group();
  group.userData.qid       = node.qid;
  group.userData.type      = node.type;
  group.userData.radius    = r;
  group.userData.baseScale = TIER_SCALE[tier] ?? 1.0;
  group.scale.setScalar(group.userData.baseScale);

  // ── Stage 1: Core geometry ─────────────────────────────────────────────────
  const geo  = _buildCoreGeo(node.type, r);
  const core = new THREE.Mesh(
    geo,
    new THREE.MeshStandardMaterial({
      color:             style.color,
      roughness:         flat ? 0.58 : 0.35,
      metalness:         flat ? 0.18 : 0.42,
      emissive:          style.color,
      emissiveIntensity: 0.18,
      flatShading:       flat,
    })
  );
  core.name         = 'core';
  core.userData.qid = node.qid;   // raycaster fallback
  if (tier === 'anchor') {
    core.material.opacity     = 0.48;
    core.material.transparent = true;
    core.material.emissiveIntensity = 0.07;
  }
  group.add(core);

  // ── Stage 2: Glow ring — degree centrality ────────────────────────────────
  //  Updated by updateNodeDegree() in nodes.mjs as edges accumulate.
  const glow = new THREE.Mesh(
    new THREE.RingGeometry(r * 1.18, r * 1.38, 48),
    new THREE.MeshBasicMaterial({
      color: style.color, side: THREE.DoubleSide,
      transparent: true, opacity: 0.20, depthWrite: false,
    })
  );
  glow.name = 'glow-ring';
  glow.rotation.x = Math.PI / 2;
  group.add(glow);

  // ── Stage 3: Temporal arc — lifespan / age ────────────────────────────────
  //  Arc angle  = span / 200 years × 2π  (full circle = 200+ years)
  //  Gold       = historical (has end date)
  //  Cyan       = still active / alive
  //  Dim amber  = very short-lived (< 5 years)
  const temporalArc = _buildTemporalArc(node.temporal, r);
  if (temporalArc) group.add(temporalArc);

  // ── Stage 4: Metric arc — population / employees on log₁₀ scale ──────────
  //  Arc at r × 1.88, rotated to start at opposite of temporal arc.
  //  log₁₀(1 000) = 3 → 30% arc   log₁₀(1 000 000 000) = 9 → 90% arc
  const metricArc = _buildMetricArc(node.metrics, r);
  if (metricArc) group.add(metricArc);

  // ── Stage 5: Sentiment aura ring ──────────────────────────────────────────
  const sentColor = SENTIMENT_COLOR[node.sentiment];
  if (sentColor) {
    const aura = new THREE.Mesh(
      new THREE.RingGeometry(r * 1.55, r * 1.70, 40),
      new THREE.MeshBasicMaterial({ color: sentColor, side: THREE.DoubleSide, transparent: true, opacity: 0.28, depthWrite: false })
    );
    aura.name = 'sentiment-ring';
    aura.rotation.x = Math.PI / 2;
    group.add(aura);
  }

  // ── Stage 6: Tier wireframe — marks spine/hub nodes ───────────────────────
  if (tier === 'spine') {
    const wire = new THREE.Mesh(
      geo.clone(),
      new THREE.MeshBasicMaterial({ color: style.color, wireframe: true, transparent: true, opacity: 0.28, depthWrite: false })
    );
    wire.name = 'tier-wireframe';
    wire.scale.setScalar(1.10);
    group.add(wire);
  }

  // ── Stage 7: Local-source ring ─────────────────────────────────────────────
  //  Square ring (4-sided RingGeometry rotated 45°) for library-doc nodes.
  if (node._source === 'local') {
    const sq = new THREE.Mesh(
      new THREE.RingGeometry(r * 1.42, r * 1.52, 4),
      new THREE.MeshBasicMaterial({ color: 0x00ff66, side: THREE.DoubleSide, transparent: true, opacity: 0.50, depthWrite: false })
    );
    sq.name = 'local-ring';
    sq.rotation.z = Math.PI / 4;
    group.add(sq);
  }

  // ── Stage 8: Tag dots — occupation / industry / continent ─────────────────
  //  Up to 3 small coloured spheres orbiting at r × 2.2.
  //  Each encodes one classification dimension.
  const tagDots = _buildTagDots(node.profile, r);
  tagDots.forEach(dot => group.add(dot));

  // ── Stage 9: Image plane (async) ──────────────────────────────────────────
  if (node.image) _attachImagePlane(node.image, r, group);

  // ── Stage 10: Label sprite ────────────────────────────────────────────────
  group.add(_buildLabel(node, style, tier, r));

  // ── Position ──────────────────────────────────────────────────────────────
  if (node.position) group.position.set(...node.position);

  return group;
}

// ── Stage builders ────────────────────────────────────────────────────────────

const _UP = new THREE.Vector3(0, 1, 0);

/**
 * Partial torus arc encoding the entity's temporal span.
 * Returns null if no temporal data is available.
 */
function _buildTemporalArc(temporal, r) {
  if (!temporal) return null;

  const now = new Date().getFullYear();
  // Determine start/end year
  const startYear = temporal.birth ?? temporal.founded ?? temporal.start ?? null;
  const endYear   = temporal.death ?? temporal.dissolved ?? temporal.end ?? null;
  if (startYear == null) return null;

  const span     = (endYear ?? now) - startYear;
  const isActive = endYear == null;

  // 200 years → full circle; clamp to [0, 2π]
  const arcAngle = Math.min((Math.max(span, 0) / 200) * Math.PI * 2, Math.PI * 2);
  if (arcAngle < 0.05) return null; // too short to render

  const color   = isActive ? 0x00ccff : (span > 10 ? 0xffaa00 : 0x554433);
  const opacity = isActive ? 0.40 : 0.32;

  const arc = new THREE.Mesh(
    new THREE.TorusGeometry(r * 1.65, r * 0.048, 6, 64, arcAngle),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false, side: THREE.DoubleSide })
  );
  arc.name = 'temporal-arc';
  arc.rotation.x = Math.PI / 2;   // lie flat in XZ plane
  return arc;
}

/**
 * Partial torus arc encoding a quantitative metric (population/employees/area).
 * Returns null if no numeric metric is present.
 * Placed at r × 1.88, same plane as temporal arc but rotated π to start opposite.
 */
function _buildMetricArc(metrics, r) {
  if (!metrics) return null;
  const val = metrics.population ?? metrics.employees ?? metrics.area ?? null;
  if (!val || val <= 0) return null;

  // log₁₀ scale: 1→0%, 1 000→30%, 1 000 000→60%, 1 000 000 000→90%
  const logVal    = Math.log10(val);
  const maxLog    = 10;                          // log₁₀(10 000 000 000)
  const arcAngle  = Math.min((logVal / maxLog) * Math.PI * 2, Math.PI * 2);
  if (arcAngle < 0.1) return null;

  const arc = new THREE.Mesh(
    new THREE.TorusGeometry(r * 1.88, r * 0.038, 6, 64, arcAngle),
    new THREE.MeshBasicMaterial({ color: 0xffee55, transparent: true, opacity: 0.28, depthWrite: false, side: THREE.DoubleSide })
  );
  arc.name = 'metric-arc';
  arc.rotation.x  = Math.PI / 2;
  arc.rotation.z  = Math.PI;  // offset so it doesn't overlap temporal arc start
  return arc;
}

/**
 * Up to 3 small orbital dots encoding occupation/industry/continent tags.
 * Returns an array (may be empty).
 */
function _buildTagDots(profile, r) {
  if (!profile) return [];
  const tags = [];

  const occ = profile.occupations?.[0];
  const ind = profile.industries?.[0];
  const con = profile.continent;

  if (occ) tags.push({ color: TAG_COLOR.occupation, label: occ });
  if (ind) tags.push({ color: TAG_COLOR.industry,   label: ind });
  if (con) tags.push({ color: TAG_COLOR.continent,  label: con });

  if (!tags.length) return [];

  const orbitR = r * 2.2;
  const dotR   = r * 0.13;

  return tags.slice(0, 3).map((tag, i, arr) => {
    const angle = (i / arr.length) * Math.PI * 2 - Math.PI / 2; // start at top
    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(dotR, 7, 7),
      new THREE.MeshBasicMaterial({ color: tag.color, transparent: true, opacity: 0.75 })
    );
    dot.name     = `tag-dot-${i}`;
    dot.userData  = { tagLabel: tag.label, tagColor: tag.color };
    dot.position.set(Math.cos(angle) * orbitR, 0, Math.sin(angle) * orbitR);
    return dot;
  });
}

// ── Label sprite ──────────────────────────────────────────────────────────────
//
//  Canvas layout (512 × 208):
//   Row 0  (y=20)   source badge left  |  tier badge right
//   Row 1  (y=46)   type label (orange)
//   Row 2  (y=92)   entity name (large, primary)
//   Row 3  (y=120)  temporal line   e.g. "1869–1948  ·  79y"  or  "est. 1998"
//   Row 4  (y=144)  metric / tag    e.g. "pop. 1.5B"  or  "writer · politician"
//   Row 5  (y=166)  id / QID (dim)

function _buildLabel(node, style, tier, r) {
  const canvas  = document.createElement('canvas');
  canvas.width  = 512;
  canvas.height = 208;
  const ctx     = canvas.getContext('2d');
  const isLocal = node._source === 'local';

  // Helpers
  const mid = 256;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'alphabetic';

  // Row 0 — source badge
  ctx.font      = 'bold 14px "Courier New", monospace';
  ctx.fillStyle = isLocal ? '#00ff66' : '#222200';
  ctx.textAlign = 'left';
  ctx.fillText(isLocal ? '◆ LOCAL' : '◇ WD', 14, 20);

  // Tier badge (right)
  if (tier && tier !== 'primary') {
    const TIER_CLR = { spine: '#ff6600', secondary: '#445544', context: '#222200', insight: '#cccccc' };
    ctx.fillStyle = TIER_CLR[tier] ?? '#445544';
    ctx.textAlign = 'right';
    ctx.fillText(tier.toUpperCase(), 498, 20);
  }

  // Row 1 — type label
  ctx.textAlign = 'center';
  ctx.font      = 'bold 18px "Courier New", monospace';
  ctx.fillStyle = '#ff6600';
  ctx.fillText(getEntityStyle(node.type ?? 'default').label.toUpperCase(), mid, 46);

  // Row 2 — entity name
  const display = (node.label ?? node.qid ?? '').toUpperCase();
  const short   = display.length > 20 ? display.slice(0, 19) + '…' : display;
  ctx.font        = 'bold 30px "Courier New", monospace';
  ctx.shadowColor = '#000';
  ctx.shadowBlur  = 10;
  ctx.fillStyle   = '#e8e0c8';
  ctx.fillText(short, mid, 92);
  ctx.shadowBlur  = 0;

  // Row 3 — temporal line
  const tLine = _formatTemporal(node.temporal);
  if (tLine) {
    const tColor = _temporalActive(node.temporal) ? '#00ccff' : '#ffaa00';
    ctx.font      = '14px "Courier New", monospace';
    ctx.fillStyle = tColor;
    ctx.fillText(tLine, mid, 120);
  }

  // Row 4 — metric or occupation tags
  const mLine = _formatMetric(node.metrics) || _formatTags(node.profile);
  if (mLine) {
    ctx.font      = '13px "Courier New", monospace';
    ctx.fillStyle = '#888877';
    ctx.fillText(mLine, mid, 144);
  }

  // Row 5 — QID / id
  ctx.font      = '13px "Courier New", monospace';
  ctx.fillStyle = '#334433';
  ctx.fillText(isLocal ? (node.qid ?? '') : (node.qid ?? ''), mid, 166);

  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(canvas),
      transparent: true, depthWrite: false, sizeAttenuation: true,
    })
  );
  sprite.scale.set(4.4, 1.6, 1);
  sprite.position.y = -(r + 0.90);
  return sprite;
}

// ── Label helpers ─────────────────────────────────────────────────────────────

function _temporalActive(t) {
  if (!t) return false;
  return (t.death == null && t.dissolved == null && t.end == null);
}

function _formatTemporal(t) {
  if (!t) return null;
  const now = new Date().getFullYear();

  // Person: "1869 – 1948  ·  79y"  or  "b. 1869  (still living)"
  if (t.birth != null) {
    const end = t.death ?? null;
    if (end) return `${t.birth} – ${end}  ·  ${end - t.birth}y`;
    return `b. ${t.birth}  ·  ${now - t.birth}y`;
  }

  // Org / Country: "est. 1947"  or  "1947 – 2001"
  if (t.founded != null) {
    if (t.dissolved) return `${t.founded} – ${t.dissolved}  ·  ${t.dissolved - t.founded}y`;
    return `est. ${t.founded}  ·  ${now - t.founded}y`;
  }

  // Event: "2008–08 → 2008–08" or just start
  if (t.start != null) {
    if (t.end) return `${t.start} – ${t.end}`;
    return `from ${t.start}`;
  }

  return null;
}

function _formatMetric(m) {
  if (!m) return null;
  if (m.population != null) return `pop. ${_humanNum(m.population)}`;
  if (m.employees  != null) return `${_humanNum(m.employees)} employees`;
  if (m.area       != null) return `${_humanNum(m.area)} km²`;
  return null;
}

function _formatTags(profile) {
  if (!profile) return null;
  const parts = [];
  if (profile.occupations?.length) parts.push(profile.occupations.slice(0, 2).join(' · '));
  else if (profile.industries?.length) parts.push(profile.industries[0]);
  if (profile.continent) parts.push(profile.continent);
  return parts.join('  ·  ') || null;
}

function _humanNum(n) {
  if (n >= 1e9)  return (n / 1e9).toFixed(1)  + 'B';
  if (n >= 1e6)  return (n / 1e6).toFixed(1)  + 'M';
  if (n >= 1e3)  return (n / 1e3).toFixed(0)  + 'K';
  return String(Math.round(n));
}

// ── Image plane (async Wikimedia thumbnail) ───────────────────────────────────

const _texCache = new Map();   // url → Promise<THREE.Texture>
const _loader   = new THREE.TextureLoader();

function _attachImagePlane(url, r, group) {
  if (!_texCache.has(url)) {
    _texCache.set(url, _resolveWikimediaUrl(url).then(resolved => {
      if (!resolved) return null;
      return new Promise(res => _loader.load(resolved, res, undefined, () => res(null)));
    }));
  }
  _texCache.get(url).then(tex => {
    if (!tex || !group.parent) return;
    tex.colorSpace = THREE.SRGBColorSpace;
    const size  = r * 1.9;
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(size, size),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, side: THREE.DoubleSide })
    );
    plane.position.z = r * 1.05;
    plane.name = 'image-plane';
    group.add(plane);
  });
}

async function _resolveWikimediaUrl(url) {
  if (!url.includes('Special:FilePath')) return url;
  const filename = decodeURIComponent(url.split('Special:FilePath/').pop());
  try {
    const api  = 'https://commons.wikimedia.org/w/api.php?' + new URLSearchParams({
      action: 'query', titles: `File:${filename}`,
      prop: 'imageinfo', iiprop: 'url', iiurlwidth: '400',
      format: 'json', origin: '*',
    });
    const json = await (await fetch(api)).json();
    const page = Object.values(json.query.pages)[0];
    return page?.imageinfo?.[0]?.thumburl ?? null;
  } catch { return null; }
}

// ── Rebuild helpers (called by nodes.mjs after enrichment) ───────────────────

/**
 * Rebuild only the temporal arc and metric arc on an existing group.
 * Called after enrichNode() populates node.temporal / node.metrics.
 */
export function rebuildDataArcs(group, node) {
  const r = group.userData.radius ?? getEntityStyle(node.type ?? 'default').radius;

  // Remove old arcs
  ['temporal-arc', 'metric-arc'].forEach(name => {
    const old = group.getObjectByName(name);
    if (old) { old.geometry.dispose(); old.material.dispose(); group.remove(old); }
  });

  // Rebuild
  const tArc = _buildTemporalArc(node.temporal, r);
  if (tArc) group.add(tArc);

  const mArc = _buildMetricArc(node.metrics, r);
  if (mArc) group.add(mArc);
}

/**
 * Rebuild only the label sprite on an existing group.
 * Called after enrichNode() fills in Wikipedia summary or other metadata.
 */
export function rebuildLabel(group, node) {
  const style = getEntityStyle(node.type ?? 'default');
  const r     = group.userData.radius ?? style.radius;
  const tier  = node.tier ?? 'primary';

  // Remove old sprite
  const old = group.children.find(c => c instanceof THREE.Sprite);
  if (old) { old.material.map?.dispose(); old.material.dispose(); group.remove(old); }

  group.add(_buildLabel(node, style, tier, r));
}

/**
 * Rebuild tag dots on an existing group.
 */
export function rebuildTagDots(group, node) {
  const r = group.userData.radius ?? getEntityStyle(node.type ?? 'default').radius;

  // Remove old dots
  for (let i = 0; i < 3; i++) {
    const old = group.getObjectByName(`tag-dot-${i}`);
    if (old) { old.geometry.dispose(); old.material.dispose(); group.remove(old); }
  }

  _buildTagDots(node.profile, r).forEach(dot => group.add(dot));
}
