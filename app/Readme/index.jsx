let React = require("react");

let Readme = React.createClass({
	render: function() {
		let style = {
			default: {
				"backgroundColor": "white",
				"border": "1px dotted gray",
				"padding": "1em"
			}
		};
		let readme = { __html: require("./../../README.md") };
		return <div style={style.default} dangerouslySetInnerHTML={readme}></div>;
	}
});
module.exports = Readme;
