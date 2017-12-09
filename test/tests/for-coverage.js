/**
 *  The test is designed for code coverage in mind, not everything in it makes sense.
 */

'use strict';

module.exports = [
  {action: "start"},
  {action: "context", context: {sampleData: "http://sample-url"}},
  {action: "browser.set.size", width: 1024, height: 768},
  {action: "browse", url: "http://www.google.com/ncr"},
  function() {
    return [{action: "send.keys", locator: {name: "q"}, keys: "WebDriver"},
      {action: "send.keys", locator: {name: "q"}, keys: Key.RETURN},
    ];
  },
  {action: "wait.title", "page.title": "WebDriver - Google Search"},
  {action: "wait.text", text: "next"},
  {action: "wait.element.exists", title: "waiting for the result of the search", locator: {id: "pnnext"}},
  {action: "test.element.exists", title: "waiting for the result of the search", locator: {id: "pnnext"}},
  {action: "test.element.text", text: "next", locator: {id: "pnnext"}},
  {action: "test.element.text", text: "not-next", locator: {id: "pnnext"}, not: true},
  {action: "test.element.text", text: "next", locator: {id: "pnnext"}, compare: (rhs, lhs) => rhs === lhs},
  {action: "test.element.text", text: "next", locator: {id: "pnnext"}, compare: function(rhs, lhs) { return rhs === lhs; }},
  {action: "test.element.text", text: "next", locator: {id: "pnnext"}, compare: (rhs, lhs) => rhs === lhs, trim: true},
  {action: "test.element.text", text: "next", locator: {id: "pnnext"}, compare: (rhs, lhs) => rhs.toLowerCase() === lhs.toLowerCase(), caseSensitive: true},
  {action: "wait.element.text.change.before", locator: {id: "pnnext"}},
  {action: "get.value", locator: {id: "pnnext"}},
  {action: "get.text", locator: {id: "pnnext"}},
  {action: "set.value", value: "new value by set.value", locator: {id: "lst-ib"}},
  {action: "set.text", value: "new1", locator: {id: "pnnext"}},
  {action: "wait.element.text.change.after", locator: {id: "pnnext"}, timeout: 2000},
  {action: "wait.not.text", text: "non existent", timeout: 100}, // Wait for the first search result
  {action: "wait.not.text", text: "non existent"},
  {
    action: "custom", fn: function(driver, helper) {
      return new Promise(function(r) { setTimeout(r, 500); });
    }
  },
  {action: "wait.element.not.exists", locator: {ngModel: "vc.user.registrationEmail"}, timeout: 10},
  {action: "wait.element.not.exists", locator: {ngClick: "vc.user.registrationEmail"}, timeout: 10},
  {action: "wait.element.not.exists", locator: {xpath: '//button[contains(text(),\'JOIN\')]'}, timeout: 10},
  {action: "wait.element.not.exists", locator: {css: 'span[ng-bind-html="vc.errorMessage | toTrusted"]'}}
];