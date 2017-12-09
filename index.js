'use strict';
const path = require("path");
module.exports = require("./lib")(path.join(process.cwd(), process.argv[2]));
