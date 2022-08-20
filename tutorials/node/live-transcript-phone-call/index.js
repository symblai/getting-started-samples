const {sdk, SpeakerEvent} = require("symbl-node");

sdk.init({
    // Your appId and appSecret https://platform.symbl.ai
    appId: 'your_appId',
    appSecret: 'your_appSecret'
}).then(async () => {
    console.log('SDK initialized.');
    try {
        const connection = await sdk.startEndpoint({
            endpoint: {
                type: 'pstn', // when making a regular phone call
                // Replace this with a real phone number
                phoneNumber: '1XXXXXXXXXX' // include country code, example - 19998887777
            }
        });
        const {connectionId} = connection;
        console.log('Successfully connected. Connection Id: ', connectionId);

        // Subscribe to connection using connectionId.
        sdk.subscribeToConnection(connectionId, (data) => {
            const {type} = data;
            if (type === 'transcript_response') {
                const {payload} = data;

                // You get live transcription here!!
                process.stdout.write('Live: ' + payload && payload.content + '\r');

            } else if (type === 'message_response') {
                const {messages} = data;

                // You get processed messages in the transcript here!!! Real-time but not live! :)
                messages.forEach(message => {
                    process.stdout.write('Message: ' + message.payload.content + '\n');
                });
            } else if (type === 'insight_response') {
                const {insights} = data;
                // See <link here> for more details on Insights
                // You get any insights here!!!
                insights.forEach(insight => {
                    process.stdout.write(`Insight: ${insight.type} - ${insight.text} \n\n`);
                });
            }
        });

        // Stop call after 60 seconds to automatically.
        setTimeout(async () => {
            await sdk.stopEndpoint({connectionId});
            console.log('Stopped the connection');
            console.log('Conversation ID:', connection.conversationId);
        }, 60000); // Change the 60000 with higher value if you want this to continue for more time.
    } catch (e) {
        console.error(e);
    }
}).catch(err => console.error('Error in SDK initialization.', err));
