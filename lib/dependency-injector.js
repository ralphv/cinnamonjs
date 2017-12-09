/**
 * Created by Ralph Varjabedian on 11/30/15.
 *
 * A helper function that calls a function and fills in the parameters via dependency injection
 *
 */
'use strict';

const assert = require("assert");
const discover = require('./di-discover.js');

function getArgument(argumentName, argumentsSources, translatorFn) {
  for(let i = 0; i < argumentsSources.length; i++) {
    if(argumentsSources[i].hasOwnProperty(argumentName)) {
      if(translatorFn) {
        return translatorFn(argumentsSources[i][argumentName]);
      }
      else {
        return argumentsSources[i][argumentName];
      }
    }
  }
  return undefined;
}

module.exports = function(self, fn, argumentsSources, translatorFn, missingArgumentCreatorFn) {
  return new Promise((resolve, reject) => {
    if(!Array.isArray(argumentsSources)) {
      argumentsSources = [argumentsSources];
    }
    let cbYes = false;
    // discover parameters
    if(!fn.diData) {
      fn.diData = discover(fn);
    }
    // prepare parameters
    let parameters = [];
    for(let i = 0; i < fn.diData.args.length; i++) {
      let paramName = fn.diData.args[i].name;
      if(paramName === "cb") {
        assert(cbYes === false, "cb should be only specified once");
        cbYes = true;
        parameters.push(function(err, data) {
          if(err) {
            return reject(err);
          } else {
            return resolve(data);
          }
        });
      } else {
        let paramValue = getArgument(paramName, argumentsSources, translatorFn);
        if(!paramValue) {
          paramValue = missingArgumentCreatorFn(paramName);
        }
        if(!paramValue) {
          throw "missing dynamic parameter value: " + paramName;
        }
        parameters.push(paramValue);
      }
    }
    let p = Promise.resolve(fn.apply(self, parameters));
    if(!cbYes && p) {
      p.then(resolve, reject);
    }
  });
};

