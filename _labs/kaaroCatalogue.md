---
title: kaaroCatalogue
description: A knowledge catalog system — structured entities, LLM-assisted enrichment, catalog-specific visualisations.
status: active
tags:
  - Knowledge Graph
  - LLM
  - Schema.org
  - JavaScript
  - MCP
---

A tool for building richly structured catalogs of anything — poets, games, recipes, films — where every entity follows Schema.org standards and the enrichment pipeline is driven by LLM agents.

The first catalog is Kabir's dohas: every couplet linked to its themes, with translations, commentary, and metadata.

## What it is

A local CLI + hosted web viewer. The CLI handles ingestion and enrichment — you can add a single entity or bulk-import from a file, and the LLM agent fills in the gaps (translations, related entities, missing metadata fields). The web viewer adapts its component set to the catalog type: a poetry catalog gets a reader interface, a film catalog gets a grid.

## What's interesting

The MCP server layer (`src/mcp-tools`) means any LLM agent with MCP support can query and extend the catalog by intent — "add all of Kabir's water metaphors with links to their themes" works as a single agent instruction.

## Status

Phase 1 in progress — bulk ingestion pipeline and LLM orchestration. Hosted viewer planned for Phase 2.
