/**
 *  The simplest test sample, open google, search for the term WebDriver and wait for results
 */

'use strict';

module.exports = [
  {action: "set.browser", browser: "chrome"},
  {action: "start"},
  {action: "browser.maximize"},
  {action: "browse", url: "https://www.w3schools.com/js/tryit.asp?filename=tryjs_ajax_get"},
  {action: "switch.to", name: "iframeResult"},
  {action: "browser.sniffer.start"},
  {action: "click", locator: {css: "body > button"}},
  {action: "wait.text", text: "This content was requested using the GET method"},
  {
    action: "browser.sniffer.collect", result: "lastCollectedXMLHttpRequests", setResult: function(data) {
      this.runtime.title = "This is coming from my step";
    }
  },
  {
    action: "info", info: function() {
      return "this is a new dynamic info";
    }
  }
];