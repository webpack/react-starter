import React from "react";

export default class StoresWrapper {
	getChildContext() {
		return {
			stores: this.props.stores
		};
	}

	render() {
		var Application = this.props.Component;
		return <Application />;
	}
};

StoresWrapper.childContextTypes = {
	stores: React.PropTypes.object
};