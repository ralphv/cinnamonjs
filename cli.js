#!/usr/bin/env node
'use strict';
const path = require("path");

require("./lib/index.js")(path.join(process.cwd(), process.argv[2]));

