import React from "react";
import { Todo } from "actions";
import { fetchTodoList } from "store-helpers/Todo";
import TodoItem from "components/TodoItem";
import NewTodoItemEditor from "components/NewTodoItemEditor";

export default class TodoListPage extends React.Component {
	static getProps(stores, params) {
		var { list } = params;
		return {
			id: list,
			list: fetchTodoList(stores, list)
		};
	}
	render() {
		var { id, list } = this.props;
		return <div>
			<h3>Todolist: {id}</h3>
			{ list.error &&
				<div><strong>{list.error.message}</strong></div>
			}
			{ list.items ?
				<ul>
					{ list.items.map((item) => <li key={item.id}>
						<TodoItem {...item} onUpdate={(update) => {
							Todo.update(item.id, update);
						}} />
					</li>) }
					<NewTodoItemEditor onAdd={(item) => {
						Todo.add(id, item);
						return true;
					}} />
				</ul> :
				<div>Fetching from server...</div>
			}
		</div>;
	}
}
