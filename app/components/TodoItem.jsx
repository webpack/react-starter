import React from "react";
import { Link } from "react-router";

export default class TodoItem extends React.Component {
	render() {
		var { id, text, done, sending, onUpdate } = this.props;
		return <div>
			<input type="checkbox" checked={done} onChange={(event) => {
				if(sending) return;
				onUpdate({
					done: event.target.checked
				});
			}}/>
			{ sending ?
				<span>{text}</span> :
				<Link to="todoitem" params={{item: id}}>{text}</Link>
			}
		</div>;
	}
}
TodoItem.propTypes = {
	id: React.PropTypes.string.isRequired,
	text: React.PropTypes.string.isRequired,
	done: React.PropTypes.bool,
	sending: React.PropTypes.bool,
	onUpdate: React.PropTypes.func.isRequired
};
