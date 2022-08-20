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
    Process Summary for the audio file
  */
  var summary = await intelligence.Summary(token, result.conversationId);
  var output = JSON.parse(summary);
  console.log(util.inspect(output, false, null, true));
}

main();
