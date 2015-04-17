import React from "react";
import { Link } from "react-router";
import Todo from "actions";

export default class TodoListPage extends React.Component {
	static getProps(stores, params) {
		var list = stores.TodoList.getItem(params.list);
		return {
			id: params.list,
			list: list,
			items: list && list.map(function(item) {
				if(typeof item === "string")
					return stores.TodoItem.getItem(item);
			}.bind(this)),
			// get more info about the item
			info: stores.TodoList.getItemInfo(params.list)
		};
	}
	constructor(props) {
		super(props);
		this.state = {
			newItem: ""
		};
	}
	render() {
		var { id, list, items, info } = this.props;
		return <div>
			<h3>Todolist: {id}</h3>
			{
				info.error ? <div><strong>{info.error.message}</strong></div> :
				info.available ? this.renderItemsView(id, list, items) :
				<div>Fetching from server...</div>
			}
		</div>;
	}
	renderItemsView(id, list, items) {
		var { newItem } = this.state;
		return <ul>
			{
				list.map(function(item, idx) {
					if(typeof item === "string") {
						return <li key={item}><Link to="todoitem" params={{item: item}}>
							{items[idx] ? items[idx].text : ""}
						</Link></li>;
					} else {
						// While adding item
						return <li key={item}>
							{item.text} &uarr;
						</li>;
					}
				})
			}
			<li>
				<input type="text" value={newItem} onChange={function(event) {
					this.setState({newItem: event.target.value});
				}.bind(this)} />
				<button onClick={function() {
					Todo.add(id, {
						text: newItem
					});
					this.setState({newItem: ""});
				}.bind(this)}>Add</button>
			</li>
		</ul>;
	}
}
