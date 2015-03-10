var React = require("react");
var Link = require("react-router").Link;

var ListMenu = React.createClass({
	render: function() {
		return <div>
			<h2>Lists:</h2>
			<ul>
				<li><Link to="todolist" params={{list: "mylist"}}>mylist</Link></li>
				<li><Link to="todolist" params={{list: "otherlist"}}>otherlist</Link></li>
			</ul>
		</div>;
	}
});

module.exports = ListMenu;