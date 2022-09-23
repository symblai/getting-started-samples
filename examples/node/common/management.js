// Copyright 2022 Symbl.ai SDK contributors. All Rights Reserved.
// SPDX-License-Identifier: MIT

require('dotenv').config()
var common = require('./common.js');
const fetch = require('node-fetch');

exports.Create = async function(token) {
  const body = {
    'name': process.env.TRACKER_NAME,
    'vocabulary': [
      process.env.TRACKER_VALUE,
    ],
  };
  // console.log(body)
  var bodyStr = JSON.stringify(body)

  var response = await management(token, "POST", bodyStr);
  var trackers = JSON.parse(response);
  // console.log("trackers: " + trackers);

  return new Promise((resolve) => {
      resolve(trackers.tracker.id);
  });
}

exports.Delete = async function(token) {
  var response = await management(token, "DELETE", process.env.TRACKER_ID);
  var tracker = JSON.parse(response);
  // console.log("trackers: " + tracker);

  return new Promise((resolve) => {
    if (tracker.deleted) {
      resolve(tracker.id);
    } else {
      throw new Error(`${tracker.id} was not deleted.`);
    }
  });
}

exports.List = async function(token) {
  return management(token, "GET", null);
}

async function management(token, action, tracker) {
  // console.log("tracker: " + tracker);

  const header = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token,
    "Connection": "keep-alive",
  };

   var uri = `https://api.symbl.ai/v1/manage/tracker`;
   if (action == "DELETE") {
    uri += `/${tracker}`;

    // reset tracker
    tracker=null;
   } else if (action == "GET") {
    uri += `s`;
   }

   var response = await common.Query(uri, action, header, tracker);
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
