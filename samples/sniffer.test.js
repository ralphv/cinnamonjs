/**
 *  The simplest test sample, open google, search for the term WebDriver and wait for results
 */

'use strict';

module.exports = [
  {action: "set.browser", browser: "chrome"},
  {action: "start"},
  {action: "browser.set.size", width: 1024, height: 768},
  {action: "browse", url: "http://www.google.com/ncr"},
  {action: "browser.sniffer.start"},
  {action: "wait", for: 100000000},
  {action: "send.keys", locator: {name: "q"}, keys: "cinnamonjs"},
  {action: "send.keys", locator: {name: "q"}, keys: Key.RETURN},
  {action: "wait.title", "page.title": "cinnamonjs - Google Search"},
  {action: "test.element.exists", title:"waiting for the result of the search", locator: {id: "pnnext"}},
  {action: "browser.sniffer.collect"}
];