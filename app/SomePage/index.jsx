var React = require("react");
var ListMenu = require("./../Components/ListMenu.jsx");

var SomePage = React.createClass({
	render: function() {
		return <div>
			<h2>SomePage</h2>
			<p>This is just some page... (loaded on demand)</p>
			<ListMenu />
		</div>;
	}
});
module.exports = SomePage;
