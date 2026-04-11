#!/usr/bin/env node
/**
 * build-garden.mjs
 *
 * Walks the vault directory, parses frontmatter, extracts [[WikiLink]] edges,
 * and emits assets/garden/garden-graph.json for the kaaroViewer Garden page.
 *
 * Vault path resolution order:
 *   1. GARDEN_VAULT_PATH env var
 *   2. ./_notes  (git submodule, production)
 *   3. ../karx.github.io  (sibling repo, local dev)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT  = path.resolve(__dirname, '..');
const OUT_DIR    = path.join(REPO_ROOT, 'assets', 'garden');
const OUT_FILE   = path.join(OUT_DIR, 'garden-graph.json');
const IMG_OUT    = path.join(OUT_DIR, 'images');

// ── Vault path resolution ────────────────────────────────────────────────────
function resolveVaultPath() {
  if (process.env.GARDEN_VAULT_PATH) {
    const p = path.resolve(process.env.GARDEN_VAULT_PATH);
    if (fs.existsSync(p)) return p;
    console.error(`GARDEN_VAULT_PATH set but not found: ${p}`);
    process.exit(1);
  }
  const submodule = path.join(REPO_ROOT, '_notes');
  if (fs.existsSync(submodule)) return submodule;

  const sibling = path.resolve(REPO_ROOT, '..', 'karx.github.io');
  if (fs.existsSync(sibling)) {
    console.warn(`[garden] Using sibling vault at ${sibling} (submodule not available)`);
    return sibling;
  }
  console.error('[garden] Could not find vault. Set GARDEN_VAULT_PATH or add _notes submodule.');
  process.exit(1);
}

// ── File discovery ───────────────────────────────────────────────────────────
const SKIP_DIRS = new Set([
  'node_modules', '.git', '_site', '.obsidian', 'Abbreviations',
]);

function* walkMarkdown(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      yield* walkMarkdown(path.join(dir, entry.name));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      yield path.join(dir, entry.name);
    }
  }
}

// For a folder note (Foo/README.md) return slug "foo".
// For a standalone note (Foo.md) return slug "foo".
// For a nested note (Foo/Bar.md) return slug "foo--bar".
function slugify(filePath, vaultRoot) {
  const rel  = path.relative(vaultRoot, filePath);
  const parts = rel.split(path.sep);

  // Drop README.md → use only the directory name
  if (parts.at(-1).toLowerCase() === 'readme.md') parts.pop();
  else parts[parts.length - 1] = parts.at(-1).replace(/\.md$/i, '');

  // Root README.md → treat as "about"
  if (parts.length === 0) return 'about';
  const slug = parts.map(p => p.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')).filter(Boolean).join('--');
  return slug || `note-${Buffer.from(rel).toString('base64').slice(0, 8)}`;
}

// ── WikiLink extraction ──────────────────────────────────────────────────────
const WIKILINK_RE = /\[\[([^\]|#]+)(?:[|#][^\]]*)?]]/g;

function extractWikiLinks(content) {
  const links = [];
  for (const m of content.matchAll(WIKILINK_RE)) {
    // Normalise to the slug format: lowercase, spaces → dashes
    links.push(m[1].trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
  }
  return [...new Set(links)];
}

// ── Image copy ───────────────────────────────────────────────────────────────
function copyImage(imagePath, vaultRoot) {
  const abs = path.join(vaultRoot, imagePath);
  if (!fs.existsSync(abs)) return null;
  const dest = path.join(IMG_OUT, path.basename(imagePath));
  fs.copyFileSync(abs, dest);
  return `/assets/garden/images/${path.basename(imagePath)}`;
}

// ── Title extraction from body ───────────────────────────────────────────────
function extractTitle(content, fallback) {
  const m = content.match(/^#\s+(.+)/m);
  return m ? m[1].trim() : fallback;
}

// ── First paragraph extraction ───────────────────────────────────────────────
function extractDescription(content) {
  // Skip headings and frontmatter remnants, get first non-empty non-heading paragraph
  const lines = content.split('\n');
  let para = '';
  for (const line of lines) {
    const t = line.trim();
    if (!t || t.startsWith('#') || t.startsWith('---')) continue;
    para += (para ? ' ' : '') + t;
    if (para.length > 200) break;
  }
  return para.slice(0, 280).replace(/\s+/g, ' ').trim();
}

// ── Main ─────────────────────────────────────────────────────────────────────
function build() {
  const vaultRoot = resolveVaultPath();
  console.log(`[garden] Vault: ${vaultRoot}`);

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(IMG_OUT, { recursive: true });

  const nodes   = [];
  const rawEdges = []; // { fromSlug, toSlug }
  const slugSet  = new Set();
  const slugToNode = new Map();

  // ── Pass 1: collect all published notes ─────────────────────────────────
  for (const filePath of walkMarkdown(vaultRoot)) {
    const raw  = fs.readFileSync(filePath, 'utf8');
    let fm, content;
    try {
      const parsed = matter(raw);
      fm      = parsed.data;
      content = parsed.content;
    } catch {
      continue;
    }

    if (!fm.published) continue;

    const slug = slugify(filePath, vaultRoot);
    if (slugSet.has(slug)) continue; // deduplicate folder README vs standalone
    slugSet.add(slug);

    const folderName = path.relative(vaultRoot, filePath)
      .split(path.sep)[0]
      .replace(/\.md$/i, '');

    const title = fm.title
      || extractTitle(content, folderName);

    const description = fm.description
      || extractDescription(content);

    const wikiLinks = extractWikiLinks(content);

    let imageUrl = null;
    if (fm.image) {
      imageUrl = copyImage(fm.image, vaultRoot);
    }

    const node = {
      id:          slug,
      type:        'vault-note',
      label:       title,
      description: description || '',
      tags:        Array.isArray(fm.tags) ? fm.tags : (fm.tags ? [fm.tags] : []),
      image:       imageUrl,
      date:        fm.date ? String(fm.date) : null,
      noteUrl:     `/notes/${slug}/`,
      wikiLinks,
    };

    nodes.push(node);
    slugToNode.set(slug, node);

    // Store raw WikiLink slugs for edge resolution in pass 2
    for (const target of wikiLinks) {
      rawEdges.push({ fromSlug: slug, toSlug: target });
    }
  }

  // ── Pass 2: resolve edges (only between published notes) ─────────────────
  const edges = [];
  const edgeSet = new Set();

  for (const { fromSlug, toSlug } of rawEdges) {
    if (!slugToNode.has(toSlug)) continue; // target not published
    const key = `${fromSlug}→${toSlug}`;
    if (edgeSet.has(key)) continue;
    edgeSet.add(key);
    edges.push({ from: fromSlug, to: toSlug, relLabel: 'wikilink', directed: true, weight: 1 });
  }

  // ── Build cluster index from tags ────────────────────────────────────────
  const TAG_COLORS = {
    'streaming':       '#4fc3f7',
    'interface':       '#fff176',
    'iot':             '#a5d6a7',
    'knowledge-graph': '#ce93d8',
    'maker':           '#ffb74d',
    'startup':         '#ef9a9a',
    'reflection':      '#b0bec5',
    'reference':       '#80cbc4',
  };
  const clusters = {};
  for (const node of nodes) {
    const primaryTag = node.tags[0];
    if (!primaryTag) continue;
    if (!clusters[primaryTag]) {
      clusters[primaryTag] = { color: TAG_COLORS[primaryTag] || '#888888' };
    }
  }

  // ── Search index ─────────────────────────────────────────────────────────
  const index = nodes.map(n => ({ id: n.id, title: n.label, tags: n.tags }));

  // ── Write output ─────────────────────────────────────────────────────────
  const output = { nodes, edges, clusters, index };
  fs.writeFileSync(OUT_FILE, JSON.stringify(output, null, 2));

  // ── Health report ────────────────────────────────────────────────────────
  const isolated     = nodes.filter(n => !edges.some(e => e.from === n.id || e.to === n.id));
  const untagged     = nodes.filter(n => n.tags.length === 0);
  const missingTargets = rawEdges.filter(({ toSlug }) => !slugToNode.has(toSlug));

  console.log(`
[garden] Build complete
  Published notes : ${nodes.length}
  Edges           : ${edges.length}
  Isolated nodes  : ${isolated.length}${isolated.length ? ' ← ' + isolated.map(n => n.id).join(', ') : ''}
  Missing targets : ${missingTargets.length}${missingTargets.length ? ' ← ' + [...new Set(missingTargets.map(e => e.toSlug))].join(', ') : ''}
  Untagged nodes  : ${untagged.length}${untagged.length ? ' ← ' + untagged.map(n => n.id).join(', ') : ''}
  Output          : ${OUT_FILE}
`);
}

build();
