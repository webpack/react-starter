import React from "react";
import ListMenu from "components/TodoListMenu";
import { RouteHandler } from "react-router";

export default class TodoPage extends React.Component {
	static getProps() {
		return {};
	}
	render() {
		return <div>
			<h2>TodoPage</h2>
			<ListMenu />
			<RouteHandler />
		</div>;
	}
}
