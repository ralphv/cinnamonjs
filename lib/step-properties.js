/**
 * Created by Ralph Varjabedian on 11/29/17.
 *
 *  A simple helper for the properties to use so that they can be centralized and documented
 */

module.exports = Object.freeze({
  "action": "action", // the action type or name
  "title": "title", // the title of the step itself, optional, but if found it will be used in the reporting for better readability
  "locator": "locator", // one or more locator formats (check README.md)
  "error": "error", // if this step encounters an error and this property is defined, it will take the error description from here (for reporting readability)
  "isTest": "isTest", // explicitly tag this step as testing step, even if it's action type is not testing
  "skipScreenshot": "skipScreenshot",  // skip the screenshot on this step
  "continue": "continue" // if this step encounters an error, do not stop the whole test, continue
});                                                