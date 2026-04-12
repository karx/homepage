# Portfolio Plan — Himan / Kartik Arora

**Goal:** Transform `akriya.co.in` from an agency site into a personal portfolio and living digital garden — the definitive public record of Kartik "kaaro" Arora's work, thinking, and experiments.

**Date:** 2026-04-12
**Status:** Phase 0 complete. Phase 1 in progress.

---

## The site in one sentence

> A living record of Kartik "kaaro" Arora — engineer, maker, and knowledge-graph obsessive — told through finished work, running experiments, and raw thinking.

---

## Identity

| | Current | Target |
|--|---------|--------|
| **Brand** | Akriya Technologies | Himan · Kartik Arora |
| **Voice** | We / Our / Agency | I / My / Personal |
| **Primary CTA** | "Start a project" | "Read the garden" / "See the work" |
| **Tagline** | "Embracing Digital Transformation" | "Builder. Tinkerer. Knowledge graphs." |
| **Persona** | IoT/Web agency | Engineer at PhonePe · ex-Bing Satori · maker |

Akriya Technologies stays as the studio name behind commercial work — it doesn't disappear, it becomes secondary.

---

## Information Architecture

```
/                  Home     — personal hero, current focus, 3 entry points
/works/            Works    — 6–8 curated case studies
/lab/              Lab      — open experiments, 3D models, hacks
/garden/           Garden   — 3D knowledge graph of published vault notes  ✓ built
/blog/             Blog     — long-form writing
/about/            About    — bio, career arc, contact
```

**Removed from nav:** Team · Core · Contact Us (standalone) · Start a Project

---

## Content inventory

### Exists and usable (minimal rewrite needed)
- **24 blog posts** — mostly technical (ESP, WebGL, Wikidata, WebComponents), 2018–present. Good foundation, needs tags and a few featured picks.
- **11 labs** — kaaroViewer, thoughtjumper, spotMe, kaaroClips, kaaroVote, etc. Already the most authentic content on the site. Needs `kaaroViewer.md` updated significantly.
- **3D GLTFs** — `_gltfs/`, `assets/models/` — distinctive asset. Stays in Lab.

### Exists but needs reframing
- **14 projects** — good work, buried in agency voice. Will be pruned to 6–8 and rewritten as personal case studies.

### Missing entirely
- **About page** — most-wanted. Kartik's bio exists in the vault (`kaaro/README.md`) — use that as the source.
- **Home hero** — current `index.md` is pure agency pitch.
- **Works page** — `/projects/` permalink and layout need renaming.

### Ongoing (no single-session fix)
- **Garden notes** — 20 published, target 40+. Needs vault maintenance sessions.

---

## Phase 0 — Garden pipeline ✓ complete

Everything needed to run the Garden page is built and working.

| Item | Status |
|------|--------|
| `scripts/build-garden.mjs` — vault → `garden-graph.json` | ✓ |
| `scripts/copy-viewer.mjs` — kaaroViewer → `/assets/garden/viewer/` | ✓ |
| `pipeline/sources/vault.mjs` in kaaroViewer | ✓ |
| `garden-main.mjs` — vault-mode orchestrator | ✓ |
| `canvas/detail.mjs` — vault-note detail panel | ✓ |
| `_layouts/garden.html` — direct embed, importmap-safe | ✓ |
| `_pages/garden.md` | ✓ |
| `GARDEN_GUIDELINES.md` in vault | ✓ |
| `GARDEN_INTEGRATION.md` in kaaroViewer | ✓ |

The garden page renders at `/garden/`. Currently 20 notes, 4 edges — functional but sparse. Graph density is a content problem, not a code problem.

---

## Phase 1 — Identity and navigation

**One session. Unblocks everything downstream.**

### 1a. `_config.yml`
```yaml
title          : "Himan"
name           : "Kartik Arora"
description    : "Builder. Tinkerer. Knowledge graphs."
url            : https://akriya.co.in   # keep domain
social:
  type         : Person
  name         : Kartik Arora
author:
  name         : "Kartik Arora"
  bio          : "Engineer at PhonePe · ex-Bing Satori · maker · knowledge graph obsessive"
  location     : "Bangalore, India"
  email        : kartik@akriya.co.in
  links:
    - GitHub: https://github.com/karx
    - LinkedIn: https://linkedin.com/in/karx01
    - Twitter/X: https://twitter.com/akriyaIN
```

### 1b. `_data/navigation.yml`
```yaml
main:
  - title: "Works"
    url: /works/
  - title: "Lab"
    url: /lab/
  - title: "Garden"
    url: /garden/
  - title: "Blog"
    url: /blogs/
  - title: "About"
    url: /about/
```

### 1c. `index.md` — new hero
Replace agency pitch with:
- Name + one-line identity ("Engineer, maker, knowledge-graph obsessive")
- Current role (PhonePe · Fraud & Risk · Graph DB + Data Pipelines)
- Three focus areas as entry cards: Works / Garden / Lab
- Keep the 3D model — it's distinctive and technically interesting

---

## Phase 2 — About page

**One session. Highest-ROI missing page.**

Source material: `karx.github.io/kaaro/README.md` (already written, just needs Jekyll frontmatter).

### Structure
```
/about/

Short intro (2–3 sentences)
  ↓
Career arc
  — Bing / Satori (Knowledge Graph Engine)
  — Akriya (IoT + Web, Noida)
  — PhonePe (Data Platforms, Fraud & Risk)
  ↓
Things I care about
  — Knowledge graphs and structured data
  — Interface design as compute becomes ubiquitous
  — Building small, useful, shareable things
  — Poker (the strategic kind)
  ↓
Current experiments (pulled from lab/projects)
  ↓
Contact (replaces /contact/ standalone page)
  — email, GitHub, LinkedIn
```

### Deliverables
- `_pages/about.md`
- Remove `_pages/contact.md` from nav (or redirect to `/about/#contact`)
- Remove `_pages/team.md` from nav

---

## Phase 3 — Works

**One session. Portfolio substance.**

Rename collection permalink from `/projects/` → `/works/`. Update `_config.yml` collections config.

### Keep and rewrite as personal case studies (6)

| Project | Story angle |
|---------|------------|
| `adengine.md` | End-to-end system design: local content management + realtime stream processing + uplinking |
| `kaaroHands.md` | Physical computing: CV + hardware, what it took to ship |
| `flutterArsenal.md` | Developer tooling: why, what was hard, what got traction |
| `agriwatch.md` | IoT + real-world impact: the constraints of field deployment |
| `instagram-calculator.md` | Data + graph: methodology and findings |
| `homeswitch.md` | IoT home automation: the personal itch that became a product |

### Archive (move to `_drafts/` or add `published: false`)
Remaining 8 projects — either stubs, client NDA work with nothing to say publicly, or superseded by better work.

### Rewrite format per case study
```
What it is (1 sentence)
The problem it solved
What I built (technical specifics)
What I learned / what was hard
Status: shipped / archived / ongoing
Links: repo, live, write-up
```

---

## Phase 4 — Lab polish

**Half session. Already strong content.**

The labs are the most authentic signal on the site. They need minimal work:

- **`kaaroViewer.md`** — complete rewrite. The current description ("Instagram viewer in VR") is years out of date. Accurate description: real-time 3D knowledge graph explorer, entity detection via OpenTapioca + Wikidata, now powers the Garden page.
- Add `status:` field to all labs: `active` / `archived` / `wip`
- Ensure every lab has at least one of `visit_link` or `contribute_link`
- Sort labs by status (active first)

---

## Phase 5 — Garden seeding

**Ongoing, not a single session. Vault maintainer work.**

Target: 40 published notes, 80+ edges.

### Priority notes to publish (already exist in vault)
These notes exist in `karx.github.io/` and just need frontmatter added:

| Path | Suggested slug | Tags |
|------|---------------|------|
| `README.md` (vault root) | `about` | `reflection` |
| `WebGraph/README.md` | `webgraph` | `knowledge-graph` |
| `Wikidata/README.md` | `wikidata` | `knowledge-graph` |
| `kaaroStream/README.md` | `kaarostream` | `streaming` |
| `kaaro/README.md` | `kaaro` | `knowledge-graph` |
| `Manifesto/` | `manifesto` | `reflection` |
| `mqtt/` | `mqtt` | `iot`, `streaming` |
| `WebComponents/` | `webcomponents` | `interface` |
| `Excalidraw/` | `excalidraw` | `interface`, `maker` |
| `kaaroClips/` | `kaaroclips` | `streaming`, `interface` |
| `SmartBike/` | `smartbike` | `iot`, `maker` |
| `Micropython/` | `micropython` | `iot` |

After adding frontmatter, run `npm run build:garden` and check the health report. Focus on adding WikiLinks between related notes — that's what turns a list into a graph.

---

## Phase 6 — Home page polish

**One session. Do this after Phases 2–3 land, so there's real content to feature.**

### Sections
1. **Hero** — name, identity, role. Done in Phase 1.
2. **Featured works** — 3 cards from Works. Manually curated, not automatic. Suggested: AdEngine, kaaroHands, one from Lab.
3. **Latest from the garden** — 3 most-recently-published notes (pulled from `garden-graph.json` index sorted by date).
4. **Latest post** — most recent blog entry.
5. **The 3D model** — keep. It loads `model-viewer` already, it's a differentiator.

---

## Technical decisions — standing

| Decision | Rationale |
|----------|-----------|
| Keep Minimal Mistakes theme | Not worth the refactor cost. Customise via skin + CSS overrides. |
| Domain stays `akriya.co.in` | Established, indexed. Personal brand lives under it. |
| Garden as direct embed (no iframe) | Cleaner, full JS access, importmap works correctly. |
| Vault as git submodule (pending disk space) | Independent sync for Obsidian mobile. Dev uses sibling path. |
| kaaroViewer modules copied to `/assets/garden/viewer/` | Jekyll serves them as static files. No bundler needed. |
| `published: true` gate in vault | Private-first. Vault stays personal; garden shows what's ready. |

---

## What to ignore for now

- Rebrand domain to `himan.dev` or similar — premature, SEO cost not worth it yet
- Custom Jekyll theme — complexity vs. reward is wrong at this stage
- Comments system — not needed until there's regular readership
- Analytics upgrade beyond existing GA — fine as-is
- RSS/newsletter — add when writing frequency warrants it

---

## Execution sequence

```
Phase 1  _config.yml + navigation + home hero          ← start here
Phase 2  _pages/about.md                               
Phase 3  Works: rename + 6 case study rewrites         
Phase 4  kaaroViewer.md rewrite + lab status fields    
Phase 5  Vault: publish 20 more notes with WikiLinks   (ongoing)
Phase 6  Home: featured works + garden latest          (after 2–3 done)
```

---

## Related documents

| Document | Location | Purpose |
|----------|----------|---------|
| `TRANSITION_PLAN.md` | `homepage/` | Original agency → personal pivot spec |
| `GARDEN_GUIDELINES.md` | `karx.github.io/` | Vault maintainer conventions |
| `GARDEN_INTEGRATION.md` | `kaaroViewer/` | Viewer requirements + status |
| `PRODUCT_ROADMAP.md` | `kaaroViewer/` | kaaroViewer standalone roadmap |
