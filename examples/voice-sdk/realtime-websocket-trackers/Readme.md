# Realtime WebSocket using Voice SDK

The WebSocket based real-time API by Symbl provides the direct, fastest and most
accurate of all other interfaces to push the audio stream in real-time, and get
the results back as soon as they're available.

In this example we connect directly using WebSocket API and push audio and get
results in real-time. Including Live Transcript and Insights.

## Getting started

This example runs on node server, so we will use `symbl-node` package.

Open `.env` file and add your APP_ID, APP_SECRET, SUMMARY_EMAIL. You can get
APP_ID and APP_SECRET from
[https://platform.symbl.ai](https://platform.symbl.ai)

```javascript
require('dotenv').config()

const {sdk} = require('symbl-node')
```

For demo purposes, we're using mic to simply get audio from microphone and pass
it on to websocket connection

We use `mic` module so make sure you check that all requirements for the package
are met. For instance we need `sox` package or `ALSA` tools to be installed.

[`mic` installation instructions](https://www.npmjs.com/package/mic#installation)

on Mac it can be as simple as running `brew install sox`

```javascript
const mic = require('mic')

const sampleRateHertz = 16000

const micInstance = mic({
  rate: sampleRateHertz,
  channels: '1',
  debug: false,
  exitOnSilence: 6,
})
```

### Initialize SDK

```javascript
;(async () => {
  try {
    await sdk.init({
      appId: process.env.APP_ID,
      appSecret: process.env.APP_SECRET,
      basePath: 'https://api.symbl.ai',
    })
  } catch (e) {}
})()
```

### Add tracker to request body

Trackers each contain a `name` field and a `vocabulary` field which is an array of strings to be tracked.

```javascript
sdk.startRealtimeRequest({
    id: realtimeSessionId,
    insightTypes: ['action_item'],
    trackers: [
        {
            name: 'Denial',
            vocabulary: [
                'No',
                'never agreed to',
                'not interested',
            ],
        },
    ],
    config: {
        ...
    }
});
```

We will also need a unique id to associate to our symbl request. We will create
this Id using `uuid` package

`const id = uuid();`

Now we can start the connection using `sdk.startRealtimeRequest`. We need to
provide several important options to our realtime request.

- `insightTypes` - we need to provide which insights will be detected. Supported
  ones are `action_item` and `question`.
- `trackers` - Array of tracker objects which has two fields
  - `name` - Tracker name.
  - `vocabulary` - Array of strings to be tracked and detected in the conversation. Each time a phrase in the trackers `vocabulary` array is detected a `tracker_response` will be output in the console.
- `config` - object with meeting title, confidence threshold and the sampleRate.
- `speaker` - object to define who is the speaker. To distinguish between
  different speakers we also need to provide `userId` with valid email, so after
  meeting will end, we will receive summary email.
- `handlers` - these handlers are used to detect speech, messages and insights.
  - `onSpeechDetected` - This will return live transcription of the call
  - `onMessageResponse` - When processed messages are available, this callback
    will be called
  - `onInsightResponse` - When Symbl detects an insight, this callback will be
    called.
  - `onTrackerResponse` - When Symbl detects a tracker, this callback will be called and the detected tracker will be logged.

So our complete code will look like this:

```javascript
const connection = await sdk.startRealtimeRequest({
  id,
  insightTypes: ['action_item', 'question'],
  trackers: [
      {
          name: 'Denial',
          vocabulary: [
              'No',
              'never agreed to',
              'not interested',
          ],
      },
  ],
  config: {
    meetingTitle: 'My Test Meeting',
    confidenceThreshold: 0.7,
    timezoneOffset: 480, // Offset in minutes from UTC
    languageCode: 'en-US',
    sampleRateHertz,
  },
  speaker: {
    // Optional, if not specified, will simply not send an email in the end.
    userId: 'your@email.com', // Update with valid email
    name: 'My name',
  },
  handlers: {
    onSpeechDetected: (data) => {
      console.log(JSON.stringify(data))
      // For live transcription
      if (data) {
        const {punctuated} = data
        console.log('Live: ', punctuated && punctuated.transcript)
      }
    },
    onMessageResponse: (data) => {
      // When a processed message is available
      console.log('onMessageResponse', JSON.stringify(data, null, 2))
    },
    onInsightResponse: (data) => {
      // When an insight is detected
      console.log('onInsightResponse', JSON.stringify(data, null, 2))
    },
  },
})
```
