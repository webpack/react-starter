import React from "react";

export default class NewChatEditor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			message: ""
		};
	}
	render() {
		var { name, message } = this.state;
		return <div>
			Your name: <input type="text" value={name} onChange={(event) => {
				this.setState({
					name: event.target.value
				});
			}} />
			{name &&
				<div>Your message: <input type="text" value={message} onChange={(event) => {
					this.setState({
						message: event.target.value
					});
				}} onKeyDown={(event) => {
					if(event.key === "Enter")
						this.sendMessage();
				}} /> <button onClick={() => this.sendMessage()}>Send</button></div>
			}
		</div>;
	}

	sendMessage() {
		var { onAdd } = this.props;
		var { name, message } = this.state;
		if(onAdd({
			user: name,
			message: message
		})) {
			this.setState({
				message: ""
			});
		}
	}
}
NewChatEditor.propTypes = {
	onAdd: React.PropTypes.func.isRequired
};
