# Getting Started - Samples

Symbl's APIs empower developers to enable: 
- **Real-time** analysis of free-flowing discussions to automatically surface highly relevant summary discussion topics, contextual insights, suggestive action items, follow-ups, decisions, and questions.
- **Voice APIs** that makes it easy to add AI-powered conversation intelligence to either [Telephony][telephony], [Streaming][streaming], or [Async][async] interfaces.
- **Conversation APIs** that provide a REST interface for managing and processing your conversation data.
- **Summary UI** with a fully customizable and editable reference experience that indexes a searchable transcript and shows generated actionable insights, topics, timecodes, and speaker information.

<hr />

## List of Sample Codes

### Real-time

- [Real-time Topics using WebSockets](./examples/node/realtime/topics)
  - Connect directly using Streaming API to push audio and get Topics discussed
    in real-time.
    [Read More](./examples/node/realtime/topics/Readme.md)
- [Real-time Trackers using WebSockets](./examples/node/realtime/trackers)
  - Connect directly using Streaming API to push audio and get Trackers discussed
    in real-time.
    [Read More](./examples/node/realtime/trackers/Readme.md)

### Telephony

- [Passing different Audio Codecs](./examples/node/telephony/custom-audio-config)
- [Realtime Output with PSTN Dialin using Voice SDK](./examples/node/telephony/realtime-insights-transcription)
  - Get the live transcription and insights events in a Telephone call.
    [Read More](./examples/node/telephony/realtime-insights-transcription/Readme.md)
- [Intent Detection with PSTN Dial-In using Voice SDK](./examples/node/telephony/realtime-intent-detection)
  - Get the intents, real-time in a Telephone call.
    [Read More](./examples/node/telephony/realtime-intent-detection/Readme.md)
- [PSTN Dial-in using Voice SDK](./examples/node/telephony/speaker-events)
  - Establishes a connection using a phone number through PSTN, to send speaker
    events, generate insights, and display a summary URL with the output. You
    can see how to initialize the Voice SDK, connect to the endpoint, push
    speaker events and get the summary URL.
    [Read More](./examples/node/telephony/speaker-events/Readme.md)

## Install

Clone this repo on your machine and perform npm install.

```bash
git clone https://github.com/symblai/getting-started-samples.git
cd getting-started-samples
npm install  # Alternatively, you can also use yarn
```

Code samples in this repo use [dotenv](https://github.com/motdotla/dotenv) for
configurations. Make copy of `.env.default` file as `.env`.

```bash
cp .env.default .env
```

Update `APP_ID`, `APP_SECRET`, and `SUMMARY_EMAIL` with valid values. You can
get them by logging into [Symbl Platform](https://platform.symbl.ai). Update
any additional configuration such as `DEFAULT_PHONE_NUMBER` may be required for
a particular sample to work properly.

## Run

Make sure your `.env` file is configured correctly.

Once you've configured the above, execute the `run-examples.sh` script.

```
Syntax: run-example.sh [API_TYPE] [PROJECT_NAME] <SDK_LANG>
API_TYPE: realtime or telephony

If PROJECT_NAME is missing, a list of available projects will be displayed on
screen based on the API_TYPE selected.

Currently, the only accepted value for SDK_LANG is node, but is a optional parameter.

To list examples for realtime projects, run:
run-example.sh realitime

To the realtime tracker example, run:
run-example.sh realitime tracker
```

## Testing for PSTN

If you're dialing to a regular phone number then you will receive a call. If
you've dialed into a meeting platform, you'll see another participant join the
meeting. Begin speaking after you see new participant, the call will end and
you'll receive an email with the generated insights if you have passed valid
email Id in the code.

## Community

If you have any questions, feel free to reach out to us at devrelations@symbl.ai or through our [Community Slack][slack] or our [forum][developer_community].

This guide is actively developed, and we love to hear from you! Please feel free to [create an issue][issues] or [open a pull request][pulls] with your questions, comments, suggestions and feedback.  If you liked our integration guide, please star our repo!

This library is released under the [MIT License][license]

[telephony]: https://docs.symbl.ai/docs/telephony/overview/post-api
[streaming]: https://docs.symbl.ai/reference/streaming-api-reference
[async]: https://docs.symbl.ai/reference/async-api-1
[developer_community]: https://community.symbl.ai/?_ga=2.134156042.526040298.1609788827-1505817196.1609788827
[slack]: https://join.slack.com/t/symbldotai/shared_invite/zt-4sic2s11-D3x496pll8UHSJ89cm78CA
[signup]: https://platform.symbl.ai/?_ga=2.63499307.526040298.1609788827-1505817196.1609788827
[issues]: https://github.com/symblai/getting-started-samples/issues
[pulls]: https://github.com/symblai/getting-started-samples/pulls
[license]: LICENSE
