var React = require("react");
var RouteHandler = require("react-router").RouteHandler;

require("./style.css");

var Application = React.createClass({
	render: function() {
		return <div>
			<h1>react-starter</h1>
			<RouteHandler />
		</div>;
	}
});
module.exports = Application;
