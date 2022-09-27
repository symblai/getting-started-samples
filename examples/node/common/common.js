// Copyright 2022 Symbl.ai SDK contributors. All Rights Reserved.
// SPDX-License-Identifier: MIT

require('dotenv').config()
const fetch = require('node-fetch');
const uuid = require('uuid').v4
// const util = require('util')

const sampleRateHertz = 16000

/*
  Simple Login that returns an AccessToken
*/
exports.Login = async function() {
  const body = {
    'type': 'application',
    'appId': process.env.APP_ID,
    'appSecret': process.env.APP_SECRET,
  };
  var bodyStr = JSON.stringify(body);

  const header = {
    'Content-Type': 'application/json',
  };

  var response = await exports.Query("https://api.symbl.ai/oauth2/token:generate", "POST", header,  bodyStr);
  var text = await response.text();
  // console.log(util.inspect(response, false, null, true));
  // console.log("reason: " + text);

  return new Promise((resolve) => {
    if (response.status == 200 || response.status == 201) {
      resolve(JSON.parse(text).accessToken);
    } else {
      throw new Error(`${response.status}: ${text}`);
    }
  });
}

/*
  Get the common configuration used for the Streaming API
*/
exports.GetConfigScaffolding = function() {
  // Need unique Id
  const id = uuid()

  var scaffold = {
    id,
    config: {
      meetingTitle: 'My Test Meeting',
      confidenceThreshold: 0.7,
      timezoneOffset: 480, // Offset in minutes from UTC
      languageCode: 'en-US',
      sampleRateHertz,
    },
    speaker: {
      // Optional, if not specified, will simply not send an email in the end.
      userId: process.env.SUMMARY_EMAIL,
      name: 'John Doe',
    },
    handlers: {
      /**
       * This will return live speech-to-text transcription of the call.
       */
      onSpeechDetected: (data) => {
        console.log(JSON.stringify(data))
        // For live transcription
        if (data) {
          const {punctuated} = data
          console.log('Live: ', punctuated && punctuated.transcript)
          console.log('');
        }
        console.log('onSpeechDetected ', JSON.stringify(data, null, 2));
      },
      /**
       * When processed messages are available, this callback will be called.
       */
      onMessageResponse: (data) => {
        // When a processed message is available
        console.log('onMessageResponse', JSON.stringify(data, null, 2))
      },
      /**
       * When Symbl detects an insight, this callback will be called.
       */
      onInsightResponse: (data) => {
        // When an insight is detected
        console.log('onInsightResponse', JSON.stringify(data, null, 2))
      },
    }
  }

  return scaffold
}

/*
  Simple Query helper function
*/
exports.Query = async function(uri, action, header, body) {
  var options = {
      method: action,
      body: body,
      headers: header,
  };

  let response = await fetch(uri, options);

  // var text = await response.text();
  // console.log(util.inspect(response, false, null, true));
  // console.log("reason: " + text);

  return response;
}

/*
 Implements a sleep function
*/
exports.Sleep = function(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/*
  Implements a wait for job completion function 
*/
exports.Wait = async function(token, jobId) {
   //console.log("jobId: " + jobId);
 
   const header = {
     "Content-Type": "application/json",
     "Authorization": "Bearer " + token,
     "Connection": "keep-alive",
   };

   var response;
   var text;
   var count = 0;
   while (true) {
    var uri = `https://api.symbl.ai/v1/job/${jobId}`;
    response = await this.Query(uri, "GET", header,  null);
    text = await response.text();
    // console.log("response: " + response);
    // console.log("reason: " + text);

    if (response.status == 200 || response.status == 201) {
      result = JSON.parse(text);
      if (result.status != "in_progress") {
        break;
      }
    } else {
      break;
    }

    ++count;
    if (count > 30) {
      break;
    }
    await this.Sleep(5000);
  }
 
   return new Promise((resolve) => {
     if (response.status == 200 || response.status == 201) {
       resolve(text);
     } else {
      throw new Error(`${response.status}: ${text}`);
     }
   });
}
