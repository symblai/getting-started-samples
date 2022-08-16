# Realtime Output with PSTN Dialin using Voice SDK

In this example let's walk through how to get the live transcription and
insights events in a Telephone call.

## Getting started

Open `.env` file and add your APP_ID, APP_SECRET, SUMMARY_EMAIL. You can get
APP_ID and APP_SECRET from
[https://platform.symbl.ai](https://platform.symbl.ai)

We will use `symbl-node` package.

```javascript
require('dotenv').config()

const {sdk} = require('symbl-node')
```

Let's start by initialising `symbl-node` sdk

```js
await sdk.init({
  appId: process.env.APP_ID,
  appSecret: process.env.APP_SECRET,
  basePath: 'https://api.symbl.ai',
})
```

Now let's start our connection:

`const connection = await sdk.startEndpoint(endpointConfig)`

First of all let's provide phone number and endpoint type:

```javascript
      endpoint: {
        type: 'pstn',
        phoneNumber: process.env.DEFAULT_PHONE_NUMBER,
      },
```

In case you want to use `sip` connection, you can use `type: sip` and provide
SIP URI to dial-in to. This should be unique for an active call/meeting in your
system. You can also provide `dtmf` code if you have one. You can find this code
on meeting platform invite. You can leave it blank if not connecting to meeting
platform

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

### Insights

Symbl provide various insights from the call. Main insights categories are
`question` and `action_item`. In order to include insights in processing, you
need to specify them in configuration like so:

```js
insightTypes: ['action_item', 'question'],
```

### Actions

You can specify different actions to happen during the call. We will define just
one:

```javascript
      actions: [
        {
          invokeOn: 'stop',
          name: 'sendSummaryEmail',
          parameters: {
            emails: [process.env.SUMMARY_EMAIL], // Add valid email addresses to received email
          },
        },
      ],
```

When our connection will be stopped, Symbl will send summary mail provided in
`.env` file

Let's also name our session by providing:

```js
data: {
  session: {
    name: 'My Test Meeting',
  },
},
```

### Getting connection Id.

For subscribing to the data, we will need to use `connectionId` unique to each
active connection. to get it you can simply retrieve it from connection
response:

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

## Realtime insights

In order to get real time data, we need to subscribe to the connection. We can
do so by using

```js
sdk.subscribeToConnection(connectionId, (data) => {})
```

data has `type` field, so we will check for `transcript_response`,
`insight_response` and `message_response`

`transcript_response` are our live transcriptions that we want to preview in the
console.

```js
if (type === 'transcript_response') {
  const {payload} = data
  process.stdout.write('Live: ' + payload && payload.content + '\r')
}
```

Transcripts are changing all the time, but once they are processed into
reasonable message and not just words, we will get `message_response` with
messages array

```js
if (type === 'message_response') {
  const {messages} = data
  messages.forEach((message) => {
    process.stdout.write('Message: ' + message.payload.content + '\n')
  })
}
```

And finally if there will be any question or action item during conversation,
you will get `insight_response`

```js
if (type === 'insight_response') {
  const {insights} = data
  insights.forEach((insight) => {
    process.stdout.write(`Insight: ${insight.type} - ${insight.text} \n\n`)
  })
}
```

As you can see with this data there is a wide array of implementations you can
do
