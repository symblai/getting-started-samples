#  Using the Topic Streaming API

This is a simple main-style sample application using Symbl's Streaming API. This application will take the audio stream from the microphone in real-time and obtain the Topic results when they become available.

## Getting started

Open `.env` file and add your APP_ID, APP_SECRET, SUMMARY_EMAIL. You can get APP_ID and APP_SECRET from [https://platform.symbl.ai](https://platform.symbl.ai)

Most of the heavy lifting is done in the `common` libraries which you can read about its plumbing [here](../../common/README.md).

## Topics Configuration

The Topic API is among the simpliest of the Symbl APIs as the configuration/input parameters just require the minimal/common configuration provided in the `common.js`.

```javascript
config = common.getConfigScaffolding();
```

Then we need to hook up the message handler so we can receive Topic data/results:

```javascript
config.handlers.onTopicResponse = (data) => {
  console.log('onTopicResponse', JSON.stringify(data, null, 2));
};
```

## Real-time Conversation Processing

That configuration is then passed to the `startCapturing()` function found in `streaming.js` to start the real-time processing by the Symbl platform and hooking up the Mic to that websocket.
