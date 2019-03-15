# coveo-voicify-twilio-webhook
Webhook (Google Cloud Function) for Coveo's integration with Voicify and Twilio

This webhook can be deployed in as a Google Cloud Function with HTTP Trigger
* go to https://console.cloud.google.com/functions/
* (create a new account and project if you don't already have one)

Create a New Function:
* Provide a name
* Select ```HTTP Trigger```
* Take note of the URL
* Select ```ZIP Upload```
* Runtime: ```Node.js 6```
* Upload a ZIP file containing both ```index.js``` and ```package.json```
* Stage Bucket: create a bucket
* Function to execute: ```webhook```
* create

In Voicify:
* Register a new webhook with the Google Cloud Function URL
