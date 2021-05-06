---
title: FaceEvents
description: Supercharging events and conferences with Face Detection and Recognition systems
contribute_link: https://github.com/ashtam55/face_events
status: inactive
---
Supercharging events and conferences with Face Detection and Recognition systems



### User Onboarding Modules
These are a set of services created for user onboarding from various platforms. These aim to collect the following data, 

|   Data Type             |  Stage      |
|-------------------------|-------------|
|   User Phone number     | (Primary)   |
|   User Name/Alias       | (Stage 1)   |
|   User email-address    | (Stage 0)   |
|   User face-id          | (Stage 2)   |
|   User address          | (Stage 3)   |
|   mobile number Verify  | (Stage 3)   |
|   email address Verify  | (Stage 3)   |
|   His profile (*)       | (Stage 4)   |

```
Stage 0: first interaction with the User
Stage 1: User visits one of our site/modules
Stage 2: User visits one of our onboarding modules
Stage 3: User visits to verify himself
Stage 4: User visits to build identity (Optional)
```

The following are the Onboarding services categories by Stage:

* Emailers (Stage 0)
* Flyers (Stage 0)
* List from Events Industry (Stage 0)
* WhatsApp (Stage 1)
* QRCode (Stage 1) 
* Web app (Stage 1)
* Android App (Stage 1)
* iOS App (Stage 1)
* Google Actions (Stage 1)
* Amazon Alexa Skill (Stage 1)
* Robot/On-point Voice bots (Stage 1)
* Robot/On-point Camera bots (Stage 2)
    

### On-ground Modules
These are hardware installations/plugins that enforce the FaceEvent flow.
*   Base Lock/Unlock module or __Verification Module__

This would be the base module, with a camera and a compute stick with network capabilities. 

* __Identification Module__ 

These are modules linked for capturing usage statistics from the camera for a different location, linked to a business identity
They would interact directly with the FaceEvent services.

* __Feedback Modules__

These are screens and visual displays linked to an expensive SOC to help enforce, facilitate and ease the FaceEvents flow.

### On-cloud Services
These are set of services deployed as a backend for the Onboarding and Ongound modules.
* Authentication
* User data management
* Data storage (face-images, assets, etc) 
* Common Onboarding APIs - (new, update, delete, blacklist) 
* Common FaceEvents APIs - (detect, fetch)


### Admin-dashboard
To be consumed by superusers. Help create reports, logs, etc.


## Devices/HW

* Robot/On-point Voice bot

```
Data to Capture:    Name
                    Mobile number 

To link:    FaceEvents weblink
            FaceEvents mobile app     
```



## Web/Software
* Whatsapp bot

```
Data to Capture:    Name
                    email-address
                    image (to-be-tested)*

To link:    FaceEvents weblink
            FaceEvents mobile app
            
```
