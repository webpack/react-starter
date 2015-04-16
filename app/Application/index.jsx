let React = require("react");
let StateFromStoreMixin = require("items-store/StateFromStoresMixin");
let RouteHandler = require("react-router").RouteHandler;
let MainMenu = require("./MainMenu.jsx");

require("./style.css");

let Application = React.createClass({
	mixins: [StateFromStoreMixin],
	statics: {
		getState: function(stores, params) {
			let transition = stores.Router.getItem("transition");
			return {
				loading: !!transition
			};
		}
	},
	render: function() {
		return <div className={this.state.loading ? "application loading" : "application"}>
			{this.state.loading ? <div style={{float: "right"}}>loading...</div> : null}
			<h1>react-starter</h1>
			<MainMenu />
			<button onClick={this.update}>Update todolist data</button>
			<RouteHandler />
		</div>;
	},
	update: function() {
		let { stores } = this.context;
		Object.keys(stores).forEach(function(key) {
			stores[key].update();
		});
	}
});
module.exports = Application;
