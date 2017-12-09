/**
 * Created by Ralph Varjabedian on 12/1/15.
 *
 * The default simplest reporter, which basically does nothing but print the running log into a JSON file
 */
'use strict';

const fs = require("fs");

// create report
module.exports = function(log, basePath, cb) {
  fs.writeFile(basePath + "log.json", JSON.stringify(log, null, 2), cb);
};