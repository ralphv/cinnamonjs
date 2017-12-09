/**
 * Created by Ralph Varjabedian on 11/30/15.
 */
'use strict';

module.exports = {
  action: "custom",
  fn: function(callDiFunction, cb) {
    callDiFunction(this, this.fn).thencb(cb);
  },
  description: "custom function",
  properties: {
    fn: {description: "The function to execute, it's parameters are injected, if cb is specified it will work in callback mode otherwise, it expects a promise to be returned", mandatory: true, type: "function"}
  }
};