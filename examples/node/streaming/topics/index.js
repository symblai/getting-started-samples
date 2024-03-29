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
  2. When Symbl detects a topic, this callback will be called.
*/
config.insightTypes = ['topic'];

config.handlers.onTopicResponse = (data) => {
  console.log('onTopicResponse', JSON.stringify(data, null, 2));
};

/*
  Start real-time Topic gathering
*/
streaming.startCapturing(config);
