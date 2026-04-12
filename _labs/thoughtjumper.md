---
title: ThoughtJumper
description: Knowledge graph tool for navigating and authoring interconnected ideas — built with edvanta.
visit_link: https://thoughtjumper.com
status: active
tags:
  - Knowledge Graph
  - Semantic Web
  - Collaboration
  - JavaScript
---

A knowledge navigation tool where ideas are nodes and relationships are edges. You don't read linearly — you jump between connected thoughts, fork others' maps, and build your own.

I was involved in the early architecture and the graph rendering layer. The project is now developed and maintained by [edvanta](https://edvanta.com).

## What it is

ThoughtMaps are directed graphs of ideas. Each node is a thought with attached context; edges are typed relationships (leads-to, contradicts, supports). Maps can be:

- Authored and shared publicly
- Forked and extended
- Structured as **quests** — sequences with defined outcomes and branching logic

The semantic layer is what makes it more than a mind-map: each node can carry metadata, and the graph can be queried and filtered.

## What I worked on

The graph rendering engine — navigating large maps without losing orientation. The challenge is spatial: when a map has 50+ nodes, the default force-directed layout produces a tangle. I built a cluster-by-topic layout that groups related nodes spatially before running the force simulation, which gave navigable results at scale.
