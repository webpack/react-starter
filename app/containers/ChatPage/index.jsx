import React from "react";
import ChatLineView from "components/ChatLineView";
import { Chat } from "actions";

export default class ChatPage extends React.Component {
	constructor() {
		super();
		this.state = {
			name: "",
			message: ""
		};
	}
	static getProps(stores, params) {
		var { room } = params;
		return {
			messages: stores.ChatRoom.getItem(room)
		};
	}
	render() {
		var { messages } = this.props;
		var { name, message } = this.state;
		return <div>
			<p>This is the ChatPage.</p>
			{messages.map(msg => <ChatLineView {...msg} />)}
			<hr />
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
				}} /> <button onClick={() => {
					Chat.send({
						name: name,
						message: message
					});
				}}>Send</button></div>
			}
		</div>;
	}
}
ChatPage.propTypes = {
	messages: React.PropTypes.arrayOf(React.PropTypes.object)
};
