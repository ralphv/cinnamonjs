/**
 * Created by Ralph Varjabedian on 11/30/15.
 */
'use strict';

module.exports = {
  action: "browser.set.size",
  skipScreenshot: true,
  fn: function(driver, log) {
    this.runtime.title = "setting browser window size to width: " + this.width + ", height: " + this.height;
    log(this.runtime.title);
    return driver.manage().window().setSize(this.width, this.height);
  },
  description: "set browser window to specific size",
  properties: {
    width: {description: "Width required", mandatory: true, type: "number"},
    height: {description: "Height required", mandatory: true, type: "number"}
  }
};