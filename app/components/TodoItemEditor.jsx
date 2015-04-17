import React from "react";

export default class TodoItemEditor extends React.Component {
	render() {
		var { value, onChange } = this.props;
		return <input type="text" value={value} onChange={onChange} />
	}
}

