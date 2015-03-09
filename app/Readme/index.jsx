var React = require("react");

var Readme = React.createClass({
	render: function() {
		var style = {
			default: {
				"backgroundColor": "white",
				"border": "1px dotted gray",
				"padding": "1em"
			}
		};
		var readme = { __html: require("./../../README.md") };
		return <div style={style.default} dangerouslySetInnerHTML={readme}></div>;
	}
});
module.exports = Readme;
