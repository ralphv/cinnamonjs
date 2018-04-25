/**
 * Created by Ralph Varjabedian on 11/30/15.
 */
'use strict';

module.exports = {
  action: "info",
  skipScreenshot: true,
  isTest: true,
  fn: function(step, log, cb) {
    this.runtime.title = JSON.stringify(step.info, null, 2);
    this.runtime.title.split("\n").forEach(function(l) { log(l); });
    cb();
  },
  description: "add info for reporting",
  properties: {
    info: {description: "The info to add for reporting", mandatory: true, type: null},
  }
};