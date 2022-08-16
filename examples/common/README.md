# Common Libraries for Symbl Javascript SDK

The `common` library contains functions, configuration, etc that is common to all projects in the `example` folder. You can find a description of each javascript file below.

## common.js

This describes the common or minimal configuration needed to invoke a real-time request `sdk.startRealtimeRequest` on the Symbl platform. We can retreive that using the `getConfigScaffolding()` function.

### Common Configuration Parameters

The configuration needs a unique id to associate to our Symbl request. We will create this Id using `uuid` package

`const id = uuid();`

The minimal required input:

- `insightTypes` - we need to provide which insights will be detected. Supported ones are `action_item` and `question`.
- `config` - object with meeting title, confidence threshold and the sampleRate.
- `speaker` - object to define who is the speaker. To distinguish between different speakers we also need to provide `userId` with valid email, so after meeting will end, we will receive summary email.
- `handlers` - these handlers are used to detect speech, messages and insights.
  - `onSpeechDetected` - This will return live transcription of the call
  - `onMessageResponse` - When processed messages are available, this callback will be called
  - `onInsightResponse` - When Symbl detects an insight, this callback will be called.

## streaming.js

This describes the basic layout, operation, design of the `streaming.js` library.

### High-level Components Used

This example runs on node, so we will use `@symblai/symbl-js` package.

```javascript
require('dotenv').config()

const {sdk} = require('@symblai/symbl-js')
```

For demo purposes, we're using the audio from microphone and passing it on to websocket connection.

We use the `mic` module to make sure all requirements for this application are met. For instance, we need `sox` package or `ALSA` tools to be installed. [`mic` installation instructions](https://www.npmjs.com/package/mic#installation)

For MacOS, it can be as simple as running:

```bash
brew install sox
npm install mic
```

### Initialize Mic

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

### Initialize Symbl SDK

```javascript
try {
  await sdk.init({
    appId: process.env.APP_ID,
    appSecret: process.env.APP_SECRET,
    basePath: 'https://api.symbl.ai',
  })
  .then(() => console.log('SDK Initialized.'))
  .catch(err => console.error('Error in initialization.', err));
}
catch (e) {}
```

### Where the Magic Happens

This is where the magic happens and it's quite simple. We start the websocket and then connect the Mic to the websocket.

```javascript
  // Start Real-time Request (Uses Realtime WebSocket API behind the scenes)
  const connection = await sdk.startRealtimeRequest(config);
  console.log('Successfully connected. Conversation ID: ', connection.conversationId);

  // get the mic
  const micInputStream = micInstance.getAudioStream()

  /**
   * Raw audio stream
   */
  micInputStream.on('data', (data) => {
    // Push audio from Microphone to websocket connection
    connection.sendAudio(data)
  })
```
