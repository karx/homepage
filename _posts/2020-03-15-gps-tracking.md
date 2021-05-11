---
layout: single
title:  "Track-O: a Cost Efficient GPS Tracking Device"
description:  Using Node-RED & freeboard
header:
  teaser: "/assets/images/tracko/tracko.webp"
tags:
  - GPS
  - Node-Red
  - GSM
  - Freeboard
  - Arduino
  - NANO
  - sim900a
  - neo 6mv2
author:
  avatar: '/assets/images/ashtam.jpg'
  name: Ashtam Singh
  short_name: kalli55
  position: Engineering
  home: '/team/ashtam-singh'
  bio: Maker | Electronic Lover
  links:
    - label: "Email"
      icon: "fas fa-fw fa-envelope-square"
      url: mailto:ashtam@akriya.co.in
    - label: "GitHub"
      icon: "fab fa-fw fa-github"
      url: "https://github.com/kalli55"
    - label: "Instagram"
      icon: "fab fa-fw fa-instagram"
      url: "https://instagram.com/ashtam55"

author_profile: true

---

## Overview
TrackO is affordable and easily deployable tracking device which is compact & easy to use. Its accuracy is about 10m from the given location.

TrackO is consist of two parts:-

HARDWARE: I m using Arduino Nano, sim900a mini (GSM Arduino module) & Ublox Neo 6MV2 (GPS module ).

SERVER: I'm using the Node-red for getting the data from the device so I can see and visualize the data and map the latitude and longitude on GOOGLE MAP. Mapping of the data is done on Freeboard.io

It's upon you where you want you to visualize your data. You can also make an app for it.

## Hardware Used

* Arduino nano (or Uno or any other microcontroller ).

![Nano](https://cdn.instructables.com/FDB/C8XU/IZYGACMM/FDBC8XUIZYGACMM.LARGE.jpg?auto=webp&frame=1&width=900&height=1024&fit=bounds)

* Sim900a GSM module.

![SIM900a](https://cdn.instructables.com/F78/XIRV/IZYGACP3/F78XIRVIZYGACP3.LARGE.jpg?auto=webp&frame=1&width=300&height=1024&fit=bounds)

* Ublox Neo 6MV2 (GPS module ).

![GPS](https://cdn.instructables.com/FKH/ZKVW/IZYGAQM7/FKHZKVWIZYGAQM7.LARGE.jpg?auto=webp&frame=1&width=300&height=1024&fit=bounds)

* PCB or Breadboard.
* 5V adapter.
* Soldering Iron If using PCB.

## Connections/Pinmap

![Connections](https://cdn.instructables.com/FZG/7SV6/IZYGA25G/FZG7SV6IZYGA25G.LARGE.jpg?auto=webp&frame=1&width=1024&fit=bounds)

* Nano GND --> GND (External DC Power Source)
* Nano Vin --> 5V (External DC Power Source)
* Nano D3(RX) --> TX (GPS)
* Nano D4(TX) --> RX(GPS)
* Nano D7(RX) --> TX (GSM)
* Nano D8(TX) --> RX (GSM)
* Connect the GND and VCC of GSM and GPS to the power source

## Firmware/SDK 

This Firmware is uploaded in NANO using Arduino/PlatformIO.
<script src="https://gist.github.com/ashtam55/9c6dc035c227347b3d7d1f3c89633b2f.js"></script>

* After debugging the code, please make sure to comment the serial monitor as it may lead to malfunctioning. Also, make a separate folder in Arduino library for the TinyGPS library and put the .h &.CPP file in it.

## Node-Red Flow

```json
[
  {
    "id": "213a0461.834cfc",
    "type": "http in",
    "z": "d8215eb6.bdc4d",
    "name": "",
    "url": "/tracko",
    "method": "get",
    "swaggerDoc": "",
    "x": 165,
    "y": 105,
    "wires": [
      [
        "b549696f.3bcd88",
        "e18f90a5.1ecd8"
      ]
    ]
  },
  {
    "id": "b549696f.3bcd88",
    "type": "mongodb out",
    "z": "d8215eb6.bdc4d",
    "mongodb": "a6c5cf74.81249",
    "name": "",
    "collection": "tracko",
    "payonly": true,
    "upsert": false,
    "multi": false,
    "operation": "insert",
    "x": 549,
    "y": 111,
    "wires": []
  },
  {
    "id": "e18f90a5.1ecd8",
    "type": "http response",
    "z": "d8215eb6.bdc4d",
    "name": "",
    "x": 360,
    "y": 137,
    "wires": []
  },
  {
    "id": "a2a0dd02.cc704",
    "type": "http in",
    "z": "d8215eb6.bdc4d",
    "name": "",
    "url": "/get_tracko",
    "method": "get",
    "swaggerDoc": "",
    "x": 91,
    "y": 309,
    "wires": [
      [
        "65281481.e6026c"
      ]
    ]
  },
  {
    "id": "a36fbbb1.a89418",
    "type": "mongodb in",
    "z": "d8215eb6.bdc4d",
    "mongodb": "a6c5cf74.81249",
    "name": "",
    "collection": "tracko",
    "operation": "find",
    "x": 462,
    "y": 309,
    "wires": [
      [
        "dbdf926c.04f77"
      ]
    ]
  },
  {
    "id": "4799ade4.87d914",
    "type": "http response",
    "z": "d8215eb6.bdc4d",
    "name": "",
    "x": 860,
    "y": 302,
    "wires": []
  },
  {
    "id": "dbdf926c.04f77",
    "type": "json",
    "z": "d8215eb6.bdc4d",
    "name": "",
    "x": 717,
    "y": 312,
    "wires": [
      [
        "4799ade4.87d914"
      ]
    ]
  },
  {
    "id": "65281481.e6026c",
    "type": "function",
    "z": "d8215eb6.bdc4d",
    "name": "",
    "func": "msg.limit = 1;\nmsg.sort = {\"_id\" : -1};\nmsg.skip = 0;\nreturn msg;",
    "outputs": 1,
    "noerr": 0,
    "x": 231.5,
    "y": 290,
    "wires": [
      [
        "a36fbbb1.a89418"
      ]
    ]
  },
  {
    "id": "a6c5cf74.81249",
    "type": "mongodb",
    "z": "",
    "hostname": "127.0.0.1",
    "port": "27017",
    "db": "db",
    "name": ""
  }
]
```

## FreeBoard

* Goto https://freeboard.io/
* Sign Up there.
* Now go through the attached video.
* At the end of the video, you can see the location of my device.It is not moving, but when you put it in a car or        something running, then you can easily track your path.
[![How-to-use-freeboard](/assets/images/Screenshot_2020-03-18 FRGX7KNIZYGAQ9X mp4.png)](https://cdn.instructables.com/ORIG/FRG/X7KN/IZYGAQ9X/FRGX7KNIZYGAQ9X.mp4)

## References
* http://nodered.org/docs/getting-started/
* https://github.com/mikalhart/TinyGPS
