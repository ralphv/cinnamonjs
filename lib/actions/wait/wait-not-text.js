/**
 * Created by Ralph Varjabedian on 11/30/15.
 */
'use strict';


module.exports = {
  action: "wait.not.text",
  fn: function(driver, helper, log, cb) {
    const self = this;
    this.runtime.title = "testing text does not exist: '" + this.text + "'";
    log(this.runtime.title);
    const locator = {xpath: "//*[contains(text(), '" + this.text + "')]"};
    helper.findElementsAndWait(driver, locator, self.timeout).thencb(function(err, elements) {
      self.runtime.title = "testing text does not exist: " + self.text;
      if(err) {
        return cb(err);
      }
      log(self.runtime.title);
      cb(elements.length !== 0);
    });
  },
  description: "test that text does not exist",
  properties: {
    text: {description: "the text to assert doesn't exist", mandatory: true, type: "string"},
    timeout: {description: "The timeout to wait for, defaults to 10 seconds", mandatory: false, type: "number"}
  }
};