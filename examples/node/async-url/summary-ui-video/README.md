#  Using the Summary-UI API

This is a simple main-style sample application using Symbl's Summary UI API. This application will post an video file to the platform and obtain the Summary results via a pre-canned UI when they become available.

## Getting started

Open `.env` file and add your APP_ID, APP_SECRET, SUMMARY_EMAIL. You can get APP_ID and APP_SECRET from [https://platform.symbl.ai](https://platform.symbl.ai)

Most of the heavy lifting is done in the `common` library which you can read about its plumbing [here](../../common/README.md).

## Async Conversation Processing

Obtaining intelligence on Summary using the Async API is pretty straight forward, the steps are:

1. Login
2. Post the video file and wait for the Symbl platform to process it
3. Retrieve the URL for Summary UI

```
async function main() {
  /*
    Login and get token
  */
  var token = await common.Login();

  /*
    Post the audio file to the Symbl platform
  */
  var result = await posturl.PostVideoURL(token, process.env.URL);

  /*
    Process Summary for the audio file
  */
  var summary = await summaryui.SummaryVideoUI(token, process.env.URL, result.conversationId);
  var output = JSON.parse(summary);
  console.log(util.inspect(output, false, null, true));
}

main();
```