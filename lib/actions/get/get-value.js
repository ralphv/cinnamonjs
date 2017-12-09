/**
 * Created by Ralph Varjabedian on 11/30/15.
 */
'use strict';

module.exports = {
  action: "get.value",
  before: function(step) {
    step.action = "test.element.exists";
    return step;
  },
  fn: function(driver, helper, context, log, cb) {
    let self = this;
    let locatorDesc = helper.getLocator(this).desc();
    this.runtime.title = "getting value of : " + locatorDesc;
    helper.getElement(driver, this).getAttribute("value").then(function(value) {
      if(typeof(self.setResult) === "function") {
        self.setResult(value);
      }
      if(self.result) {
        context[self.result] = value;
      }
      log(self.runtime.title);
      cb();
    });
  },
  description: "get attribute 'value' of an element",
  properties: {
    locator: {description: "DOM locator", mandatory: true, type: "locator"},
    setResult: {description: "The function to call to set the result to", mandatory: false, type: "function"},
    result: {description: "The context variable name to fill the result in", mandatory: false, type: "string"},
  }
};