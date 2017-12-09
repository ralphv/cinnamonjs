/**
 * Created by Ralph Varjabedian on 11/30/15.
 */
'use strict';

module.exports = {
  action: "switch.to",
  fn: function(driver, log) {
    if (this.name) {
      this.runtime.title = "switch iframe to name: " + this.name;
      log(this.runtime.title);
      return driver.switchTo().frame(this.name);
    }
  },
  description: "switch to iframe",
  properties: {
    name: {description: "name of iframe", mandatory: true, type: "string"}
  }
};