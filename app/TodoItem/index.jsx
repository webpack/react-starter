var React = require("react");
var State = require("react-router").State;
var Link = require("react-router").Link;
var StateFromStoreMixin = require("items-store/StateFromStoresMixin");
var Todo = require("../actions").Todo;

var TodoItem = React.createClass({
	mixins: [State, StateFromStoreMixin],
	statics: {
		getState: function(stores, params) {
			return {
				id: params.item,
				// this is just the data (or undefined when not yet available)
				item: stores.TodoItem.getItem(params.item),
				// this gives more info about the item
				// i. e. updated, outdated, error
				info: stores.TodoItem.getItemInfo(params.item)
			};
		},
	},
	render: function() {
		var id = this.state.id;
		var item = this.state.item;
		var info = this.state.info;
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
			<h2>Todoitem "{item.text}"</h2>
			<p><input type="text" value={item.text} onChange={function(event) {
				Todo.update(id, {
					text: event.target.value
				});
			}} /></p>
			{ info.updated ? <p>Syncing to server...</p> : info.outdated ? <p>Syncing from server...</p> : null }
		</div>
	}
});
module.exports = TodoItem;
