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
      this.runtime.title = "Sample function to process received collected data";
    }
  },
  {
    action: "info", info: function() {
      return ["The result from Ajax calls is:", $context["lastCollectedXMLHttpRequests"]];
    }
  },
  {
    action: "assert", title: "assert that we got the expected text from the Ajax call", condition: function() {
      return $context["lastCollectedXMLHttpRequests"] && $context["lastCollectedXMLHttpRequests"][0] &&
             $context["lastCollectedXMLHttpRequests"][0].request && $context["lastCollectedXMLHttpRequests"][0].request.url === "demo_get.asp" &&
             $context["lastCollectedXMLHttpRequests"][0].response && $context["lastCollectedXMLHttpRequests"][0].response.data &&
             $context["lastCollectedXMLHttpRequests"][0].response.data.includes("This content was requested using the GET method.");
    }
  }
];