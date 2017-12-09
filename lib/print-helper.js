/**
 * Created by Ralph Varjabedian on 11/29/15.
 *
 * A file that helps with printing header and help information when using the cli without parameters
 */
'use strict';

let actions = require("./actions.js");
let keys = Object.keys(actions);

module.exports = {
  printHeader: function() {
    const version = require("../package.json").version;
    const name = require("../package.json").name;
    console.cinnamon.olog("[".cyan.bold + name + "]".cyan.bold, "version", version.green, "\r\n");
  },
  printActions: function() {
    for(let i = 0; i < keys.length; i++) {
      let key = keys[i];
      console.cinnamon.olog(" Action:", "'" + key.underline.cyan.bold + "'", actions[key].description.yellow);
      if(actions[key].properties) {
        console.cinnamon.olog("\t", "Properties:".blue.bold);
        for(let p in actions[key].properties) {
          console.cinnamon.olog("\t\t", p.blue + ":".blue, "(" + actions[key].properties[p].type + ")", (actions[key].properties[p].mandatory ? "(mandatory) " : "") +
                                                                                                        actions[key].properties[p].description);
        }
      }
      console.cinnamon.olog();
    }
  }
};
