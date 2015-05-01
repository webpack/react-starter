import React from "react";
import { Chat } from "actions";
import ChatList from "containers/ChatList";
import NewChatEditor from "components/NewChatEditor";

export default class ChatPage extends React.Component {
	static getProps(stores, params) {
		var { room } = params;
		return {
			room: room,
			chatList: ChatList.getProps(stores, {
				room: room
			})
		};
	}
	render() {
		var { room, chatList } = this.props;
		return <div>
			<p>Chat room "{room}".</p>
			<button onClick={() => this.fetch()}>Update chat data</button>
			<ChatList {...chatList} />
			<hr />
			<NewChatEditor onAdd={(item) => {
				Chat.send(room, item);
				return true;
			}} />
			<p>Note: There is no realtime communication here as you would expect from a chat. This is on the roadmap for items-store.</p>
		</div>;
	}

	fetch() {
		Chat.fetch();
	}
}
ChatPage.propTypes = {
	room: React.PropTypes.string,
	chatList: React.PropTypes.any
};
