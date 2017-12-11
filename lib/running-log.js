/**
 * Created by Ralph Varjabedian on 12/3/17.
 *
 * A class responsible for creating an instance of a RunningLog
 * The RunningLog keeps all the information and results of all the steps performed so that it can be consumed by a reporting tool at the end of the test.
 */
'use strict';

const fs = require("fs");
const path = require('path');
const createReports = require("./reports").createReports;

class RunningLog {
  constructor() {
    this.log = {Date: new Date(), files: []};
  }

  addTestFile(file, currentFileIndex, filesToTestLength) {
    let testFile = {
      file: file,
      shortFile: file.substring(file.lastIndexOf("/")),
      start: process.hrtime(),
      currentFile: currentFileIndex,
      totalFiles: filesToTestLength,
      steps: []
    };
    this.log.files.push(testFile);
    return testFile;
  }

  getLog() {
    return this.log;
  }

  flushRunningLog() {
    fs.writeFileSync(path.join(process.cwd(), "cinnamonjs.running.log.json"), JSON.stringify(this.log, null, 2));
  }

  removeRunningLog() {
    try {
      fs.unlinkSync(path.join(process.cwd(), "cinnamonjs.running.log.json"));
    }
    catch(e) {

    }
  }

  createReports() {
    return createReports(this.log);
  }

}

module.exports = RunningLog;

