let React = require("react");

let SomePage = React.createClass({
	render: function() {
		return <div>
			<h2>SomePage</h2>
			<p>This is just some page... (loaded on demand)</p>
		</div>;
	}
});
module.exports = SomePage;
