---
title: kaaroHands
categories: [Project, Personal]
status: Active
type: Web Application
layout: projecto
excerpt: Poker session tracker that understands natural language — say your stack, it logs it.
contribute_link: https://github.com/karx/kaaroHands
features:
  - title: Natural language stack input
  - title: Gemini function calling for parsing
  - title: Real-time Chart.js visualization
  - title: Multi-player session support
  - title: MCP server interface
  - title: Firebase Firestore backend
feature_image: /assets/images/poker-hands/main-interface.jpeg
header:
  overlay_image: /assets/images/poker-hands/main-interface.jpeg
  overlay_filter: 0.7
tags: [JavaScript, Firebase, Gemini API, MCP, Chart.js, Node.js]
---

A poker session tracker where you just say your stack — no forms, no clicks.

## The problem

Tracking chip stacks during a live poker game interrupts play. You're mid-hand, someone asks for a count, you need to log it — but pulling out a phone and typing numbers kills the rhythm. The input should be frictionless: say it, done.

## What I built

Vanilla JS frontend backed by Firebase Firestore. Players enter stack updates as natural speech: "current stack 21,500", "stack at 18k", "I'm at twenty-one five". Gemini's function calling API parses these into structured events:

```js
// input:  "stack at 18k"
// output: { action: "stack_update", payload: { stackSize: 18000 } }
```

Chart.js renders a time-series of stack progression for the session. All updates sync in real-time across connected clients — useful for a dealer or observer logging multiple players.

The app also ships as an MCP server, exposing session management, stack recording, and reporting as callable tools. Any MCP-compatible agent can interact with a session programmatically.

## What was hard

Getting Gemini function calling to handle ambiguous poker speech reliably. "Twenty-one five" and "21,500" and "21k five hundred" all mean the same thing — the prompt engineering to cover the full range of how people actually talk about chip counts took more iteration than the app itself.

## Status

Active. [GitHub →](https://github.com/karx/kaaroHands)
