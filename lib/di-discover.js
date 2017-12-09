/**
 * Created by Ralph Varjabedian on 11/28/15.
 *
 *  A helper function that "discovers" functions (figure out the parameters names) so that it can be used in dependency injection
 */
'use strict';

const fillInParamsRegex = {
  FN_ARGS: /^function\s*[^\(]*\(\s*([^\)]*)\)/m, FN_ARG_SPLIT: /,/, FN_ARG: /^\s*(_?)(\S+?)\1\s*$/, STRIP_COMMENTS: /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg
};

module.exports = function(fn, forceTyped, ignoreFirst, ignoreLast) {
  let array = [];
  let fnText = fn.toString();
  if(fnText.indexOf("=>") !== -1) {
    throw new Error("dependency injection discover function does not support fat arrow format");
  }
  if(!ignoreFirst) {
    ignoreFirst = 0;
  }
  if(!ignoreLast) {
    ignoreLast = 0;
  }
  fnText = fnText.replace(fillInParamsRegex.STRIP_COMMENTS, '');
  let argDeclaration = fnText.match(fillInParamsRegex.FN_ARGS);
  let arg = [];
  if(argDeclaration && argDeclaration[1]) {
    arg = argDeclaration[1].split(fillInParamsRegex.FN_ARG_SPLIT);
  }
  for(let x = ignoreFirst; x < arg.length - ignoreLast; x++) { // ignore last one, should be cb
    (function(arg) {
      arg.replace(fillInParamsRegex.FN_ARG, function(all, underscore, name) {
        let element = {};
        element.name = name;
        array.push(element);
      });
    })(arg[x]);
  }
  return {args: array, totalArgsCount: arg.length};
};
