---
title: VirtualBuzzer
description: A browser-based quiz buzzer — open tabs act as buzzers, a watch view acts as the host display.
contribute_link: https://github.com/karx/virtual-buzzer
status: active
tags:
  - JavaScript
  - Erlang
  - Real-time
  - Events
header:
  teaser: "/assets/images/devices/buzzer.jpg"
---

A zero-install quiz buzzer that runs in any browser. Open multiple tabs — each one becomes a buzzer. A separate watch view shows who buzzed first.

Built for events where you need a buzzer round but don't want physical hardware. The Erlang backend handles the real-time race condition of simultaneous buzz-ins correctly — last-write-wins is wrong for a buzzer, so it tracks first-arrival at the server level.
