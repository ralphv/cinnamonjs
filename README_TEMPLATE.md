# [cinnamonjs](http://cinnamonjs.com) - A data driven approach to E2E testing

[![NPM](https://nodei.co/npm/cinnamonjs.png?mini=true)](https://nodei.co/npm/cinnamonjs/)

* [Features](#features)
* [Getting started](#getting-started)
* [Defining test files](#defining-test-files)
* [Defining steps](#defining-steps)
* [List of Actions](#list-of-actions)
* [Examples of steps](#examples-of-steps)
* [Fallback plan](#fallback-plan)
* [The command line](#the-command-line)
* [Help needed](#help-needed)
* [License](#license)
* [Changelog](#changelog)

## Features

* A data driven approach to E2E testing.
* Built on top of selenium-webdriver.
* Your test files are basically an array of steps, each step being a JSON object that executes an action.
* Each action defines what to do (like click or navigate) or what to test (like existence of element or value of element).

With this approach, your test files are more readable, easier to maintain and can be written by non developers.

## Getting started

    $ npm install -g cinnamonjs
    
to run tests you can either specify an individual test file directly (or a list of files separated by a comma)    

    $ cinnamonjs samples/google.test.js
    
or you can specify a directory full of test files with file names ending with `.test.js`

    $ cinnamonjs website1

## Defining test files

Each test file can be either an array of elements (called steps), each element being an object defining an action
, or the test file can export a JSON object having the following two properties:

__Arguments__

* `steps` - The array of steps.
* `skip` - A simple boolean to allow turning on/off the test for the whole file.

__Simple example__

* __Open google and search for 'cinnamonjs' and wait for results__

```js
module.exports = [
  {action: "start"},
  {action: "browser.set.size", width: 1024, height: 768},
  {action: "browse", url: "http://www.google.com/ncr"},
  {action: "send.keys", locator: {name: "q"}, keys: "cinnamonjs"},
  {action: "send.keys", locator: {name: "q"}, keys: Key.RETURN},
  {action: "wait.title", "page.title": "WebDriver - Google Search"},
  {action: "test.exists", title:"waiting for the result of the search", locator: {id: "pnnext"}}
];
```

Each test file has the following variables injected into it:

* `By` - WebDriver [By](https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_By.html) object
* `Key` - WebDriver [Key](https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_Key.html) object 
* `until` - WebDriver [until](https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/until.html) object 
* `$config` - Configuration object (see [./config.js](https://raw.githubusercontent.com/ralphv/cinnamonjs/master/config.js))
* `$context` - A JSON object that can be used as context for the current running test

## Defining steps

Each array element is called a test step, or simply a step. Each step is a JSON object that defines an action to execute.

Each step object should have at least the property `action` which defines what this step does.
Depending on the action itself, it may have other mandatory properties.

Note that any property can either be it's intended type, or
it can be a function that will be evaluated. The functions can have special parameters injected
into it using dependency injection. The following list is the parameters that can be injected:

* `driver` - the selenium web driver instance for advanced operations.
* `step` - a reference to the step object itself.
* `By` - WebDriver [By](https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_By.html) object
* `Key` - WebDriver [Key](https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_Key.html) object 
* `until` - WebDriver [until](https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/until.html) object 
* `log` - a function that can be used to log to the console.

#### Common properties of steps

The following is a list of properties that can apply to all actions:

* `action` - The action type
* `title` - The title of the action, helpful for reporting
* `locator` - [locator](#locator) to reference the [DOM](https://www.w3schools.com/jsref/dom_obj_all.asp) element
* `error` - An error description to use when this action fails, helpful for reporting
* `isTest` - Tags this step as a 'testing' step, helpful for reporting
* `skipScreenshot` - To explicitly disable screenshot on this particular step
* `continue` - In case this step is a test that fails, do not stop the testing process, continue

#### locator

The locator can have multiple formats:

* an object with id - `{id: "elementId"}`, id being the [DOM](https://www.w3schools.com/jsref/dom_obj_all.asp) element id
* an object with name - `{name: "elementName"}`, name being the [DOM](https://www.w3schools.com/jsref/dom_obj_all.asp) element name
* an object with css - `{css: "css expression"}`, css being the [CSS expression](http://www.seleniumeasy.com/selenium-tutorials/css-selectors-tutorial-for-selenium-with-examples) to search for
* an object with ngModel - `{ngModel: "ngModel variable name"}`, ngModel being the variable name bound to ngModel in AngularJS
* an object with ngClick - `{ngClick: "ngClick expression"}`, ngClick being the expression bound to ngClick in AngularJS
* an object with xpath - `{xpath: "xpath expression"}`, [xpath](https://www.guru99.com/xpath-selenium.html) being the xpath expression to search for
* \[Otherwise\], the locator can be [any valid locator.](http://www.seleniumhq.org/docs/03_webdriver.jsp#locating-ui-elements-webelements)

## List of Actions

${LIST_OF_ACTIONS}

## Examples of steps

* The start action should be the first action in each test file
```js
  {"action": "start"}
```

* If you want to configure any variables (as a context for a test file), you can use the context action
later on you can access the context in the file directly by using the variable $context
```js
  {"action": "context", "context": {"urlOfSiteToTest": "http://www.google.com", "developementEnvironment": true, "generatedRandomPassword": "lkjasdlkjasd323"}}
```

* If you want to press any keys to a target element (usually an input), you can use the send.keys action
```js
  {"action": "send.keys", "locator": {"name": "username"}, "keys": "username@test.com"}
```

* If you are sending a password and you don't want it to show in the logs
```js
  {"action": "send.keys", "locator": {"name": "password"}, "keys": "password12345", "password": true}
```

* If you are sending a password but the password was already setup in context object before 
```js
  {"action": "send.keys", "locator": {"name": "password"}, "keys": $context.generatedRandomPassword, "password": true}
```

* If you want to browse to a certain url and wait until the page's title match a certain value use this
```js
  {"action": "browse", "url": "http://www.google.com/ncr"},
  {"action": "wait.title", "page.title": "Google Search"}
```

* If you want to test for the existence of a certain element, you use this action. Note that the driver
has implicit wait already setup
```js
  {"action": "test.element.exists", "title": "waiting for the next link to show up", "locator": {"id": "pnnext"}}
```

* If you want to repeat the same action as above, but the [locator](#locator) is not known before hand, you can use a function
that will be evaluated.
```js
  {"action": "test.element.exists", "title": "waiting for the next link to show up", "locator": function(){
      return {"id": "pnnext"};
    }
  }
```

* If you have a dropdown (select) that you want to select a certain value in it
```js
  {"action": "dropdown.select", "locator":{"xpath":"/html/body/select"}, "value":"audi"}
```

* If you have a checkbox you want to select
```js
  {"action": "click", "locator": {"css": "label[for=options_2]"}}
```

* If you want to switch the driver's reference to a different iframe
```js
  {"action": "switch.to", "name": "iframeName"}
```

* If after switch to iframe, you want to switch back to main html page
```js
  {"action": "switch.to.default"}
```

* If you want to read the value of a certain input and save that value in a context variable, 
later on you can access that value with `$context.$temp_result`
```js
  {"action": "get.value", "locator": {"xpath":"/html/body/select"}, "result": "$temp_result"}
```

* If you want to clear an input element with name q
```js
  {"action": "clear.element", "locator": {"name": "q"}},
```

* If you want to get the text of a certain element and save it in $result1
```js
  {"action": "get.text", "locator": {"id": "pnnext"}, "result": "$result"}
```

* If you want to set the value of an input
```js
  {"action": "set.value", "value": "new value by set.value", "locator": {"id": "lst-ib"}}
```

* If you want to set the text of an element (innerHTML)
```js
  {"action": "set.text", "value": "new1", "locator": {"id": "pnnext"}}
```

* If you want to wait for a certain text to appear on the page
```js
  {"action": "wait.text", "text": "next"}
```

## Fallback plan

What happens if you get to a certain point in your test file and you have a functionality that isn't covered in one of the defined actions. 

This is where the `custom` action comes in. It gives you total control by providing you with the driver instance.

The `custom` action only has one property other than the action itself, it's `fn`.

`fn` is a function whose parameters are injected and the following is the list of parameters that can be injected:

* `driver` - the selenium web driver instance for advanced operations.
* `step` - a reference to the step object itself.
* `startDriver` - a function that starts the driver.
* `endDriver` - a function that ends (quits) the driver.
* `By` - WebDriver [By](https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_By.html) object
* `Key` - WebDriver [Key](https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_Key.html) object 
* `until` - WebDriver [until](https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/until.html) object 
* `log` - a function that can be used to log to the console.
* `helper` - a helper singleton with many functions, please refer to the file [./lib/actions-helper.js](https://raw.githubusercontent.com/ralphv/cinnamonjs/master/lib/actions-helper.js).

For asynchronous operation, you can either add the parameter `cb` at the end of your function defined in `fn`, or return a promise from your function.

## The command line

The command line arguments you pass serve the purpose of modifying one or more configuration properties found in [./config.js](https://raw.githubusercontent.com/ralphv/cinnamonjs/master/config.js).
The format of the arguments is in the form of X=Y, check the next samples.
You could also modify options via setOptions function.

    $ cinnamonjs param=value
    $ cinnamonjs 'param=value with spaces'
    $ cinnamonjs 'array_param=["array element 1", "array element 2"]'
    $ cinnamonjs array_param=element_one,element_two,element_three

## Help Needed

Cinnamonjs needs your contributions, mainly in creating and defining new actions.
If you think you have a new action worth adding, fork the project and submit a pull request.
Adding actions is very easy and simple, just check the source code of the folder `./lib/actions`.

## License

cinnamonjs is licensed under the [BSD-4 License](https://raw.githubusercontent.com/ralphv/cinnamonjs/master/LICENSE).

## Changelog

* 0.9.3: Windows fix.
* 0.9.2: Windows fix.
* 0.9.1: Initial version.