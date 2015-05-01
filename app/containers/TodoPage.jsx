import React from "react";
import ListMenu from "components/TodoListMenu";
import { RouteHandler } from "react-router";
import { Todo } from "actions";

export default class TodoPage extends React.Component {
	static getProps() {
		return {};
	}
	render() {
		return <div>
			<h2>TodoPage</h2>
			<button onClick={() => this.fetch()}>Update todolist data</button>
			<ListMenu />
			<RouteHandler />
		</div>;
	}

	fetch() {
		Todo.fetch();
	}
}
