---
title: SpotMe
description: Pose recognition accessibility tool for the visually impaired — runs in a browser, no install.
visit_link: https://kaaro.akriya.co.in/Spot-me/
contribute_link: https://github.com/karx/Spot-me/
status: active
tags:
  - Accessibility
  - Machine Learning
  - TensorFlow
  - JavaScript
  - Web
header:
  teaser: "/assets/images/spotme/spot-me-IMG.png"
sidebar:
  - title: Live demo
    image: "/assets/images/spotme/spot-me-side.PNG"
    image_alt: SpotMe in action
    text: Live demo screenshot
---

A browser-based accessibility tool that uses pose recognition to detect and describe a person's position and gestures — designed for the visually impaired.

No install, no app. Point a camera, load the URL.

## How it works

Built on TensorFlow.js and the PoseNet model. The camera feed runs pose detection in the browser at ~15fps. Detected keypoints (shoulders, elbows, hips) are translated into spatial descriptions and surfaced as audio feedback.

Two modules:

- **Camera module** — desktop/laptop with webcam
- **Mobile module** — handheld, optimised for phone cameras held at arm's length

## What was hard

Latency. PoseNet on a mobile CPU at real-time needs aggressive frame-skipping and confidence thresholding — miss too many frames and the feedback is useless; process every frame and it lags behind reality. Finding the right tradeoff took more iteration than the detection logic itself.
