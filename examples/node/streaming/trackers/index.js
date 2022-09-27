// Copyright 2022 Symbl.ai SDK contributors. All Rights Reserved.
// SPDX-License-Identifier: MIT

require('dotenv').config()
var common = require('../../common/common.js');
var streaming = require('../../common/streaming.js');

/*
  Get basic configuration
*/
config = common.GetConfigScaffolding();

/*
  1. Configure to receive topics
  2. Add input parameters for trackers
  3. When Symbl detects a topic, this callback will be called.
*/
// config.insightTypes = ['topic'];

config.trackers = [
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
];

/*
  When Symbl detects a tracker, this callback will be called.
*/
config.handlers.onTrackerResponse = (data) => {
  console.log('onTrackerResponse:');
  data.trackers.forEach(tracker=>{
      console.info(`    Name: ${tracker.name}`);
      tracker.matches.forEach(match=>{
        console.log(`Tracker Value: ${match.value}`);
        console.log(`Messages detected against this Tracker`);
        match.messageRefs.forEach((messageRef) => {
            console.log(`Message ID: ${messageRef.id}`);
            console.log(`Message text for which the match was detected: ${messageRef.text}`);
            console.log(`\n`);
        });
        console.log(`\n`);

        console.log(`Insights detected against this Tracker`);
        match.messageRefs.forEach((insightRef) => {
            console.log(`Insight ID: ${insightRef.id}`);
            console.log(`Insight text for which the match was detected: ${insightRef.text}`);
            console.log(`Insight Type: ${insightRef.type}`);
            console.log(`\n`);
        });
        console.log(`\n\n`);
      })
  });
};

/*
  Start real-time Topic gathering
*/
streaming.startCapturing(config);
