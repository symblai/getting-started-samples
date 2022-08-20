#  Using the Management API

This is a simple main-style sample application using Symbl's Management API. This application will create a Tracker on the platform and return the Tracker ID.

## Getting started

Open `.env` file and add your APP_ID, APP_SECRET, SUMMARY_EMAIL. You can get APP_ID and APP_SECRET from [https://platform.symbl.ai](https://platform.symbl.ai)

Most of the heavy lifting is done in the `common` library which you can read about its plumbing [here](../../common/README.md).

## Creating a Tracker

Creating a Tracker is pretty straight-forward. We obtain some environment variables to help drive
executing this node.js application, but here are the steps:

1. Login
3. Create the Tracker

```
async function main() {
  /*
    Login and get token
  */
  var token = await common.Login();

  /*
    Create a Tracker
  */
  var trackerId = await management.Create(token);
  console.log("trackerId: " + trackerId);
}

main();
```