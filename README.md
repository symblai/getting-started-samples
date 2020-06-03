# Getting Started - Samples
Few code samples to get you started quickly with Symbl APIs.

## List of Sample Codes
1. [PSTN Dial-in using Voice SDK](./examples/voice-sdk/telephony-speaker-events.js): Dial-in using phone number and optional DTMF code with Speaker Events pushed in real-time.
2. [Realtime WebSocket using Voice SDK](./examples/voice-sdk/realtime-websocket-single-stream.js): Connect directly using WebSocket API and push audio and get results in real-time. Including Live Transcript and Insights.

## Install
Clone this repo on your machine and perform npm install.
```bash
git clone https://github.com/symblai/getting-started-samples.git
cd getting-started-samples
npm install
```
Code samples in this repo use [dotenv](https://github.com/motdotla/dotenv) for configurations. Make copy of `.env.default` file as `.env`. 

```bash
cp .env.default .env
```

Update `APP_ID` and `APP_SECRET` with valid values. You can get them by logging into [Symbl Platform](https://platform.symbl.ai).
Update any additional configuration if required.

## Run
Make sure any required configuration is done within the code and/or `.env` file.

Every sample code has more instructions wherever applicable.

Once you've configured the above, simply run any sample code you would like to try for example: 
```bash
node ./examples/voice-sdk/telephony-speaker-events.js
```

## Testing for PSTN 

If you're dialing to a regular phone number then you will receive a call. If you've dialed into a meeting platform, you'll see another participant join the meeting. 
Begin speaking after you see new participant, the call will end and you'll receive an email with the generated insights if you have passed valid email Id in the code.

## References
Feel free to fork any of the projects here to use on your own and if you have any code improvements, make a pull request and the request will be reviewed by one of our admins.

For a sample reference implementation using Symbl, take a look at our [Platform](https://platform.symbl.ai).

If you have questions, bugs to report or feature suggestions, join our [Dev Community](https://community.symbl.ai).
