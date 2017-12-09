/**
 * Created by Ralph Varjabedian on 11/30/15.
 */
'use strict';

module.exports = {
  action: "switch.to.default",
  fn: function(driver) {
    return driver.switchTo().defaultContent();
  },
  description: "switch to default content",
  properties: null
};