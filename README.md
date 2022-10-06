# Getting Started - Examples/Samples

Symbl's APIs empower developers to enable: 
- **Real-time** analysis of free-flowing discussions to automatically surface highly relevant summary discussion topics, contextual insights, suggestive action items, follow-ups, decisions, and questions.
- **Voice APIs** that makes it easy to add AI-powered conversation intelligence to either [Telephony][telephony], [Streaming][streaming], or [Async][async] interfaces.
- **Conversation APIs** that provide a REST interface for managing and processing your conversation data.
- **Summary UI** with a fully customizable and editable reference experience that indexes a searchable transcript and shows generated actionable insights, topics, timecodes, and speaker information.

<hr />

## List of Examples as Code

### Upload a Conversation using the Async APIs

The Async APIs allow individuals to obtain conversation intelligence on offline, pre-recorded conversations in an audio format (mp3, wav, etc). These examples demonstrate how to upload an audio or video files for processing.

- [Action-Items](./examples/node/async-upload/action-items)
- [Analytics](./examples/node/async-upload/analytics)
- [Entities](./examples/node/async-upload/entites)
- [Follow-Ups](./examples/node/async-upload/follow-ups)
- [Messages](./examples/node/async-upload/messages)
- [Questions](./examples/node/async-upload/questions)
- [Summary](./examples/node/async-upload/summary)
- [Topics](./examples/node/async-upload/topics)
- [Trackers](./examples/node/async-upload/trackers)

### Reference a URL using the Async APIs

- Action-Items: TODO
- Analytics: TODO
- Entities: TODO
- Follow-Ups: TODO
- Messages: TODO
- Questions: TODO
- Summary: TODO
- Topics: TODO
- Trackers: TODO
- Summary UI for Audio: TODO
- [Summary UI using a Video](./examples/node/async-url/summary-ui-video)

### Management (Tracker management)

The Management APIs allows individuals to create, list, delete Trackers that can be used
to highlight important or significant words, topics, etc in a given conversation.

- [Create a Tracker](./examples/node/management/create)
- [List all Trackers](./examples/node/management/list)
- [Delete a Tracker](./examples/node/management/delete)

### Real-time

These example applications use WebSockets in order to using the Streaming APIs
get real-time analysis on conversation for a variety of intelligence metrics. These
examples make use of the Microphone in order to demonstrate the real-time
analytics capabilities.

- [Topics](./examples/node/realtime/topics)
- [Trackers](./examples/node/realtime/trackers)
- [Questions](./examples/node/realtime/questions)
- [Action-Items](./examples/node/realtime/action-items)

### Telephony

These example applications the Telephony APIs to get real-time analysis on conversation
for a variety of intelligence metrics.

- [Passing different Audio Codecs](./examples/node/telephony/custom-audio-config)
- [Realtime Output with PSTN Dialin using Voice SDK](./examples/node/telephony/realtime-insights-transcription)
  - Get the live transcription and insights events in a Telephone call.
- [Intent Detection with PSTN Dial-In using Voice SDK](./examples/node/telephony/realtime-intent-detection)
  - Get the intents, real-time in a Telephone call.
- [PSTN Dial-in using Voice SDK](./examples/node/telephony/speaker-events)
  - Establishes a connection using a phone number through PSTN, to send speaker
    events, generate insights, and display a summary URL with the output. You
    can see how to initialize the Voice SDK, connect to the endpoint, push
    speaker events and get the summary URL.

> **_NOTE:_** Validation on the `Telephony` examples are still pending. If you notice an issue, drop us a line!

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

Update `APP_ID`, `APP_SECRET`, and `SUMMARY_EMAIL` with valid values. You are
going to new a Symbl account. If you don't have one, you can [sign up here][symbl_signup]
for a free account which will allow you to process 1,000 minutes of conversation each month.
Update any additional configuration such as `DEFAULT_PHONE_NUMBER` may be required for
a particular sample to work properly.

## Run

Make sure your `.env` file is configured correctly.

Once you've configured the above, execute the `run-examples.sh` script.

```
Syntax: <SDK_LANG=lang> run-example.sh [API_TYPE] <PROJECT_NAME> <PARAM=VALUE>
 
Required Parameters:
- API_TYPE (required): async-upload, realtime or telephony
 
Optional parameters:
- PROJECT_NAME (optional): if missing, will provide a list of projects
- SDK_LANG (optional): environment variable to select the language
- <PARAM=VALUE> (optional): some action require user input
 
Examples:
To list examples for streaming projects, run:
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
[symbl_signup]: https://platform.symbl.ai/signup?utm_source=symbl&utm_medium=blog&utm_campaign=devrel&_ga=2.226597914.683175584.1662998385-1953371422.1659457591&_gl=1*mm3foy*_ga*MTk1MzM3MTQyMi4xNjU5NDU3NTkx*_ga_FN4MP7CES4*MTY2MzEwNDQyNi44Mi4xLjE2NjMxMDQ0MzcuMC4wLjA.
