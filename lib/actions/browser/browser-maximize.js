/**
 * Created by Ralph Varjabedian on 11/30/15.
 */
'use strict';

module.exports = {
  action: "browser.maximize",
  fn: function(driver, log) {
    this.runtime.title = "maximizing browser window";
    log(this.runtime.title);
    return driver.manage().window().maximize();
  },
  description: "maximize browser window",
  properties: null
};