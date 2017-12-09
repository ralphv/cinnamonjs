/**
 * Created by Ralph Varjabedian on 11/30/15.
 */
'use strict';

module.exports = {
  action: "test.element.exists",
  skipScreenshot: true,
  isTest: true,
  fn: function(driver, config, helper, until, log, cb) {
    let self = this;
    let r = helper.getLocator(this);
    driver.wait(until.elementLocated(r.locator), config.defaultWaitTimeout).thencb(function(err, isPresent) {
      self.runtime.title = "testing element presence: " + r.desc();
      if (err) {
        return cb(err);
      }
      log(self.runtime.title, isPresent ? "[PASSED]".green : "[FAILED]".red);
      cb(!isPresent);
    });
  },
  description: "tests if an element exists",
  properties: {
    locator: {description: "DOM locator", mandatory: true, type: "locator"}
  }
};