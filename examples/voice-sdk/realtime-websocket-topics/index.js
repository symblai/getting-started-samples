require('dotenv').config()
var common = require('../../common/common.js');
var streaming = require('../../common/streaming.js');

/*
  Get basic configuration
*/
config = common.getConfigScaffolding();

/*
  When Symbl detects a topic, this callback will be called.
*/
config.handlers.onTopicResponse = (data) => {
  console.log('onTopicResponse', JSON.stringify(data, null, 2));
};

/*
  Start real-time Topic gathering
*/
streaming.startCapturing(config);
