---
layout: single
title: The Streaming Age
header:
  teaser: "/assets/images/streamin-age.png"
tags:
- Streaming
- Live
- Video
- Film
- Compute
sidebar:
- title: A minion
  image: "/assets/images/streaming-1.jpg"
  alt: "Image of a Minion and Headphone on a Desk"

---
## Streaming Age

I would start to describing and talking about our Streaming age by talking little about how things used to be. The advent of Films/Videography is not new, it happened in the 20th century. We had Video tapas, disk recording, and later, streaming media.

This evolution has also brought about a considerable change in how the Viewing experience has evolved. In this article, I would focus more on these evolution of the viewing experience and how it affects the ecology.

Theaters. Theaters where the place where one used to go to view a Films/Videos or a Performance. It was a skillful and heavy job to be able to replay media from a recording or setup a stage for an act. Large groups of people gathered to enjoy this playback. Even when TVs came out, families used to gather together to watch Films and TV series to enjoy. Watching a Media stream was a `Communal Experience`.

Then came the smartphones and the tablets, the cheaper PCs, viewing habits became personal. After the Youtube Boom, the viewing experience became very personal. The viewing sessions were private, even when we share, its for private viewing later. The sitting together and watching, felt quite diminished.

### If this is streaming age, what was the last Age ?

Streaming Age  
\- Information Age  
\-- Globalization  
\--- The Great Divergence  
\----- Colonial/Imperial Age

## The Canvas

Streaming, to a broadcasting service, has become the new Canvas.

The canvas everyone wants to use!

The interaction possible on this medium is only second to talking one-on-one. The community aspects of it opens door for new experiences. It never so accessible to have a stable channel of interaction with so many people involved.

### What do we Stream?

We shall look at the latest data > trends on what is being streamed as of writing this, but before I do that lets just think about it ideologically:

What in an ideal world would be streamed?

* Knowledge sharing -> Live coaching/learning/teaching
* Games - Shared interactions in a Virtual Game
* Radio -> Stream ->  Music > Art
* News - Journalism - Democratic live feed
* PSA - Always Live
* PSA - Highly data rich Dashboard-y Services
* PSA - Health eg. **Radio calisthenics**

Now lets look at the data:

Live watching at the moment on Twitch: 3,232,000 = three million two hundred thirty-two thousand.

![Streaming Platform share comparison](https://www.digitaltveurope.com/files/2020/05/Live-Streaming-State-of-Stream-April-2020-.png)
![Twitch Traker Data]('/assets/images/Screenshot_2020-10-16 Twitch Statistics Charts.png')

From the platform share comparison and live stats of Twtich which we can get from Twitch Tracker Data we can extrapolate for all vendors.

So, after exploring, we see the actual usage of streaming category wise as:  
[https://docs.google.com/spreadsheets/d/1G3-Ad63vofT0W7qAQjBLo9Lczml0FTrNxjKm8dW_eBY/edit#gid=87439160](https://docs.google.com/spreadsheets/d/1G3-Ad63vofT0W7qAQjBLo9Lczml0FTrNxjKm8dW_eBY/edit#gid=87439160 "https://docs.google.com/spreadsheets/d/1G3-Ad63vofT0W7qAQjBLo9Lczml0FTrNxjKm8dW_eBY/edit#gid=87439160")

### How can we stream?

If I had to answer in just one tool, OBS.  
But if you have time,

Well, we first need to capture our screen/media, this can be done with any tool of your liking, the tricky part comes immediately after.  
It is packaging and sending to so 'someplace'. This someplace is what we call an _ingetion_ server, a remote server setup ready to accept your encoded media feed, and convert it into a public endpoint, which can then be viewed by all.

This packaging or trans-coding is done what we achieve using OBS or ffmpeg. _A local tool_

There are optimized encoding/formats which we have now isolated and standardized for transmitting streaming media data, most popular these days: RTMP. _The Protocol_

The ingestion servers basically runs a service which understands this encoding, maintains a small buffer, and projects forward this Media as an open endpoint for viewing, often embedded into a webpage or sometimes another Stream. _The Public Cloud_

<--DRAWING-->


To understand *Protocol* better: https://restream.io/blog/streaming-protocols/

To understand *Ingetion Servers* Better: [A mini-node based Ingetion server](https://github.com/karx/kaaroStream-bridge/blob/master/streamer-bridge.js)

To understand *The tool* better: Download [OBS - Open Broadcaster Software](https://obsproject.com/) and use it.

### Interactions

What are the various types of interactions that are possible on this canvas, examples of how it is being used.

Mostly, if feels like giving a talk or a speech, or performing on a stage, however, the audience here has alot more tools available at their disposal.   
We are going to refer to audience as 'viewers' or _chat. chat_ can vote, mark location on map, start a debate, introduce new topic, and well basically without a chat, there is no real stream. Without chat, a stream is just a video. 

## Refs

* [https://en.wikipedia.org/wiki/Radio_calisthenics](https://en.wikipedia.org/wiki/Radio_calisthenics "https://en.wikipedia.org/wiki/Radio_calisthenics")
* [https://en.wikipedia.org/wiki/Great_Divergence](https://en.wikipedia.org/wiki/Great_Divergence "https://en.wikipedia.org/wiki/Great_Divergence")
* [https://en.wikipedia.org/wiki/Contemporary_history](https://en.wikipedia.org/wiki/Contemporary_history "https://en.wikipedia.org/wiki/Contemporary_histor")
* [https://twitchtracker.com/statistics](https://twitchtracker.com/statistics "https://twitchtracker.com/statistics")
* [Streaming Trends Q3 2020](https://streamhatchet.com/wp-content/uploads/2020/10/2020-Q3-Streaming-Trends.pdf) from [https://streamhatchet.com/](https://streamhatchet.com/)