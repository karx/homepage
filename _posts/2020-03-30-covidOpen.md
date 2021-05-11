---
layout: single
title:  "Covid 19 - Open Source and Open Data" 
header:
  teaser: "/assets/images/covid/covid-teaser.jpg"
tags:
  - Covid 
  - Open Data
  - Open source
  - Collaborations
  - Pandemic

# published: false
  
# sidebar:
#   - title: Discord
#     image: "/assets/images/discord/title.jpeg"
#     image-alt: discord is our choice
#     text: Discord is our choice
model:
  asset: "/assets/images/covid/life-under-quarantine/source/room.gltf"
  color: #FFFFFF
---
# Fight against Global Pandemic


## Summary
We have seen an unprecedented collaborative and open movement in this fight against COVID pandemic, in all aspects.
Ranging from Genomic sequencing of the virus itself to, Community guidelines to help prevent the outbreak.

When the new coronavirus (formally known as SARS-CoV-2) was identified in China in January, scientists around the world were ready to respond. The virus’s entire genetic makeup, or genome, was published [online](https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(20)30251-8/fulltext) within days!

The collaborative efforts of engineers, designers and entrepreneurs have made possible technological tools like the 100$ Ventilator and the 3D printed valves that tackle the bottlenecks faced by the healthcare infrastructure.

However,
The number of resources, portals, groups, tools, apps and of course Dashboards are almost overwhelming.

Also, with such speedy science, we get higher error rate. The research papers aren't peer reviewed, the data is not referenced (and hence might as well be opinions) and equipment I fear are not tested OK.

The self-isolation, a great and necessary tactic, also requires a psychological analysis to cater to this sudden change of environment and lifestyle.

We here at Akriya Technologies decided not to add yet another tool, dashboard, datasheet to the mix, but to add value to the numerous projects jumpstarted around us and use this precious time to expand our knowledge base.

This post will link and discuss a few projects, papers and tools that we found useful/interesting/intriguing for us and our loved ones.
Hope you benefit from it too.


```
Document Last Updated on 1st April 2020
```

## Open Web
This category will focus on web-based portal and tools. 
### Dashboards
* **JHU Global Cases Portal**

The Coronavirus COVID-19 Global Cases by the Center for Systems Science and Engineering (CSSE) at Johns Hopkins University (JHU) [Portal](https://coronavirus.jhu.edu/map.html) was on of the first comprehensive ones to pop up on the internet.
![COVID Dashboard Screenshot](/assets/images/covid/Screenshot_2020-03-31 Coronavirus COVID-19 (2019-nCoV).png)

The raw data used to run this dashboard like many other is sourced from [this GitHub repository](https://github.com/CSSEGISandData/COVID-19)

The repository also links references to all the data sources that it uses to compile this information.

* 🔬 **COVID19 India Cluster Network**

A graphical representation of the COVID19 cases in India, and trace.
[![COVID India Cluster](https://camo.githubusercontent.com/0886f43d3200c0cab37a506b21fdb8967828fa11/68747470733a2f2f692e6962622e636f2f646d4e447468572f53637265656e2d53686f742d323032302d30332d31392d61742d392d31352d35312d504d2e706e67)](https://cluster.covid19india.org/)

The data used for this crowdsourced and collected by volunteers at covid19india.org

They even have filter based on State City and Travel.
Check out the GitHub repository for [the Cluster Dashboard](https://github.com/someshkar/covid19india-cluster), [the NLP data Extraction](https://github.com/NirantK/coronaIndia) or [the Unofficial data Repository](https://github.com/amodm/api-covid19-in)



## Open Broadcast  
This category will focus on some of the great content pieces created by YouTubers/Cinematographers.

* **Simulating an epidemic**

[![Video by 3b1b](/assets/images/covid/Screenshot_2020-04-01 3blue1brown - YouTube.png)](https://www.youtube.com/watch?v=gxAaO2rsdIs)

This video by 3blue1brown is a mathematical take on how an epidemic grows, using what can be called an "agent-based" SIR model. The following quote from the video makes the rationalist inside me just light up!
>>  ..I think it can be healthy to engage the little scientist inside all of us and take the chance to be experimental and quantitative even if it's in a necessarily limited fashion, especially if the alternative is to dwell on the headlines and uncertainty.

For those who really like this video, the animations are largely made using [manim](https://github.com/3b1b/manim) - an Open Source Animation engine for explanatory math videos. 



## Open Hardware
This category will focus on Engineering projects that are making a difference.

* **OpenLung Project**

![Current Design](https://gitlab.com/open-source-ventilator/OpenLung/-/raw/master/images/current_concept.png)

The OpenLung project is an In Progress Open Source Ventilator Design that uses BVM as core component.
The project is being developed in open collaboration with http://opensourceventilator.ie/

The design is based/originated out of two prominent groups: the [MIT research group](https://web.mit.edu/2.75/projects/DMD_2010_Al_Husseini.pdf) and another device from [Rice University Mechanical Engineering student group](http://oedk.rice.edu/Sys/PublicProfile/47585242/1063096).

The project uses it's [GitLab page](https://gitlab.com/open-source-ventilator/OpenLung) as the primary srouce of documents and information. 

## Closing Statements
Some thoughts I wanted to get out there along with this text.
* If you are planning to create/work on a tool/resource/app/dashboard make it open source. Use platforms like GitLabs or Github to maintain. A Trello-like board to help people understand the current status, get onboarded fast.

* Times are what they are. Think of this as an adventure, a story you get tell your grandkids, the time when the entire world was on lockdown. Make it a good story, smile.

* We can curb miss-information, by flooding the mediums with factual information, with references. Do share information, but only what you have firsthand, marking yourself as reference. IF you are reposting, fact check by exploring the references and then repost. No technology can solve miss-information, humans can, humans are the ones that lie.


