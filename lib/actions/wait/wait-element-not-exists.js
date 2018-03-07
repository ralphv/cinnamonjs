/**
 * Created by Ralph Varjabedian on 11/30/15.
 */
'use strict';

const assert = require("assert");
const waitStep = 100; // 100 milliseconds

module.exports = {
  action: "wait.element.not.exists",
  fn: function(driver, log, helper, config, cb) {
    const r = helper.getLocator(this);
    const timeout = this.timeout ? this.timeout : config.defaultWaitTimeout;
    this.runtime.title = "waiting for element to not exist: " + r.desc();
    let countOfWaits = timeout / waitStep;
    assert(countOfWaits > 0);
    log(this.runtime.title);
    let fetchElement = function() {
      countOfWaits--;
      helper.findElementsAndWait(driver, r.locator, waitStep).thencb(function(err, elements) {
        if(err) {
          return cb(err);
        }
        if(elements.length > 0 && countOfWaits > 0) {
          setTimeout(fetchElement, waitStep);
        } else {
          cb(elements.length !== 0);
        }
      });
    };
    fetchElement();
  },
  description: "waits for element to not exist",
  properties: {
    locator: {description: "DOM locator", mandatory: true, type: "locator"},
    timeout: {description: "The timeout to wait for, defaults to 10 seconds", mandatory: false, type: "number"}
  }
};