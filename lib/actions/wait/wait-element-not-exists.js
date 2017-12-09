/**
 * Created by Ralph Varjabedian on 11/30/15.
 */
'use strict';

module.exports = {
  action: "wait.element.not.exists",
  fn: function(driver, log, helper, cb) {
    const self = this;
    const r = helper.getLocator(this);
    helper.findElementsAndWait(driver, r.locator, self.timeout).thencb(function(err, elements) {
      self.runtime.title = "testing element does not exist: " + r.desc();
      if(err) {
        return cb(err);
      }
      log(self.runtime.title);
      cb(elements.length !== 0);
    });
  },
  description: "waits for element to not exist",
  properties: {
    locator: {description: "DOM locator", mandatory: true, type: "locator"},
    timeout: {description: "The timeout to wait for, defaults to 10 seconds", mandatory: false, type: "number"}
  }
};