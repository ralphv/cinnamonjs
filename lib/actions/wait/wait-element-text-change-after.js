/**
 * Created by Ralph Varjabedian on 12/2/15.
 */
'use strict';

const assert = require("assert");
const waitStep = 100; // 100 milliseconds

module.exports = {
  action: "wait.element.text.change.after",
  before: function(step) {
    step.action = "test.element.exists";
    return step;
  },
  isTest: true,
  fn: function(driver, helper, log, $wait_element_text_change, callDiFunction, cb) {
    let r = helper.getLocator(this);
    let oldText = $wait_element_text_change.value;
    this.runtime.title = "waiting for element text change: " + r.desc() + " from: '" + oldText + "'";
    log(this.runtime.title);
    let countOfWaits = this.timeout / waitStep;
    assert(countOfWaits > 0);
    let self = this;
    let fetchTextFunction = function() {
      helper.getElementTextOrAttributeValue(driver, self, {noLog: true}).thencb(function(err, text) {
        countOfWaits--;
        if(err) {
          return cb(err);
        }
        helper.compareTwoTexts(oldText, text, self, callDiFunction, {noLog: true}, function(err, result) {
          result = !result; // we want them to be different (not)
          if(!result && countOfWaits > 0) {
            setTimeout(fetchTextFunction, waitStep);
          } else {
            if (result) {
              log("element text changed into: '" + text + "'");
            }
            cb(!result); // send error if result is negative.
          }
        });
      });
    };
    fetchTextFunction();
  },
  description: "wait for an element to change it's text. used with wait.element.text.change.before",
  properties: {
    locator: {description: "DOM locator", mandatory: true, type: "locator"},
    timeout: {description: "maximum time to wait in milliseconds.", mandatory: true, type: "number"},
    compare: {description: "A custom function to compare with params, rhs, lhs", mandatory: false, type: "function"},
    caseSensitive: {description: "case sensitive compare", mandatory: false, type: "boolean"},
    trim: {description: "trimming before compare", mandatory: false, type: "boolean"},
    not: {description: "not equality", mandatory: false, type: "boolean"},
    textFromAttributeValue: {description: "flag to get string from attribute 'value' instead of text of element", mandatory: false, type: "boolean"}
  }
};