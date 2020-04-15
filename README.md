# Getting Started with the Voice SDK

This is a sample implementation of Symbl's Voice SDK using a PSTN connection. You can use this sample code to have Symbl join a voice call or a meeting platform and generate intelligent insights, without any training.

## Authentication

In order to use the SDK, you need a valid `appId` and `appSecret` which you can get by logging into [Symbl Platform](https://platform.symbl.ai)

## npm

Before running the code, install all the dependencies by running `npm install`

## Run

Make sure to configure the `phoneNumber`,`emails` and `dtmf` (if you're dialing into a meeting) parameters before running the code.

Once you've configured the above, run `node index.js`

## Test

If you're dialed into a mobile device, you will recive a call and if you've dialed into a meeting platform, you'll see another caller join the meeting. You can begin speaking and after 2 minutes, the call will end and you'll recieve an email with the generated insights.

## References
Feel free to fork any of the projects here to use on your own and if you have any code improvements, make a pull request and the request will be reviewed by one of our admins.

For a sample reference implentation using Symbl, take a look at our [Platform](https://platform.symbl.ai).

If you have questions, bugs to report or feature suggestions, join our [Dev Community](https://community.symbl.ai).
