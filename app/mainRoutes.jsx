var React = require("react");
var Router = require("react-router");
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

// polyfill
if(!Object.assign)
	Object.assign = React.__spread;

// export routes
module.exports = (
	<Route name="app" path="/" handler={require("./Application")}>
		<Route name="some-page" path="/some-page" handler={require("react-proxy!./SomePage")} />
		<Route name="readme" path="/readme" handler={require("react-proxy!./Readme")} />
		<Route name="todo" path="/todo" handler={require("./TodoPage")} >
			<Route name="todolist" path="list/:list" handler={require("./TodoPage/TodoList")} />
			<Route name="todoitem" path="item/:item" handler={require("./TodoPage/TodoItem")} />
		</Route>
		<Route name="home" path="/home" handler={require("./Home")} />
		<DefaultRoute handler={require("./Home")} />
	</Route>
);