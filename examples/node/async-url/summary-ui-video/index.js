// Copyright 2022 Symbl.ai SDK contributors. All Rights Reserved.
// SPDX-License-Identifier: MIT

require('dotenv').config()
const util = require('util')

const common = require('../../common/common.js');
const posturl = require('../../common/post-url.js');
const summaryui = require('../../common/summary-ui.js');

async function main() {
  /*
    Login and get token
  */
  var token = await common.Login();

  /*
    Post the audio file to the Symbl platform
  */
  var result = await posturl.PostVideoURL(token, process.env.URL);

  /*
    Process Summary for the audio file
  */
  var summary = await summaryui.SummaryVideoUI(token, process.env.URL, result.conversationId);
  var output = JSON.parse(summary);
  console.log(util.inspect(output, false, null, true));
}

main();
