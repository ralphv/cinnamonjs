/**
 * Created by Ralph Varjabedian on 11/30/15.
 */
'use strict';

module.exports = {
  action: "end",
  skipScreenshot: true,
  fn: function(endDriver) {
    this.runtime.title = "ending driver session";
    return endDriver();
  },
  description: "ends driver session",
  properties: null
};