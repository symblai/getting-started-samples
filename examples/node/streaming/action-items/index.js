require('dotenv').config()
var common = require('../../common/common.js');
var streaming = require('../../common/streaming.js');

/*
  Get basic configuration
*/
config = common.GetConfigScaffolding();

/*
  1. Configure to receive action items
  2. When Symbl detects a action items, the event will be triggered onInsightResponse. This can be overwritten.
*/
config.insightTypes = ['action_item'];

config.handlers.onInsightResponse = (data) => {
  // When an insight is detected
  console.log('onActionItemResponse', JSON.stringify(data, null, 2))
};

/*
  Start real-time Topic gathering
*/
streaming.startCapturing(config);
