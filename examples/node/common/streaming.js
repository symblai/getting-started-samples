// Copyright 2022 Symbl.ai SDK contributors. All Rights Reserved.
// SPDX-License-Identifier: MIT

require('dotenv').config()
const util = require('util')

const {sdk} = require('@symblai/symbl-js')
const mic = require('mic')

const sampleRateHertz = 16000

// For demo purposes, we're using mic to simply get audio from microphone and pass it on to websocket connection
const micInstance = mic({
  rate: sampleRateHertz,
  channels: '1',
  debug: false,
  exitOnSilence: 6,
});

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
    const micInputStream = micInstance.getAudioStream()

    /**
     * Raw audio stream
     */
    micInputStream.on('data', (data) => {
      // Push audio from Microphone to websocket connection
      // console.log("---------------------------")
      // console.log(util.inspect(data, false, null, true));
      // console.log("---------------------------")
      connection.sendAudio(data)
    })

    micInputStream.on('error', function (err) {
      console.log('Error in Input Stream: ' + err)
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
    return connection;
  } catch (e) {
    console.error('Error: ', e)
  }
}
