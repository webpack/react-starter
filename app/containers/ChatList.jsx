import React from "react";
import ChatLineView from "components/ChatLineView";
import { fetchChatMessages } from "store-helpers/Chat";
import styles from "./ChatList.css";

export default class ChatList extends React.Component {
	static getProps(stores, params) {
		var { room } = params;
		return {
			messages: fetchChatMessages(stores, room)
		};
	}
	render() {
		var { messages } = this.props;
		return <div className={styles.this} ref="chatList">
			{messages ?
				messages.map((msg, idx) => <ChatLineView key={idx} {...msg} />) :
				<i>Loading chat messages...</i>
			}
		</div>;
	}
	componentDidMount() {
		this.scrollDown();
	}
	componentDidUpdate() {
		this.scrollDown();
	}

	scrollDown() {
		var domEl = React.findDOMNode(this.refs.chatList);
		domEl.scrollTop = domEl.scrollHeight;
	}
}
ChatList.propTypes = {
	messages: React.PropTypes.arrayOf(React.PropTypes.object)
};
