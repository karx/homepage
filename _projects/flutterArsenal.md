---
title: Flutter Arsenal
categories: [Project, Community]
status: Active
type: Community tool
layout: projecto
excerpt: A community-curated, GitHub-driven directory of Flutter libraries and tools.
contribute_link: https://github.com/flutterarsenal/FlutterArsenal
visit_link: https://flutterarsenal.com
features:
  - title: Community-driven submissions via GitHub issues
  - title: Auto-update pipeline on merge
  - title: Tag and category filtering
  - title: Monthly top-10 rankings
  - title: Flutter events listing
feature_image: /assets/images/flutterarsenal/logo-colored-text.png
header:
  overlay_image: /assets/images/flutterarsenal/flutter-arsenal-facebook-cover.jpg
  overlay_filter: 0.7
tags: [Flutter, Jekyll, GitHub Actions, Community, Mobile]
---

A searchable directory of Flutter libraries and tools, maintained entirely through GitHub issues and pull requests.

## The problem

Flutter's ecosystem grew extremely fast through 2019. Developers were hunting for packages through GitHub stars, Reddit threads, and word of mouth. There was no aggregator that let you filter by category, check quality signals, or find what was actively maintained versus abandoned.

## What I built

A Jekyll static site where the data layer is driven by GitHub. To submit a library, you open an issue using a structured template. On merge, the pipeline regenerates the site. No CMS, no database — the GitHub issue tracker is the data entry mechanism.

The site supports tag-based filtering, a free/demo/paid category split, monthly top-10 rankings (weighted across a combination of signals), and a separate events section for Flutter meetups and workshops.

The community grew to include contributors across the Flutter ecosystem who keep the listings current and add new packages.

## What was hard

The auto-update pipeline — making GitHub issues the reliable source of truth for a static site required careful schema design for the issue templates and a robust generation step that wouldn't break on malformed submissions.

## Status

Active. [flutterarsenal.com →](https://flutterarsenal.com) · [GitHub →](https://github.com/flutterarsenal/FlutterArsenal)
