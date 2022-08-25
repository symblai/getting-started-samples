# Telephony - passing other than English languages and timezone

This example shows how to use languages other than English and also how to pass
in `timezone` in which the conversation is taking place. For languages:
Currently the following languages are supported

['en-US', 'en-AU', 'en-GB', 'fr-CA', 'fr-FR', 'de-DE', 'it-IT', 'nl-NL',
'es-US', 'ja-JP']

The above are all BCP-47 standard language codes and currently ONLY 1 should be
passed in the `languages` array as shown below. Support for detecting multiple
languages in the same conversation will be added soon!

For timezone: Please refer to
https://en.wikipedia.org/wiki/List_of_tz_database_time_zones for a list of
timeZones.

You can also use `moment-timezone` package to obtain a list of timeZones like
the following const timeZones = moment.tz.names()

NOTE: If `languages` is NOT passed in the `startEndpoint` call the API will
fallback to 'en-US'. If `timezone` is NOT passed the API will fall back to
'UTC'.

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

```js
await sdk.init({
  appId: process.env.APP_ID,
  appSecret: process.env.APP_SECRET,
  basePath: 'https://api.symbl.ai',
})
```

Now start your endpoint and provide `language` and `timezone` properties:

```js
const connection = await sdk.startEndpoint({
  ...config,
  languages: ['ja-JP'],
  timezone: 'Asia/Tokyo',
})
```
