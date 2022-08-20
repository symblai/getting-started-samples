#  Using the Management API

This is a simple main-style sample application using Symbl's Management API. This application will list all Trackers on the platform.

## Getting started

Open `.env` file and add your APP_ID, APP_SECRET, SUMMARY_EMAIL. You can get APP_ID and APP_SECRET from [https://platform.symbl.ai](https://platform.symbl.ai)

Most of the heavy lifting is done in the `common` library which you can read about its plumbing [here](../../common/README.md).

## Creating a Tracker

List all Trackers is pretty straight-forward. We obtain some environment variables to help drive
executing this node.js application, but here are the steps:

1. Login
3. List the Trackers

```
async function main() {
  /*
    Login and get token
  */
  var token = await common.Login();

  /*
    List Trackers
  */
  var trackers = await management.List(token);
  var output = JSON.parse(trackers);
  console.log(util.inspect(output, false, null, true));
}

main();
```