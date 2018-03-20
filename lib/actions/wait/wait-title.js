/**
 * Created by Ralph Varjabedian on 11/30/15.
 */
'use strict';

module.exports = {
  action: "wait.title",
  fn: function(driver, log, until, config) {
    this.runtime.title = "waiting for page title: '" + this["page.title"] + "'";
    log(this.runtime.title);
    return driver.wait(until.titleIs(this["page.title"]), this.timeout ? this.timeout : config.defaultWaitTimeout);
  },
  description: "wait for the page title",
  properties: {
    "page.title": {description: "wait until the title matches this", mandatory: true, type: "string"},
    timeout: {description: "The timeout to wait for, defaults to 10000 milliseconds", mandatory: false, type: "number"}
  }
};