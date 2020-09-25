# Get Live Transcription with a Simple Phone Call

Get the live transcription in your Node.js application by making a simple call
to a valid phone number.

Making a simple phone call is also the quickest way to test the
[Symbl’s Telephony API](https://docs.symbl.ai/?shell#telephony-api). It can make
an outbound call to a phone number using a traditional public switched telephony
network
([PSTN](https://en.wikipedia.org/wiki/Public_switched_telephone_network)) or any
[SIP trunks](https://en.wikipedia.org/wiki/SIP_trunking) or SIP endpoints that
can be accessed over the internet using a SIP URI.

Live transcription can be used by calling let's say meeting number and getting
live transcription of the whole meeting. Important to note, that there won't be
any automated messages, so main use of this API is to get live transcription of
meetings etc.

## Setup

Make sure you have [your account credentials](https://platform.symbl.ai/#/home)
and Node.js installed (> v8.x) on your machine.

### Install dependencies

```bash
npm install
```

## Update Code

1. Update your credentials in `init()` call.

```javascript
sdk.init({
  // Your appId and appSecret https://platform.symbl.ai
  appId: 'your_appId',
  appSecret: 'your_appSecret',
})
```

2. Update your phone number (valid US/Canada number), with country code.

```javascript
const connection = await sdk.startEndpoint({
  endpoint: {
    type: 'pstn', // when making a regular phone call
    // Replace this with a real phone number
    phoneNumber: '1XXXXXXXXXX', // include country code, example - 19998887777
  },
})
```

The above call will start the phone call to your phone, but in order to get
actual live transcription and insights data from the call, you need to subscribe
to connection like so. `sdk.subscribeToConnection`

You can read more about that in the
[docs](https://docs.symbl.ai/#get-live-transcription-phone-call-node-js-telephony)

## Run

Run the code:

```bash
node index.js
```

You should receive a phone call on the phone number you used in the
startEndpoint call. Accept the Call.

Start speaking - you should see the live transcription being printed on the
console in real-time.

The call should automatically end after 60 seconds.
