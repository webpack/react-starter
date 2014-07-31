/** @jsx React.DOM */

var React = require("react");
var Example = require("./Example");

var Application = React.createClass({
	render: function() {
		return <Example />;
	}
});
module.exports = Application;