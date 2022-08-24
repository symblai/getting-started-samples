# How to pass different audio codecs

Sometimes you need to pass different audio codecs when passing the audio. This
example shows how to pass them. The ones currently supported are

    [OPUS](https://opus-codec.org/):
      - Supported Sample Rates -- 16000Hz, 24000Hz,48000Hz
      - Both CBR (Constant Bitrate) and VBR (Variable Bitrate) are supported
      - Support for in-band FEC

      [SPEEX](https://www.speex.org/):
        - Supported Sample Rates -- 16000Hz
        - VBR is not supported

      [LINEAR16](https://tools.ietf.org/html/rfc2586)
        - Supported Sample Rates -- 44100Hz

      [MULAW](https://en.wikipedia.org/wiki/G.711#%CE%BC-law)
        - Supported Sample Rates -- 8000Hz

> NOTE: We recommend using OPUS as compared to other codecs because it provides
> the most flexibility in terms of audio transportation and also has packet
> retransmission mechanisms like FEC which work well especially in low-bandwidth
> scenarios.

## Getting started

Open `.env` file and add your APP_ID, APP_SECRET, SUMMARY_EMAIL. You can get
APP_ID and APP_SECRET from
[https://platform.symbl.ai](https://platform.symbl.ai)

We will use `symbl-node` package.

```javascript
require('dotenv').config()

const {sdk} = require('symbl-node')
```

Let's start by initialising `symbl-node` sdk

```javascript
await sdk.init({
  appId: process.env.APP_ID,
  appSecret: process.env.APP_SECRET,
  basePath: 'https://api.symbl.ai',
})
```

Now after we initialised, we need to start the connection by running

```javascript
const connection = await sdk.startEndpoint(endpointConfig)
```

So how do you pass custom codecs? It's as simple as passing custom audio config

```javascript
          endpoint: {
            //*****************Custom Audio Config******************
            audioConfig: {
              encoding: 'OPUS',
              sampleRate: 16000,
            },
            //******************************************************
            type: 'pstn',
            phoneNumber: process.env.DEFAULT_PHONE_NUMBER,
          },
```

If you have a requirement to use a codec not included in the ones above or have
any other queries, please drop an e-mail to support@symbl.ai
