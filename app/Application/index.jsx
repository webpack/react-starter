var React = require("react");
var StateFromStoreMixin = require("items-store/StateFromStoresMixin");
var RouteHandler = require("react-router").RouteHandler;

require("./style.css");

var Application = React.createClass({
	mixins: [StateFromStoreMixin],
	statics: {
		getState: function(stores, params) {
			return {
				loading: !!stores.Router.getItem("transition")
			};
		},
	},
	render: function() {
		return <div>
			{this.state.loading ? <div style={{float: "right"}}>loading...</div> : null}
			<h1>react-starter</h1>
			<RouteHandler />
		</div>;
	}
});
module.exports = Application;
