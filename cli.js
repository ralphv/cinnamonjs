#!/usr/bin/env node
'use strict';
const path = require("path");

require("./lib/index.js")(process.argv[2] ? path.join(process.cwd(), process.argv[2]) : null);

