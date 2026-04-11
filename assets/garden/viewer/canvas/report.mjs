/**
 * report.mjs — rich visual dashboard report view.
 *
 * Renders an intelligence brief from enriched doc metadata:
 *   Header → KPI Strip → Briefing → Story Arc (SVG) → Analytics Panel
 *   → Insights → Entity Spotlight → Clusters → Footer
 *
 * Events dispatched:
 *   report:navigate    { qid }           — focus a single node in graph
 *   report:cluster-focus { nodeIds[] }   — frame cluster in graph canvas
 *   report:beat-frame    { nodeIds[] }   — fly camera to beat nodes
 */

import { getEntityStyle } from '../ontology.mjs';

let _wrap  = null;
let _inner = null;

export function initReport() {
  _wrap  = document.getElementById('report-wrap');
  _inner = document.getElementById('report-inner');
}

export function renderReport(docMeta) {
  if (!_inner || !docMeta) return;
  _inner.innerHTML = [
    _header(docMeta),
    _kpiStrip(docMeta),
    _briefing(docMeta),
    _storyArc(docMeta),
    _analyticsPanel(docMeta),
    _insights(docMeta),
    _entitySpotlight(docMeta),
    _clusters(docMeta),
    _footer(docMeta),
  ].join('');
  _bindClicks(_inner);
}

export function showReport()        { _wrap?.classList.add('rp-visible'); }
export function hideReport()        { _wrap?.classList.remove('rp-visible'); }
export function isReportVisible()   { return !!_wrap?.classList.contains('rp-visible'); }

export function scrollToCluster(clusterId) {
  const el = document.getElementById(`rp-cl-${clusterId}`);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Section renderers ─────────────────────────────────────────────────────────

function _header(doc) {
  const tags = (doc.tags ?? []).map(t => `<span class="rp-tag">${_e(t)}</span>`).join('');
  const tone = doc.tone ?? 'analytical';
  return `
  <header class="rp-header">
    <div class="rp-header-meta">
      <span class="rp-domain">${_e(doc.domain)}</span>
      <span class="rp-sep">·</span>
      <span class="rp-year">${_e(doc.year)}</span>
      <span class="rp-tone rp-tone-${_e(tone)}">${_e(tone.toUpperCase())}</span>
    </div>
    <h1 class="rp-title">${_e(doc.title)}</h1>
    ${doc.subtitle ? `<p class="rp-subtitle">${_e(doc.subtitle)}</p>` : ''}
    ${tags ? `<div class="rp-tags">${tags}</div>` : ''}
  </header>`;
}

// ── KPI Strip ─────────────────────────────────────────────────────────────────

function _kpiStrip(doc) {
  const a          = doc.analytics ?? {};
  const nodeCount  = (doc.nodes ?? []).length;
  const edgeCount  = Object.values(a.relTypeDist ?? {}).reduce((s, v) => s + v, 0);
  const clCount    = (doc.clusters ?? []).length;
  const insCount   = (doc.insights ?? []).length;
  const beatCount  = (doc.story ?? []).length;
  const chainCount = (a.causalChains ?? []).length;

  const topEntry   = Object.entries(a.centrality ?? {}).sort(([, x], [, y]) => y - x)[0];
  const topLabel   = topEntry ? (doc.nodeLookup?.[topEntry[0]]?.label ?? topEntry[0]) : '—';

  const items = [
    { val: nodeCount,  lbl: 'ENTITIES' },
    { val: edgeCount,  lbl: 'RELATIONS' },
    { val: clCount,    lbl: 'CLUSTERS' },
    { val: insCount,   lbl: 'INSIGHTS' },
    { val: beatCount,  lbl: 'BEATS' },
    ...(chainCount ? [{ val: chainCount, lbl: 'CAUSAL CHAINS' }] : []),
    { val: topLabel,   lbl: 'MOST CENTRAL', str: true },
  ];

  return `<div class="rp-kpi-strip">${
    items.map(({ val, lbl, str }) =>
      `<div class="rp-kpi">
        <span class="rp-kpi-val${str ? ' rp-kpi-str' : ''}">${_e(String(val))}</span>
        <span class="rp-kpi-lbl">${_e(lbl)}</span>
      </div>`
    ).join('')
  }</div>`;
}

// ── Briefing ──────────────────────────────────────────────────────────────────

function _briefing(doc) {
  const rc     = doc.report_card ?? {};
  const stats  = (rc.key_stats ?? []).map(s => {
    const { label, value } = _parseStat(s);
    return `<div class="rp-stat">
      <span class="rp-stat-val">${_e(value)}</span>
      ${label ? `<span class="rp-stat-lbl">${_e(label)}</span>` : ''}
    </div>`;
  }).join('');

  const prota  = (rc.protagonists ?? []).map(id => _pill(id, doc)).join('');
  const antag  = (rc.antagonists  ?? []).map(id => _pill(id, doc, 'neg')).join('');
  const themes = (rc.themes ?? []).map(t => `<span class="rp-theme">${_e(t)}</span>`).join('');

  return `
  <section class="rp-briefing">
    <div class="rp-sechdr">── EXECUTIVE BRIEFING ─────────────────────────────────────────────</div>
    ${rc.summary ? `<p class="rp-summary">${_e(rc.summary)}</p>` : ''}
    ${stats ? `<div class="rp-stats-row">${stats}</div>` : ''}
    ${_sentimentBars(doc)}
    <div class="rp-actors-row">
      ${prota ? `<div class="rp-actor-grp"><span class="rp-actor-lbl">PROTAGONISTS</span>${prota}</div>` : ''}
      ${antag ? `<div class="rp-actor-grp"><span class="rp-actor-lbl rp-actor-lbl-neg">ANTAGONISTS</span>${antag}</div>` : ''}
    </div>
    ${themes ? `<div class="rp-themes-row"><span class="rp-actor-lbl">THEMES</span>${themes}</div>` : ''}
  </section>`;
}

// ── Story Arc with SVG tension chart ──────────────────────────────────────────

function _storyArc(doc) {
  if (!doc.story?.length) return '';

  const beats = doc.story.map((beat, i) => {
    const primary  = doc.nodeLookup?.[beat.node];
    const related  = (beat.nodes ?? []).map(id => _pill(id, doc)).join('');
    const allIds   = [beat.node, ...(beat.nodes ?? [])].filter(Boolean);
    const frameBtn = allIds.length
      ? `<button class="rp-beat-frame-btn" data-beat-nodes="${_e(allIds.join(','))}">◉ FRAME</button>`
      : '';
    return `
    <div class="rp-beat rp-tension-${_e(beat.tension ?? 'low')}">
      <div class="rp-beat-bar"></div>
      <div class="rp-beat-body">
        <div class="rp-beat-hdr">
          <span class="rp-beat-num">${String(i + 1).padStart(2, '0')}</span>
          <span class="rp-beat-title">${_e(beat.title)}</span>
          <span class="rp-beat-tension-tag">${_e((beat.tension ?? 'low').toUpperCase())}</span>
          ${frameBtn}
        </div>
        ${primary ? _entityBadge(primary) : ''}
        <p class="rp-beat-narration">${_e(beat.narration)}</p>
        ${related ? `<div class="rp-beat-related"><span class="rp-related-lbl">ALSO ▸</span>${related}</div>` : ''}
      </div>
    </div>`;
  }).join('');

  const strip = doc.story.map((beat, i) => {
    const allIds = [beat.node, ...(beat.nodes ?? [])].filter(Boolean);
    return `<div class="rp-bs-block rp-bs-${_e(beat.tension ?? 'low')}"
      title="${_e(beat.title)}"
      data-beat-idx="${i}"
      ${allIds.length ? `data-beat-nodes="${_e(allIds.join(','))}"` : ''}
    ><span class="rp-bs-num">${i + 1}</span></div>`;
  }).join('');

  return `
  <section class="rp-story">
    <div class="rp-sechdr">── STORY ────────────────────────────────────────────────────────────</div>
    <div class="rp-beat-strip" id="rp-beat-strip">${strip}</div>
    ${_svgTensionArc(doc)}
    ${beats}
  </section>`;
}

// ── SVG Tension Arc Chart ─────────────────────────────────────────────────────

function _svgTensionArc(doc) {
  const curve = doc.analytics?.tensionCurve ?? [];
  if (curve.length < 2) return '';

  const W = 560, H = 84, PX = 46, PY = 8;
  const n      = curve.length;
  const xStep  = (W - PX - 16) / Math.max(n - 1, 1);
  const yRange = H - PY * 2 - 14; // leave 14px for beat-number labels

  const pts = curve.map((v, i) => ({
    x: PX + i * xStep,
    y: PY + yRange - ((v - 1) / 3) * yRange,
  }));

  const polylineStr = pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const bottomY     = (PY + yRange).toFixed(1);
  const areaPath    = `M ${pts[0].x.toFixed(1)},${bottomY} ` +
    pts.map(p => `L ${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') +
    ` L ${pts[n - 1].x.toFixed(1)},${bottomY} Z`;

  const TCOL  = { 1: '#334433', 2: '#996600', 3: '#ff4400', 4: '#ff0044' };
  const TNAME = { 1: 'LOW', 2: 'MED', 3: 'HIGH', 4: 'CLIMAX' };

  const grid = [1, 2, 3, 4].map(v => {
    const y   = (PY + yRange - ((v - 1) / 3) * yRange).toFixed(1);
    const col = TCOL[v];
    return `<line x1="${PX}" y1="${y}" x2="${W - 8}" y2="${y}" stroke="${col}" stroke-opacity="0.18" stroke-width="1" stroke-dasharray="3 5"/>
            <text x="${PX - 4}" y="${(parseFloat(y) + 3.5).toFixed(1)}" text-anchor="end" class="rp-svg-lbl" fill="${col}">${TNAME[v]}</text>`;
  }).join('');

  const dotElems = pts.map((p, i) => {
    const col  = TCOL[curve[i]] ?? '#334433';
    const beat = doc.story[i];
    const qid  = beat?.node ?? '';
    return `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="5" fill="${col}" stroke="#000000" stroke-width="1.5" class="rp-arc-pt"${qid ? ` data-qid="${_e(qid)}"` : ''} title="${_e(beat?.title ?? '')}"/>`;
  }).join('');

  const numLabels = pts.map((p, i) =>
    `<text x="${p.x.toFixed(1)}" y="${H - 2}" text-anchor="middle" class="rp-svg-lbl">${String(i + 1).padStart(2, '0')}</text>`
  ).join('');

  return `
  <div class="rp-tension-chart">
    <svg viewBox="0 0 ${W} ${H}" class="rp-svg-arc" preserveAspectRatio="none">
      <defs>
        <linearGradient id="tensionGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ff4400" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#330000" stop-opacity="0.04"/>
        </linearGradient>
      </defs>
      ${grid}
      <path d="${areaPath}" fill="url(#tensionGrad)"/>
      <polyline points="${polylineStr}" fill="none" stroke="#cc5500" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
      ${dotElems}
      ${numLabels}
    </svg>
  </div>`;
}

// ── Analytics Panel ────────────────────────────────────────────────────────────

function _analyticsPanel(doc) {
  const a = doc.analytics;
  if (!a) return '';

  const centrality = _centralityBars(doc);
  const relDist    = _relTypeBars(doc);
  if (!centrality && !relDist) return '';

  return `
  <section class="rp-analytics-sec">
    <div class="rp-sechdr">── ANALYTICS ────────────────────────────────────────────────────────</div>
    <div class="rp-analytics-grid">
      ${centrality ? `<div class="rp-chart-block">
        <div class="rp-chart-title">DEGREE CENTRALITY</div>
        ${centrality}
      </div>` : ''}
      ${relDist ? `<div class="rp-chart-block">
        <div class="rp-chart-title">RELATIONSHIP DISTRIBUTION</div>
        ${relDist}
      </div>` : ''}
    </div>
  </section>`;
}

function _centralityBars(doc) {
  const centrality = doc.analytics?.centrality;
  if (!centrality) return '';

  const sorted = Object.entries(centrality)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);
  if (!sorted.length) return '';

  return `<div class="rp-cbar-chart">${
    sorted.map(([id, score]) => {
      const node  = doc.nodeLookup?.[id];
      const label = node?.label ?? id;
      const pct   = (score * 100).toFixed(1);
      const style = getEntityStyle(node?.type ?? 'default');
      const col   = '#' + style.color.toString(16).padStart(6, '0');
      return `<div class="rp-cbar-row" data-qid="${_e(id)}">
        <span class="rp-cbar-lbl">${_e(label.length > 18 ? label.slice(0, 17) + '…' : label)}</span>
        <div class="rp-cbar-track"><div class="rp-cbar-fill" style="width:${pct}%;background:${col}"></div></div>
        <span class="rp-cbar-val">${pct}%</span>
      </div>`;
    }).join('')
  }</div>`;
}

function _relTypeBars(doc) {
  const dist = doc.analytics?.relTypeDist;
  if (!dist) return '';

  const sorted = Object.entries(dist).sort(([, a], [, b]) => b - a).slice(0, 10);
  if (!sorted.length) return '';
  const max = sorted[0][1];

  const REL_COL = {
    causes: '#ff4400', membership: '#00cccc', creation: '#ff6600',
    opposition: '#ff2222', location: '#00ff88', leadership: '#ffcc00',
    collaboration: '#4488ff', conflict: '#ff0044', reveals: '#cc44ff',
    default: '#334433',
  };

  return `<div class="rp-cbar-chart">${
    sorted.map(([rel, count]) => {
      const col = REL_COL[rel] ?? '#334433';
      const pct = (count / max * 100).toFixed(1);
      return `<div class="rp-cbar-row">
        <span class="rp-cbar-lbl">${_e(rel)}</span>
        <div class="rp-cbar-track"><div class="rp-cbar-fill" style="width:${pct}%;background:${col}"></div></div>
        <span class="rp-cbar-val">${count}</span>
      </div>`;
    }).join('')
  }</div>`;
}

function _sentimentBars(doc) {
  const dist = doc.analytics?.sentimentDist;
  if (!dist) return '';
  const total = Object.values(dist).reduce((s, v) => s + v, 0);
  if (!total) return '';

  const SCOL = { positive: '#00ff88', negative: '#ff4444', neutral: '#555544', contested: '#ffcc00' };
  const entries = Object.entries(dist).filter(([, v]) => v > 0);
  if (!entries.length) return '';

  const segs = entries.map(([k, v]) => {
    const col = SCOL[k] ?? '#666';
    const pct = (v / total * 100).toFixed(1);
    return `<div class="rp-sent-seg" style="flex:${v};background:${col}" title="${_e(k.toUpperCase())}: ${v} (${pct}%)">
      <span class="rp-sent-lbl">${_e(k.toUpperCase().slice(0, 3))}</span>
    </div>`;
  }).join('');

  const legend = entries.map(([k, v]) => {
    const col = SCOL[k] ?? '#666';
    const pct = (v / total * 100).toFixed(0);
    return `<span class="rp-sent-legend-item"><span class="rp-sent-dot" style="background:${col}"></span>${_e(k)} ${pct}%</span>`;
  }).join('');

  return `<div class="rp-sent-wrap">
    <div class="rp-sent-row">${segs}</div>
    <div class="rp-sent-legend">${legend}</div>
  </div>`;
}

// ── Insights ──────────────────────────────────────────────────────────────────

function _insights(doc) {
  if (!doc.insights?.length) return '';

  const ICON = { finding:'◈', warning:'⚑', pattern:'◎', conclusion:'◆', paradox:'◉', opportunity:'◇' };
  const SEV_PCT = { high: 100, medium: 66, low: 33 };
  const SEV_COL = { high: '#ff4400', medium: '#cc8800', low: '#334433' };

  // Build filter pills only for types that actually exist in this document
  const typesPresent = [...new Set(doc.insights.map(ins => ins.type).filter(Boolean))];
  const filterPills  = typesPresent.length > 1
    ? `<div class="rp-ins-filters">
        <button class="rp-ins-filter rp-ins-f-active" data-filter="all">ALL</button>
        ${typesPresent.map(t =>
          `<button class="rp-ins-filter" data-filter="${_e(t)}">${_e(ICON[t] ?? '')} ${_e(t.toUpperCase())}</button>`
        ).join('')}
      </div>`
    : '';

  const cards = doc.insights.map(ins => {
    const icon    = ICON[ins.type] ?? '◈';
    const sevPct  = SEV_PCT[ins.severity] ?? 66;
    const sevCol  = SEV_COL[ins.severity] ?? '#cc8800';
    const evidence = (ins.evidence ?? []).map(id => _pill(id, doc)).join('');
    const evidenceIds = (ins.evidence ?? []).join(',');
    const focusBtn = evidenceIds
      ? `<button class="rp-ins-focus-btn" data-insight-qid="${_e(ins.id)}" data-insight-evidence="${_e(evidenceIds)}">◉ FOCUS EVIDENCE</button>`
      : '';
    return `
    <div class="rp-insight rp-ins-${_e(ins.type)} rp-sev-${_e(ins.severity ?? 'medium')}">
      <div class="rp-ins-hdr">
        <span class="rp-ins-icon">${icon}</span>
        <span class="rp-ins-type">${_e((ins.type ?? 'finding').toUpperCase())}</span>
        <div class="rp-ins-sev-bar"><div class="rp-ins-sev-fill" style="width:${sevPct}%;background:${sevCol}"></div></div>
        <span class="rp-ins-sevlbl" style="color:${sevCol}">${_e((ins.severity ?? 'medium').toUpperCase())}</span>
      </div>
      <blockquote class="rp-ins-quote">"${_e(ins.title)}"</blockquote>
      <p class="rp-ins-body">${_e(ins.body)}</p>
      ${evidence ? `<div class="rp-ins-evidence"><span class="rp-related-lbl">EVIDENCE ▸</span>${evidence}</div>` : ''}
      ${focusBtn}
    </div>`;
  }).join('');

  return `
  <section class="rp-insights-sec">
    <div class="rp-sechdr">── ANALYTICAL INSIGHTS ──────────────────────────────────────────────</div>
    ${filterPills}
    <div class="rp-insights-grid">${cards}</div>
  </section>`;
}

// ── Entity Spotlight ──────────────────────────────────────────────────────────

function _entitySpotlight(doc) {
  const rc     = doc.report_card ?? {};
  const protas = (rc.protagonists ?? []).map(id => doc.nodeLookup?.[id]).filter(Boolean);
  const antags = (rc.antagonists  ?? []).map(id => doc.nodeLookup?.[id]).filter(Boolean);
  if (!protas.length && !antags.length) return '';

  const card = (node) => {
    const style    = getEntityStyle(node.type ?? 'default');
    const col      = '#' + style.color.toString(16).padStart(6, '0');
    const metrics  = node.metrics
      ? Object.entries(node.metrics).slice(0, 5).map(([k, v]) =>
          `<div class="rp-ec-row"><span class="rp-ec-k">${_e(k)}</span><span class="rp-ec-v">${_e(String(v))}</span></div>`
        ).join('')
      : '';
    const descShort = node.description
      ? node.description.length > 160 ? node.description.slice(0, 159) + '…' : node.description
      : '';
    return `
    <div class="rp-ec rp-ec-${_e(node.sentiment ?? 'neutral')}" data-qid="${_e(node.id)}">
      <div class="rp-ec-top">
        <span class="rp-ec-type" style="color:${col}">${_e(style.label.toUpperCase())}</span>
        <span class="rp-ec-tier">${_e((node.tier ?? 'primary').toUpperCase())}</span>
      </div>
      <div class="rp-ec-label" style="border-left-color:${col}">${_e(node.label)}</div>
      ${descShort ? `<p class="rp-ec-desc">${_e(descShort)}</p>` : ''}
      ${metrics ? `<div class="rp-ec-metrics">${metrics}</div>` : ''}
      <button class="rp-ec-goto" data-qid="${_e(node.id)}">VIEW IN GRAPH →</button>
    </div>`;
  };

  return `
  <section class="rp-spotlight">
    <div class="rp-sechdr">── ENTITY SPOTLIGHT ─────────────────────────────────────────────────</div>
    ${protas.length ? `
      <div class="rp-spot-grp">
        <div class="rp-spot-grp-lbl">PROTAGONISTS</div>
        <div class="rp-ec-grid">${protas.map(card).join('')}</div>
      </div>` : ''}
    ${antags.length ? `
      <div class="rp-spot-grp">
        <div class="rp-spot-grp-lbl rp-spot-grp-lbl-neg">ANTAGONISTS / FORCES</div>
        <div class="rp-ec-grid">${antags.map(card).join('')}</div>
      </div>` : ''}
  </section>`;
}

// ── Clusters ──────────────────────────────────────────────────────────────────

function _clusters(doc) {
  if (!doc.clusters?.length) return '';

  const totalNodes = (doc.nodes ?? []).length || 1;

  const cards = doc.clusters.map(cl => {
    const col     = cl.color ?? '#666666';
    const count   = cl.nodes?.length ?? 0;
    const pct     = (count / totalNodes * 100).toFixed(0);
    const nodeIds = (cl.nodes ?? []).join(',');
    const nodes   = (cl.nodes ?? []).map(id => {
      const n = doc.nodeLookup?.[id];
      return `<span class="rp-cl-node" data-qid="${_e(id)}">${_e(n?.label ?? id)}</span>`;
    }).join('');

    return `
    <div class="rp-cl-card" id="rp-cl-${_e(cl.id)}" style="--cl-color:${_e(col)}">
      <div class="rp-cl-hdr">
        <span class="rp-cl-dot" style="background:${_e(col)}"></span>
        <span class="rp-cl-lbl">${_e(cl.label)}</span>
        <span class="rp-cl-cnt">${count}</span>
        <div class="rp-cl-pct-bar"><div class="rp-cl-pct-fill" style="width:${pct}%;background:${_e(col)}"></div></div>
      </div>
      ${cl.description ? `<p class="rp-cl-desc">${_e(cl.description)}</p>` : ''}
      <div class="rp-cl-nodes">${nodes}</div>
      ${nodeIds ? `<button class="rp-cl-focus-btn" data-cluster-nodes="${_e(nodeIds)}">◎ FOCUS IN GRAPH</button>` : ''}
    </div>`;
  }).join('');

  return `
  <section class="rp-clusters-sec">
    <div class="rp-sechdr">── ENTITY CLUSTERS ──────────────────────────────────────────────────</div>
    <div class="rp-cl-grid">${cards}</div>
  </section>`;
}

function _footer(doc) {
  return `
  <footer class="rp-footer">
    <span>kaaroViewer</span><span class="rp-sep">·</span>
    <span>${_e(doc.domain)}</span><span class="rp-sep">·</span>
    <span>${_e(doc.year)}</span><span class="rp-sep">·</span>
    <span>${_e(doc.id)}</span>
  </footer>`;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function _entityBadge(node) {
  const style = getEntityStyle(node.type ?? 'default');
  const col   = '#' + style.color.toString(16).padStart(6, '0');
  return `<div class="rp-ebadge" data-qid="${_e(node.id)}">
    <span class="rp-ebadge-type" style="color:${col}">${_e(style.label.toUpperCase())}</span>
    <span class="rp-ebadge-lbl">${_e(node.label)}</span>
  </div>`;
}

function _pill(id, doc, mod = '') {
  const node  = doc.nodeLookup?.[id];
  const label = node?.label ?? id;
  const style = getEntityStyle(node?.type ?? 'default');
  const col   = '#' + style.color.toString(16).padStart(6, '0');
  return `<span class="rp-pill${mod ? ' rp-pill-' + mod : ''}" data-qid="${_e(id)}" style="border-color:${col}">${_e(label)}</span>`;
}

function _bindClicks(root) {
  // Single node navigate
  root.querySelectorAll('[data-qid]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const qid = el.dataset.qid;
      if (qid) document.dispatchEvent(new CustomEvent('report:navigate', { detail: { qid } }));
    });
  });

  // Cluster focus — fly camera to all cluster nodes
  root.querySelectorAll('[data-cluster-nodes]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const nodeIds = btn.dataset.clusterNodes.split(',').filter(Boolean);
      if (nodeIds.length)
        document.dispatchEvent(new CustomEvent('report:cluster-focus', { detail: { nodeIds } }));
    });
  });

  // Beat frame — fly camera to beat's nodes
  root.querySelectorAll('[data-beat-nodes]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const nodeIds = btn.dataset.beatNodes.split(',').filter(Boolean);
      if (nodeIds.length)
        document.dispatchEvent(new CustomEvent('report:beat-frame', { detail: { nodeIds } }));
    });
  });

  // Insight focus — fly camera to evidence set
  root.querySelectorAll('.rp-ins-focus-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const qid         = btn.dataset.insightQid;
      const highlightSet = btn.dataset.insightEvidence.split(',').filter(Boolean);
      if (qid) document.dispatchEvent(new CustomEvent('report:insight-focus', { detail: { qid, highlightSet } }));
    });
  });

  // Beat strip blocks — scroll to beat + optionally frame
  root.querySelectorAll('.rp-bs-block').forEach(block => {
    block.addEventListener('click', e => {
      e.stopPropagation();
      const idx = parseInt(block.dataset.beatIdx ?? '-1', 10);
      if (idx < 0) return;
      const beatEls = root.querySelectorAll('.rp-beat');
      beatEls.forEach(b => b.classList.remove('rp-beat-active'));
      if (beatEls[idx]) {
        beatEls[idx].classList.add('rp-beat-active');
        beatEls[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      // Also update active state on strip
      root.querySelectorAll('.rp-bs-block').forEach(b => b.classList.remove('rp-bs-active'));
      block.classList.add('rp-bs-active');
      // Optionally frame those nodes
      const nodeIds = block.dataset.beatNodes?.split(',').filter(Boolean) ?? [];
      if (nodeIds.length)
        document.dispatchEvent(new CustomEvent('report:beat-frame', { detail: { nodeIds } }));
    });
  });

  // Insight type filter tabs
  root.querySelectorAll('.rp-ins-filter').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const filter = btn.dataset.filter;
      root.querySelectorAll('.rp-ins-filter').forEach(b => b.classList.remove('rp-ins-f-active'));
      btn.classList.add('rp-ins-f-active');
      root.querySelectorAll('.rp-insight').forEach(card => {
        const show = filter === 'all' || card.classList.contains(`rp-ins-${filter}`);
        card.style.display = show ? '' : 'none';
      });
    });
  });
}

function _e(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/** Normalise a key_stat entry — handles both plain strings and {label,value} objects. */
function _parseStat(s) {
  if (typeof s === 'string') {
    const sep = s.indexOf(': ');
    return sep > 0
      ? { label: s.slice(0, sep), value: s.slice(sep + 2) }
      : { label: '', value: s };
  }
  return { label: s.label ?? '', value: s.value ?? '' };
}
