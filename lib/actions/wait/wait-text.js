/**
 * Created by Ralph Varjabedian on 11/30/15.
 */
'use strict';

module.exports = {
  action: "wait.text",
  fn: function(driver, log, until, config, cb) {
    this.runtime.title = "waiting for text: '" + this.text + "'";
    log(this.runtime.title);
    const locator = {xpath: "//*[contains(text(), '" + this.text + "')]"};
    const self = this;
      driver.wait(until.elementLocated(locator), self.timeout ? self.timeout : config.defaultWaitTimeout).then(function(isPresent) {
      if(!isPresent) {
        return cb("could not find element");
      }
      cb();
    }, cb);
  },
  description: "wait for any element with text",
  properties: {
    text: {description: "the text to assert doesn't exist", mandatory: true, type: "string"},
    timeout: {description: "The timeout to wait for, defaults to 10000 milliseconds", mandatory: false, type: "number"}
  }
};