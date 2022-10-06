// Copyright 2022 Symbl.ai SDK contributors. All Rights Reserved.
// SPDX-License-Identifier: MIT

require('dotenv').config()
const util = require('util')

const common = require('../../common/common.js');
const post = require('../../common/post-file.js');
const async = require('../../common/async.js');

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
    Process Questions for the audio file
  */
  var questions = await async.Questions(token, result.conversationId);
  var output = JSON.parse(questions);
  console.log(util.inspect(output, false, null, true));
}

main();
