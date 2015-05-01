import React from "react";

export default class NewTodoItemEditor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			text: ""
		};
	}
	render() {
		var { onAdd } = this.props;
		var { text } = this.state;
		return <div>
			<input type="text" value={text} onChange={(event) => {
				this.setState({
					text: event.target.value
				});
			}} />
			<button onClick={() => {
				if(onAdd({
					done: false,
					text: text
				}))
					this.setState({text: ""});
			}}>Add</button>
		</div>;
	}
}
NewTodoItemEditor.propTypes = {
	onAdd: React.PropTypes.func.isRequired
};
