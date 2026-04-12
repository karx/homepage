# Transition Plan: From Agency to Personal Digital Laboratory

This document outlines the strategy to transform the **Akriya Technologies** homepage into a personal portfolio and integrated digital garden for **Himan**.

---

## 1. Vision: The Unified Digital Laboratory
The goal is to create a "Living Portfolio" that doesn't just show finished work but reveals the **process**. By merging the professional agency projects with the raw personal notes (the "Garden"), the site will demonstrate both expert delivery and continuous research.

*   **Primary Identity:** Himan (Personal Brand)
*   **Secondary Identity:** Akriya Technologies (The Professional Studio/Foundation)
*   **Core Value:** Transparency in thought, excellence in execution.

---

## 2. Information Architecture (IA) Pivot

### Current Structure (Agency-Centric)
*   **Home:** Service offerings, "Start a project" CTA.
*   **Core:** Corporate mission/vision.
*   **Team:** Bios of collaborators.
*   **Projects/Labs:** Finished deliverables.

### New Structure (Portfolio-Centric)
*   **Home (The Hook):** Personal intro, "AI + IoT + Design" focus, featured work.
*   **Garden (The Notes):** Searchable, raw notes from the `karx.github.io` vault.
*   **Works (Projects):** High-quality case studies from Akriya and personal builds.
*   **Laboratory (Labs):** Experiments, 3D models, and "In-progress" hacks.
*   **Blog (Posts):** Long-form articles and reflections.
*   **About/Contact:** Personal bio, resume, and direct collaboration links.

---

## 3. The Digital Garden Integration (The Vault)

The `karx.github.io` folder is an Obsidian vault. To power this within the Jekyll site:

### Strategy: Git Submodule + 3D Graph Viewer

The vault is mounted as a **git submodule** at `_notes/`. A pre-build script (`scripts/build-garden.mjs`) walks the submodule, parses frontmatter and `[[WikiLink]]` edges, and emits `assets/garden/garden-graph.json`. The Garden page embeds **kaaroViewer** (via iframe) pointed at this JSON — rendering the vault as an interactive 3D knowledge graph rather than a flat list.

1.  **Submodule Setup:**
    ```bash
    git submodule add https://github.com/karx/karx.github.io _notes
    ```
    The vault stays an independent repo. Homepage pins a specific commit. Update with `cd _notes && git pull`.

2.  **Build Script (`scripts/build-garden.mjs`):**
    *   Walks `_notes/`, parses frontmatter with `gray-matter`
    *   Filters to `published: true` notes only (private-first)
    *   Extracts `[[WikiLink]]` patterns → graph edges
    *   Copies `image:` frontmatter assets to `assets/garden/images/`
    *   Emits `assets/garden/garden-graph.json`

3.  **Viewer:** kaaroViewer's `garden.html` entry point loads the JSON and renders the graph. See `kaaroViewer/GARDEN_INTEGRATION.md` for the full kaaroViewer requirements.

4.  **Vault Conventions:** See `karx.github.io/GARDEN_GUIDELINES.md` for the frontmatter spec, tagging taxonomy, and WikiLink rules that garden maintainers must follow.

---

## 4. Implementation Phases

### Phase 1: Identity & Config (Immediate)
- [ ] Update `_config.yml`: Change `title`, `author`, `email`, and `social` links.
- [ ] Update `_data/navigation.yml`: Refactor the menu to the "Portfolio-Centric" IA.
- [ ] Update `_pages/home.md`: Replace the agency banner with a personal hero section.

### Phase 2: Content Pruning & Rebranding
- [ ] **Prune:** Delete empty project files and redundant drafts.
- [ ] **Archive:** Move `_team/` to an internal archive or convert to a "Collaborators" page.
- [ ] **Edit:** Batch-replace "We/Our" with "I/My" in core pages using a script.

### Phase 3: The Vault Bridge
- [ ] Add `karx.github.io` as git submodule at `_notes/`.
- [ ] Write `scripts/build-garden.mjs` — parse frontmatter, extract WikiLinks, emit `garden-graph.json`.
- [ ] Create `_pages/garden.md` embedding kaaroViewer's `garden.html` via iframe.
- [ ] Create `_layouts/note.html` for the Jekyll-rendered full note pages (linked from the graph detail panel).
- [ ] Tag and publish 20+ seed notes in the vault (follow `GARDEN_GUIDELINES.md`).
- [ ] Wire `npm run build:garden` into Jekyll's prebuild step.

### Phase 4: Visual Polishing
- [ ] Refactor `_pages/core.md` into a "Personal Manifesto" or "How I Work" page.
- [ ] Ensure GLTF 3D models are prominently featured as "Interactive Labs."

---

## 5. Technical Considerations
*   **Repository Management:** 
    *   *Recommendation:* Merge the vault into the main repo to avoid sync issues. 
    *   *Alternative:* Use a **Git Submodule** if the vault needs to remain an independent repository for Obsidian mobile sync.
*   **Styling:** Use the `minimal-mistakes` "Skin" feature to give the personal site a distinct look (e.g., switching from "default" to "air" or "contrast").

---

**Next Immediate Step:** Update `_config.yml` with Himan's personal details.
