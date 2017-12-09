/**
 *  The test is designed for code coverage in mind, not everything in it makes sense.
 */

'use strict';

module.exports = [
  {action: "set.browser", browser: "chrome"},
  {action: "start"},
  {action: "context", context: {sampleData: "http://sample-url"}},
  {action: "browser.maximize"},
  {action: "browser.set.size", width: 1024, height: 768},
  {action: "browse", url: "http://www.google.com/ncr"},
  {action: "send.keys", locator: {name: "q"}, keys: "WebDriver"},
  {action: "clear.element", locator: {name: "q"}},
  {action: "send.keys", locator: {name: "q"}, keys: "WebDriver", password: true},
  {action: "send.keys", locator: {name: "q"}, keys: Key.RETURN},
  {action: "wait.title", "page.title": "WebDriver - Google Search"},
  {action: "test.element.exists", title: "waiting for the result of the search", locator: {id: "pnnext"}},
  {
    action: "test.element.text", text: function($test) {
      $test.value = 'sample';
      return "next";
    },
    locator: {id: "pnnext"}
  },
  {action: "test.element.text", text: "not-next", locator: {id: "pnnext"}, not: true},
  {action: "test.element.text", text: "next", locator: {id: "pnnext"}, compare: (rhs, lhs) => rhs === lhs},
  {action: "test.element.text", text: "next", locator: {id: "pnnext"}, compare: function(rhs, lhs) { return rhs === lhs; }},
  {action: "test.element.text", text: "next", locator: {id: "pnnext"}, compare: (rhs, lhs) => rhs === lhs, trim: true},
  {action: "test.element.text", text: "next", locator: {id: "pnnext"}, compare: (rhs, lhs) => rhs.toLowerCase() === lhs.toLowerCase(), caseSensitive: true},
  {action: "wait.not.text", text: "non existent", timeout: 100},
  {action: "wait.not.text", text: "non existent"},
  {action: "wait.element.not.exists", locator: {ngModel: "vc.user.registrationEmail"}, timeout: 10},
  {action: "wait.element.not.exists", locator: {ngClick: "vc.user.registrationEmail"}, timeout: 10},
  {action: "wait.element.not.exists", locator: {xpath: '//button[contains(text(),\'JOIN\')]'}, timeout: 10},
  {action: "wait.element.not.exists", locator: {css: 'span[ng-bind-html="vc.errorMessage | toTrusted"]'}},
  {action: "click", locator: {id: "pnnext"}},
  {action: "info", info: "sample info"},
  {action: "end"}
];