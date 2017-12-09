'use strict';

module.exports = {
  verbose: 0,
  browser: "firefox", // default browser to start the test with, for chrome you need to add the driver manually to selenium-webdriver
  defaultWaitTimeout: 10000, // for operations that have to wait, like page load, find element load and so on
  defaultNotWaitTimeout: 2000, // for operations that have to wait to NOT find an element (negative logic), to make sure something is not there
  reports: ["json", "html-offline"], // default set of reports, json: the standard json, html-offline: a fancy nice html based report. Each report name should correspond to a .js file under lib/reports
  reportsOutputFolder: "output", // output folder for reports
  screenShotsVerbose: 2 //0 turn off, 1 = failed only, 2 = all steps
};
