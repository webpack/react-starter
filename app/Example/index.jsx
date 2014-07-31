/** @jsx React.DOM */

var React = require("react");
var Display = require("./Display");
var Control = require("./Control");

var Example = React.createClass({
	render: function() {
		return <div>
			<Display />
			<div>
				<Control action="increment" label="+1" />
				<Control action="decrement" label="-1" />
				<Control action="reset" label="Reset" />
			</div>
		</div>;
	}
});
module.exports = Example;