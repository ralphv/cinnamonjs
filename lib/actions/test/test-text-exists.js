/**
 * Created by Ralph Varjabedian on 11/30/15.
 */
'use strict';

module.exports = {
  action: "test.text.exists",
  skipScreenshot: true,
  isTest: true,
  fn: function(driver, config, until, log, helper, cb) {
    const self = this;
    const locator = {xpath: "//*[contains(text(), '" + this.text + "')]"};
    driver.wait(until.elementLocated(locator), config.defaultWaitTimeout).then(function(isPresent) {
      self.runtime.title = "testing text presence: '" + self.text + "'";
      log(self.runtime.title, isPresent ? "[PASSED]".green : "[FAILED]".red, "text:", "'" + self.text + "'");
      cb(!isPresent);
    }, function(err) {
      cb(err);
    });
  },
  description: "test for any element with the specified text",
  properties: {
    text: {description: "The text to search for", mandatory: true, type: "string"}
  }
};