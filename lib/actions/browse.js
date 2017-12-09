/**
 * Created by Ralph Varjabedian on 11/30/15.
 */
'use strict';

module.exports = {
  action: "browse",
  fn: function(driver, log) {
    this.runtime.title = "browsing to: " + this.url;
    log(this.runtime.title);
    return driver.get(this.url);
  },
  description: "browse to a url",
  properties: {
    url: {description: "The url to browse to", mandatory: true, type: "string"}
  }
};