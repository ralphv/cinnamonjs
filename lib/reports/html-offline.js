/**
 * Created by Ralph Varjabedian on 12/1/15.
 *
 * Fills in the running log into an html file that does lots of fancy stuff to the results.
 */
'use strict';

const fs = require("fs");
const path = require("path");
const helper = require("../actions-helper.js");

function modifyTemplate(template, data) {
  return template.replace(/\[TEMPLATE.DATA\]/g, JSON.stringify(data, null, 2));
}

// create report
module.exports = function(log, basePath, cb) {
  log.files.forEach(file => {
    file.steps = file.steps.filter(e => !(e.expandedStep && (e.runtime.test && e.runtime.result || !e.runtime.test))); // skip implicit (expanded test steps that are correct)
  });
  let template = fs.readFileSync(path.join(__dirname, "report-offline.html"), "utf8");
  template = modifyTemplate(template, log);
  fs.writeFile(basePath + "report-offline.html", template, cb);
  helper.openFileWithDefaultApp(basePath + "report-offline.html");
};