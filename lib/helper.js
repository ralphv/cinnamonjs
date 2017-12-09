/**
 * Created by Ralph Varjabedian on 12/3/17.
 *
 * General helper singleton
 */

module.exports = {
  elapsed: function(startTime) {
    const diff = process.hrtime(startTime);
    return Math.round((diff[0] * 100000) + (diff[1] / 1e4)) / 100; // in milliseconds
  },
  fancyElapsed: function(seconds) {
    const _mod = function(value, mod) {
      return {c: Math.floor(value / mod), r: Math.ceil(value % mod)};
    };
    let res = _mod(seconds, 60);
    seconds = res.r;
    let minutes = res.c;
    res = _mod(minutes, 60);
    minutes = res.r;
    let hours = res.c;

    let result = "";
    if(hours) {
      result += hours + " hour";
      if(hours !== 1) {
        result += "s";
      }
      result += " ";
    }
    if(minutes) {
      result += minutes + " minute";
      if(minutes !== 1) {
        result += "s";
      }
      result += " ";
    }
    if(seconds) {
      result += seconds + " second";
      if(seconds !== 1) {
        result += "s";
      }
      result += " ";
    }
    return result.trim();
  },
  clone: function(obj) {
    const newObj = {};
    Object.keys(obj).forEach(k => newObj[k] = obj[k]);
    return newObj;
  },
  addProperties: function(obj, src) {
    Object.keys(src).forEach(function(k) {
      obj[k] = src[k];
    });
  }
};