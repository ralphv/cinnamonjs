/**
 * Created by Ralph Varjabedian on 11/30/15.
 */
'use strict';


module.exports = {
  action: "wait",
  fn: function(driver, log, cb) {
    this.runtime.title = "waiting for " + this.for + "ms.";
    log(this.runtime.title);
    setTimeout(cb, this.for);
  },
  description: "wait for milliseconds",
  properties: {
    for: {description: "The milliseconds to wait for", mandatory: true, type: "number"}
  }
};