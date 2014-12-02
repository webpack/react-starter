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
				item: stores.TodoItem.getItem(params.item)
			};
		},
	},
	render: function() {
		var id = this.state.id;
		var item = this.state.item;
		return <div>
			<h2>Todoitem "{item && item.text}"</h2>
			<p><input type="text" value={item && item.text} onChange={function(event) {
				Todo.update(id, {
					text: event.target.value
				});
			}} /></p>
		</div>
	}
});
module.exports = TodoItem;
