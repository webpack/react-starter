var React = require("react");

var Readme = React.createClass({
	render: function() {
		var style = {
			default: {
				"background-color": "white",
				"border": "1px dotted gray",
				"padding": "1em"
			}
		};
		var readme = require("./../../README.md");
		return <div style={style.default} dangerouslySetInnerHTML={{__html:readme}}></div>;
	}
});
module.exports = Readme;
