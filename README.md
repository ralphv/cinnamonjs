# [cinnamonjs](http://cinnamonjs.com) - A data driven approach to E2E testing

[![NPM](https://nodei.co/npm/cinnamonjs.png?mini=true)](https://nodei.co/npm/cinnamonjs/)

* [Features](#features)
* [Getting started](#getting-started)
* [Defining test files](#defining-test-files)
* [Defining steps](#defining-steps)
* [List of Actions](#list-of-actions)
* [Examples of steps](#examples-of-steps)
* [Reports](#reports)
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
* Ability to sniff XMLHttpRequest calls (works over https). Check sniffer.test.js under Samples folder.

With this approach, your test files are more readable, easier to maintain and can be written by non developers.

## Getting started

    $ npm install -g cinnamonjs
    
After installing cinnamonjs, it will install [selenium-webdriver](https://www.npmjs.com/package/selenium-webdriver). However selenium-webdriver still needs additional components once installed. Please
refer to the [selenium-webdriver](https://www.npmjs.com/package/selenium-webdriver) page for further instructions.
    
To run tests you can either specify an individual test file directly (or a list of files separated by a comma)    

    $ cinnamonjs samples/google.test.js
    
Or you can specify a directory full of test files with file names ending with `.test.js`

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
  {action: "set.browser", browser: "chrome"},
  {action: "start"},
  {action: "browser.set.size", width: 1024, height: 768},
  {action: "browse", url: "http://www.google.com/ncr"},
  {action: "send.keys", locator: {name: "q"}, keys: "cinnamonjs"},
  {action: "send.keys", locator: {name: "q"}, keys: Key.RETURN},
  {action: "wait.title", "page.title": "cinnamonjs - Google Search"},
  {action: "test.element.exists", title:"waiting for the result of the search", locator: {id: "pnnext"}}
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

### Category: wait
```
'wait' - wait for milliseconds

* properties:
   'for' - (mandatory) (number) The milliseconds to wait for
```
```
'wait.element.exists' - waits for element to exist

* properties:
   'locator' - (mandatory) (locator) DOM locator
```
```
'wait.element.not.displayed' - waits for element to not exist or not be visible

* properties:
   'locator' - (mandatory) (locator) DOM locator
   'timeout' - (number) The timeout to wait for, defaults to 10000 milliseconds
```
```
'wait.element.not.exists' - waits for element to not exist

* properties:
   'locator' - (mandatory) (locator) DOM locator
   'timeout' - (number) The timeout to wait for, defaults to 10000 milliseconds
```
```
'wait.element.text.change.after' - wait for an element to change it's text. used with wait.element.text.change.before

* properties:
   'locator' - (mandatory) (locator) DOM locator
   'timeout' - (mandatory) (number) maximum time to wait in milliseconds.
   'compare' - (function) A custom function to compare with params, rhs, lhs
   'caseSensitive' - (boolean) case sensitive compare
   'trim' - (boolean) trimming before compare
   'not' - (boolean) not equality
   'textFromAttributeValue' - (boolean) flag to get string from attribute 'value' instead of text of element
```
```
'wait.element.text.change.before' - remember an element's current text, to be used with wait.element.text.change.after

* properties:
   'locator' - (mandatory) (locator) DOM locator
   'textFromAttributeValue' - (boolean) flag to get string from attribute 'value' instead of text of element
```
```
'wait.not.text' - test that text does not exist

* properties:
   'text' - (mandatory) (string) the text to assert doesn't exist
   'timeout' - (number) The timeout to wait for, defaults to 10000 milliseconds
```
```
'wait.not.text.displayed' - test that text does not exist or is hidden

* properties:
   'text' - (mandatory) (string) the text to assert doesn't exist or hidden
   'timeout' - (number) The timeout to wait for, defaults to 10000 milliseconds
```
```
'wait.text' - wait for any element with text

* properties:
   'text' - (mandatory) (string) the text to assert doesn't exist
   'timeout' - (number) The timeout to wait for, defaults to 10000 milliseconds
```
```
'wait.title' - wait for the page title

* properties:
   'page.title' - (mandatory) (string) wait until the title matches this
   'timeout' - (number) The timeout to wait for, defaults to 10000 milliseconds
```
### Category: browser
```
'browser.maximize' - maximize browser window
```
```
'browser.scroll.bottom' - scroll to bottom of page
```
```
'browser.scroll.to.element' - scroll to element

* properties:
   'locator' - (mandatory) (locator) DOM locator
```
```
'browser.scroll.top' - scroll to top of page
```
```
'browser.set.size' - set browser window to specific size

* properties:
   'width' - (mandatory) (number) Width required
   'height' - (mandatory) (number) Height required
```
```
'browser.sniffer.collect' - collect data from XmlHttpRequest sniffer that is already attached. The result is an array of Ajax calls (request/response data).

* properties:
   'setResult' - (function) The function to call to set the result to
   'result' - (string) The context variable name to fill the result in
```
```
'browser.sniffer.start' - attaches sniffer to XmlHttpRequest ajax calls, must be done AFTER page loads.
```
### Category: test
```
'test.element.disabled' - tests if an element is disabled

* properties:
   'locator' - (mandatory) (locator) DOM locator
```
```
'test.element.enabled' - tests if an element is enabled

* properties:
   'locator' - (mandatory) (locator) DOM locator
```
```
'test.element.exists' - tests if an element exists

* properties:
   'locator' - (mandatory) (locator) DOM locator
```
```
'test.element.text' - test element's text

* properties:
   'locator' - (mandatory) (locator) DOM locator
   'text' - (mandatory) (string) The text to compare with
   'compare' - (function) A custom function to compare with params, rhs, lhs
   'caseSensitive' - (boolean) case sensitive compare
   'trim' - (boolean) trimming before compare
   'not' - (boolean) not equality
   'textFromAttributeValue' - (boolean) flag to get string from attribute 'value' instead of text of element
```
```
'test.text.exists' - test for any element with the specified text

* properties:
   'text' - (mandatory) (string) The text to search for
```
### Category: set
```
'set.browser' - change driver of browser

* properties:
   'browser' - (mandatory) (string) The browser name
```
```
'set.implicitwait' - set the implicitlyWait (implicit timeout) of the driver

* properties:
   'wait' - (mandatory) (number) The amount to wait for in milliseconds
```
```
'set.text' - set text of an element

* properties:
   'locator' - (mandatory) (locator) DOM locator
   'value' - (string) The value to set
```
```
'set.value' - set attribute 'value' of an element

* properties:
   'locator' - (mandatory) (locator) DOM locator
   'value' - (string) The value to set
```
### Category: get
```
'get.text' - get text of an element

* properties:
   'locator' - (mandatory) (locator) DOM locator
   'setResult' - (function) The function to call to set the result to
   'result' - (string) The context variable name to fill the result in
```
```
'get.value' - get attribute 'value' of an element

* properties:
   'locator' - (mandatory) (locator) DOM locator
   'setResult' - (function) The function to call to set the result to
   'result' - (string) The context variable name to fill the result in
```
### Category: switch
```
'switch.to' - switch to iframe

* properties:
   'name' - (mandatory) (string) name of iframe
```
```
'switch.to.default' - switch to default content
```
### Category: Others
```
'custom' - custom function

* properties:
   'fn' - (mandatory) (function) The function to execute, it's parameters are injected, if cb is specified it will work in callback mode otherwise, it expects a promise to be returned
```
```
'dropdown.select' - click an element

* properties:
   'locator' - (mandatory) (locator) DOM locator
   'value' - (mandatory) (string) The value to select
```
```
'browse' - browse to a url

* properties:
   'url' - (mandatory) (string) The url to browse to
```
```
'assert' - asserts condition is true

* properties:
   'condition' - (mandatory) (boolean) The condition to assert
```
```
'info' - add info for reporting

* properties:
   'info' - (mandatory) (null) The info to add for reporting
```
```
'send.keys' - sendKeys to an element

* properties:
   'locator' - (mandatory) (locator) DOM locator
   'keys' - (mandatory) (string) The string to send
   'password' - (boolean) Turn off verbose if this field is a password
```
```
'clear.element' - clears an element from text

* properties:
   'locator' - (mandatory) (locator) DOM locator
```
```
'start' - start driver, must be the first step in every testing file
```
```
'click' - click an element

* properties:
   'locator' - (mandatory) (locator) DOM locator
```
```
'context' - an easy way to setup $context

* properties:
   'context' - (mandatory) (object) the context to set
```
```
'end' - ends driver session
```

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

## Reports

Cinnamonjs keeps a comprehensive running log of all the steps in memory.
It also flushes a temporary file periodically called `cinnamonjs.running.log.json` in case of a crash, it is removed if the process exists without problems.
When cinnamonjs is done, it calls one or more 'report' modules. The default is `["json", "html-offline"]` 

json: is a simple report module that just saves the running log as 'log.json' file under the reporting folder.

html-offline: is a very comprehensive html based report. This module generates one file called 'report-offline.html' that can be opened offline. 

The report contains the following information:

* Date/time of the test run.
* Total number of files.
* Total number of steps (including run, failed and skipped).
* Total time elapsed.
* The main view contains 4 tabs that give the following information:
  * Tests: A tab that shows only the steps that are 'test' steps.
  [[./docs/images/report-tab-1.png|alt=Tests]]
  * All steps: A tab that shows the full list of steps.
  [[./docs/images/report-tab-2.png|alt=All steps]]
  * Charts: A tab that shows a bar chart with the list of steps alongside their execution time.
  [[./docs/images/report-tab-3.png|alt=Charts]]
  * Screenshots: A tab that shows for each step, a screenshot of the browser.
  [[./docs/images/report-tab-4.png|alt=Screenshots]]  

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

* 1.0.00: 3 new actions, assert, browser.sniffer.start and browser.sniffer.collect. Check sniffer.test.js in samples.
* 0.9.14: Info action should show in first tab.
* 0.9.13: Documentation was messed up.
* 0.9.12: Fixing documentation and action descriptions of timeouts.
* 0.9.11: Adding 3 scroll actions.
* 0.9.10: Minor fixes.
* 0.9.9:  Fixing samples.
* 0.9.8:  Error handling fixes and adding actions.
* 0.9.7:  Adding actions.
* 0.9.6:  Minor fixes.
* 0.9.5:  Windows fix.
* 0.9.4:  Windows fix.
* 0.9.3:  Windows fix.
* 0.9.2:  Windows fix.
* 0.9.1:  Initial version.