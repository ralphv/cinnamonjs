/**
 * Created by Ralph Varjabedian on 11/30/15.
 */
'use strict';

module.exports = {
  action: "browser.scroll.to.element",
  before: function(step) {
    step.action = "test.element.exists";
    return step;
  },
  fn: function(driver, helper, log, cb) {
    let r = helper.getLocator(this);
    this.runtime.title = "scroll to element: " + r.desc();
    log(this.runtime.title);
    helper.getElement(driver, this).thencb(function(err, element) {
      if(err) {
        return cb(err);
      }
      driver.executeScript("arguments[0].scrollIntoView();", element).thencb(cb);
    });
  },
  description: "scroll to element",
  properties: {
    locator: {description: "DOM locator", mandatory: true, type: "locator"}
  }
};