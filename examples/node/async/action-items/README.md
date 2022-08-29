#  Using the ActionItem Async API

This is a simple main-style sample application using Symbl's Async API. This application will post an audio file to the platform and obtain the ActionItem results when they become available.

## Getting started

Open `.env` file and add your APP_ID, APP_SECRET, SUMMARY_EMAIL. You can get APP_ID and APP_SECRET from [https://platform.symbl.ai](https://platform.symbl.ai)

Most of the heavy lifting is done in the `common` library which you can read about its plumbing [here](../../common/README.md).

## Async Conversation Processing

Obtaining intelligence on ActionItems using the Async API is pretty straight forward, the steps are:

1. Login
2. Post the audio file and wait for the Symbl platform to process it
3. Retrieve the ActionItems

```
async function main() {
  /*
    Login and get token
  */
  var token = await common.Login();

  /*
    Post the audio file to the Symbl platform
  */
  var result = await post.Post(token, "All_I_Really_Want.mp3");

  /*
    Process ActionItems for the audio file
  */
  var actionItems = await intelligence.ActionItems(token, result.conversationId);
  output = JSON.parse(actionItems);
  console.log(output);
}

main();
```