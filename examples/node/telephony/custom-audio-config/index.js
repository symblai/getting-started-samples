// Copyright 2022 Symbl.ai SDK contributors. All Rights Reserved.
// SPDX-License-Identifier: MIT

/*
 * This example shows how to pass in different Audio Codecs. The ones currently supported are
 *   OPUS:
 *     * Supported Sample Rates -- 16000Hz, 24000Hz, 48000Hz
 *     * Both CBR (Constant Bitrate) and VBR (Variable Bitrate) are supported
 *     * Support for in-band FEC
 *
 *   SPEEX:
 *     * Supported Sample Rates -- 16000Hz
 *     * VBR is not supported
 *
 *   LINEAR16:
 *     * Supported Sample Rates -- 44100Hz
 *
 *   MULAW:
 *     * Supported Sample Rates -- 8000Hz
 *
 *   NOTE: We recommend using OPUS as compared to other codecs because it provides the most flexibility in terms of
 *         audio transportation and also has packet retransmission mechanisms like FEC which work well especially
 *         in low-bandwidth scenarios.
 *
 *   If you have a requirement to use a codec not included in the ones above or have any other queries,
 *   please drop an e-mail to support@symbl.ai
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
    userId: 'John@example.com',
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
      actions: [
        {
          invokeOn: 'stop',
          name: 'sendSummaryEmail',
          parameters: {
            emails: ['vladimir.novick@symbl.ai'],
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
