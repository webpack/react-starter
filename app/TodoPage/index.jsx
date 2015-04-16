let React = require("react");
let ListMenu = require("./TodolistMenu.jsx");
let {RouteHandler} = require("react-router");

let TodoPage = React.createClass({
	render: function() {
		return <div>
			<h2>TodoPage</h2>
			<ListMenu />
			<RouteHandler />
		</div>;
	}
});
module.exports = TodoPage;
