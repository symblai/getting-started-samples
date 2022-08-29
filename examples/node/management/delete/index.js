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
    Delete a Tracker
  */
  var trackerId = await management.Delete(token);
  console.log("Deleted Tracker. ID: " + trackerId);
}

main();
