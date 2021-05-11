---
layout: single
title:  "Langton's Ant - Computational Art"
header:
  teaser: "/assets/images/langton/title.png"
tags:
  - Finite State Automata
  - Turing Machine
  - CDT Principle 
  - VR
  - Aframe
  - Compute
  
sidebar:
  - title: LR
    image: "/assets/images/langton/LR.png"
    image-alt: LR 1000 Steps
    text: LR 1000 Steps
  - title: LRRL
    image: "/assets/images/langton/LRRL.png"
    image-alt: LRRL 1000 Steps

# model:
#   asset: "/assets/models/esp.glb"
#   color: #FFFFFF
---

# Langton's Ant


## What is Langton's Ant?
Langton's Ant is a 2D Universal Turing Machine, invented by Chris Langton in 1986.   
With a very simple ruleset, it runs on a square lattice of black and white cells.   
We set on of the cells of this lattice as the ant. The ant also has a `heading direction` in one of the 4 cardinal direction.   
The ant moves and colors the lattice based on the following rule:
* At White Square, Turn 90° Clockwise, flip color of lattice, move 1 unit.
* At Black Square, Turn 90° counter-clockwise, flip color of lattice, move 1 unit.

This ruleset can be shorthanded as `[L , R]`.    

![Langton's Ant GIF](/assets/images/langton/LangtonsAntAnimated.gif)

This idea has been more generalized to have a 2D [Termite](https://en.wikipedia.org/wiki/Turmite), having arbitrarily many state states, and thus colors.


At each timestep the Ant/Termite performs the following operations:
* Turn on the spot (`L` or `R`)
* change color of the lattice
* move forward 1 unit

The termite could also be made to work in a triangular or hexagonal lattice, with turn angles of Pi/3 and Pi/6 respectively.

The following animation is of a hexagonal grid, with the following ruleset: `[R1,R2,N,U,R2,R1,L2]`. The animation has 14000 iterations, and the speed of animation will change twice.
![hexagonal termite animation](https://upload.wikimedia.org/wikipedia/commons/4/4a/CA50338_animation.gif)


## Exploring Langton's Ant

Now that we understand the basics of what is Langton's Ant, its time we explore, experiment, attempt to predict and test our understanding.

We have our very own Universal Turing machine to play around with, and let's be honest, these termites are amazing to look at.

A 2D visual representation makes these compute system very "digestible" for us, in terms that we can in one look/glance we are able to know
* how long the machine has been ON
* how many possible states exist

and making this representation animated or progress in a time-like vector: frame-rate we can further increase the amount of understanding of this compute system by simply looking at it. (frame-rate in our scenario, is not exactly time but time-like, more about this later)   

Furthermore, let's just put this entire setup in VR using some JS and A-frame library, which should further enhance the flux of information we gather by observing it grow.  
[![Langton 3D image](/assets/images/langton/3dCanvas.png)](http://kaaro.akriya.co.in/kCanvas/langton3d/kaaro.html)


The cells, now also grow in size the more they are visited in our 3D construct in this VR, enhancing the flux even more. If you any more ideas please add them to the GitHub issues.


Try yourself: What happens when two termites collide !?
![Almost colliding Termites](/assets/images/langton/collision.png)

Fork and get started here: [Langton 3D on GitHub](https://github.com/karx/kCanvas/tree/master/langton3d)



```
Note: Most, termite rule set end up creating a chaotic pattern.
```

## Why Langton's Ant?

Langton's Ant is one of the simplest examples that highlights computational irreducibility. A term quite often used by Wolfram in his upcoming work [A New Kind of Science](https://www.wolframscience.com/nks/).

Computational irreducibility simply means, for a compute system, if the only way to guess the nth state, is to evaluate the compute system till nth state, the system is said to be computationally irreducible.

For a general `termite`, it is not feasible to guess the nth state by any math trick, the only way is to let the compute function run, and observe the output.


## The CDT Principle

This brings out a very important principle, the Church–Turing–Deutsch principle (CTD principle), which is a more physical interpretation of the Church–Turing thesis.

The principle can be termed quite simply: 

>> The principle states that a *Universal computing device* can simulate *every* **physical process**.


But this has profound implications in our understanding the fabric of our reality.

Let's break this statement down based on our understanding of playing around with our very own UCD, Langton's ant.

* So, if all physical process can be simulated by a UCD, that means, to know the state of this compute system, we would have to run it, for the number of iterations as the universe has been running.   
This clearly answers or actually devalues the even asking the question, are we living in a simulation.   

* For any natural theory, we can have what we can call unit test. The law of conservation of momentum. Any theory must satisfy these.
The CDT principle provides us with a similar unit test (if proven) which would allow us to better understand our reality. Any model of nature must show that the universal compute system is Turing complete.

Based on these points, it feels like we live in a universe, which a compute system that has been running for quite some `time` and with compute power far superior to what we can fathom. We in 2020 are barely able to leverage molecular level interactions to build these `Quantum Computer` family of computing systems. Which does make us feel we are playing catch-up with the universe's compute, but on a very very slow cart.


By the time we discover a new `particle` (a notion of the physicality of the universe), the universe might have generated maybe a million more kind of such physicalities.  


## Some thinking
But allow me, purely conjecture from here on forth, to point towards `Time`.

As mentioned, we ran this 2D Turing complete machine on a time-like vector.
The time that exists for us Humans, this fabric is inherent to us to impose on all thoughts we have, and ergo on all programs/compute systems that we deploy. But the tick rate/iterations for these compute systems are not necessarily linked to `time`. We have of course built these systems to `flow` alongside our comprehension of `time`.


There is a whole family of `Quantum Computers` that can be build that have this flow unlinked with `time`. This would enable us to interact with such machines, and in-time run simulations of compute systems that are unhinged from our flow `time`. 


A lot more thinking needs to be done to have a working prototype of such machines, but rest assured, they must have a time-like `flow` vector. The flow rate is the rate at which we move along the `tape` of this Turing machine.


## Further Work
* How does it **Sound**?   
This is WIP, along with coloring the cell, the termite also emits a Note. You can listen to your favourite Lanton's Termite sequence on this [Lanton's ant Sound WIP](karx.github.io/kCanvas/langtonSound/index.html)

* A web component for Langton's Ant.   
This should allow easier playing around and sharing a langton's ant. 

* Persistent shared building.   
Would like to build an ant where we compute the states in a distributed way. Computing @home kind of project, and maintain this state in a distributed way. This exercise should allow us to more embrace the shared space-time tape used for computations. Our universe is shared by infinitely many computing consciousness. 

* In VR Controls.  
Controls to add/remove termites, update rule set and speed control. 


## Thanks and Suggetions
Hope you had an insightful time knowing more about Langton's Ant.

Please provide your suggetions on how to make this KT more engaging and fruitful.

Also comments, help, issues are welcome on [GitHub issues]().


For general support and discussion of this project, please join the Discord server: [Discord Invite Link](https://discord.gg/4xdMRMV)

[![Discord Server](https://discordapp.com/api/guilds/552881714196774953/widget.png?style=banner2)](https://discord.gg/4xdMRMV)

To check known bugs and see planned changes and features for this project, please see the [GitHub issues]().

Found a bug we don't already have an issue for? Please report it in a new [GitHub issue]() with as much detail as you can!


## References
* https://en.wikipedia.org/wiki/File:CA50338_animation.gif
* https://mathworld.wolfram.com/LangtonsAnt.html
* https://www.flickr.com/photos/aldoaldoz/3193056003/
* https://mathworld.wolfram.com/Church-TuringThesis.html
* https://github.com/GollyGang/ruletablerepository
* https://github.com/karx/kCanvas/