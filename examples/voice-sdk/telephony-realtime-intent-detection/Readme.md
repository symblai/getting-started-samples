# Realtime Intent Detection with PSTN DialIn using Voice SDK

In this example let's walk through how to get live intent detection in a Telephone call.

## Getting started

Open `.env` file and add your APP_ID, APP_SECRET, SUMMARY_EMAIL. You can get
APP_ID and APP_SECRET from
[https://platform.symbl.ai](https://platform.symbl.ai)

we will use `symbl-node` package.

```javascript
require('dotenv').config()

const {sdk} = require('symbl-node')
```

Let's start by initialising `symbl-node` sdk

```js
await sdk.init({
  appId: process.env.APP_ID,
  appSecret: process.env.APP_SECRET,
  basePath: 'https://api.symbl.ai',
})
```

Now let's start our connection:

`const connection = await sdk.startEndpoint(endpointConfig)`

First of all let's provide phone number and endpoint type:

```javascript
      endpoint: {
        type: 'pstn',
        phoneNumber: process.env.DEFAULT_PHONE_NUMBER,
      },
```

In case you want to use `sip` connection, you can use `type: sip` and provide
SIP URI to dial-in to. This should be unique for an active call/meeting in your
system. You can also provide `dtmf` code if you have one. You can find this code
on meeting platform invite. You can leave it blank if not connecting to meeting
platform

```javascript
   dtmf: "<code>",
   type: 'sip',
   uri: 'sip:124@domain.com'
```

You can also pass custom `audioConfig`. If not provided, it uses PCMU with 800
sample rate. If you want to provide it, you can do it like so:

```js
audioConfig: {
  encoding: 'OPUS',
  sampleRate: 48000
},
```
### Intents
Symbl provides various intents which can be detected in realtime. 
* An `intent` can also have a `subIntent` which indicates additional metadata about the intent. 
For e.g. the `answering_machine` intent will have subIntents which can either be `answered_by_human` or `answered_by_machine`

* The `text` field in the `intent` returns the textual content at which the intent was finalised.

* The `score` field in the `intent` returns a confidence score for the detected intent.

* The `alternatives` is an array in the `intent` object which contains other possible intents detected if any, with their confidence `score` 

Refer to the below [section](#Getting the detected Intents in RealTime) for extracting the above structure from the response.

In order to detect intents for a conversation, you can specify the below configuration:

```js
intents: [
    {
        intent: 'answering_machine'
    },
    {
        intent: 'interested'
    },
    {
        intent: 'not_interested'
    },
    {
        intent: 'do_not_call'
    }
]
```

### Actions

You can specify different actions to happen during the call. We will define just
one:

```javascript
      actions: [
        {
          invokeOn: 'stop',
          name: 'sendSummaryEmail',
          parameters: {
            emails: [process.env.SUMMARY_EMAIL], // Add valid email addresses to received email
          },
        },
      ],
```

When our connection will be stopped, Symbl will send summary mail provided in
`.env` file

Let's also name our session by providing:

```js
data: {
  session: {
    name: 'My Awesome Meet',
  },
},
```

### Getting connection Id.

For subscribing to the data, we will need to use `connectionId` unique to each
active connection. to get it you can simply retrieve it from connection
response:

```js
const connectionId = connection.connectionId
```

### Getting the detected Intents in RealTime

In order to get real time intents, we need to subscribe to the connection. We can
do so by using

```js
sdk.subscribeToConnection(connectionId, (data) => {})
```

`data` has `type` field, so we will check for `intent_response`. 
In the nested object we will find the detected `intent` and it's metadata.

```js
if (data.type === 'intent_response') {
    const { intent: intentData } = data;

    switch (intentData.intent) {
        case "answering_machine":
            let { subIntent } = intentData;
            console.log(`SubIntent identified: ${subIntent} for 'answering_machine'`); // subIntents supported under 'answering_machine' are [answered_by_human, answered_by_machine]
        case "interested":
        case "not_interested":
        case "do_not_call":
            let { score, text, alternatives } = intentData;
            console.log(`Score: ${score}`); // Score of the detected intent
            console.log(`Text: ${text}`); // Text at which the intent was detected
            console.log(`Alternatives: ${alternatives}`); // These represent other complementing intents if any were detected
            break;
    }
}
```

As you can see with this data there is a wide array of implementations you can
do.
