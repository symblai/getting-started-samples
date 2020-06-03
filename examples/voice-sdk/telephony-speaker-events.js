require('dotenv').config();

const {sdk, SpeakerEvent} = require("symbl-node");

const phoneNumber = undefined; // replace this with the phone number, or configure DEFAULT_PHONE_NUMBER in .env file.

sdk.init({
    appId: process.env.APP_ID,
    appSecret: process.env.APP_SECRET,
    basePath: "https://api.symbl.ai"
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
                ]
            }).then(connection => {
                const connectionId = connection.connectionId;
                console.log("Successfully connected.", connectionId);

                const speakerEvent = new SpeakerEvent({
                    type: SpeakerEvent.types.startedSpeaking,
                    user: {
                        userId: "john@example.com",
                        name: "John"
                    }
                });

                setTimeout(() => {
                    speakerEvent.timestamp = new Date().toISOString();
                    sdk.pushEventOnConnection(
                        connectionId,
                        speakerEvent.toJSON(),
                        err => {
                            if (err) {
                                console.error("Error during push event.", err);
                            } else {
                                console.log("Event pushed!");
                            }
                        }
                    );
                }, 1000);

                setTimeout(() => {
                    speakerEvent.type = SpeakerEvent.types.stoppedSpeaking;
                    speakerEvent.timestamp = new Date().toISOString();

                    sdk.pushEventOnConnection(
                        connectionId,
                        speakerEvent.toJSON(),
                        err => {
                            if (err) {
                                console.error("Error during push event.", err);
                            } else {
                                console.log("Event pushed!");
                            }
                        }
                    );
                }, 12000);

                // Scheduling stop endpoint call after 60 seconds
                setTimeout(() => {
                    sdk
                        .stopEndpoint({
                            connectionId: connection.connectionId
                        })
                        .then(() => {
                            console.log("Stopped the connection");
                            console.log("Summary Info:", connection.summaryInfo);
                            console.log("Conversation ID:", connection.conversationId);
                        })
                        .catch(err =>
                            console.error("Error while stopping the connection.", err)
                        );
                }, 10000);
            })
            .catch(err => console.error("Error while starting the connection", err));
    })
    .catch(err => console.error("Error in SDK initialization.", err));
