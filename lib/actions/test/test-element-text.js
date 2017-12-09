/**
 * Created by Ralph Varjabedian on 11/30/15.
 */
'use strict';

module.exports = {
  action: "test.element.text",
  skipScreenshot: true,
  before: function(step) {
    step.action = "test.element.exists";
    return step;
  },
  isTest: true,
  fn: function(driver, helper, callDiFunction, cb) {
    let r = helper.getLocator(this);
    let self = this;
    helper.getElementTextOrAttributeValue(driver, this).thencb(function(err, text) {
      if(err) {
        return cb(err);
      }
      self.runtime.title = "testing element: " + r.desc() + " text with: '" + self.text + "'";
      helper.compareTwoTexts(self.text, text, self, callDiFunction, {}, function(err, result) {
        cb(!result);
      });
    });
  },
  description: "test element's text",
  properties: {
    locator: {description: "DOM locator", mandatory: true, type: "locator"},
    text: {description: "The text to compare with", mandatory: true, type: "string"},
    compare: {description: "A custom function to compare with params, rhs, lhs", mandatory: false, type: "function"},
    caseSensitive: {description: "case sensitive compare", mandatory: false, type: "boolean"},
    trim: {description: "trimming before compare", mandatory: false, type: "boolean"},
    not: {description: "not equality", mandatory: false, type: "boolean"},
    textFromAttributeValue: {description: "flag to get string from attribute 'value' instead of text of element", mandatory: false, type: "boolean"}
  }
};