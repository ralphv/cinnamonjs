/**
 * Created by Ralph Varjabedian on 11/30/15.
 */
'use strict';

module.exports = {
  action: "click",
  before: function(step) {
    step.action = "test.element.exists";
    return step;
  },
  fn: function(driver, helper, log, cb) {
    let r = helper.getLocator(this);
    this.runtime.title = "clicking on element: " + r.desc();
    helper.getElement(driver, this).click().thencb(cb);
    log(this.runtime.title);
  },
  description: "click an element",
  properties: {
    locator: {description: "DOM locator", mandatory: true, type: "locator"}
  }
};