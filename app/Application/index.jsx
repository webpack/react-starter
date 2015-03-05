var React = require("react");
var StateFromStoreMixin = require("items-store/StateFromStoresMixin");
var RouteHandler = require("react-router").RouteHandler;

require("./style.css");

var Application = React.createClass({
	mixins: [StateFromStoreMixin],
	statics: {
		getState: function(stores, params) {
			var transition = stores.Router.getItem("transition");
			return {
				loading: !!transition
			};
		}
	},
	render: function() {
		return <div className={this.state.loading ? "application loading" : "application"}>
			{this.state.loading ? <div style={{float: "right"}}>loading...</div> : null}
			<h1>react-starter</h1>
			<button onClick={this.update}>Update data</button>
			<RouteHandler />
		</div>;
	},
	update: function() {
		var { stores } = this.context;
		Object.keys(stores).forEach(function(key) {
			stores[key].update();
		});
	}
});
module.exports = Application;
