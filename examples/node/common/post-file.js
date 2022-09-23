// Copyright 2022 Symbl.ai SDK contributors. All Rights Reserved.
// SPDX-License-Identifier: MIT

require('dotenv').config()
var common = require('./common.js');
const fetch = require('node-fetch');
var fs = require('fs');

exports.Post = async function(token, filename) {
  console.log(`audio: ${filename}\n`);

  var status = await upload(token, filename);
  var results = JSON.parse(status);
  // console.log("conversationId: " + results.conversationId);
  // console.log("jobId: " + results.jobId);

  var status = await wait(token, results.jobId);
  // console.log("status: " + status)
  console.log(results);
  console.log("\n");

  return results;
}

async function upload(token, filename) {
  // console.log("token: " + token);
  // console.log("filename: " + filename);

  const stats = fs.statSync(filename);
  const fileSizeInBytes = stats.size;
  // console.log("file size: " + fileSizeInBytes);

  const header = {
    "Content-Type": "audio/mpeg",
    "Authorization": "Bearer " + token,
    "Connection": "keep-alive",
  };

  let readStream = fs.createReadStream(filename);

  var uri = `https://api.symbl.ai/v1/process/audio?name=${filename}&languageCode=en-US`;
  var response = await common.Query(uri, "POST", header,  readStream);
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

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function wait(token, jobId) {
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
    response = await common.Query(uri, "GET", header,  null);
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
    await sleep(5000);
  }
 
   return new Promise((resolve) => {
     if (response.status == 200 || response.status == 201) {
       resolve(text);
     } else {
      throw new Error(`${response.status}: ${text}`);
     }
   });
}
