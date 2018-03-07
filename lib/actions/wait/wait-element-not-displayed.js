/**
 * Created by Ralph Varjabedian on 11/30/15.
 */
'use strict';

const assert = require("assert");
const waitStep = 100; // 100 milliseconds

module.exports = {
  action: "wait.element.not.displayed",
  fn: function(driver, log, helper, config, cb) {
    const r = helper.getLocator(this);
    const timeout = this.timeout ? this.timeout : config.defaultWaitTimeout;
    this.runtime.title = "waiting for element to not exist: " + r.desc();
    let countOfWaits = timeout / waitStep;
    assert(countOfWaits > 0);
    let fetchElement = function() {
      countOfWaits--;
      helper.findElementsAndWait(driver, r.locator, waitStep).thencb(function(err, elements) {
        if(err) {
          return cb(err);
        }
        if(elements.length > 1) {
          return cb("Locator returns more than one element");
        }
        if(elements.length === 0) { // not found, success
          return cb();
        }
        elements[0].isDisplayed().thencb(function(err, displayed) {
          if(!displayed) { // not displayed, success
            return cb();
          }
          if(countOfWaits > 0) {
            setTimeout(fetchElement, waitStep);  // wait more
          } else {
            cb("Element still exists"); // raise error
          }
        });
      });
    };
    fetchElement();
  },
  description: "waits for element to not exist or not be visible",
  properties: {
    locator: {description: "DOM locator", mandatory: true, type: "locator"},
    timeout: {description: "The timeout to wait for, defaults to 10 seconds", mandatory: false, type: "number"}
  }
};