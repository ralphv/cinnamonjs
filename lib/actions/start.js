/**
 * Created by Ralph Varjabedian on 11/30/15.
 */
'use strict';

module.exports = {
  action: "start",
  skipScreenshot: true,
  fn: function(startDriver, config, log) {
    this.runtime.title = "staring driver: " + config.browser;
    log(this.runtime.title);
    return startDriver();
  },
  after: function(config) {
    return {action: "set.implicitWait", wait: config.defaultWaitTimeout};
  },
  description: "start driver, must be the first step in every testing file",
  properties: null
};