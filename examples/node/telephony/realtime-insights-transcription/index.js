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
}

;(async () => {
  try {
    // Initialize the SDK
    await sdk.init({
      appId: process.env.APP_ID,
      appSecret: process.env.APP_SECRET,
      basePath: 'https://api.symbl.ai',
    })

    console.log('SDK Initialized')

    const connection = await sdk.startEndpoint({
      endpoint: {
        type: 'pstn',
        phoneNumber: process.env.DEFAULT_PHONE_NUMBER,
      },
      insightTypes: ['action_item', 'question'],
      actions: [
        {
          invokeOn: 'stop',
          name: 'sendSummaryEmail',
          parameters: {
            emails: [process.env.SUMMARY_EMAIL], // Add valid email addresses to received email
          },
        },
      ],
      data: {
        session: {
          name: 'My Test Meeting',
        },
      },
    })

    const connectionId = connection.connectionId
    console.log('Successfully connected. Connection ID: ', connectionId)
    const scheduleEvent = getScheduleEvent(sdk, connectionId)

    setTimeout(() => {
      // Schedule all the events to be sent.
      scheduleEvent(SpeakerEvent.types.startedSpeaking, users.john, 0)
      scheduleEvent(SpeakerEvent.types.stoppedSpeaking, users.john, 5)

      scheduleEvent(SpeakerEvent.types.startedSpeaking, users.mary, 5)
      scheduleEvent(SpeakerEvent.types.stoppedSpeaking, users.mary, 15)

      scheduleEvent(SpeakerEvent.types.startedSpeaking, users.john, 15)
      scheduleEvent(SpeakerEvent.types.stoppedSpeaking, users.john, 45)

      scheduleEvent(SpeakerEvent.types.startedSpeaking, users.mary, 45)
      scheduleEvent(SpeakerEvent.types.stoppedSpeaking, users.mary, 60)
    }, 1000)

    console.log('Subscribing to the live events on the connection.')
    // Subscribe to connection using connectionId.
    // Multiple subscriptions to same connectionId are allowed. It can be useful to get the updates at multiple clients.
    sdk.subscribeToConnection(connectionId, (data) => {
      // console.log(data);
      const {type} = data
      if (type === 'transcript_response') {
        const {payload} = data
        process.stdout.write('Live: ' + payload && payload.content + '\r')
        // console.log('Live: ',payload && payload.content);
      } else if (type === 'message_response') {
        const {messages} = data
        messages.forEach((message) => {
          process.stdout.write('Message: ' + message.payload.content + '\n')
        })
      } else if (type === 'insight_response') {
        const {insights} = data
        insights.forEach((insight) => {
          process.stdout.write(
            `Insight: ${insight.type} - ${insight.text} \n\n`,
          )
        })
      }
    })

    // Scheduling stop endpoint call after 60 seconds
    setTimeout(async () => {
      console.log('Stopping the connection')
      try {
        await sdk.stopEndpoint({
          connectionId: connection.connectionId,
        })
        console.log('Connection stopped.')
        console.log('Summary Info:', connection.summaryInfo)
        console.log('Conversation ID:', connection.conversationId)
      } catch (err) {}
    }, 62 * 1000)
  } catch (e) {}
})()
