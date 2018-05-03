/**
 * Created by Ralph Varjabedian on 11/30/15.
 */
'use strict';
const fs = require("fs");
const path = require("path");

var snifferFile;

module.exports = {
  action: "browser.sniffer.start",
  fn: function(driver, log) {
    this.runtime.title = "attaching browser sniffer";
    log(this.runtime.title);
    if (!snifferFile) {
      snifferFile = fs.readFileSync(path.normalize(path.join(__dirname, "..", "..", "XMLHttpRequestSniffer.js.src")), { encoding: 'utf8' });
    }
    return driver.executeScript(snifferFile, true);
  },
  description: "attaches sniffer to XmlHttpRequest ajax calls, must be done AFTER page loads.",
  properties: null
};