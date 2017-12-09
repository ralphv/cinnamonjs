'use strict';

const fs = require('fs');
require("require-inject-scope");

module.exports = function(grunt) {
  grunt.initConfig({
    test: {
      testFilesPattern: "test/*.test.js",
      reporter: "spec"
    },
    cover: {
      root: "lib",
      buildFolder: "./cov-reports",
      testFilesPattern: "test/*.test.js"
    },
    // don't modify below this line
    mochaTest: {
      test: {
        options: {
          reporter: '<%= test.reporter %>',
          bail: true,
          timeout: 0
        },
        src: ['<%= test.testFilesPattern %>']
      }
    },
    clean: {
      coverage: ['<%= cover.buildFolder %>', '.sonar']
    },
    shell: {
      create_coverageFolders: {
        command: [
          'test -d <%= cover.buildFolder %>', 'mkdir -p <%= cover.buildFolder %>'
        ].join('||')
      },
      istanbul_cover: {
        options: { stdout: true },
        command: "istanbul cover --root <%= cover.root %> --preserve-comments --report lcov --dir <%= cover.buildFolder %> _mocha -R grunt test"
      },
      sonar: {
        options: { stdout: true },
        command: 'sonar-runner'
      }
    },
    coveralls: {
      // Options relevant to all targets
      options: {
        // When true, grunt-coveralls will only print a warning rather than
        // an error, to prevent CI builds from failing unnecessarily (e.g. if
        // coveralls.io is down). Optional, defaults to false.
        force: false
      },

      your_target: {
        // LCOV coverage file (can be string, glob or array)
        src: './cov-reports/lcov.info',
        options: {
          // Any options for just this target
        }
      }
    }
  });

  grunt.loadNpmTasks("grunt-mocha-test");
  grunt.loadNpmTasks("grunt-shell");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks('grunt-coveralls');

  grunt.registerTask("test", "Task to do units tests", ['mochaTest:test']);
  grunt.registerTask("cover", "Alias to coverage", ['coverage']);
  grunt.registerTask("coverage", "Task to perform coverage on this project", ['shell:create_coverageFolders', 'shell:istanbul_cover']);
  grunt.registerTask("sonar_coverage", "Task to perform coverage on this project and submit to sonar", ['clean:coverage', 'shell:create_coverageFolders', 'shell:istanbul_cover', 'shell:sonar', 'clean:coverage']);

  grunt.registerTask('generate-readme', "generate README.md", function() {
    const actions = require("./lib/actions.js");

    const actionsGrouped = Object.keys(actions).sort((a,b) => a.localeCompare(b)).reduce(function(r, a) {
      const action = actions[a];
      const subAction = action.action.substr(0, action.action.indexOf(".") !== -1 ? action.action.indexOf(".") : undefined);
      r[subAction] = r[subAction] || [];
      r[subAction].push(action);
      return r;
    }, Object.create(null));

    let actionsList = [];

    // should groups with multiple values first then the ones without values at last (group others)
    const actionGroupsKeys = Object.keys(actionsGrouped).sort((a,b) => actionsGrouped[b].length - actionsGrouped[a].length);
    let othersAdded = false;

    actionGroupsKeys.forEach(actionGroupKey => {
      let group = actionsGrouped[actionGroupKey];
      if(group.length !== 1) {
        actionsList.push("### Category: " + actionGroupKey);
      }
      else {
        if (!othersAdded) {
          actionsList.push("### Category: Others");
          othersAdded = true;
        }
      }
      group.forEach(action => {
        let str = `'${action.action}' - ${action.description}\r\n`;
        if(action.properties) {
          str += `\r\n* properties:\r\n`;
          Object.keys(action.properties).forEach(propertyKey => {
            const property = action.properties[propertyKey];
            str += `   '${propertyKey}' - `;
            str += property.mandatory ? "(mandatory) " : "";
            str += `(${property.type}) ${property.description}\r\n`;
          });
        }
        actionsList.push('```\r\n' + str + '```');
      });
    });

    let file = fs.readFileSync("README_TEMPLATE.md", {encoding: "utf8"});
    file = file.replace("${LIST_OF_ACTIONS}", actionsList.join('\r\n'));
    fs.writeFileSync("README.md", file, {encoding: "utf8"});
  });
};

