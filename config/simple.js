let fs = require("fs");
let path = require("path");
let html = fs.readFileSync(path.resolve(__dirname, "../app/simple.html"), "utf-8");

module.exports = function(path, readItems, scriptUrl, styleUrl, commonsUrl, callback) {
	callback(null, html.replace("SCRIPT_URL", scriptUrl));
};
