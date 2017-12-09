/**
 *  The test is designed for code coverage in mind, not everything in it makes sense.
 */

'use strict';

module.exports = [
  {action: "start"}, // start driver, all files should have this as a first step
  {action: "browser.set.size", width: 1024, height: 768}, // set the browser size
  {action: "browse", url: "https://www.w3schools.com/tags/tryit.asp?filename=tryhtml_select"},
  {action: "switch.to", name: "iframeResult"},
  {action: "dropdown.select", locator:{xpath:"/html/body/select"}, value:"audi"},
  {action: "get.value", locator:{xpath:"/html/body/select"}, result:"$temp_result"},
  {action: "get.value", locator:{xpath:"/html/body/select"}, setResult:function(){}},
  {action: "switch.to.default"},
  {action: "wait", for: 1000},
  {action: "end"}
];