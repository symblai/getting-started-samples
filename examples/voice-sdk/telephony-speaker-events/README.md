# PSTN Dial-in using Voice SDK

In this example, it establishes a connection using a phone number through PSTN,
to send speaker events, generate insights, and display a summary URL with the
output. You can see how to initialize the Voice SDK, connect to the endpoint,
push speaker events and get the summary URL.

## Getting started

Open `.env` file and add your APP_ID, APP_SECRET, SUMMARY_EMAIL. You can get
APP_ID and APP_SECRET from
[https://platform.symbl.ai](https://platform.symbl.ai)

Let's start by initializing `symbl-node` sdk

```js
await sdk.init({
  appId: process.env.APP_ID,
  appSecret: process.env.APP_SECRET,
  basePath: 'https://api.symbl.ai',
})
```

## Connecting

`const connection = await sdk.startEndpoint(endpointConfig)`

First of all let's provide phone number and endpoint type to connect to
a landline or cell number:

```javascript
      endpoint: {
        type: 'pstn',
        phoneNumber: process.env.DEFAULT_PHONE_NUMBER,
      },
```

You can also provide `dtmf` code if you have one. You can often find this code
on the meeting platform invite. For example, if your meeting id is 8349:

```javascript
      endpoint: {
        type: 'pstn',
        phoneNumber: process.env.DEFAULT_PHONE_NUMBER,
        dtmf: ',,8349#'  # <pause> <pause> 8349 <# symbol>
      },
```

In case you want to use `sip` connection, you can use `type: sip` and provide
SIP URI to dial-in to. This should be unique for an active call/meeting in your
system. 

```javascript
   dtmf: "<code>",
   type: 'sip',
   uri: 'sip:124@domain.com'
```

You can also pass custom `audioConfig`. If not provided, it uses PCMU with 800
sample rate. If you want to provide it, you can do it like so:

```js
audioConfig: {
  encoding: 'OPUS',
  sampleRate: 48000
},
```

### Getting connection Id.

To send speaker events we will need `connectionId` unique to each active
connection. to get it you can simply retrieve it from connection response:

```js
const connectionId = connection.connectionId
```

## Sending speaker events.

We can send different speaker events to our connection indicating that different
speakers started speaking. That will give us more personalised insights and get
better meeting summary

In our example we will do it by calling helper `getScheduleEvent` function, that
we will review in a bit. We pass SpeakerEvent type to it by using
`SpeakerEvent.types` enum from `symbl-node`, passing user data and timestamp

```javascript
const scheduleEvent = getScheduleEvent(sdk, connectionId)

setTimeout(() => {
  // Schedule all the events to be sent.
  scheduleEvent(SpeakerEvent.types.startedSpeaking, users.john, 0)
  scheduleEvent(SpeakerEvent.types.stoppedSpeaking, users.john, 5)
}, 1000)
```

We retrieve users just from the global array of users but in real world example
that might be users data retrieved from database.

```js
const users = {
  john: {
    userId: 'john@example.com',
    name: 'John',
  },
  mary: {
    userId: 'mary@example.com',
    name: 'Mary',
  },
}
```

In order to push event to our connection we will create an event like so

```js
const speakerEvent = new SpeakerEvent({
  type: eventType,
  user,
})

speakerEvent.timestamp = new Date().toISOString()
```

And push it using `pushEventOnConnection` function provided by SDK

```js
sdk.pushEventOnConnection(connectionId, speakerEvent.toJSON(), (err) => {
  if (err) {
    console.error('Error during push event.', err)
  } else {
    console.log('Event pushed!')
  }
})
```
