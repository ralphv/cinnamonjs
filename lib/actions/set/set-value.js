/**
 * Created by Ralph Varjabedian on 11/30/15.
 */
'use strict';

module.exports = {
  action: "set.value",
  before: function(step) {
    step.action = "test.element.exists";
    return step;
  },
  fn: function(driver, helper) {
    let locatorDesc = helper.getLocator(this).desc();
    this.runtime.title = "setting value of : " + locatorDesc;
    return helper.setAttributeOfElement(driver, this, "value", this.value);
  },
  description: "set attribute 'value' of an element",
  properties: {
    locator: {description: "DOM locator", mandatory: true, type: "locator"},
    value: {description: "The value to set", mandatory: false, type: "string"},
  }
};