/** @jsx React.DOM */

var React = require("react");

var BigDisplay = React.createClass({
	render: function() {
		return <span>Yeah! <strong>{this.props.value}</strong> is really big.</span>;
	}
});
module.exports = BigDisplay;