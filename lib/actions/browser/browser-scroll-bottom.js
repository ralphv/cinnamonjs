/**
 * Created by Ralph Varjabedian on 11/30/15.
 */
'use strict';

module.exports = {
  action: "browser.scroll.bottom",
  fn: function(driver, log) {
    this.runtime.title = "scroll to bottom";
    log(this.runtime.title);
    return driver.executeScript("window.scrollTo(0, document.body.scrollHeight);");

  },
  description: "scroll to bottom of page",
  properties: null
};