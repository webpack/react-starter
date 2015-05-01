import React from "react";
import { Todo } from "actions";
import TodoItemEditor from "components/TodoItemEditor";
import { fetchTodoItem } from "store-helpers/Todo";

export default class TodoItemPage extends React.Component {
	static getProps(stores, params) {
		var todoItem = fetchTodoItem(stores, params.item);
		return {
			id: params.item,
			item: todoItem
		};
	}
	render() {
		var { id, item } = this.props;
		// item is undefined on initial load
		if(!item) {
			return <div>Initial load from server...</div>;
		}
		return <div>
			<h3>Todoitem "{item.text}"</h3>
			{ item.error &&
				<p>
					<b>{item.error}</b>
					<button onClick={function() {
						Todo.fetchItem(id);
					}}>Reload</button>
				</p>
			}
			<p><TodoItemEditor {...item} onUpdate={function(update) {
				Todo.update(id, update);
			}} /></p>
			{
				item.updated ? <p>Syncing to server...</p> :
				item.outdated ? <p>Syncing from server...</p> :
				null
			}
		</div>;
	}
}
