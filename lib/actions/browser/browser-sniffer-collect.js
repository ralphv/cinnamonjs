/**
 * Created by Ralph Varjabedian on 11/30/15.
 */
'use strict';
const fs = require("fs");
const path = require("path");

var snifferFile;

module.exports = {
  action: "browser.sniffer.collect",
  fn: function(driver, log, context) {
    let self = this;
    this.runtime.title = "collecting data from browser sniffer";
    log(this.runtime.title);
    if (!snifferFile) {
      snifferFile = fs.readFileSync(path.normalize(path.join(__dirname, "..", "..", "XMLHttpRequestSniffer.js.src")), { encoding: 'utf8' });
    }
    return driver.executeScript(snifferFile, false).then(function(data){
      if (!data || !Array.isArray(data)) {
        return Promise.reject("sniffer not attached or page has changed/reloaded");
      }
      if(typeof(self.setResult) === "function") {
        self.setResult(data);
      }
      if(self.result) {
        context[self.result] = data;
      }
      self.runtime.XMLHttpRequests = data;  // send to log file
      return data;
    });
  },
  description: "collect data from XmlHttpRequest sniffer that is already attached. The result is an array of Ajax calls (request/response data).",
  properties: {
    setResult: {description: "The function to call to set the result to", mandatory: false, type: "function"},
    result: {description: "The context variable name to fill the result in", mandatory: false, type: "string"},
  }
};