---
layout: single
title:  "Ambient Apparels"
description:  Tees Which Love Talking
header:
  teaser: "https://cdn.instructables.com/F0T/V105/J2QFF6JH/F0TV105J2QFF6JH.LARGE.jpg?auto=webp&frame=1&width=616&height=1024&fit=bounds"
tags:
  - LED
  - NeoPixels
  - Addressable LED's
  - ESP8266
  - WEMOSD1
  - Arduino
  - NeoMatrix
  - Tshirt

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
gist: true


---

## Story

Ever wondered about sharing your thoughts with others who you cross path your path?

The idea came to our mind when we were roaming on busy streets of Delhi. The capital city of India. Millions of people cross paths of each other everyday yet no one exchanges their thoughts or ideas which take place in their minds, quite weird?

We thought how about making "Ideas" (Thought) a part of something we use in our daily life. And we weren't able to find anything better than a "T-shirt."

After iterating a lot and making random prototyping, we came up with "Ambient Apparels", T-shirts that can display your thoughts. All you have to do is a couple of clicks on your smartphone.


## Prerequisites

Things to remember before starting this instructable:

You should know how to use Arduino IDE or you can refer from google.
Basic knowledge of C/C++.
A laptop or Personal Computer.

## Collecting Things



![Things-To-Collect](https://cdn.instructables.com/F3R/LQ9N/J2QFEYYX/F3RLQ9NJ2QFEYYX.LARGE.jpg?auto=webp&frame=1&fit=bounds)

Things that you need to make this instructable are as follows:

* A white T-shirt (Plain).
  You can buy it from any shopping website.

* Neopixel LED strip; we are making a LED panel which consists of 64 LEDs, so buy accordingly.
  You can buy it from www.aliexpress.com but check other websites, too.

* Wemos D1 mini.
  You can buy it from www.ebay.com

* Some thin wires.

* Transparent tape.

* Soldering Iron.

And some patience and enthusiasm for doing things correctly.
I bought all these stuff from a nearby shop but if you're having a problem in buying, just let me know in comment section.

## What Is "NEOPIXEL"?

![Neopixels](https://cdn.instructables.com/FHM/AKU1/J2QFEZQM/FHMAKU1J2QFEZQM.LARGE.jpg?auto=webp&frame=1&width=1024&height=1024&fit=bounds)

Neopixel or addressable LEDs are those LEDs which can be individually set to a particular color via controller like Arduino, webmos, etc. These are different from standard RGB LEDs as Neopixel can generate much more color than RGB LEDs. Neopixel can be operated on 5V whereas RGB LEDs need a 12V power supply. Neopixel has only three pin GND, VCC, & DIN.

Some examples of addressable LEDs are WS2801, SK6812, LPD8806, HL1606, etc.

## Making of Neomatrix Panel

![Panel](https://cdn.instructables.com/F06/6GC7/J2QFF1T8/F066GC7J2QFF1T8.LARGE.jpg?auto=webp&frame=1&width=1024&height=1024&fit=bounds)

The first thing we need to do is to make a LED matrix or panel of size 8 pixels x 8 pixels.

Cut the strip into 8 parts. Each part contains 8 LEDs and lay them on a piece of a clothing(like a handkerchief). I also put a black tape on the backside of the panel to hide and Insulate panel.

Do remember while laying the strips, see the arrows on them. Every strip's arrow should face the same direction as data coming from Din Pin moves forward according to the direction of the arrow. See the image to understand better.

## Soldering

![Solder-1](https://cdn.instructables.com/F36/C49H/J2QFF1VO/F36C49HJ2QFF1VO.LARGE.jpg?auto=webp&frame=1&width=600&height=1024&fit=bounds)

In this step, we need to connect all LED strips.

Connect GND and VCC pin of every strip to a wire in series connection and connect DOUT pin of the last LED of the first strip to the DIN pin of first LED of the second strip and continue until all the strips are connected together.

If all goes well then, CONGRATULATIONS you just made your Neopixel panel as this is the most time taking part of this project (for you :P, as writing and checking code is also a tough task).

## Code

Let first understand how this whole project works.

When the user wears the T-shirt, plug on the portable power bank and give the supply to the Wemos D1 mini.

Then a Wi-Fi Hotspot comes up on your mobile phones after connecting to which you need to open your browser and go to the IP address that is specified by you while coding in my case it is 192.168.4.1, a Webpage will load up and you just need to enter your text you want to display on the Neomatrix panel.

But the process inside the hardware occurs when you send the text. It gets stored in the EEPROM of the Wemos D1, and we need to extract that piece of text and save it as string type. Then, we have to print that string on Neomatrix (Panel).


<script src="https://gist.github.com/karx/9159e439ae7bf1b91630ddeca1e69fa3.js"></script>

## Conclusion

Hope through this idea we can unmute these cosmo-metropolitan cities and also, it is well said: "Power is gained by sharing knowledge, not holding it".

## References
* https://github.com/adafruit/Adafruit_NeoPixel

