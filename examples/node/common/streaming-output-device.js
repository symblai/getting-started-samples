// Copyright 2022 Symbl.ai SDK contributors. All Rights Reserved.
// SPDX-License-Identifier: MIT

require('dotenv').config()
const {sdk} = require('@symblai/symbl-js')
const AudioRecorder = require('node-audiorecorder')

const sampleRateHertz = 16000;

// For demo purposes, we're using mic to simply get audio from microphone and pass it on to websocket connection
const options = {
    program: 'rec',
    device: 'hw:0,1', // Device Id - 'hw:0,1' indicates first output device
    bits: 16,
    rate: sampleRateHertz,
    channels: '1',
    encoding: 'signed-integer',
    silence: 6,
    keepSilence: true
};

const recorder = new AudioRecorder(options, console);

exports.startCapturing = async function(config) {
    try {
        // Initialize the SDK
        await sdk.init({
            appId: process.env.APP_ID,
            appSecret: process.env.APP_SECRET,
            basePath: 'https://api.symbl.ai',
        })
            .then(() => console.log('SDK Initialized.'))
            .catch(err => console.error('Error in initialization.', err));

        // Start Real-time Request (Uses Realtime WebSocket API behind the scenes)
        const connection = await sdk.startRealtimeRequest(config);
        console.log('Successfully connected. Conversation ID: ', connection.conversationId);

        // get the mic
        const audioStream = recorder.start().stream();

        /**
         * Raw audio stream
         */
        audioStream.on('data', (data) => {
            // Push audio from Microphone to websocket connection
            // console.log("---------------------------")
            // console.log(util.inspect(data, false, null, true));
            // console.log("---------------------------")
            connection.sendAudio(data)
        })

        audioStream.on('error', function (err) {
            console.log('Error in Input Stream: ' + err)
        })

        audioStream.on('startComplete', function () {
            console.log('Started listening to Microphone.')
        })

        audioStream.on('silence', function () {
            console.log('Got SIGNAL silence')
        })


        setTimeout(async () => {
            // Stop listening to microphone
            recorder.stop()
            console.log('Stopped listening to output device.')
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
}
