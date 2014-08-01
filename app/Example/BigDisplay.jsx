/** @jsx React.DOM */

var React = require("react");
var Reflux = require("reflux");
var ClicksStore = require("./ClicksStore");

var BigDisplay = React.createClass({
	mixins: [Reflux.ListenerMixin],
	getInitialState: function() {
		return {
			clicks: ClicksStore.getClicks()
		};
	},
	componentDidMount: function() {
		this.listenTo(ClicksStore, this._onChange);
	},
	_onChange: function() {
		this.setState(this.getInitialState());
	},
	render: function() {
		return <span>Yeah! <strong>{this.props.value}</strong> is really big. You clicked <i>{this.state.clicks}</i> times.</span>;
	}
});
module.exports = BigDisplay;