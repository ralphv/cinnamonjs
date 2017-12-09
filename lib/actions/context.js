/**
 * Created by Ralph Varjabedian on 11/30/15.
 */
'use strict';

module.exports = {
  action: "context",
  skipScreenshot: true,
  fn: function(step, updateContext, cb) {
      this.runtime.title = "Setting $context to: " + JSON.stringify(step.context, null, 2);
      updateContext(step.context);
    cb();
  },
  description: "an easy way to setup $context",
  properties: {
    context: {description: "the context to set", mandatory: true, type: "object"}
  }
};