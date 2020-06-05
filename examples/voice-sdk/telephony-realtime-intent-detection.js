/*
 * Note: This Sample Code doesn't work with https://api.symbl.ai. If you have a requirement that needs this functionality, please contact us at support@symbl.ai
 */
require('dotenv').config();
const {sdk} = require('symbl-node');

const phoneNumber = undefined; // replace this with the phone number, or configure DEFAULT_PHONE_NUMBER in .env file.

const stop = (sdk, connection) => {
    console.log('Stopping connection ' + connection.connectionId);
    sdk.stopEndpoint({
        connectionId: connection.connectionId
    }).then(() => {
        console.log('Stopped the connection');
    }).catch(err => console.error('Error while stopping the connection:', err));
};

let _connection = undefined;

sdk.init({
    appId: process.env.APP_ID,
    appSecret: process.env.APP_SECRET,
    basePath: 'https://cpl-media.symbl.ai' // Intent detection is not available as part of regular API offering. You'll need a custom URL from Symbl to be able to use this.
}).then(() => {
    sdk.startEndpoint({
        endpoint: {
            type: "pstn",
            phoneNumber: phoneNumber|| process.env.DEFAULT_PHONE_NUMBER,
            // dtmf: "<code>" // you can find this on the meeting platform invite. Leave blank if not connecting to a meeting platform
            // audioConfig: {
            //     encoding: 'OPUS',
            //     sampleRate: 48000
            // },
            // type: 'sip',
            // uri: 'sip:124@domain.com' // Your SIP URI to dial-in to. This should be unique for an active call/meeting in your system.
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
                    "toshish@symbl.ai"
                ]
            }
        }],
        data: {
            session: {
                name: 'My Awesome Call',
                users: [{
                    user: {
                        name: 'Toshish',
                        userId: 'toshish@symbl.ai',
                        role: 'organizer'
                    }
                }]
            }
        }
    }, (data) => {
        const timestamp = new Date().toISOString();
        // Received data from subscribed connection
        if (data.type === 'intent_response') {
            const { intent: intentData } = data;

            switch (intentData.intent) {
                case "answering_machine":
                    let { subIntent } = intentData;
                    console.log(`\n ${timestamp} SubIntent identified: '${subIntent}' for 'answering_machine' \n`); // subIntents supported under 'answering_machine' are [answered_by_human, answered_by_machine]
                    if (subIntent === 'answered_by_machine') {
                        stop(sdk, _connection);
                    } else if (subIntent === 'answered_by_human') {
                        console.log(timestamp, `Continuing with call.`); // subIntents supported under 'answering_machine' are [answered_by_human, answered_by_machine]
                    }
                    break;
                case "interested":
                case "not_interested":
                case "do_not_call":
                    let { score, text, alternatives } = intentData;
                    console.log(timestamp, `\nIntent Detected: ${intentData.intent},  Score: ${score}\n`); // Score of the detected intent
                    // console.log(timestamp, `Text: ${text}`); // Text at which the intent was detected
                    // console.log(timestamp, `Alternatives: ${alternatives}`); // These represent other complementing intents if any were detected
                    break;
            }
        } else if (data.type === 'transcript_response') {
            const { payload: { content } } = data;
            // isFinal: false represents an on going iteration for the speech being transcribed.
            // isFinal: true represents final iteration the transcribed sentence processed util now.
            console.log(timestamp, `Transcription: ${content}`);
        } else if (data.type === 'insight_response') {
            const { insights } = data;
            insights.forEach(insight => {
                const { type, text, confidence, from } = insight;
                console.log(timestamp, `Insight Type: ${type}, Text: ${text}`); // Insight Type can be one of [action_item, question]
                // console.log(timestamp, `Insight Score: ${confidence}`); // The confidence score for this insight
                // console.log(timestamp, `From:`, from); // The detected user who spoke this insight if any
            });
        }
    }).then(connection => {
        _connection = connection;
        const connectionId = connection.connectionId;
        console.log('Connected. Connection Id:', connectionId);
            // Scheduling stop endpoint call after 30 seconds
            setTimeout(() => {
                stop(sdk, connection)
            }, 30000);

    }).catch(err => console.error('Error while starting the connection', err));

}).catch(err => console.error('Error in SDK initialization.', err));
