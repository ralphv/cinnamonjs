/**
 * Created by Ralph Varjabedian on 11/30/15.
 */
'use strict';

module.exports = {
  action: "info",
  skipScreenshot: true,
  isTest: true,
  fn: function(step, log, cb) {
    if (typeof(step.info) === "string") {
      this.runtime.title = step.info;
      this.runtime.title.split("\n").forEach(function(l) { log(l); });
    }  else if (Array.isArray(step.info)) {
      this.runtime.title = JSON.stringify(step.info, null, 2);
      step.info.forEach(function(l) { log(l); });
    }
    cb();
  },
  description: "add info for reporting",
  properties: {
    info: {description: "The info to add for reporting", mandatory: true, type: null},
  }
};