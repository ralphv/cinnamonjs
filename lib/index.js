/**
 * Created by Ralph Varjabedian on 11/28/15.
 *
 * The main entry point of cinnamonjs and the bulk of the functions that handle steps
 *
 */
'use strict';

require('colors');
const fs = require("fs");
const path = require('path');
const assert = require('assert');
require('./log-changes.js');
require("require-inject-scope");
require("./promise-thencb.js");
const Step = require("./step.js");
const config = require("../config.js");
const helper = require('./helper.js');
const actions = require("./actions.js");
const RunningLog = require("./running-log.js");
const printHelper = require('./print-helper.js');
const driverAndActionsDI = require('./driver-actions-di.js');
const stepProperties = require('./step-properties');

//region Dependency Injection engine for actions functions and WebDriver management
driverAndActionsDI.initialize();
//endregion

//region setup crash log, try to flush whatever log we have to reports
process.on('uncaughtException', async function(err) {
  console.cinnamon.plog('Un-Caught exception:'.red, err);
  console.cinnamon.plog('Will attempt to create unfinished reports'.red);
  try {
    const i = runningLog.getLog().files[runningLog.getLog().files.length - 1].steps.length - 1;
    const entry = {
      action: "exception",
      runtime: {title: err.toString(), elapsed: 0, i: i, test: true, result: false},
      exception: err
    };
    runningLog.getLog().files[runningLog.getLog().files.length - 1].steps.push(entry);
    if(driverAndActionsDI.isWebDriverActive()) {
      driverAndActionsDI.takeScreenshot(async function(err, base64data) {
        entry.runtime.base64Screenshot = base64data;
        await runningLog.createReports();
        runningLog.removeRunningLog();
        process.exit(1);
      });
    }
    else {
      await runningLog.createReports();
      runningLog.removeRunningLog();
      process.exit(1);
    }
  }
  catch(e) {
    process.exit(1);
  }
});
//endregion

function getCurrentTime() {
  return (new Date()).toLocaleTimeString();
}

/**
 * Run the test for a single step
 * @param fileIndex
 * @param allStepsIndex
 * @param stepIndex
 * @param majorStepIndex
 * @param step
 * @param totalFiles
 * @param totalSteps
 * @param totalMajorSteps
 * @param stepsLog
 * @returns {Promise<void>}
 */
async function doTestForStep(fileIndex, allStepsIndex, stepIndex, majorStepIndex, step, totalFiles, totalSteps, totalMajorSteps, stepsLog) {
  const action = step[stepProperties.action].toLowerCase();
  // call target
  if(totalFiles > 1) {
    console.cinnamon.plog("┌─ (" + getCurrentTime() + ") " +
                                      fileIndex +
                                      "/" +
                                      totalFiles +
                                      " -- " +
                                      (allStepsIndex + 1) +
                                      " - " +
                                      (majorStepIndex + 1) +
                                      "/" +
                                      totalMajorSteps +
                                      ":" +
                                      (stepIndex + 1) +
                                      "/" +
                                      (totalSteps) +
                                      " -", "[".cyan +
                                            step[stepProperties.action].green +
                                            "]".cyan, ">>");
  } else {
    console.cinnamon.plog("┌─ (" + getCurrentTime() + ") " + (allStepsIndex + 1) + " - " + (majorStepIndex + 1) + "/" + totalMajorSteps + ":" + (stepIndex + 1) + "/" + (totalSteps) + " -", "[".cyan +
                                                                                                                                                                             step[stepProperties.action].green +
                                                                                                                                                                             "]".cyan, ">>");
  }
  console.cinnamon.addSubTree = true;
  step.runtime.start = process.hrtime(); // start timing right before calling action

  try {
    await driverAndActionsDI.callDiFunction(step, actions[action].fn);
  }
  catch(err) {
    if(step[stepProperties.error]) { // there is an error and a better description is found
      err = {error: step[stepProperties.error], details: arguments[0]};
    }
    step.runtime.result = false;
    if(!step.runtime.test || !step.runtime.continue) {// this is a test with error, but continue was instructed
      throw err;
    }
  }

  step.runtime.elapsed = helper.elapsed(step.runtime.start); // stop timing right after calling action
  if(step[stepProperties.title]) {
    step.runtime.title = step[stepProperties.title]; // overriding title if it was originally provided by test designer.
  }
  stepsLog.push(step); // add the steps with new stuff to an array for reporting
  console.cinnamon.addSubTree = false;
  if(step.runtime.test) {
    console.cinnamon.plog("└─" + "[".cyan + step[stepProperties.action].cyan + "]".cyan, "<<", step.runtime.result ? "[PASSED]".green : "[FAILED]".red, ("(" + step.runtime.elapsed).grey + ")".grey);
  } else {
    console.cinnamon.plog("└─" + "[".cyan + step[stepProperties.action].cyan + "]".cyan, "<<", ("(" + step.runtime.elapsed).grey + ")".grey);
  }
  runningLog.flushRunningLog();

}

/**
 * Things to do before processing a step
 * @param step
 */
function beforeEachStep(step) {
  Object.freeze(step);
}

/**
 * Things to do after processing a step
 * @param step
 * @returns {Promise<any>}
 */
function afterEachStep(step) {
  return new Promise((resolve, reject) => {
    if(!driverAndActionsDI.isWebDriverActive()) {
      return resolve();
    }
    if(config.screenShotsVerbose === 2) {
      if(step.runtime.skipScreenshot) {
        return resolve();
      } else {
        driverAndActionsDI.takeScreenshot(function(err, base64data) {
          if(err) {
            return reject(err);
          }
          step.runtime.base64Screenshot = base64data;
          resolve();
        });
      }
    }
    else if(config.screenShotsVerbose === 1) {
      if(step.runtime.test && !step.runtime.result) {
        driverAndActionsDI.takeScreenshot(function(err, base64data) {
          if(err) {
            return reject(err);
          }
          step.runtime.base64Screenshot = base64data;
          resolve();
        });
      } else {
        resolve();
      }
    } else {
      resolve();
    }
  });
}

/**
 * Run the tests (steps) for a single file
 * @param filename
 * @param fileIndex
 * @param totalFiles
 * @param stepsLog
 * @returns {Promise<void>}
 */
async function doTestForFile(filename, fileIndex, totalFiles, stepsLog) {

  //*/ decide on the stuff that are injected into the scope of the test file
  let testFile = require([filename, driverAndActionsDI.getTestFileRequireInject()]);
  //*/ so we have two format for the test file, document those.
  if(Array.isArray(testFile)) {
    // if just array then create the parent object with steps in it
    testFile = {steps: testFile};
  }
  if(testFile.skip) {
    return;
  }

  //region expand the steps that are functions
  const steps = [];
  // first step, any array element that is a function should be called, this is so it is given a chance to use local variables in a block
  testFile.steps.forEach(step => {
    if(typeof(step) === "function") {
      Array.prototype.push.apply(steps, step());
    } else {
      steps.push(step);
    }
  });
  //endregion
  steps.forEach(step => Object.setPrototypeOf(step, Step.prototype));

  console.cinnamon.olog();
  console.cinnamon.plog("Starting tests for:", filename.blue.bold.underline, "steps:", steps.length);
  // index of current step because the steps may expand dynamically
  let allStepsIndex = -1;

  for(let majorStepIndex = 0; majorStepIndex < steps.length; majorStepIndex++) {
    const expandedCurrentSteps = await steps[majorStepIndex].expandStep(actions, driverAndActionsDI);
    for(let currentStepIndex = 0; currentStepIndex < expandedCurrentSteps.length; currentStepIndex++) {
      allStepsIndex++;
      const step = expandedCurrentSteps[currentStepIndex];
      await step.processStepStructure(actions, driverAndActionsDI);
      step.runtime.i = allStepsIndex;
      beforeEachStep(step);
      try {
        await doTestForStep(fileIndex, allStepsIndex, currentStepIndex, majorStepIndex, step, totalFiles, expandedCurrentSteps.length, steps.length, stepsLog);
      }
      catch(err) {
        console.cinnamon.plog("(" + getCurrentTime() + ") Tests aborted".red.inverse + " for:", filename.red.bold.underline, "(" + (allStepsIndex + 1) + "/" + steps.length + ")");
        console.cinnamon.plog("Error:".red.underline, err, "\r\n");
        for(let r = allStepsIndex + 1; r < steps.length; r++) {
          // there were some steps we didn't do
          if(!steps[r].runtime) {
            steps[r].runtime = {};
          }
          steps[r].runtime.skipped = true;
          stepsLog.push(steps[r]);
        }
        throw err;
      }
      assert(stepsLog.length === allStepsIndex + 1);
      afterEachStep(step);
    }
  }

  console.cinnamon.plog("Finished tests for:", filename.blue.bold.underline, "(" + steps.length + "/" + steps.length + ")", "\r\n");
}

//region main
const runningLog = new RunningLog();

module.exports = async function(targetToTest) {
  return new Promise(async (resolve) => {
    try {
      //region check command line arguments
      printHelper.printHeader();
      if(!targetToTest) {
        printHelper.printActions();
        return resolve();
      }
      //endregion

      //region load command line configurations
      require("../cmd_to_config.js");
      //endregion


      //region fill in the files to test
      const filesToTest = [];
      targetToTest = targetToTest.split(",");
      targetToTest = targetToTest.map(appendPathToFileIfRelative);
      targetToTest.forEach(targetToTest => {
        const stat = fs.statSync(targetToTest);
        if(stat.isDirectory()) {
          fs.readdirSync(targetToTest)
            .filter(file => file.endsWith(".test.js"))
            .map(file => path.join(targetToTest, file))
            .forEach(file => filesToTest.push(file));
        }
        else {
          filesToTest.push(targetToTest);
        }
      });
      //endregion

      let currentFileIndex = 1;
      console.cinnamon.plog("Will do tests for", filesToTest.length, "files");

      //region test each file
      for(let file of filesToTest) {
        // for each test, create parameters object that will be used in dependency injection
        driverAndActionsDI.resetDiParametersObject();
        const testLog = runningLog.addTestFile(file, currentFileIndex, filesToTest.length);

        await doTestForFile(file, currentFileIndex++, filesToTest.length, testLog.steps);
        driverAndActionsDI.quitDriver();
        if(driverAndActionsDI.getDiParametersObject().info && driverAndActionsDI.getDiParametersObject().info.info) {
          testLog.info = driverAndActionsDI.getDiParametersObject().info.info;
        }
        testLog.elapsed = helper.elapsed(testLog.start);
        testLog.fancyElapsed = helper.fancyElapsed(testLog.elapsed / 1000);
      }
      //endregion

      //region create reports
      await runningLog.createReports();
      runningLog.removeRunningLog();
      //endregion

      resolve();
    }
    catch(err) {
      console.cinnamon.plog("Top-level Error:".red.underline, err, err.stack, "\r\n");
      await runningLog.createReports();
      runningLog.removeRunningLog();
    }
  });

};

function appendPathToFileIfRelative(file) {
  if (path.isAbsolute(file))
    return file;
  return path.normalize(path.join(process.cwd(), file));
}
//endregion

