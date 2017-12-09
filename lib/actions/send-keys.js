/**
 * Created by Ralph Varjabedian on 11/30/15.
 */
'use strict';

module.exports = {
  action: "send.keys",
  before: function(step) {
    step.action = "test.element.exists";
    return step;
  },
  fn: function(driver, helper, log, cb) {
    let p = helper.getElement(driver, this).sendKeys(this.keys);
    if(!this.password) {
      this.runtime.title = "sending keys: " + this.keys + " to: " + helper.getLocator(this).desc();
    } else {
      this.runtime.title = "sending password keys";
    }
    log(this.runtime.title);
    p.thencb(cb);
  },
  description: "sendKeys to an element",
  properties: {
    locator: {description: "DOM locator", mandatory: true, type: "locator"},
    keys: {description: "The string to send", mandatory: true, type: "string"},
    password: {description: "Turn off verbose if this field is a password", mandatory: false, type: "boolean"}
  }
};