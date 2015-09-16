var fs = require("fs");
var path = require("path");
var html = fs.readFileSync(path.resolve(__dirname, "../app/simple.html"), "utf-8");
var URL = require("url");

function SimpleRenderer(options) {
	this.options = options;
	this.html = html;
}

SimpleRenderer.prototype.render = function(req, _readItems, callback) {
	urlObj = URL.parse(this.options.scriptUrl);
	urlObj.host = null;
	urlObj.hostname = req.hostname;
	callback(null, this.html.replace("SCRIPT_URL", URL.format(urlObj)));
};

module.exports = SimpleRenderer;