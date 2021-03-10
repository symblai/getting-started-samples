Realtime WebSocket using Symbl Javascript SDK
============================

[![Streaming](https://img.shields.io/badge/symbl-realtime-brightgreen)](https://docs.symbl.ai/docs/streamingapi/overview/introduction)

Realtime WebSocket using Symbl Javascript SDK


Symbl's APIs empower developers to enable: 

- **Real-time** analysis of free-flowing discussions to automatically surface highly relevant summary discussion topics, contextual insights, suggestive action items, follow-ups, decisions, and questions.\
- **Voice APIs** that makes it easy to add AI-powered conversational intelligence to either [telephony][telephony] or [WebSocket][websocket] interfaces.
- **Conversation APIs** that provide a REST interface for managing and processing your conversation data.
- **Summary UI** with a fully customizable and editable reference experience that indexes a searchable transcript and shows generated actionable insights, topics, timecodes, and speaker information.

<hr />

# Realtime WebSocket using Symbl Javascript SDK

<hr />

 * [Setup](#setup)
 * [Integration](#integration)
 * [Conclusion](#conclusion)
 * [Community](#community)

## Setup 

You will find the core of the application in `index.js`.

The first step to getting setup is to [sign up][signup] and grab your `appId` and `appToken` from the Symbl Platform page. Replace lines 7 and 8 with those values. 


Install the Symbl Javascript SDK and other required Node modules:

```npm install```

## Integration 

Run the application using 

```node index.js```

If successful the application will start the connection to the Symbl API and begin recording using your devices microphone. Once you start speaking you should see some of the callback responses in the terminal.

## Community 

If you have any questions, feel free to reach out to us at devrelations@symbl.ai or through our [Community Slack][slack] or our [developer community][developer_community]. 

This guide is actively developed, and we love to hear from you! Please feel free to [create an issue][issues] or [open a pull request][github.com/symblai/connect-symbl-to-zoom-without-ui/pulls] with your questions, comments, suggestions and feedback. If you liked our integration guide, please star our repo!


This library is released under the [MIT License][license]

[license]: LICENSE.txt
[telephony]: https://docs.symbl.ai/docs/telephony/overview/post-api
[websocket]: https://docs.symbl.ai/docs/streamingapi/overview/introduction
[developer_community]: https://community.symbl.ai/?_ga=2.134156042.526040298.1609788827-1505817196.1609788827
[slack]: https://join.slack.com/t/symbldotai/shared_invite/zt-4sic2s11-D3x496pll8UHSJ89cm78CA
[signup]: https://platform.symbl.ai/?_ga=2.63499307.526040298.1609788827-1505817196.1609788827
[issues]: https://github.com/symblai/connect-symbl-to-zoom-without-ui/issues
[pulls]: https://github.com/connect-symbl-to-zoom-without-ui/pulls