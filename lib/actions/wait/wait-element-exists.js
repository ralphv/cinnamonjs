/**
 * Created by Ralph Varjabedian on 11/30/15.
 */
'use strict';

module.exports = {
  action: "wait.element.exists",
  fn: function(driver, until, helper, config, log, cb) {
    let self = this;
    let r = helper.getLocator(this);
      driver.wait(until.elementLocated(r.locator), config.defaultWaitTimeout).thencb(function(err, isPresent) {
      self.runtime.title = "waiting for element: " + r.desc();
      if (err) {
        return cb(err);
      }
      log(self.runtime.title);
      cb(!isPresent);
    });
  },
  description: "waits for element to exist",
  properties: {
    locator: {description: "DOM locator", mandatory: true, type: "locator"}
  }
};