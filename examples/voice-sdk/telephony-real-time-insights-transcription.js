require('dotenv').config();

const {sdk, SpeakerEvent} = require("symbl-node");

const phoneNumber = undefined; // replace this with the phone number, or configure DEFAULT_PHONE_NUMBER in .env file.

const getScheduleEvent = (sdk, connectionId) => {
    return (eventType, user, time) => {
        setTimeout(() => {
            const speakerEvent = new SpeakerEvent({
                type: eventType,
                user
            });
            speakerEvent.timestamp = new Date().toISOString();

            console.log(`Pushing event [${speakerEvent.timestamp}] ${speakerEvent.type} : ${speakerEvent.user.name}`);

            sdk.pushEventOnConnection(connectionId, speakerEvent.toJSON(), (err) => {
                if (err) {
                    console.error('Error during push event.', err);
                } else {
                    console.log('Event pushed!');
                }
            });
        }, time * 1000);
    };
};

const users = {
    "john": {
        userId: 'john@example.com',
        name: 'John'
    },
    "mary": {
        userId: 'mary@example.com',
        name: 'Mary'
    }
};

sdk.init({
    appId: process.env.APP_ID,
    appSecret: process.env.APP_SECRET,
    basePath: 'https://api.symbl.ai'
}).then(() => {
        console.log("SDK Initialized");

        sdk.startEndpoint({
                endpoint: {
                    // type: 'sip',         // Use this if you're trying to dial in to a SIP trunk.
                    // uri: 'sip:username@domain.com',
                    type: "pstn",
                    phoneNumber: phoneNumber || process.env.DEFAULT_PHONE_NUMBER,
                    dtmf: "<code>" // you can find this on the meeting platform invite. Leave blank if not connecting to a meeting platform
                },
                actions: [
                    {
                        invokeOn: "stop",
                        name: "sendSummaryEmail",
                        parameters: {
                            emails: ["your_email@example.com"] // Add valid email addresses to received email
                        }
                    }
                ],
                data: {
                    session: {
                        name: 'My Test Meeting'
                    }
                }
            }).then(connection => {
                const connectionId = connection.connectionId;
                console.log("Successfully connected. Connection ID: ", connectionId);
            const scheduleEvent = getScheduleEvent(sdk, connectionId);

            setTimeout(() => {
                // Schedule all the events to be sent.
                scheduleEvent(SpeakerEvent.types.startedSpeaking, users.john, 0);
                scheduleEvent(SpeakerEvent.types.stoppedSpeaking, users.john, 5);

                scheduleEvent(SpeakerEvent.types.startedSpeaking, users.mary, 5);
                scheduleEvent(SpeakerEvent.types.stoppedSpeaking, users.mary, 15);

                scheduleEvent(SpeakerEvent.types.startedSpeaking, users.john, 15);
                scheduleEvent(SpeakerEvent.types.stoppedSpeaking, users.john, 45);

                scheduleEvent(SpeakerEvent.types.startedSpeaking, users.mary, 45);
                scheduleEvent(SpeakerEvent.types.stoppedSpeaking, users.mary, 60);
            }, 1000);

                console.log('Subscribing to the live events on the connection.');
                // Subscribe to connection using connectionId.
                // Multiple subscriptions to same connectionId are allowed. It can be useful to get the updates at multiple clients.
                sdk.subscribeToConnection(connectionId, (data) => {
                    // console.log(data);
                    const {type} = data;
                    if (type === 'transcript_response') {
                        const {payload} = data;
                        process.stdout.write('Live: ' + payload && payload.content + '\r');
                        // console.log('Live: ',payload && payload.content);
                    } else if (type === 'message_response') {
                        const {messages} = data;
                        messages.forEach(message => {
                            process.stdout.write('Message: ' + message.payload.content + '\n');
                        });
                    } else if (type === 'insight_response') {
                        const {insights} = data;
                        insights.forEach(insight => {
                            process.stdout.write(`Insight: ${insight.type} - ${insight.text} \n\n`);
                        });
                    }
                });


                // Scheduling stop endpoint call after 60 seconds
                setTimeout(() => {
                    console.log('Stopping the connection');
                    sdk.stopEndpoint({
                            connectionId: connection.connectionId
                        })
                        .then(() => {
                            console.log("Connection stopped.");
                            console.log("Summary Info:", connection.summaryInfo);
                            console.log("Conversation ID:", connection.conversationId);
                        })
                        .catch(err =>
                            console.error("Error while stopping the connection.", err)
                        );
                }, 62 * 1000); // Stop after 1 minute
            })
            .catch(err => console.error("Error while starting the connection", err));
    })
    .catch(err => console.error("Error in SDK initialization.", err));
