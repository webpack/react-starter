var React = require("react");
var Router = require("react-router");
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

if(!Object.assign)
	Object.assign = React.__spread;

function componentWithStores(stores, Component) {
	return React.createClass({
		statics: {
			chargeStores: Component.chargeStores && function(stores, params, callback) {
				Component.chargeStores(stores, params, callback);
			}
		},
		displayName: Component.displayName + "_WithStores",
		render: function() {
			return <Component />
		},
		childContextTypes: {
			stores: React.PropTypes.object.isRequired
		},
		getChildContext: function() {
			return {
				stores: stores
			}
		}
	});
}

module.exports = function(stores) {
	var c = componentWithStores.bind(null, stores);
	return (
		<Route name="app" path="/" handler={c(require("./Application"))}>
			<Route name="some-page" path="/some-page" handler={c(require("./SomePage"))} />
			<Route name="todolist" path="/:list" handler={c(require("./TodoList"))} />
			<Route name="todoitem" path="/todo/:item" handler={c(require("./TodoItem"))} />
			<DefaultRoute name="home" handler={c(require("./Home"))} />
		</Route>
	);
}
