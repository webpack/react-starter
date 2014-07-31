/** @jsx React.DOM */

var React = require("react");
var Application = require("./Application");
var html = require("./prerender.html");

module.exports = function(scriptUrl, styleUrl) {
	var application = React.renderComponentToString(<Application />);
	return html.replace("STYLE_URL", styleUrl).replace("SCRIPT_URL", scriptUrl).replace("CONTENT", application);
};
