/**
 * Created by Ralph Varjabedian on 12/2/15.
 */
'use strict';

module.exports = {
  action: "wait.element.text.change.before",
  before: function(step) {
    step.action = "test.element.exists";
    return step;
  },
  isTest: true,
  fn: function(driver, helper, until, config, log, $wait_element_text_change, cb) {
    let r = helper.getLocator(this);
    let self = this;
      driver.wait(until.elementLocated(r.locator), config.defaultWaitTimeout).then(function(isPresent) {
      if(!isPresent) {
        return cb("element doesn't exist");
      }
      helper.getElementTextOrAttributeValue(driver, self).thencb(function(err, text) {
        if(err) {
          return cb(err);
        }
        self.runtime.title = "remembering element text, currently: '" + text + "'";
        log(self.runtime.title);
        $wait_element_text_change.value = text;
        cb();
      });
    }, function(err) {
      cb(err);
    });
  },
  description: "remember an element's current text, to be used with wait.element.text.change.after",
  properties: {
    locator: {description: "DOM locator", mandatory: true, type: "locator"},
    textFromAttributeValue: {description: "flag to get string from attribute 'value' instead of text of element", mandatory: false, type: "boolean"}
  }
};