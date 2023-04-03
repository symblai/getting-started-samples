// Copyright 2022 Symbl.ai SDK contributors. All Rights Reserved.
// SPDX-License-Identifier: MIT

require('dotenv').config()
var common = require('./common.js');
const fetch = require('node-fetch');

exports.Topics = async function(token, conversationId, params) {
  return processIntelligence(token, "topics", conversationId, params);
}

exports.Questions = async function(token, conversationId, params) {
  return processIntelligence(token, "questions", conversationId, params);
}

exports.FollowUps = async function(token, conversationId, params) {
  return processIntelligence(token, "follow-ups", conversationId, params);
}

exports.Entities = async function(token, conversationId, params) {
  return processIntelligence(token, "entities", conversationId, params);
}

exports.ActionItems = async function(token, conversationId, params) {
  return processIntelligence(token, "action-items", conversationId, params);
}

exports.Messages = async function(token, conversationId, params) {
  return processIntelligence(token, "messages", conversationId, params);
}

exports.Summary = async function(token, conversationId, params) {
  return processIntelligence(token, "summary", conversationId, params);
}

exports.Analytics = async function(token, conversationId, params) {
  return processIntelligence(token, "analytics", conversationId, params);
}

exports.Trackers = async function(token, conversationId, params) {
  return processIntelligence(token, "trackers-detected", conversationId, params);
}

async function processIntelligence(token, api, conversationId, params) {
  // console.log("conversationId: " + conversationId);

  const header = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token,
    "Connection": "keep-alive",
  };

  if (params == "all") {
    params = "parentRefs=true&sentiment=true"
  }

   var uri = `https://api.symbl.ai/v1/conversations/${conversationId}/${api}?${params}`;
   if (params == "none" || params == "") {
      uri = `https://api.symbl.ai/v1/conversations/${conversationId}/${api}`
   }
   var response = await common.Query(uri, "GET", header,  null);
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
