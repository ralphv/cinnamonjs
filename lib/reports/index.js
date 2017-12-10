/**
 * Created by Ralph Varjabedian on 12/1/15.
 */
'use strict';

const fs = require("fs");
const path = require("path");
const assert = require("assert");
const config = require("../../config.js");

const isWin = /^win/.test(process.platform);
const timeSeparator = isWin ? "-" : ":";

const self = module.exports = {
  createReports: async function(log) {
    // save result file.
    const now = new Date();
    let basePath = now.getHours() + timeSeperator + now.getMinutes() + timeSeperator + now.getSeconds() + "." + now.getMilliseconds() + " " + now.getFullYear() + "-" + now.getMonth() + "-" + now.getDay();
    basePath = path.join(config.reportsOutputFolder, basePath, "/");
    self.mkdir(basePath);

    for(let item of config.reports) {
      await(async () => {
          return new Promise(function(resolve, reject) {
            console.cinnamon.plog("Creating report:", item);
            const reportJs = self.namesToFiles[item];
            assert(reportJs);
            require(reportJs)(log, basePath, function(err, data) {
              if(err) {
                reject(err);
              } else {
                resolve();
              }
            });
          });
        }
      )();
    }
  },
  mkdir: function(folder) {
    let index = folder.indexOf('/', 1);
    while(index !== -1) {
      const currentDir = folder.substr(0, index);
      try {
        fs.mkdirSync(currentDir);
      } catch(e) {
        if(!fs.statSync(currentDir).isDirectory()) {
          throw new Error(e);
        }
      }
      index = folder.indexOf('/', index + 1);
    }
  },
  namesToFiles: {
    "json": "./json.js",
    "html": "./html.js",
    "html-offline": "./html-offline.js"
  }
};