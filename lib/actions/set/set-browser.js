/**
 * Created by Ralph Varjabedian on 11/30/15.
 */
'use strict';

module.exports = {
  action: "set.browser",
  skipScreenshot: true,
  fn: function(config, log, cb) {
    this.runtime.title = "setting browser to:" + this.browser;
    log(this.runtime.title);
    config.browser = this.browser;
    cb();
  },
  description: "change driver of browser",
  properties: {
    browser: {description: "The browser name", mandatory: true, type: "string"}
  }
};