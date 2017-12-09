/**
 * Created by Ralph Varjabedian on 11/30/15.
 */
'use strict';

module.exports = {
  action: "test.element.disabled",
  isTest: true,
  continue: true,
  skipScreenshot: true,
  before: function(step) {
    step.action = "test.element.exists";
    return step;
  },
  fn: function(driver, helper, log, cb) {
    let r = helper.getLocator(this);
    this.runtime.title = "checking disabled element: " + r.desc();
    helper.getElement(driver, this).isEnabled().thencb(function(err, data) {
      if(err) {
        return cb(err);
      }
      cb(data); // disabled = positive = no err (false)
    });
    log(this.runtime.title);
  },
  description: "tests if an element is disabled",
  properties: {
    locator: {description: "DOM locator", mandatory: true, type: "locator"}
  }
};