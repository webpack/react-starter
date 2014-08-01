/** @jsx React.DOM */

var React = require("react");
var Actions = require("./Actions");

var Example = React.createClass({
	render: function() {
		return <button onClick={this._onClick}>{this.props.label}</button>;
	},
	_onClick: function() {
		Actions.view[this.props.action]();
	}
});
module.exports = Example;