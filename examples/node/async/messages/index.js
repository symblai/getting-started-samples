require('dotenv').config()
const util = require('util')

const common = require('../../common/common.js');
const post = require('../../common/post-file.js');
const intelligence = require('../../common/intelligence.js');

async function main() {
  /*
    Login and get token
  */
  var token = await common.Login();

  /*
    Post the audio file to the Symbl platform
  */
  var result = await post.Post(token, process.env.FILENAME);

  /*
    Process Messages for the audio file
  */
  var messages = await intelligence.Messages(token, result.conversationId);
  var output = JSON.parse(messages);
  console.log(util.inspect(output, false, null, true));
}

main();
