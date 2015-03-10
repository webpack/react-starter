var React = require("react");
var ListMenu = require("./TodolistMenu.jsx");
var RouteHandler = require("react-router").RouteHandler;

var TodoPage = React.createClass({
	render: function() {
		return <div>
			<h2>TodoPage</h2>
			<ListMenu />
			<RouteHandler />
		</div>;
	}
});
module.exports = TodoPage;
