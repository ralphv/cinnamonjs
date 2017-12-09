/**
 * Created by Ralph Varjabedian on 11/29/17.
 *
 * A simple helper function added to the Promise prototype,
 * instead of then which takes two functions, thencb takes one function with the err in the first argument and data in the second, similar to the standard callbacks of nodejs
 *
 */

const webdriver = require('selenium-webdriver');

function thencb(cb) {
  this.then(function(data) {
    cb(null, data);
  }, cb);
}

webdriver.promise.Promise.prototype.thencb = thencb;
webdriver.WebElementPromise.prototype.thencb = thencb;
Promise.prototype.thencb = thencb;