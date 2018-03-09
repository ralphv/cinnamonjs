/**
 * Created by Ralph Varjabedian on 12/8/17.
 *
 * Responsible for processing a locator property of an action into proper locator information for the WebDriver.
 *
 */
'use strict';

const By = require('selenium-webdriver').By;

module.exports = function(item) {
  item = item.locator; // take everything related to selecting an element from "locator" object
  if(!item) {
    throw new Error("locator in action can not be undefined");
  }
  if(typeof(item) === "string") {
    // locator is not an object, it is a string directly
    // put it in object
    item = {locator: item};
  }
  if(item.id) {
    return {
      method: "id", value: item.id, locator: By.id(item.id), desc: function() {
        return "{id: " + item.id + "}";
      }
    }
  } else if(item.name) {
    return {
      method: "name", value: item.name, locator: By.name(item.name), desc: function() {
        return "{name: " + item.name + "}";
      }
    }
  } else if(item.css) {
    return {
      method: "css", value: item.css, locator: By.css(item.css), desc: function() {
        return "{css: " + item.css + "}";
      }
    }
  } else if(item.ngModel) {
    return {
      method: "ng-model",
      value: item.ngModel,
      locator: By.css('*[ng-model="' + item.ngModel + '"]'),
      desc: function() {
        return "{ngModel: " + item.ngModel + "}";
      }
    }
  } else if(item.ngClick) {
    return {
      method: "ng-click",
      value: item.ngClick,
      locator: By.css('*[ng-click="' + item.ngClick + '"]'),
      desc: function() {
        return "{ngClick: " + item.ngClick + "}";
      }
    }
  } else if(item.xpath) {
    return {
      method: "xpath", value: item.xpath, locator: By.xpath(item.xpath), desc: function() {
        return "{xpath: " + item.xpath + "}";
      }
    }
  } else {
    return {
      method: "locator", value: item.locator, locator: item.locator, desc: function() {
        return "{with locator}";
      }
    };
  }
};