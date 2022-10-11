// Copyright 2022 Symbl.ai SDK contributors. All Rights Reserved.
// SPDX-License-Identifier: MIT

require('dotenv').config()
var common = require('./common.js');
const fetch = require('node-fetch');
var fs = require('fs');

exports.PostAudioURL = async function(token, url) {
  return this.PostVideoURL(token, url)
}

exports.PostVideoURL = async function(token, url) {
  console.log(`audio/video: ${url}\n`);

  var status = await sendURL(token, url);
  var results = JSON.parse(status);
  // console.log("conversationId: " + results.conversationId);
  // console.log("jobId: " + results.jobId);

  var status = await common.Wait(token, results.jobId);
  // console.log("status: " + status)
  console.log(results);
  console.log("\n");

  return results;
}

async function sendURL(token, url) {
  // console.log(`video: ${url}`);
  // console.log(`token: ${token}`);

  const header = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token,
    "Connection": "keep-alive",
  };

  const data = {
    "name": "my-conversation",
    "url": url,
  }
  var dataStr = JSON.stringify(data);

  var uri = `https://api.symbl.ai/v1/process/audio/url`
  if (url.includes("mp4")) {
    uri = `https://api.symbl.ai/v1/process/video/url`;
  }

  var response = await common.Query(uri, "POST", header,  dataStr);
  var text = await response.text();
  // console.log("response: " + response);
  // console.log("reason: " + text);

  return new Promise((resolve) => {
    if (response.status == 200 || response.status == 201) {
      resolve(text);
    } else {
      throw new Error(`${response.status}: ${text}`);
    }
  });
}
