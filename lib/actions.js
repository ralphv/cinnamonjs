/**
 * Created by Ralph Varjabedian on 11/28/15.
 *
 * The Actions loader, takes all the actions from the actions subdirectory and loads them and does several sanity checks on them
 */
'use strict';

const fs = require('fs');
const path = require('path');

//*/ do this with schema validator?
const actionsPropertyList = [
  {property: "action", mandatory: true},
  {property: "fn", mandatory: true},
  {property: "description", mandatory: true},
  {property: "properties", mandatory: true},
  {property: "continue", mandatory: false},
  {property: "before", mandatory: false},
  {property: "after", mandatory: false},
  {property: "isTest", mandatory: false},
  {property: "skipScreenshot", mandatory: false},
];
const actionsMandatoryPropertyArray = actionsPropertyList.filter(a => a.mandatory).map(a => a.property);

// actions should be verbs, if names (like browser) they should have a prefix explaining it (like set.browser)
const actions = module.exports = {};

function loadActionsFromDir(dir) {
  const actionsToLoad = fs.readdirSync(dir);

  for(let i = 0; i < actionsToLoad.length; i++) {
    let file = actionsToLoad[i];
    let fullPath = path.join(dir, file);
    let stat = fs.statSync(fullPath);
    if(stat.isDirectory()) {
      loadActionsFromDir(fullPath);
    } else if(fullPath.endsWith(".js")) {
      const actionData = require(fullPath);
      const properties = Object.keys(actionData);
      actionsMandatoryPropertyArray.forEach(actionsMandatoryProperty => {
        if(!properties.find(p => p === actionsMandatoryProperty)) {
          throw `Mandatory property '${actionsMandatoryProperty}' could not be found on action defined in file: ${fullPath}`;
        }
      });
      properties.forEach(property => {
        if(!actionsPropertyList.find(p => p.property === property)) {
          throw `Property '${property}' is not allowed in action in file: ${fullPath}`;
        }
      });

      actions[actionData.action] = actionData;
      if(actionData.alias) {
        if(!Array.isArray(actionData.alias)) {
          actionData.alias = [actionData.alias];
        }
        actionData.alias.forEach(a => actions[a] = actionData);
      }
      actionData.action = actionData.action.toLowerCase();
      //console.log('loaded: action', actionData.action);
    }
  }
}

loadActionsFromDir(path.join(__dirname, "actions"));
