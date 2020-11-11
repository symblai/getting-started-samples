# Add Trackers to Realtime websockets call

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
