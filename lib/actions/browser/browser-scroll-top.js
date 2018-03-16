/**
 * Created by Ralph Varjabedian on 11/30/15.
 */
'use strict';

module.exports = {
  action: "browser.scroll.top",
  fn: function(driver, log) {
    this.runtime.title = "scroll to top";
    log(this.runtime.title);
    return driver.executeScript("window.scrollTo(0, 0);");

  },
  description: "scroll to top of page",
  properties: null
};