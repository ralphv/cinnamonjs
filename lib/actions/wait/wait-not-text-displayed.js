/**
 * Created by Ralph Varjabedian on 11/30/15.
 */
'use strict';

const assert = require("assert");
const waitStep = 100; // 100 milliseconds

module.exports = {
  action: "wait.not.text.displayed",
  fn: function(driver, helper, log, config, cb) {
    const locator = {xpath: "//*[contains(text(), '" + this.text + "')]"};
    const timeout = this.timeout ? this.timeout : config.defaultWaitTimeout;
    this.runtime.title = "testing text does not exist: '" + this.text + "'";
    let countOfWaits = timeout / waitStep;
    assert(countOfWaits > 0);
    log(this.runtime.title);
    let fetchElement = function() {
      countOfWaits--;
      helper.findElementsAndWait(driver, locator, waitStep).thencb(function(err, elements) {
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
  description: "test that text does not exist or is hidden",
  properties: {
    text: {description: "the text to assert doesn't exist or hidden", mandatory: true, type: "string"},
    timeout: {description: "The timeout to wait for, defaults to 10 seconds", mandatory: false, type: "number"}
  }
};