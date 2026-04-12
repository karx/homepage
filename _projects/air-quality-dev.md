---
title: AirOwl — Community AQI Network
categories: [Project, Community]
status: Deployed
type: Device + Network
layout: projecto
excerpt: 50 DIY air quality sensors deployed across a community in collaboration with IODA.
features:
  - title: PM2.5 and PM10 measurement
  - title: DIY-friendly open hardware
  - title: Community assembly and deployment
  - title: Centralized data aggregation
  - title: Companion web dashboard
model:
  asset: "/assets/models/Owl.glb"
  color: "#FFFFFF"
header:
  overlay_color: black
tags: [ESP8266, Arduino, Django, IoT, Open Hardware]
---

Fifty open-source air quality monitors assembled and deployed across a city, feeding real data into a public dashboard.

## The problem

Official AQI monitoring stations in India are expensive, sparse, and often placed in locations that don't reflect where people actually live and work. The India Open Data Association (IODA) wanted affordable, dense monitoring — enough nodes to map neighborhood-level air quality, not just city-level averages.

## What I built

The AirOwl is an open hardware design built around ESP8266, measuring PM2.5 and PM10 particulate matter. I assembled and deployed 50 units as part of a community collaboration with IODA.

Each unit transmits readings to a Django backend for aggregation. A web dashboard surfaces the data publicly — location-mapped readings with time-series history.

The design is intentionally DIY-friendly: no custom PCB, off-the-shelf components, documented assembly process. The goal was hardware that a community could maintain and replicate without depending on a vendor.

## What was hard

Calibration at scale. Getting 50 units to report consistently requires careful sensor selection and placement guidelines — height above ground, sun exposure, proximity to pollution sources all affect readings significantly. We had to develop a field calibration checklist and ongoing anomaly detection to catch units that drifted out of expected ranges.

## Status

Deployed. [AirOwl on Hackster →](https://www.hackster.io/oizom/airowl-know-what-you-breathe-9a7bf7)
