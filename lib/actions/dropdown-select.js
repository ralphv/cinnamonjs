/**
 * Created by Ralph Varjabedian on 11/30/15.
 */
'use strict';

module.exports = {
  action: "dropdown.select",
  before: function(step) {
    step.action = "test.element.exists";
    return step;
  },
  fn: function(driver, helper, log, By, cb) {
    const self = this;
    this.runtime.title = "selecting dropdown value: " + this.value;
    if(this.value) {
      helper.getElement(driver, this).then(function(element) {
        element.findElement(By.css("option[value=\'" + self.value + "\']")).click().thencb(cb);
      });
    } 
    log(this.runtime.title);
  },
  description: "click an element",
  properties: {
    locator: {description: "DOM locator", mandatory: true, type: "locator"},
    value: {description: "The value to select", mandatory: true, type: "string"},
  }
};