/*
 *  This example shows how to use languages other than English and also how to pass in `timezone` in which the conversation is taking place.
 *  For languages: Currently the following languages are supported
 *
 *  ['en-US', 'en-AU', 'en-GB', 'fr-CA', 'fr-FR', 'de-DE', 'it-IT', 'nl-NL', 'es-US', 'ja-JP']
 *
 *  The above are all BCP-47 standard language codes and currently ONLY 1 should be passed in the `languages` array as shown below.
 *  Support for detecting multiple languages in the same conversation will be added soon!
 *
 *  For timezone: Please refer to https://en.wikipedia.org/wiki/List_of_tz_database_time_zones for a list of timeZones.
 *
 *  You can also use `moment-timezone` package to obtain a list of timeZones like the following
 *  const timeZones = moment.tz.names()
 *
 *  NOTE: If `languages` is NOT passed in the `startEndpoint` call the API will fallback to 'en-US'.
 *        If `timezone` is NOT passed the API will fall back to 'UTC'.
 */
require('dotenv').config()
const {sdk, SpeakerEvent} = require('symbl-node')

const getScheduleEvent = (sdk, connectionId) => {
  return (eventType, user, time) => {
    setTimeout(() => {
      const speakerEvent = new SpeakerEvent({
        type: eventType,
        user,
      })
      speakerEvent.timestamp = new Date().toISOString()

      console.log(
        `Pushing event [${speakerEvent.timestamp}] ${speakerEvent.type} : ${speakerEvent.user.name}`,
      )

      sdk.pushEventOnConnection(connectionId, speakerEvent.toJSON(), (err) => {
        if (err) {
          console.error('Error during push event.', err)
        } else {
          console.log('Event pushed!')
        }
      })
    }, time * 1000)
  }
}

const users = {
  john: {
    userId: 'john@example.com',
    name: 'John',
  },
  mary: {
    userId: 'mary@example.com',
    name: 'Mary',
  },
  tim: {
    userId: 'tim@example.com',
    name: 'Tim',
  },
  jennifer: {
    userId: 'jennifer@example.com',
    name: 'Jennifer',
  },
}

;(async () => {
  try {
    // Initialize the SDK
    await sdk.init({
      appId: process.env.APP_ID,
      appSecret: process.env.APP_SECRET,
      basePath: 'https://api.symbl.ai',
    })

    const connection = await sdk.startEndpoint({
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
      languages: ['ja-JP'], // Can be any 1 of ['en-US', 'en-AU', 'en-GB', 'fr-CA', 'fr-FR', 'de-DE', 'it-IT', 'nl-NL', 'es-US', 'ja-JP']
      timezone: 'Asia/Tokyo', // List of timeZones: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones      timezone: 'Asia/Tokyo', // List of timeZones: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
      actions: [
        {
          invokeOn: 'stop',
          name: 'sendSummaryEmail',
          parameters: {
            emails: [process.env.SUMMARY_EMAIL],
          },
        },
      ],
      data: {
        session: {
          name: 'Ship-wide nanomachines, to the center.',
        },
      },
    })
    const connectionId = connection.connectionId
    console.log('Successfully connected.', connectionId)

    const scheduleEvent = getScheduleEvent(sdk, connectionId)

    setTimeout(() => {
      // This is just for interactive purposeas to show the elapsed time.

      scheduleEvent(SpeakerEvent.types.startedSpeaking, users.john, 0)
      scheduleEvent(SpeakerEvent.types.stoppedSpeaking, users.john, 4)

      scheduleEvent(SpeakerEvent.types.startedSpeaking, users.mary, 4)
      scheduleEvent(SpeakerEvent.types.stoppedSpeaking, users.mary, 9)

      // Scheduling stop endpoint call after 60 seconds
      setTimeout(() => {
        console.log('stopping connection ' + connection.connectionId)
        sdk
          .stopEndpoint({
            connectionId,
          })
          .then(() => {
            console.log('Stopped the connection')
          })
          .catch((err) =>
            console.error('Error while stopping the connection.', err),
          )
      }, 10000)
    }, 1000)
  } catch (err) {
    console.error('Error in SDK initialization.', err)
  }
})()
