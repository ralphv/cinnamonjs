/**
 * Created by Ralph Varjabedian on 11/30/15.
 */
'use strict';

module.exports = {
  action: "clear.element",
  before: function(step) {
    step.action = "test.element.exists";
    return step;
  },
  fn: function(driver, log, helper) {
    let r = helper.getLocator(this);
    this.runtime.title = 'clearing element: ' + r.desc();
    log(this.runtime.title);
    return helper.getElement(driver, this).clear();
  },
  description: "clears an element from text",
  properties: {
    locator: {description: "DOM locator", mandatory: true, type: "locator"}
  }
};