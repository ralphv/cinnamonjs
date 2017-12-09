/**
 * Created by Ralph Varjabedian on 12/3/17.
 *
 * A singleton that a manages the WebDriver instance (start, quit)
 * Also has callDiFunction that calls a step's function (fn) using dependency injection
 */

const webdriver = require('selenium-webdriver');

const helper = require('./helper.js');
const config = require("../config.js");
const actionsHelper = require("./actions-helper.js");
const dependencyInjector = require('./dependency-injector.js');

let driver = null;
let diParameters = null;
let diParametersObject = {};
let contextForTests = {};

const instance = module.exports = {
  isWebDriverActive: function() {
    return !!driver;
  },
  initialize: function() {
    diParameters = {
      driver: function() {
        return driver;
      },
      step: function(step) {
        return step;
      },
      startDriver: function() {
        return function() {
          driver = new webdriver.Builder()
            .forBrowser(config.browser)
            .build();
          return driver.getTitle(); // force start
        };
      },
      endDriver: function() {
        return function() {
          driver.quit();
          driver = null;
        };
      },
      By: function() {
        return webdriver.By;
      },
      Key: function() {
        return webdriver.Key;
      },
      until: function() {
        return webdriver.until;
      },
      callDiFunction: function() {
        return instance.callDiFunction;
      },
      helper: function() {
        return actionsHelper;
      },
      config: function() {
        return config;
      },
      log: function() {
        return console.cinnamon.plog;
      },
      //*/ setter object on context? as a function?
      context: function() {
        return contextForTests;
      },
      updateContext: function() {
        return function(context) {
          if(context === null) {
            contextForTests = {}; // reset
          }
          else {
            helper.addProperties(contextForTests, context);
          }
        }
      }
    };
  },
  quitDriver: function() {
    if(driver) {
      driver.quit();
      driver = null;
    }
  },
  getDiParametersObject: function() {
    return diParametersObject;
  },
  resetDiParametersObject: function() {
    diParametersObject = {};
  },
  callDiFunction: async function(step, fn, extraArgumentsSource) {
    let argumentSources = [diParameters, diParametersObject];
    if(extraArgumentsSource) {
      argumentSources = [diParameters, diParametersObject, extraArgumentsSource];
    }
    return dependencyInjector(step, fn, argumentSources, function(param) {
        if(typeof (param) === "function") {
          return param(step);
        } else {
          return param;
        }
      },
      function(paramName) {
        if(paramName[0] === '$') {
          diParametersObject[paramName] = {};
          return diParametersObject[paramName] = (function(paramName) {
            return diParametersObject[paramName];
          })(paramName);
        }
        else {
          return undefined;
        }
      });
  },
  getTestFileRequireInject: function() {
    return {
      "$config": config,
      "By": webdriver.By,
      "until": webdriver.until,
      "Key": webdriver.Key,
      "global": contextForTests,
      "globals": contextForTests,
      "$context": contextForTests
    };
  },
  takeScreenshot: function(cb) {
    return actionsHelper.takeScreenshot(driver, cb);
  }
};