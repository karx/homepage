---
title: kaaroViewer
description: Real-time 3D knowledge graph explorer — entity detection, Wikidata enrichment, and the engine behind this site's Garden page.
contribute_link: https://github.com/karx/kaaroViewer
visit_link: /garden/
status: active
---

A browser-based 3D knowledge graph explorer. Type or speak anything — it finds entities, queries Wikidata, and renders them as an interactive graph you can navigate in real-time.

![kaaroViewer wikidata screenshot](/assets/images/kaaroViewer/kaaroViewer-wikidata.PNG)

## How it works

```
Text / Speech → OpenTapioca NLP → Wikidata SPARQL → Three.js 3D scene
```

Entity detection via OpenTapioca maps free text to Wikidata QIDs. A SPARQL query pulls relationships, images, and metadata. The graph grows as you expand nodes — each double-click fetches the entity's neighbors and adds them to the scene.

## What's interesting

- **Command-bar interface** — keyboard-first. F1 voice, F2 save session, F3 expand, F4 clear, F5 local library, F8 sessions, F9 intelligence report
- **Cluster isolation** — isolate a subgraph by cluster; sentiment and tier overlays for analytical views
- **Session persistence** — save and restore exploration paths across visits
- **Intelligence report** — F9 generates a structured brief from the entities in the current scene
- **Local document mode** — load any text document, extract entities, explore the knowledge graph it implies

## Data sources

Wikidata (default) · Wikipedia enrichment · Liquipedia (esports) · Reddit · YouTube — pluggable `ContentSource` interface.

## Garden integration

kaaroViewer powers this site's [Garden page](/garden/). The vault source loads a pre-built JSON graph of published notes from my Obsidian vault instead of querying Wikidata — same rendering engine, local data. WikiLinks between notes become edges; tags become spatial clusters.

## Stack

Three.js · ES modules · Web Speech API · MQTT (mobile controller) · Wikidata SPARQL · OpenTapioca NLP
