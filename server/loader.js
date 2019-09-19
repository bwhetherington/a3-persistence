// This file allows us to use `import` in our server code.

require = require("esm")(module /*, options*/);
module.exports = require("./main.js");
