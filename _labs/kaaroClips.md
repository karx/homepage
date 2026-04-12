---
title: kaaroClips
description: Automated Twitch clip discovery and distribution — Twitter bot, Discord bot, and a dynamic portal.
visit_link: https://twitter.com/ClipsKaaro
contribute_link: https://github.com/karx/twitter-kClips
status: active
tags:
  - Twitch
  - Discord
  - API
  - Automation
  - JavaScript
header:
  teaser: "/assets/images/kaaroClips/dynamic_home_page.png"
---

An automated pipeline that pulls top clips from Twitch, ranks them, and distributes them across channels — Twitter bot, Discord bot, and two web portals.

Built when Twitch's clip ecosystem had no good aggregation layer. The Twitch API exposes clip metadata and view counts; the missing piece was curation and distribution.

## Parts

- **Twitter bot** ([@ClipsKaaro](https://twitter.com/ClipsKaaro)) — tweets top clips by game and broadcaster on a schedule
- **Discord bot** — drops clips into servers on demand or by schedule
- **Dynamic portal** — ranked clip feed with game and broadcaster filters
- **Static site** (11ty build) — weekly snapshot, zero JS, fast

## What was interesting

Ranking clips fairly. View count alone surfaces viral moments but misses quality — a clip can rack up views because of the streamer's audience size, not the play itself. I experimented with a ratio of views-to-channel-size as a proxy for "actually good regardless of who made it."
