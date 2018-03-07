/**
 * Created by Ralph Varjabedian on 11/30/15.
 *
 * Actions Helper, many helper functions that can be used directly within the actions files
 * One of the important things it has is it abstracts the locator property and how the WebDriver will use it to locate a DOM element
 */
'use strict';

const fs = require("fs");
const l = console.cinnamon.plog;
const config = require("../config.js");

module.exports = {
  implicitWaitTimeout: config.defaultWaitTimeout,
  setImplicitWait: function(driver, timeout) {
    this.implicitWaitTimeout = timeout;
    return this._setImplicitWait(driver, timeout);
  },
  _setImplicitWait: function(driver, timeout) {
    return driver.manage().setTimeouts({
      implicit: timeout,
      script: timeout,
      pageLoad: timeout
    })
  },
  restoreImplicitWait: function(driver) {
    return this._setImplicitWait(driver, this.implicitWaitTimeout);
  },
  findElementsAndWait: function(driver, locator, timeout) {
    const self = this;
    if(!timeout) {
      timeout = config.defaultNotWaitTimeout;
    }
    return self._setImplicitWait(driver, timeout).then(function() {
      return driver.findElements(locator).then(function(value) {
        return self.restoreImplicitWait(driver).then(function() {
          return value;
        });
      });
    })
  },
  getLocator: require("./locator-processor.js"),
  getElement: function(driver, item, options) {
    if(!options) {
      options = {};
    }
    const r = this.getLocator(item);
    if(!options.noLog) {
      l("fetching element:", r.desc());
    }
    return driver.findElement(r.locator);
  },
  setAttributeOfElement: function(driver, item, attributeName, attributeValue) {
    return this.getElement(driver, item).then(function(element) {
      return driver.executeScript("arguments[0].setAttribute(arguments[1], arguments[2]);",
        element, attributeName, attributeValue);
    });
  },
  setInnerHTMLOfElement: function(driver, item, value) {
    return this.getElement(driver, item).then(function(element) {
      return driver.executeScript("arguments[0].innerHTML = arguments[1];",
        element, value);
    });
  },
  getElementTextOrAttributeValue: function(driver, item, options) {
    if(item.textFromAttributeValue) {
      return this.getElement(driver, item, options).getAttribute("value");
    } else {
      return this.getElement(driver, item, options).getText();
    }
  },
  compareTwoTexts: function(lhs, rhs, item, callDiFunction, options, cb) {
    if(!item.caseSensitive) {
      lhs = lhs.toLowerCase();
      rhs = rhs.toLowerCase();
    }
    if(item.trim) {
      lhs = lhs.trim();
      rhs = rhs.trim();
    }
    if(item.compare && item.compare.toString().indexOf("=>") === -1) {
      callDiFunction(item, item.compare, {rhs: rhs, lhs: lhs}).thencb(function(err, result) {
        if(err) {
          return cb(err);
        }
        if(!options.noLog) {
          l("comparing text: ", "'" + lhs + "'", "with", "'" + rhs + "'", result ? "[PASSED]".green : "[FAILED]".red);
        }
        cb(null, result);
      });
    }
    else if(item.compare && item.compare.toString().indexOf("=>") !== -1) {
      const result = item.compare(lhs, rhs);
      if(!options.noLog) {
        l("comparing text: ", "'" + lhs + "'", "with", "'" + rhs + "'", result ? "[PASSED]".green : "[FAILED]".red);
      }
      cb(null, result);
    }
    else {
      let result = lhs === rhs;
      if(item.not) {
        result = !result;
      }
      if(!options.noLog) {
        l("comparing text: ", "'" + lhs + "'", "with", "'" + rhs + "'", result ? "[PASSED]".green : "[FAILED]".red);
      }
      cb(null, result);
    }
  },
  takeScreenshotSaveFile: function(driver, file, cb) {
    driver.takeScreenshot().thencb(
      function(image, err) {
        if(err) {
          return cb(err);
        }
        fs.writeFileSync(file, image, 'base64');
        cb(null, image);
      }
    );
  },
  takeScreenshot: function(driver, cb) {
    driver.takeScreenshot().thencb(cb);
  },
  openFileWithDefaultApp: function(file) {
    /^win/.test(process.platform) ? require("child_process").exec('start "" "' + file + '"')
      : require("child_process").spawn(getCommandLine(), [file], {detached: true, stdio: 'ignore'}).unref();
  }
};

function getCommandLine() {
  switch(process.platform) {
    case 'darwin' :
      return 'open';
    default :
      return 'xdg-open';
  }
}

