'use strict';

const path = require("path");
const config = require("../config.js");
const helper = require("../lib/helper.js");

describe('testing', function() {
  global.isTestMode = true;
  this.timeout(0);

  it('running tests without any arguments', function(done) {
    require("../lib/index.js")().thencb(done);
  });

  it('running tests of the folder /tests/', function(done) {
    // pass the file to test instead of command line arguments
    require("../lib/index.js")(path.normalize(path.join(__dirname, "./tests/"))).thencb(done);
  });

  it('running tests of the folder /tests/ with screenShotVerbose=1', function(done) {
    config.screenShotsVerbose = 1;
    require("../lib/index.js")(path.normalize(path.join(__dirname, "./tests/for-coverage.js"))).thencb(done);
  });

  it('running console.cinnamon.log tests', function(){
    console.cinnamon.log("log output");
    console.cinnamon.warn("warn output");
    console.cinnamon.addSubTree = true;
    console.cinnamon.log("log output");
    console.cinnamon.warn("warn output");
    console.cinnamon.addSubTree = false;
  });

  it('running helper tests', function(){
    helper.fancyElapsed(3666);
  });
});

