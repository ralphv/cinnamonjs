/**
 *  The test is designed for code coverage in mind, not everything in it makes sense.
 */

'use strict';

module.exports = [
  {action: "start"},
  {action: "browser.set.size", width: 1024, height: 768},
  {action: "test.element.text", text: "next", locator: null, continue: true},
  {action: "test.element.text", text: "next", locator: null, error: "this is a better error description", continue: true},
];