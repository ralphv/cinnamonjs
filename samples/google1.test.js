/**
 *  The simplest test sample, open google, search for the term WebDriver and wait for results,
 *  this variant shows how you can have a "step" defined as a function that returns an array of steps.
 *  Having a function block helps with variable management for a set of steps
 */
'use strict';

module.exports = [
  {action: "set.browser", browser: "chrome"},
  {action: "start"}, // start driver, all files should have this as a first step
  {action: "browser.set.size", width: 1024, height: 768}, // set the browser size
  {action: "browse", url: "http://www.google.com/ncr"}, // browser to the given url
  function() {
    return [
      {action: "send.keys", locator: {name: "q"}, keys: "WebDriver"}, // fill in the search area in google page with "WebDriver"
      {action: "send.keys", locator: {name: "q"}, keys: Key.RETURN}, // Press ENTER to start the search
    ]
  },
  {action: "wait.title", "page.title": "WebDriver - Google Search"}, // Wait for the search results
  {action: "test.element.exists", title:"waiting for the result of the search", locator: {id: "pnnext"}} // Wait for the first search result
];
