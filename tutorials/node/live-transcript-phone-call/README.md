# Get Live Transcription with a Simple Phone Call

Get the live transcription in your Node.js application by making a simple call to a valid phone number.

Making a simple phone call is also the quickest way to test the Symbl’s Telephony API. It can make an outbound call to a phone number using a traditional public switched telephony network (PSTN) or any SIP trunks or SIP endpoints that can be accessed over the internet using a SIP URI.

## Setup
Make sure you have [your account credentials](https://platform.symbl.ai/#/home) and Node.js installed (> v8.x) on your machine.

### Install dependencies
```bash
npm install
```

## Update Code
1. Update your credentials in `init()` call.
2. Update your phone number (valid US/Canada number), with country code.

## Run
Run the code:
```bash
node index.js
```

You should receive a phone call on the phone number you used in the startEndpoint call. Accept the Call.

Start speaking - you should see the live transcription being printed on the console in real-time.

The call should automatically end after 60 seconds.



