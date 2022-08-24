# Tracker API Using Streaming API

This is a simple main-style sample application using Symbl's Streaming API. This application will take the audio stream from the microphone in real-time and obtain the Tracker results when they become available.

## Getting started

Open `.env` file and add your APP_ID, APP_SECRET, SUMMARY_EMAIL. You can get APP_ID and APP_SECRET from [https://platform.symbl.ai](https://platform.symbl.ai)

Most of the heavy lifting is done in the `common` libraries which you can read about its plumbing [here](../../common/README.md).

## Tracker Configuration

The Tracker API requires some additional parameters beyond the minimal/common configuration provided in the `common.js`. They include:

- `trackers` - Array of tracker objects which has two fields
  - `name` - Tracker name.
  - `vocabulary` - Array of strings to be tracked and detected in the conversation. Each time a phrase in the trackers `vocabulary` array is detected a `tracker_response` will be output in the console.

Which is seen here in code:

```javascript
config.trackers = [
  {
      name: 'Denial',
      vocabulary: [
          'No thank you',
          'Not interested',
          'No thanks',
      ]
  },
  {
      name: 'Approval',
      vocabulary: [
          'Yes',
          'Alright',
          'Sounds good',
      ]
  }
];
```

Then we need to hook up the message handler so we can receive Tracker data/results:

```javascript
config.handlers.onTrackerResponse = (data) => {
  console.log('onTrackerResponse:');
  data.trackers.forEach(tracker=>{
      console.info(`    Name: ${tracker.name}`);
      tracker.matches.forEach(match=>{
        console.log(`Tracker Value: ${match.value}`);
        console.log(`Messages detected against this Tracker`);
        match.messageRefs.forEach((messageRef) => {
            console.log(`Message ID: ${messageRef.id}`);
            console.log(`Message text for which the match was detected: ${messageRef.text}`);
            console.log(`\n`);
        });
        console.log(`\n`);

        console.log(`Insights detected against this Tracker`);
        match.messageRefs.forEach((insightRef) => {
            console.log(`Insight ID: ${insightRef.id}`);
            console.log(`Insight text for which the match was detected: ${insightRef.text}`);
            console.log(`Insight Type: ${insightRef.type}`);
            console.log(`\n`);
        });
        console.log(`\n\n`);
      })
  });
};
```

## Real-time Conversation Processing

That configuration is then passed to the `startCapturing()` function found in `streaming.js` to start the real-time processing by the Symbl platform and hooking up the Mic to that websocket.
