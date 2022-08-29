require('dotenv').config()
var common = require('./common.js');
const fetch = require('node-fetch');

exports.Topics = async function(token, conversationId) {
  return processIntelligence(token, "topics", conversationId);
}

exports.Questions = async function(token, conversationId) {
  return processIntelligence(token, "questions", conversationId);
}

exports.FollowUps = async function(token, conversationId) {
  return processIntelligence(token, "follow-ups", conversationId);
}

exports.Entities = async function(token, conversationId) {
  return processIntelligence(token, "entities", conversationId);
}

exports.ActionItems = async function(token, conversationId) {
  return processIntelligence(token, "action-items", conversationId);
}

exports.Messages = async function(token, conversationId) {
  return processIntelligence(token, "messages", conversationId);
}

exports.Summary = async function(token, conversationId) {
  return processIntelligence(token, "summary", conversationId);
}

exports.Analytics = async function(token, conversationId) {
  return processIntelligence(token, "analytics", conversationId);
}

exports.Trackers = async function(token, conversationId) {
  return processIntelligence(token, "trackers-detected", conversationId);
}

async function processIntelligence(token, api, conversationId) {
  // console.log("conversationId: " + conversationId);

  const header = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token,
    "Connection": "keep-alive",
  };

   var uri = `https://api.symbl.ai/v1/conversations/${conversationId}/${api}?parentRefs=true&sentiment=true`;
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
