/**
 * Created by Ralph Varjabedian on 12/6/17.
 *
 * A class responsible for wrapping a step and doing operations on it
 *
 */

const helper = require('./helper.js');
const stepProperties = require('./step-properties.js');
const actionProperties = require('./action-properties');

const actionPropertyTypesIgnoreList = ["locator"];
const stepPropertiesToNotTestOrPrune = ["action", "runtime", "expandedStep", "continue", "title", "error"];

class Step {
  constructor() {
  }

  //region public
  /**
   * Process and Prepare this step before being used for testing
   * @param actions
   */
  async processStepStructure(actions, driverAndActionsDI) {
    await this._validateStepAndPullValues(driverAndActionsDI, actions);
    this.runtime = {};

    const action = actions[this.action.toLowerCase()];

    if(action[actionProperties.isTest] || (this.action === "custom" && this[stepProperties.isTest])) {
      this.runtime.test = true;
      this.runtime.result = true; // by default
    }
    if(action[actionProperties.skipScreenshot] || (this.action === "custom" && this[stepProperties.skipScreenshot])) {
      this.runtime.skipScreenshot = true;
    }

    if(this.hasOwnProperty(stepProperties.continue)) { //overrides the action value
      this.runtime.continue = this[stepProperties.continue];
    }
    else if(action.continue) {
      this.runtime.continue = action.continue;
    }
  }

  /**
   * Process and step's action and see if it has before/after which may or may not create additional steps (expand the current step)
   * @param actions
   * @param driverAndActionsDI
   * @returns {Promise<Array>}
   */
  async expandStep(actions, driverAndActionsDI) {

    const expandedSteps = [];
    const action = this[stepProperties.action].toLowerCase();

    if(actions[action] && actions[action].before) {
      const newStep = await driverAndActionsDI.callDiFunction(helper.clone(this), actions[action].before);
      if(newStep) {
        Object.setPrototypeOf(newStep, Step.prototype);
        await newStep._pruneExtraProperties(driverAndActionsDI, actions);
        await newStep.processStepStructure(actions, driverAndActionsDI);
        newStep.expandedStep = true;
        expandedSteps.push(newStep);
      }
    }

    expandedSteps.push(this);

    if(actions[action] && actions[action].after) {
      const newStep = await driverAndActionsDI.callDiFunction(helper.clone(this), actions[action].after);

      if(newStep) {
        Object.setPrototypeOf(newStep, Step.prototype);
        await newStep._pruneExtraProperties(driverAndActionsDI, actions);
        await newStep.processStepStructure(actions, driverAndActionsDI);
        newStep.expandedStep = true;
        expandedSteps.push(newStep);
      }
    }

    return expandedSteps;
  }
  //endregion

  //region private
  /**
   * Validate the step, several sanity checks
   * @param actions
   * @private
   */
  async _validateStepAndPullValues(driverAndActionsDI, actions) {
    // action should be there
    if(!this.action) {
      throw new Error("action missing");
    }
    // action should be valid
    if(!actions[this.action.toLowerCase()]) {
      throw new Error("Unknown action:" + this.action);
    }
    const action = actions[this.action.toLowerCase()];
    if(action.properties) {
      for(let property in action.properties) {
        await this._validateProperty(driverAndActionsDI, property, action.properties[property]);
      }
      const actionPropertiesKeys = Object.keys(action.properties);
      const unsupportedProperties = Object.keys(this)
        .filter(a => stepPropertiesToNotTestOrPrune.indexOf(a) === -1)
        .filter(stepProperty => !actionPropertiesKeys.find(ack => stepProperty === ack));
      if(unsupportedProperties.length) {
        throw new Error(`The following properties: '${unsupportedProperties}' on step with action: '${this.action}' are not defined and thus not allowed`);
      }
    }
  }

  /**
   * When a step is cloned and given to before/after functions of an action, after it is returned, we make sure not
   * to leave an properties that do not belong to the new defined action
   * @param actions
   * @private
   */
  async _pruneExtraProperties(driverAndActionsDI, actions) {
    // action should be there
    if(!this.action) {
      throw new Error("action missing");
    }
    // action should be valid
    if(!actions[this.action.toLowerCase()]) {
      throw new Error("Unknown action:" + this.action);
    }
    const action = actions[this.action.toLowerCase()];
    if(action.properties) {
      for(let property in action.properties) {
        await this._validateProperty(driverAndActionsDI, property, action.properties[property]);
      }
      const actionPropertiesKeys = Object.keys(action.properties);
      const unsupportedProperties = Object.keys(this)
        .filter(a => stepPropertiesToNotTestOrPrune.indexOf(a) === -1)
        .filter(stepProperty => !actionPropertiesKeys.find(ack => stepProperty === ack));
      unsupportedProperties.forEach(propToRemove => delete this[propToRemove]);
    }
  }

  /**
   * Validate a single property of a step against the defined properties that are defined on the action itself
   * @param propertyName
   * @param propertyObject
   * @private
   */
  async _validateProperty(driverAndActionsDI, propertyName, propertyObject) {
    // test mandatory
    if(propertyObject.mandatory && !this.hasOwnProperty(propertyName)) {
      throw new Error(`step with action: ${this.action} is missing the mandatory property: ${propertyName}`);
    }
    // test the proper type
    if(propertyObject.type && this[propertyName] && !actionPropertyTypesIgnoreList.find(a => a === propertyObject.type)) {
      let typeOfProperty = typeof(this[propertyName]);
      if(typeOfProperty !== propertyObject.type && typeOfProperty === "function") {
        this[propertyName] = await driverAndActionsDI.callDiFunction(this, this[propertyName]);
        typeOfProperty = typeof(this[propertyName]);
      }
      if(typeOfProperty !== propertyObject.type) {
        throw new Error(`step with action: ${this.action} has a property: ${propertyName} with different type than expected. Expected: '${propertyObject.type}' Found: '${typeOfProperty}'`);
      }
    }
  }
  //endregion
}

module.exports = Step;