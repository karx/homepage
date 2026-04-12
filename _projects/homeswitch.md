---
title: HomeSwitch
categories: [Project, Client]
status: Product stage
type: System
layout: projecto
excerpt: Offline-first smart home switches — full functionality with no internet dependency.
features:
  - title: ESP32 mesh networking
  - title: Offline-first, zero cloud dependency
  - title: Flutter mobile app
  - title: One-touch pairing
  - title: Google Actions integration
  - title: Optional Firebase sync
feature_image: "/assets/images/homeswitch/homeswitch.png"
header:
  overlay_color: black
model:
  asset: "/assets/models/esp.glb"
  color: "#FFFFFF"
tags: [ESP32, Lua, Flutter, Firebase, GCP, IoT]
---

Smart home switches that work completely offline — the internet going down doesn't turn off your lights.

## The problem

Smart home products in 2019 required constant cloud connectivity. If your internet dropped, your switches became dumb. The brief was direct: design a system that's fully functional offline, with mesh connectivity between switches and a Flutter app as the interface.

## What I built

ESP32 nodes running Lua, forming a local mesh network. Each switch communicates with its neighbours directly — no hub required, no cloud relay. The Flutter app discovers and pairs with the mesh over local network.

Installation is designed to be end-user friendly: one-touch pairing via the app, visual feedback on the device during setup. The system includes Google Actions integration for voice control when the internet is available. Firebase sync is optional — it backs up state and enables remote access, but nothing breaks if it's disconnected.

The scope also included process definitions for installation, maintenance, and debugging — the product had to be operable by someone who isn't a developer.

## What was hard

Mesh networking on ESP32. Getting the protocol reliable under node failures — when one switch drops out, the mesh needs to reroute cleanly without manual intervention. The offline-first constraint changes every assumption about state sync: you can't rely on a server to be the source of truth, so every node has to maintain its own state and reconcile on reconnect.

## Status

Product stage. Ongoing development.
