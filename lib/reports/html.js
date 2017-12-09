/**
 * Created by Ralph Varjabedian on 12/1/15.
 */
'use strict';

const fs = require("fs");
const path = require("path");

function modifyTemplate(template, data) {
  return template.replace(/\[TEMPLATE.DATA\]/g, JSON.stringify(data, null, 2));
}

// create report
module.exports = function(log, basePath, cb) {
  let template = fs.readFileSync(path.join(__dirname, "report.html"), "utf8");
  template = modifyTemplate(template, log);
  fs.writeFile(basePath + "report.html", template, cb);
};