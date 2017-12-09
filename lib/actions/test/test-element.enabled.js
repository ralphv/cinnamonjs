/**
 * Created by Ralph Varjabedian on 11/30/15.
 */
'use strict';

module.exports = {
  action: "test.element.enabled",
  skipScreenshot: true,
  isTest: true,
  continue: true,
  before: function(step) {
    step.action = "test.elexists";
    return step;
  },
  fn: function(driver, helper, log, cb) {
    let r = helper.getLocator(this);
    this.runtime.title = "checking enabled element: " + r.desc();
    helper.getElement(driver, this).isEnabled().thencb(function(err, data) {
      if(err) {
        return cb(err);
      }
      cb(!data); // enabled = positive = no err (false)
    });
    log(this.runtime.title);
  },
  description: "tests if an element is enabled",
  properties: {
    locator: {description: "DOM locator", mandatory: true, type: "locator"}
  }
};