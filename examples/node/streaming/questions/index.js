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
  1. Configure to receive question
  2. When Symbl detects a question, the event will be triggered onInsightResponse. This can be overwritten.
*/
config.insightTypes = ['question'];

config.handlers.onInsightResponse = (data) => {
  // When an insight is detected
  console.log('onQuestionResponse', JSON.stringify(data, null, 2))
};

/*
  Start real-time Topic gathering
*/
streaming.startCapturing(config);
