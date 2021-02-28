# Add Trackers to Realtime websockets call

## Setup

Make sure you have [your account credentials](https://platform.symbl.ai/#/home)
and Node.js installed (> v8.x) on your machine.

The sample code uses `sox` to access microphone. You will also need to make sure that `sox` is installed on your machine.

#### Mac OS
```bash
brew install sox
```

#### Ubuntu/Linux
```bash
sudo apt-get install libasound2-plugins libasound2-python libsox-fmt-all

sudo apt-get install sox
```


### Install dependencies

```bash
npm install
```

## Update Code

1. Update your credentials in `init()` call.

```javascript
await sdk.init({
  // Your appId and appSecret https://platform.symbl.ai
  appId: 'your_appId',
  appSecret: 'your_appSecret',
})
```
2. Add yourself to users by providing a name and email address to the `userId` field

```javascript
const users = {
    John: {
        userId: 'your_email@example.com',
        name: 'John',
    },
};
```

3. Add `trackers` to the realtime request request body as an array of tracker objects. A tracker object has two fields:
    1. `name` {{string}} - Name for the tracker
    2. `vocabulary` {{array}} - Array of words/phrases that will be detected from the conversation.

```javascript
const connection = await sdk.startRealtimeRequest({
  id,
  insightTypes: ['action_item', 'question'],
  trackers: [
      {
          name: 'Denial',
          vocabulary: [
              'No thank you',
              'Not interested',
              'No thanks',
              ...
          ]
      },
      {
          name: 'Approval',
          vocabulary: [
              ...
          ]
      }
  ],
  ...
})

```

4. If you want to receive interim results as trackers are detected, you can optionally set `interimResults` to `true` in the `config` object in request.json
```javascript
   const connection = await sdk.startRealtimeRequest({
      id,
      insightTypes: ['action_item', 'question'],
      trackers: [
         {
            name: 'Denial',
            vocabulary: [
               'No thank you',
               'Not interested',
               'No thanks',
               ...
            ]
         },
         {
            name: 'Approval',
            vocabulary: [
               ...
            ]
         }
      ],
      config: {
         confidenceThreshold: 0.5,
         timezoneOffset: 420,
         languageCode: 'en-US',
         trackers: {
            // Returns interim tracker detection returns
            interimResults: true // By default false
         },
         speechRecognition: {
            encoding: 'LINEAR16',
            sampleRateHertz: 16000
         },
      },
   ...
})
```

## Run

Run the code:

```bash
node index.js
```

Once the script is running wait until you see in the log a message starting with
```
connection started for speaker:
```
This indicates that the websocket connection has been established and audio data is streaming.
You can start speaking into your microphone and test out the realtime Trackers by speaking phrases included in your described trackers `vocabulary` array.

When a Tracker is detected you see in the log an `onTrackerResponse` which will contain an array of trackers each containing `messageRefs` and `insightRefs`.
