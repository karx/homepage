#!/usr/bin/env node
/**
 * copy-viewer.mjs
 *
 * Copies the kaaroViewer Garden files into assets/garden/viewer/
 * so they can be served by Jekyll and iframed from the Garden page.
 *
 * Source: KAARO_VIEWER_PATH env var, or ../kaaroViewer (sibling repo)
 *
 * Copies:
 *   garden.html        → entry point
 *   garden-main.mjs    → garden orchestrator
 *   style.css          → shared styles
 *   logger.mjs         → logging
 *   ontology.mjs       → entity type resolution
 *   canvas/            → Three.js rendering modules
 *   pipeline/          → graph, resolver, sources, sessions, etc.
 *
 * Excluded:
 *   node_modules/, .git/, index.html (main viewer, not needed)
 *   Components and A-Frame files not used by garden-main.mjs
 */

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const OUT_DIR   = path.join(REPO_ROOT, 'assets', 'garden', 'viewer');

function resolveViewerPath() {
  if (process.env.KAARO_VIEWER_PATH) {
    const p = path.resolve(process.env.KAARO_VIEWER_PATH);
    if (fs.existsSync(p)) return p;
    console.error(`KAARO_VIEWER_PATH set but not found: ${p}`);
    process.exit(1);
  }
  const sibling = path.resolve(REPO_ROOT, '..', 'kaaroViewer');
  if (fs.existsSync(sibling)) {
    console.log(`[viewer] Using sibling kaaroViewer at ${sibling}`);
    return sibling;
  }
  console.error('[viewer] Could not find kaaroViewer. Set KAARO_VIEWER_PATH.');
  process.exit(1);
}

// Files and directories to copy (relative to viewer src)
const COPY_TARGETS = [
  'garden.html',
  'garden-main.mjs',
  'style.css',
  'logger.mjs',
  'ontology.mjs',
  'canvas',
  'pipeline',
];

// Within pipeline/, skip sources we don't need in garden mode
const SKIP_FILES = new Set([
  path.join('pipeline', 'sources', 'liquipedia.mjs'),
  path.join('pipeline', 'sources', 'reddit.mjs'),
  path.join('pipeline', 'sources', 'youtube.mjs'),
  path.join('pipeline', 'sources', 'locationHelper.mjs'),
]);

function copyRecursive(src, dest, baseRelative = '') {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      const rel = baseRelative ? path.join(baseRelative, entry) : entry;
      if (SKIP_FILES.has(rel)) continue;
      copyRecursive(path.join(src, entry), path.join(dest, entry), rel);
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

function build() {
  const viewerSrc = resolveViewerPath();
  fs.mkdirSync(OUT_DIR, { recursive: true });

  let copied = 0;
  for (const target of COPY_TARGETS) {
    const srcPath  = path.join(viewerSrc, target);
    const destPath = path.join(OUT_DIR, target);
    if (!fs.existsSync(srcPath)) {
      console.warn(`[viewer] skipping missing: ${target}`);
      continue;
    }
    copyRecursive(srcPath, destPath, target);
    copied++;
  }

  console.log(`[viewer] Copied ${copied} targets → ${OUT_DIR}`);
}

build();
