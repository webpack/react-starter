import React from "react";

export default class ReactLogo extends React.Component {
	render() {
		var { type } = this.props;
		var url = {
			"svg": require("./ReactLogo/logo.svg"),
			"png": require("./ReactLogo/logo.png"),
			"jpg": require("./ReactLogo/logo.jpg")
		}[type];
		return <img src={url} height="36" width="36" />;
	}
}
ReactLogo.propTypes = {
	type: React.PropTypes.oneOf(["svg", "png", "jpg"])
};
