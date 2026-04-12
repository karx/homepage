---
title: AdEngine
categories: [Project, Client]
status: Handed over
type: System
layout: projecto
excerpt: Targeted advertising on TVs via HDMI passthrough and live HTML overlay — no hardware replacement required.
features:
  - title: HDMI-to-CSI-2 passthrough
  - title: HTML ad overlay compositor
  - title: Realtime stream marker processing
  - title: Local content management
  - title: Cloud uplink + offline cache
  - title: ESP32 sensor controller
feature_image: /assets/images/AdEngine/feature.png
header:
  overlay_image: /assets/images/AdEngine/header.jpg
  overlay_filter: 0.7
tags: [Raspberry Pi, ESP32, Arduino, Python, HDMI, RTS]
---

A TV advertising injection system that required zero modification to existing display hardware.

## The problem

The client ran a network of TV screens across commercial locations. Replacing them with smart displays was cost-prohibitive. They needed a way to inject localized, scheduled ads into existing TV signal pipelines — without touching the displays or breaking the source signal.

## What I built

An HDMI-to-CSI-2 bridge board that piggybacks on the Raspberry Pi's camera input. The Pi captures the incoming HDMI signal, composites an HTML overlay on top, and passes the combined output back to the display.

The overlay is rendered as standard HTML — ad creative is managed through a web interface, no firmware required. An ESP32 handles proximity and dwell-time sensing to trigger marker events. The stream processor swaps ad slots based on those events, and a cloud uplink syncs the content schedule. When the connection drops, the system serves from local cache.

```
HDMI source → CSI-2 bridge → RPi compositor
                                    ↓
                            HTML overlay renderer
                                    ↓
                            HDMI output to TV
                                    ↑
                            ESP32 sensor events
```

## What was hard

The CSI-2 bridge is finicky hardware. Getting clean passthrough with overlay latency below perceptible threshold took the bulk of prototyping time. The second hard thing: the handover sprint. I had to document the system clearly enough for a non-technical ops team to run and troubleshoot it day-to-day.

## Status

Prototype complete. Handed over to client, April 2020.
