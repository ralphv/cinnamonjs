/**
 * Created by Ralph Varjabedian on 11/30/15.
 */
'use strict';

module.exports = {
  action: "set.implicitwait",
  skipScreenshot: true,
  fn: function(driver, helper, log) {
    this.runtime.title = "setting implicitlyWait to: " + this.wait + " ms.";
    log(this.runtime.title);
    return helper.setImplicitWait(driver, this.wait);
  },
  description: "set the implicitlyWait of the driver",
  properties: {
    wait: {description: "The amount to wait for in milliseconds", mandatory: true, type: "number"}
  }
};