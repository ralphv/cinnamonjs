/**
 * Created by Ralph Varjabedian on 11/30/15.
 */
'use strict';

module.exports = {
  action: "assert",
  skipScreenshot: true,
  isTest: true,
  fn: function(driver, config, until, log, helper, cb) {
    cb(!this.condition ? "assert failed" : null);
  },
  description: "asserts condition is true",
  properties: {
    condition: {description: "The condition to assert", mandatory: true, type: "boolean"}
  }
};