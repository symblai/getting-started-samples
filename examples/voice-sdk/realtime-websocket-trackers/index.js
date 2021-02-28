require('dotenv').config()

const {sdk} = require('symbl-node')
const uuid = require('uuid').v4

// For demo purposes, we're using mic to simply get audio from microphone and pass it on to websocket connection
const mic = require('mic')

const sampleRateHertz = 16000;


(async () => {
    const micInstance = mic({
        rate: sampleRateHertz,
        channels: '1',
        debug: false,
        exitOnSilence: 6,
    });
    try {
        // Initialize the SDK
        await sdk.init({
            appId: '__appId__',
            appSecret: '__appSecret__',
            basePath: 'https://api.symbl.ai',
        })

        // Need unique Id
        const id = uuid()

        // Start Real-time Request (Uses Realtime WebSocket API behind the scenes)
        const connection = await sdk.startRealtimeRequest({
            id,
            insightTypes: ['action_item', 'question'],
            trackers: [
                {
                    name: 'Denial',
                    vocabulary: [
                        'No thank you',
                        'Not interested',
                        'No thanks',
                    ]
                },
                {
                    name: 'Approval',
                    vocabulary: [
                        'Yes',
                        'Alright',
                        'Sounds good',
                    ]
                }
            ],
            config: {
                meetingTitle: 'My Test Meeting',
                confidenceThreshold: 0.7,
                timezoneOffset: 480, // Offset in minutes from UTC
                languageCode: 'en-US',
                trackers: {
                    interimResults: true
                },
                sampleRateHertz,
            },
            speaker: {
                // Optional, if not specified, will simply not send an email in the end.
                userId: 'validemail@gmail.com', // Update with valid email
                name: 'John Doe',
            },
            handlers: {
                onSpeechDetected: (data) => {
                    console.log(JSON.stringify(data))
                    // For live transcription
                    if (data) {
                        const {punctuated} = data
                        console.log('Live: ', punctuated && punctuated.transcript)
                    }
                },
                onMessageResponse: (data) => {
                    // When a processed message is available
                    console.log('onMessageResponse', JSON.stringify(data))
                },
                onInsightResponse: (data) => {
                    // When an insight is detected
                    console.log('onInsightResponse', JSON.stringify(data))
                },
                onTrackerResponse: (data) => {
                    console.log('onTrackerResponse:');
                    data.trackers.forEach(tracker => {
                        if (tracker.isFinal) {
                            console.info(`    Name: ${tracker.name}`);
                            tracker.matches.forEach(match => {
                                console.debug(`        id: ${tracker.id} | offset: ${tracker.offset} - ${tracker.text}`);
                            })
                        } else {
                            console.log('Interim Tracker: ', JSON.stringify(data, null, 2));
                        }
                    });
                },
            },
        });
        console.log('Successfully connected.')

        const micInputStream = micInstance.getAudioStream()
        micInputStream.on('data', (data) => {
            // Push audio from Microphone to websocket connection
            connection.sendAudio(data)
        })

        micInputStream.on('error', function (err) {
            cosole.log('Error in Input Stream: ' + err)
        })

        micInputStream.on('startComplete', function () {
            console.log('Started listening to Microphone.')
        })

        micInputStream.on('silence', function () {
            console.log('Got SIGNAL silence')
        })

        micInstance.start()

        setTimeout(async () => {
            // Stop listening to microphone
            micInstance.stop()
            console.log('Stopped listening to Microphone.')
            try {
                // Stop connection
                await connection.stop()
                console.log('Connection Stopped.')
            } catch (e) {
                console.error('Error while stopping the connection.', e)
            }
        }, 60 * 1000) // Stop connection after 1 minute i.e. 60 secs
    } catch (e) {
        console.error('Error: ', e)
    }
})()
