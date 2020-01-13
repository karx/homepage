---
title: "Instagram + Wendor"
layout: single
description: "A digital and offline marketing experience. Gratification engines"
tags: 
  - Wendor
  - Instagram
  - Marketing
  - ESP32
  - IoT

# sidebar:
#   - title: 
#     image: "/assets/images/wendor-events/wendorEventMini-demo.jpg"
#     image_alt: "Wending machine with user"
#     text: 

header:
  teaser: "/assets/images/wendor-events/wendorEventMini-demo.jpg"


---

## WendorEvents
`WendorEvents` is the name used by us internally to refer to this project. First tested and deployed at Megaboxing event 2019 in Gurgaon, is now due to complete its third successful Event at DLF Mall of India tomorrow. Crossing over 250k Impressions and over a million in reach, it has just begun.
The use-case is pretty straight forward: 

`Online Promotions/Impressions => Offline Gratification`

To implement this, we use the following,
* Instagram API (to verify online Post/Impressions)
* Wendor.in Wending Machines (for offline gratification engine)


Only if it were that simple. We learnt, luckily on our very first event :
```
Events industry calls for operational excellence
```

So now our toolkit is something like this:
* Instagram Crawlers - to monitor current activity + Reporting
* Instagram APIs - to verify post/impressions - [Github](https://github.com/karx/wendorEvents-bridge)
* Wendor.in Wending machine - [Wendor.in](https://wendor.in)
* Discord Chat bots - On-ground Master control - [Github](https://github.com/karx/wendorEvents-bridge)
* OP dashboard - monitoring and firefighting
* Ground UI - [Github](https://github.com/karx/MegaBoxing)
* Multiple ESP32 modules - event specific experience - [Github](https://github.com/ashtam55/OtaTestingDevice)


## Event 0 - #BoxWinner
Megaboxing 2019
![Megaboxing event image]()


## Event 1 - #KhushiyonKaSeason
![DLF MOI Pre-Diwali](/assets/images/wendor-events/wendorEventMini.jpg)


## Event 2 - #BeFashionAbElle
![DLF + Elle](/assets/images/wendor-events/wendorEventLarge.jpg)


