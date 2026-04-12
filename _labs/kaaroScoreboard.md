---
title: kaaroScoreboard
description: A live scoreboard for esports events — OBS-ready, social-aware, theme-customisable.
visit_link: https://kaaroscoreboard.akriya.co.in/
contribute_link: https://github.com/karx/karx.github.io/issues/161
status: active
tags:
  - Stream
  - Overlay
  - OBS
  - JavaScript
  - Events
header:
  teaser: "/assets/images/kaaroScoreboard/Screenshot_kaaroScoreboard.png"
---

A browser-based scoreboard built for live esports events. Runs as an OBS browser source — no installs, no software beyond a URL.

Used in production at **Gaming Stars** (by Recharge) and several local LAN events.

## What it does

Most scoreboard tools cover P1 vs P2. Real events need more:

- Player profiles and team scorecards
- Tournament bracket structure and game modes
- Timer with event sync
- Live chat integration (Nightbot / Twitch)
- Twitch, Steam, and Twitter profile pulls
- Fully custom themes per event

The scoreboard is driven by a simple JSON config — event organizers update it without touching code.

## What was interesting

Getting it OBS-stable. Browser sources in OBS have quirks around repaints, font loading, and animation timing. The overlay needs to be visually correct from the first frame after scene transition — no flash, no layout shift.
