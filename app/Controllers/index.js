/**
 * Loads all controllers in folder
 * http://stackoverflow.com/questions/5364928/node-js-require-all-files-in-a-folder
 */
var controllers = {};
require("fs").readdirSync("./app/Controllers").forEach(function(file) {
	if(file.charAt(0) !== "." && file !== "index.js") {
	  	controllers[file.replace(".js", "")] = require("./" + file);
  	}
});
module.exports = controllers;