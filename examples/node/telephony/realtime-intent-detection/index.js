require('dotenv').config();

const {sdk} = require('symbl-node');

const phoneNumber = process.env.DEFAULT_PHONE_NUMBER; // replace this with the phone number, or configure DEFAULT_PHONE_NUMBER in .env file.

sdk.init({
    appId: process.env.APP_ID,
    appSecret: process.env.APP_SECRET,
    basePath: process.env.BASE_PATH
}).then(() => {
    sdk.startEndpoint({
        endpoint: {
            type: "pstn",
            phoneNumber: phoneNumber,
            // dtmf: "<code>" // you can find this on the meeting platform invite. Leave blank if not connecting to a meeting platform
            // audioConfig: {
            //     encoding: 'OPUS',
            //     sampleRate: 48000
            // },
            // type: 'sip',
            // uri: 'sip:124@domain.com'
        },
        intents: [{
            intent: 'answering_machine'
        },{
            intent: 'interested'
        },{
            intent: 'not_interested'
        },{
            intent: 'do_not_call'
        }],
        actions: [{
            "invokeOn": "stop",
            "name": "sendSummaryEmail",
            "parameters": {
                "emails": [
                    "john@symbl.ai"
                ]
            }
        }],
        data: {
            session: {
                name: 'My Awesome Meet',
                users: [{
                    user: {
                        name: 'John',
                        userId: 'john@symbl.ai',
                        role: 'organizer'
                    }
                }]
            }
        }
    }).then(connection => {
        const connectionId = connection.connectionId;
        console.log('Successfully connected:', connectionId);

        // The function `subscribeToConnection` provides the live events as it receives them to the callback function passed
        sdk.subscribeToConnection(connectionId, (data) => {
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
            } else if (data.type === 'transcript_response') {
                const { payload: { content }, isFinal } = data;
                // isFinal: false represents an on going iteration for the speech being transcribed.
                // isFinal: true represents final iteration the transcribed sentence processed util now.
                console.log(`Transcription: ${content}, isFinal: ${isFinal}`);
            } else if (data.type === 'insight_response') {
                const { insights } = data;
                insights.forEach(insight => {
                    const { type, text, confidence, from } = insight;
                    console.log(`Insight Type: ${type}`); // Insight Type can be one of [action_item, question]
                    console.log(`Text: ${text}`); // Textual the part of transcript detected as an insight
                    console.log(`Insight Score: ${confidence}`); // The confidence score for this insight
                    console.log(`From:`, from); // The detected user who spoke this insight if any
                });
            }
        });

        setTimeout(() => {

            // Scheduling stop endpoint call after 30 seconds
            setTimeout(() => {
                console.log('Stopping connection ' + connection.connectionId);
                sdk.stopEndpoint({
                    connectionId
                }).then(() => {
                    console.log('Stopped the connection');
                }).catch(err => console.error('Error while stopping the connection:', err));
            }, 30000);
        }, 1000);

    }).catch(err => console.error('Error while starting the connection', err));

}).catch(err => console.error('Error in SDK initialization.', err));
