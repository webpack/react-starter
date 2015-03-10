var React = require("react");
var State = require("react-router").State;
var Link = require("react-router").Link;
var StateFromStoreMixin = require("items-store/StateFromStoresMixin");
var Todo = require("./../../actions").Todo;

var TodoList = React.createClass({
	mixins: [State, StateFromStoreMixin],
	statics: {
		getState: function(stores, params) {
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
	},
	getInitialState: function() {
		return {
			newItem: ""
		};
	},
	render: function() {
		var id = this.state.id;
		var list = this.state.list;
		var items = this.state.items;
		var info = this.state.info;
		return <div>
			<h2>Todolist: {id}</h2>
			{
				info.error ? <div><strong>{info.error.message}</strong></div> :
				info.available ? this.renderItemsView(id, list, items) :
				<div>Fetching from server...</div>
			}
		</div>;
	},
	renderItemsView: function(id, list, items) {
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
				<input type="text" value={this.state.newItem} onChange={function(event) {
					this.setState({newItem: event.target.value});
				}.bind(this)} />
				<button onClick={function() {
					Todo.add(id, {
						text: this.state.newItem
					});
					this.setState({newItem: ""});
				}.bind(this)}>Add</button>
			</li>
		</ul>;
	}
});
module.exports = TodoList;
