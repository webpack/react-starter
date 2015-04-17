import React from "react";
import { Link } from "react-router";
import Todo from "actions";
import TodoItemEditor from "components/TodoItemEditor";

export default class TodoItemPage extends React.Component {
	static getProps(stores, params) {
		return {
			id: params.item,
			// this is just the data (or undefined when not yet available)
			item: stores.TodoItem.getItem(params.item),
			// this gives more info about the item
			// i. e. updated, outdated, error
			info: stores.TodoItem.getItemInfo(params.item)
		};
	}
	render() {
		var { id, item, info } = this.props;
		// item is undefined on initial load
		if(!item) {
			return <div>Initial load from server...</div>
		}
		// We use a special error data for mark errored items
		// see ../mainStoresDescriptions.js
		if(item.error) {
			return <div>
				<div><b>{item.error}</b></div>
				<button onClick={function() {
					Todo.reload(id);
				}}>Reload</button>
			</div>;
		}
		return <div>
			<h3>Todoitem "{item.text}"</h3>
			<p><TodoItemEditor value={item.text} onChange={function(event) {
				Todo.update(id, {
					text: event.target.value
				});
			}} /></p>
			{ info.updated ? <p>Syncing to server...</p> : info.outdated ? <p>Syncing from server...</p> : null }
		</div>
	}
}
