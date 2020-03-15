---
layout: single
title:  "Track-O: a Cost Efficient GPS Tracking Device Using NODE-RED & FREEBOARD"
header:
  teaser: "https://cdn.instructables.com/FHX/DOZB/IZYGACRD/FHXDOZBIZYGACRD.LARGE.jpg?auto=webp&frame=1&width=1024&height=1024&fit=bounds"
tags:
  - GPS
  - Node-Red
  - GSM
  - Freeboard
  - Arduino
  - NANO
  - sim900a
  - neo 6mv2

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
```
#include <SoftwareSerial.h>
#include<TinyGPS.h>
//Global Variables for Latitude and Longitude
long lat, lon;
float latitude, longitude;
SoftwareSerial GPS_Com(3, 4);//RX, TX
SoftwareSerial GSM_Com(7, 8); //RX, TX
TinyGPS gps;
String deviceID = "TRACKO";
void setup()
{
//Serial.begin(115200);
GPS_Com.begin(9600);
GSM_Com.begin(9600);
//Serial.println("Connecting GPS......"); }
void loop() {
gpsGetdata();
}
void gpsGetdata() {
//Time Variables
int year;
byte month, day, hour, minute, second, hundredths;
unsigned long age;
GPS_Com.listen();
while (GPS_Com.available() != 0) {
if (gps.encode(GPS_Com.read())) {
gps.get_position(&lat, &lon);
//gps.get_datetime(&date, &time, &age);
gps.crack_datetime(&year, &month, &day, &hour, &minute, &second, &hundredths, &age);
//Time Calculations
char date[16];
char timer[16];
sprintf(date, "%02d/%02d/%02d", month, day, year);
sprintf(timer, "%02d:%02d:%02d", hour, minute, second);
latitude = (lat * 0.000001);
longitude = (lon * 0.000001);
//Serial.print("Position: "); //Serial.print("Lat: "); //Serial.print(latitude, 4); //Serial.print(" "); //Serial.print("Lon: "); //Serial.println(longitude, 4); //Serial.print(" "); //Serial.print("Date: "); //Serial.println(date); //Serial.print(" "); //Serial.print("Time: "); //Serial.println(timer); //Serial.print(" ");
gsmGetdata(latitude, longitude, date, timer); } } }
void gsmGetdata(float la, float lo, String pdate, String ptimer)
{
GSM_Com.listen();
//Serial.println("Geting Data from GSM:");
GSM_Com.println("AT+CGATT=1");
delay(200);
rxempty();
//Setup the GPRS in GSM
GSM_Com.println("AT+SAPBR=3,1,\"CONTYPE\",\"GPRS\"");
delay(1000);
//Check GPRS Connection Status
if (check(0, 5000))
{ //Serial.println("GPRS connection ok"); }
else { //Serial.println("GPRS connection err"); }
rxempty();
//Set the APN for GSM Setting
GSM_Com.println("AT+SAPBR=3,1,\"APN\",\"\"");
delay(5000);
if (check(0, 5000))
{ //Serial.println("APN connection ok"); }
else { //Serial.println("APN connection err"); }
rxempty();
//Setup the SAPBR
for (int i = 0; i < 3; i++)
{ GSM_Com.println("AT+SAPBR=1,1");
//setting the APN, the second need you fill in your local apn server
if (check(0, 10000)) { //Serial.println("SAPBR connection ok");
break; }
else { //Serial.println("SAPBR connection err"); } }
rxempty();
//Initialize the HTTP Client
GSM_Com.println("AT+HTTPINIT");
delay(2000);
if (check(0, 5000)) { //Serial.println("HTTP connection ok"); }
else { //Serial.println("HTTP connection err"); }
rxempty();
//Serial.println("AT+HTTPPARA=\"URL\",\"http://URL-NODE-RED/tracko?deviceID=" + deviceID + "&Latitude=" + String(la, 6) + "&Longitude=" + String(lo, 6) + "&Date=" + String(pdate) + "&Time=" + String(ptimer) + "\"");</p><p>//Put your Node red URL here 
GSM_Com.println("AT+HTTPPARA=\"URL\",\"http://URL-NODE-RED/tracko?deviceID=" + deviceID + "&Latitude=" + String(la, 6) + "&Longitude=" + String(lo, 6) + "&Date=" + String(pdate) + "&Time=" + String(ptimer) + "\"");
delay(1000);
rxempty();
GSM_Com.println();
//Setup the HTTP Action
GSM_Com.println("AT+HTTPACTION=0");
delay(8000);
if (check(0, 5000))
{ //Serial.println("Send ok"); }
else { //Serial.println("Send err"); }
//delay(1000);
if (check(2, 10000))
{ //Serial.println("Send ok"); }
else { //Serial.println("Send err"); }
rxempty();
//Read the Data from the Server
GSM_Com.println("AT+HTTPREAD=0,20");
GSM_Com.println("");
delay(3000);
if (check(0, 10000))
{ //Serial.println("GSM done"); }
else { //Serial.println("GSM err"); }
rxempty();
//Terminate the HTTP Client
GSM_Com.println("AT+HTTPTERM");
if (check(0, 5000))
{ //Serial.println("Terminate done"); }
else { //Serial.println("Terminate err"); }
rxempty();
GSM_Com.println("AT+SAPBR=0,1");
if (check(0, 5000))
{ //Serial.println("Terminate done"); }
else { //Serial.println("Terminate err"); }
//Serial.println();
delay(1000);
}
//GSM Check Commands
bool check(int v, uint32_t timeout, String & Data)
{
unsigned long start = millis();
char a;
while (millis() - start < timeout) {
while (GSM_Com.available() > 0)
{ a = GSM_Com.read();
if (a == '\0') continue;
Data += a; }
if (Data.indexOf("OK") != -1 && v == 0)
{ //Serial.println(Data);
return 1;
}
if (Data.indexOf(">") != -1 && v == 1)
{ //Serial.println(Data);
return 1;
}
if (Data.indexOf(":") != -1 && v == 2)
{ //Serial.println(Data);
return 1;
} }
//Serial.println(Data);
return 0;
}
bool check(int v, uint32_t timeout)
{ unsigned long start = millis();
char a;
String Data;
while (millis() - start < timeout)
{
while (GSM_Com.available() > 0)
{ a = GSM_Com.read();
if (a == '\0') continue;
Data += a; }
if (Data.indexOf("OK") != -1 && v == 0)
{ //Serial.println(Data);
return 1; }
if (Data.indexOf(">") != -1 && v == 1)
{ //Serial.println(Data);
return 1;
}
if (Data.indexOf(":") != -1 && v == 2)
{ //Serial.println(Data);
return 1;
} }
//Serial.println(Data);
return 0;
}
void rxempty()
{
while (GSM_Com.available() != 0)
//Serial.write(GSM_Com.read());
GSM_Com.read();
}
```
* After debugging the code, please make sure to comment the serial monitor as it may lead to malfunctioning. Also, make a separate folder in Arduino library for the TinyGPS library and put the .h &.CPP file in it.

## Node-Red Flow

```
[{"id":"213a0461.834cfc","type":"http in","z":"d8215eb6.bdc4d","name":"","url":"/tracko","method":"get","swaggerDoc":"","x":165,"y":105,"wires":[["b549696f.3bcd88","e18f90a5.1ecd8"]]},{"id":"b549696f.3bcd88","type":"mongodb out","z":"d8215eb6.bdc4d","mongodb":"a6c5cf74.81249","name":"","collection":"tracko","payonly":true,"upsert":false,"multi":false,"operation":"insert","x":549,"y":111,"wires":[]},{"id":"e18f90a5.1ecd8","type":"http response","z":"d8215eb6.bdc4d","name":"","x":360,"y":137,"wires":[]},{"id":"a2a0dd02.cc704","type":"http in","z":"d8215eb6.bdc4d","name":"","url":"/get_tracko","method":"get","swaggerDoc":"","x":91,"y":309,"wires":[["65281481.e6026c"]]},{"id":"a36fbbb1.a89418","type":"mongodb in","z":"d8215eb6.bdc4d","mongodb":"a6c5cf74.81249","name":"","collection":"tracko","operation":"find","x":462,"y":309,"wires":[["dbdf926c.04f77"]]},{"id":"4799ade4.87d914","type":"http response","z":"d8215eb6.bdc4d","name":"","x":860,"y":302,"wires":[]},{"id":"dbdf926c.04f77","type":"json","z":"d8215eb6.bdc4d","name":"","x":717,"y":312,"wires":[["4799ade4.87d914"]]},{"id":"65281481.e6026c","type":"function","z":"d8215eb6.bdc4d","name":"","func":"msg.limit = 1;\nmsg.sort = {\"_id\" : -1};\nmsg.skip = 0;\nreturn msg;","outputs":1,"noerr":0,"x":231.5,"y":290,"wires":[["a36fbbb1.a89418"]]},{"id":"a6c5cf74.81249","type":"mongodb","z":"","hostname":"127.0.0.1","port":"27017","db":"db","name":""}]
```

## FreeBoard

* Goto https://freeboard.io/
* Sign Up there.
* Now go through the attached video.
* At the end of the video, you can see the location of my device.It is not moving, but when you put it in a car or        something running, then you can easily track your path.
![How-to-use-freeboard](https://cdn.instructables.com/ORIG/FRG/X7KN/IZYGAQ9X/FRGX7KNIZYGAQ9X.mp4)

## References
* http://nodered.org/docs/getting-started/
* https://github.com/mikalhart/TinyGPS
