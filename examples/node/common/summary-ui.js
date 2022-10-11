// Copyright 2022 Symbl.ai SDK contributors. All Rights Reserved.
// SPDX-License-Identifier: MIT

require('dotenv').config()
var common = require('./common.js');
const fetch = require('node-fetch');

exports.SummaryAudioUI = async function(token, url, conversationId) {
  return this.SummaryVideoUI(token, url, conversationId)
}

exports.SummaryVideoUI = async function(token, url, conversationId) {
  // console.log("conversationId: " + conversationId);

  const header = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token,
    "Connection": "keep-alive",
  };

  const data = {
    "name": "video-summary",
    "videoUrl": url,
    "summaryURLExpiresIn": 0
  };
  var dataStr = JSON.stringify(data);

   var uri = `https://api.symbl.ai/v1/conversations/${conversationId}/experiences`;
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
