const {sdk} = require('symbl-node');
const uuid = require('uuid').v4;

const mic = require('mic');

const micInstance = mic({
    rate: '16000',
    channels: '1',
    debug: false,
    exitOnSilence: 6,
});

const micInputStream = micInstance.getAudioStream();

const users = {
    John: {
        userId: '__your_valid_email__',
        name: 'John',
    },
};

const realtimeSessionId = uuid();
console.log(realtimeSessionId);

sdk.init({
    appId: '',
    appSecret: '',
    basePath: 'https://api.symbl.ai'
})
    .then(() => {
        console.log('SDK Initialized.');

        const sendAudioArray = [];

        Object.values(users).forEach(user => {
            sdk.startRealtimeRequest({
                id: realtimeSessionId,
                insightTypes: ['action_item'],
                trackers: [
                    {
                        name: 'Denial',
                        vocabulary: [
                            'No',
                            'never agreed to',
                            'not interested',
                        ],
                    },
                ],
                config: {
                    confidenceThreshold: 0.5,
                    timezoneOffset: 480,
                    languageCode: 'en-US',
                    sampleRateHertz: 16000,

                    //mode: 'speaker'
                },
                speaker: user,
                handlers: {
                    onSpeechDetected: data => {
                        console.log(
                            user.name,
                            'onSpeechDetected',
                            JSON.stringify(data)
                        );
                    },
                    onMessageResponse: data => {
                        console.log(
                            user.name,
                            'onMessageResponse',
                            JSON.stringify(data)
                        );
                    },
                    onInsightResponse: data => {
                        console.log(
                            user.name,
                            'onInsightResponse',
                            JSON.stringify(data)
                        );
                    },
                    onTrackerResponse: data => {
                        console.log(
                            user.name,
                            'onTrackerResponse',
                            JSON.stringify(data)
                        );
                    },
                },
            })
                .then(connection => {
                    console.log(
                        'Connection Started for speaker: ',
                        user,
                        connection.conversationId
                    );
                    sendAudioArray.push(connection.sendAudio);
                    setTimeout(() => {
                        micInstance.stop();
                        connection
                            .stop()
                            .then(conversationData => {
                                console.log(
                                    'Connection stopped for speaker:',
                                    user
                                );
                                console.log(
                                    'Conversation Data',
                                    conversationData
                                );
                                //process.exit();
                            })
                            .catch(console.error);
                    }, 60 * 1000);
                })
                .catch(console.error);
        });

        micInputStream.on('data', data => {
            sendAudioArray.forEach(sendAudio => sendAudio(data));
        });

        micInstance.start();
    })
    .catch(err => console.error('Error in initialization.', err));
