import React from "react";
import { RouteHandler } from "react-router";
import MainMenu from "components/MainMenu";

import "./style.css";

export default class Application extends React.Component {
	static getProps(stores, params) {
		var transition = stores.Router.getItem("transition");
		return {
			loading: !!transition
		};
	}
	render() {
		var { loading } = this.props;
		return <div className={loading ? "application loading" : "application"}>
			{loading ? <div style={{float: "right"}}>loading...</div> : null}
			<h1>react-starter</h1>
			<MainMenu />
			<button onClick={this.update}>Update todolist data</button>
			<RouteHandler />
		</div>;
	}
	update() {
		var { stores } = this.context;
		Object.keys(stores).forEach(function(key) {
			stores[key].update();
		});
	}
}

Application.contextTypes = {
	stores: React.PropTypes.object
};
