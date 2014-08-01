/** @jsx React.DOM */

var Reflux = require("reflux");
Reflux.nextTick(process.nextTick);

var React = require("react");

// Basic styling
require("./style.styl");

// Init relevant modules
// With a pages/router init only relevant modules for this page.
require("Example/init");

// render top-level react component
var Example = require("./Example");
var Application = React.createClass({
	render: function() {
		return <Example />;
	}
});
module.exports = Application;