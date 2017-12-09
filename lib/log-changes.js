/**
 * Created by Ralph Varjabedian on 11/29/15.
 *
 * A file responsible for modifying the standard console.log format and adding few helper functions for console logging
 */

console.cinnamon = {};
console.cinnamon.olog = console.log;

console.cinnamon.log = function() {
  let array = Array.prototype.slice.call(arguments, 0);
  if(console.cinnamon.addSubTree) {
    array = ["├─"].concat(array);
  }
  console.cinnamon.olog.apply(this, ["\033[1;34m[cinnamonjs]\033[0m"].concat(array));
};

/*if(!global.isTestMode) {
  console.log = console.cinnamon.log;
}*/

console.cinnamon.plog = function() {
  let array = Array.prototype.slice.call(arguments, 0);
  if(console.cinnamon.addSubTree) {
    array = ["├─"].concat(array);
  }
  console.cinnamon.olog.apply(this, ["\033[1;33m[cinnamonjs]\033[0m"].concat(array));
};

console.cinnamon.warn = function() {
  let array = Array.prototype.slice.call(arguments, 0);
  if(console.cinnamon.addSubTree) {
    array = ["├─"].concat(array);
  }
  console.warn.apply(this, ["\033[1;31m[cinnamonjs]\033[0m"].concat(array));
};
