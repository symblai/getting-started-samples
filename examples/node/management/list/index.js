// Copyright 2022 Symbl.ai SDK contributors. All Rights Reserved.
// SPDX-License-Identifier: MIT

require('dotenv').config()
const util = require('util')

const common = require('../../common/common.js');
const post = require('../../common/post-file.js');
const management = require('../../common/management.js');

async function main() {
  /*
    Login and get token
  */
  var token = await common.Login();

  /*
    List Trackers
  */
  var trackers = await management.List(token);
  var output = JSON.parse(trackers);
  console.log(util.inspect(output, false, null, true));
}

main();
