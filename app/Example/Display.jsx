/** @jsx React.DOM */

var React = require("react");
var Reflux = require("reflux");
var Store = require("./Store");
var BigDisplay = require("react-proxy!./BigDisplay");

var Display = React.createClass({
	mixins: [Reflux.ListenerMixin],
	getInitialState: function() {
		return {
			value: Store.get()
		};
	},
	componentDidMount: function() {
		this.listenTo(Store, this._onChange);
	},
	_onChange: function() {
		this.setState(this.getInitialState());
	},
	render: function() {
		if(this.state.value < 10) {
			return <span><strong>{this.state.value}</strong> Try to get 10 or more.</span>;
		} else {
			// BigDisplay loads on demand because of "react-proxy"
			return <BigDisplay value={this.state.value} />
		}
	}
});
module.exports = Display;