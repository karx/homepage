---
title: AgriWatch
categories: [Project, Client]
status: Deployed
type: System
layout: projecto
excerpt: A 13-sensor precision agriculture monitor with automated irrigation control.
features:
  - title: Soil pH, moisture, temperature
  - title: Leaf wetness
  - title: Wind speed and direction
  - title: Rainfall, lightning, cloud height
  - title: Automated irrigation control
  - title: Remote dashboard
feature_image: /assets/images/AgriWatch/agriwatch1.png
header:
  overlay_image: /assets/images/AgriWatch/header.jpg
  overlay_filter: 0.7
gallery:
  - url: "/assets/images/AgriWatch/agriwatchscreens/humidity.jpg"
    image_path: "/assets/images/AgriWatch/agriwatchscreens/humidity.jpg"
    alt: "Humidity graph on dashboard"
  - url: "/assets/images/AgriWatch/agriwatchscreens/soil moisture.jpg"
    image_path: "/assets/images/AgriWatch/agriwatchscreens/soil moisture.jpg"
    alt: "Soil moisture graph on dashboard"
  - url: "/assets/images/AgriWatch/agriwatchscreens/sunlight.jpg"
    image_path: "/assets/images/AgriWatch/agriwatchscreens/sunlight.jpg"
    alt: "Sunlight hours on dashboard"
sidebar:
  - title: ""
    image: "/assets/images/AgriWatch/agriwatch-schema.png"
    image_alt: "AgriWatch board schematics"
    text: "Board schematics"
    url: "/assets/images/AgriWatch/agriwatch-schema.png"
tags: [ESP32, Arduino, Django, React.js, IoT]
---

A field-deployed precision agriculture monitoring system — 13 environmental sensors, automated irrigation, and a remote dashboard.

## The problem

The client's farm operations ran on intuition and daily walkthroughs. Irrigation was manual, schedules were fixed, and there was no visibility into what was actually happening at the soil level. They needed data-driven field control that could operate without constant supervision.

## What I built

A custom board built around ESP32 and Arduino with a full environmental sensor array: soil pH, moisture, temperature, leaf wetness, ambient temperature and humidity, barometric pressure, wind speed and direction, rainfall, lightning, and cloud height.

The device sends readings to a Django backend over the network. The analytics layer processes the data and controls irrigation pumps and valves based on crop requirements — if soil moisture drops below threshold, the system triggers irrigation automatically. A React dashboard gives remote visibility into current conditions and historical trends.

{% include gallery caption="Dashboard views — humidity, soil moisture, sunlight hours." %}

## What was hard

Field deployment. The sensors are out in the elements — dust, moisture, temperature swings. Calibration drift was a real problem at scale; readings that looked correct in the lab wandered after weeks in the field. We had to build in recalibration routines and anomaly detection to flag sensors that had drifted out of range.

Connectivity was also unreliable. The system needed to queue readings locally and sync when the connection came back, without losing data or double-counting.

## Status

Deployed and operational.
