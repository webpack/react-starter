var React = require("react");
var ListMenu = require("./TodolistMenu.jsx");

var TodoPage = React.createClass({
	render: function() {
		return <div>
			<h2>TodoPage</h2>
			<ListMenu />
		</div>;
	}
});
module.exports = TodoPage;
